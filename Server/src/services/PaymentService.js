import Payment from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import { getConfiguredProvider } from '../providers/index.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

export const createPaymentIntent = async (userId, { amount, currency, description, metadata }, idempotencyKey) => {
  const payment = await Payment.create({
    amount,
    currency,
    description,
    metadata,
    idempotencyKey,
    user: userId,
    status: 'requires_payment_method',
  });

  const provider = getConfiguredProvider();

  try {
    const result = await provider.createPayment({ amount, currency, idempotencyKey, metadata });

    const fromStatus = 'requires_payment_method';
    const toStatus = result.status;

    if (!Payment.isValidTransition(fromStatus, toStatus)) {
      throw new AppError(`Invalid status transition from ${fromStatus} to ${toStatus}`, 500);
    }

    payment.status = toStatus;
    payment.provider = process.env.PAYMENT_PROVIDER || 'mock';
    payment.providerPaymentId = result.providerPaymentId;
    await payment.save();

    await Transaction.create({
      payment: payment._id,
      fromStatus,
      toStatus,
      changedBy: 'system',
      metadata: { providerData: result.providerData },
    });

    logger.info({ paymentId: payment._id, status: toStatus }, 'Payment intent created');

    return payment;
  } catch (err) {
    payment.status = 'failed';
    payment.errorMessage = err.message || 'Provider error';
    await payment.save();

    await Transaction.create({
      payment: payment._id,
      fromStatus: 'requires_payment_method',
      toStatus: 'failed',
      changedBy: 'system',
      metadata: { error: err.message },
    });

    logger.error({ err, paymentId: payment._id }, 'Payment intent creation failed');

    if (err instanceof AppError) throw err;
    throw new AppError('Payment processing failed', 502);
  }
};

export const getPaymentById = async (paymentId, userId) => {
  const payment = await Payment.findOne({ _id: paymentId, user: userId });
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }
  return payment;
};
