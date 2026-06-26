import * as WebhookService from '../services/WebhookService.js';
import logger from '../utils/logger.js';

export const handleWebhook = async (req, res) => {
  const { provider } = req.params;
  const signature = req.headers['stripe-signature'] || req.headers['webhook-signature'] || '';
  const body = req.body;

  try {
    const result = await WebhookService.processWebhook(provider, signature, body);
    res.json(result);
  } catch (err) {
    logger.error({ err, provider }, 'Webhook processing failed');
    res.status(400).json({ received: true, error: err.message });
  }
};
