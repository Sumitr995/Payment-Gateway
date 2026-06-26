import { Router } from 'express';
import { createPaymentIntent, getPayment } from '../controller/PaymentController.js';
import { protect } from '../middleware/AuthMiddleware.js';
import validate from '../middleware/validate.js';
import idempotency from '../middleware/idempotency.js';
import { createPaymentIntentSchema } from '../validators/paymentValidators.js';

const router = Router();

router.post('/intent', protect, idempotency(), validate(createPaymentIntentSchema), createPaymentIntent);
router.get('/:id', protect, getPayment);

export default router;
