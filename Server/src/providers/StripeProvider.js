import Stripe from 'stripe';
import logger from '../utils/logger.js';

class StripeProvider {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPayment({ amount, currency, idempotencyKey, metadata }) {
    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount,
        currency,
        metadata,
        automatic_payment_methods: { enabled: true },
      },
      { idempotencyKey }
    );

    return {
      providerPaymentId: paymentIntent.id,
      status: paymentIntent.status,
      providerData: paymentIntent,
    };
  }

  async confirmPayment(providerPaymentId) {
    const paymentIntent = await this.stripe.paymentIntents.confirm(providerPaymentId);
    return {
      providerPaymentId: paymentIntent.id,
      status: paymentIntent.status,
      providerData: paymentIntent,
    };
  }

  async retrievePayment(providerPaymentId) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(providerPaymentId);

    return {
      providerPaymentId: paymentIntent.id,
      status: paymentIntent.status,
      providerData: paymentIntent,
    };
  }

  async refundPayment(providerPaymentId, { amount, reason } = {}) {
    const refund = await this.stripe.refunds.create({
      payment_intent: providerPaymentId,
      ...(amount && { amount }),
      ...(reason && { reason }),
    });

    return {
      providerRefundId: refund.id,
      status: refund.status,
      providerData: refund,
    };
  }

  async capturePayment(providerPaymentId) {
    const paymentIntent = await this.stripe.paymentIntents.capture(providerPaymentId);

    return {
      providerPaymentId: paymentIntent.id,
      status: paymentIntent.status,
      providerData: paymentIntent,
    };
  }

  async verifyWebhook(signature, body) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    const event = this.stripe.webhooks.constructEvent(body, signature, secret);
    return { verified: true, event };
  }
}

export default StripeProvider;
