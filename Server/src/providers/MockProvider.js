import crypto from 'crypto';

class MockProvider {
  async createPayment({ amount, currency, idempotencyKey, metadata }) {
    await new Promise((r) => setTimeout(r, 150));

    return {
      providerPaymentId: `mock_pi_${crypto.randomBytes(8).toString('hex')}`,
      status: 'requires_confirmation',
      providerData: { amount, currency, idempotencyKey, metadata, mock: true },
    };
  }

  async confirmPayment(providerPaymentId) {
    await new Promise((r) => setTimeout(r, 300));

    return {
      providerPaymentId,
      status: 'succeeded',
      providerData: { confirmedAt: new Date().toISOString(), mock: true },
    };
  }

  async retrievePayment(providerPaymentId) {
    await new Promise((r) => setTimeout(r, 50));

    return {
      providerPaymentId,
      status: 'succeeded',
      providerData: { mock: true },
    };
  }

  async refundPayment(providerPaymentId, { amount, reason } = {}) {
    await new Promise((r) => setTimeout(r, 200));

    return {
      providerRefundId: `mock_rf_${crypto.randomBytes(8).toString('hex')}`,
      status: 'succeeded',
      providerData: { amount, reason, mock: true },
    };
  }

  async capturePayment(providerPaymentId) {
    await new Promise((r) => setTimeout(r, 200));

    return {
      providerPaymentId,
      status: 'succeeded',
      providerData: { capturedAt: new Date().toISOString(), mock: true },
    };
  }

  async verifyWebhook(_signature, body) {
    const event = JSON.parse(body.toString());
    return { verified: true, event };
  }
}

export default MockProvider;
