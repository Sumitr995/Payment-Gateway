import express, { Router } from 'express';
import { handleWebhook } from '../controller/WebhookController.js';

const router = Router();

router.post('/:provider', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
