import Payment from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import { getProviderByName } from '../providers/index.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

const eventStatusMap = {
  'payment_intent.succeeded': 'succeeded',
  'payment_intent.processing': 'processing',
  'payment_intent.requires_action': 'requires_confirmation',
  'payment_intent.requires_payment_method': 'requires_payment_method',
  'payment_intent.payment_failed': 'failed',
  'payment_intent.canceled': 'failed',
};

export const processWebhook = async (providerName, signature, body) => {
  const provider = getProviderByName(providerName);

  let event;
  try {
    const result = await provider.verifyWebhook(signature, body);
    event = result.event;
  } catch (err) {
    logger.error({ err, provider: providerName }, 'Webhook verification failed');
    throw new AppError('Webhook signature verification failed', 400);
  }

  const eventType = event.type;
  const eventData = event.data?.object || event.data || event;
  const providerPaymentId = eventData.id;

  if (!providerPaymentId) {
    throw new AppError('Missing payment ID in webhook event', 400);
  }

  const payment = await Payment.findOne({ providerPaymentId });
  if (!payment) {
    logger.warn({ providerPaymentId, eventType }, 'Webhook received for unknown payment');
    return { received: true, ignored: true, reason: 'payment_not_found' };
  }

  const toStatus = eventStatusMap[eventType];
  if (!toStatus) {
    logger.info({ eventType, providerPaymentId }, 'Unhandled webhook event type');
    return { received: true, ignored: true, reason: 'unhandled_event_type' };
  }

  if (!payment.canTransitionTo(toStatus)) {
    logger.warn({ from: payment.status, to: toStatus, paymentId: payment._id }, 'Invalid webhook status transition');
    return { received: true, ignored: true, reason: 'invalid_transition' };
  }

  const fromStatus = payment.status;
  payment.status = toStatus;
  if (eventType === 'payment_intent.payment_failed' && eventData.last_payment_error) {
    payment.errorMessage = eventData.last_payment_error.message || 'Payment failed';
  }
  await payment.save();

  await Transaction.create({
    payment: payment._id,
    fromStatus,
    toStatus,
    changedBy: 'provider_webhook',
    metadata: { eventType, providerData: eventData },
  });

  logger.info({ paymentId: payment._id, fromStatus, toStatus, eventType }, 'Payment status updated via webhook');

  return { received: true, success: true };
};
