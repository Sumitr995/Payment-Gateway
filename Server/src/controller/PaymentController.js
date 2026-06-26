import asyncHandler from '../middleware/asyncHandler.js';
import * as PaymentService from '../services/PaymentService.js';

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency, description, metadata } = req.body;
  const idempotencyKey = req.headers['idempotency-key'];

  const payment = await PaymentService.createPaymentIntent(
    req.user._id,
    { amount, currency, description, metadata },
    idempotencyKey
  );

  res.status(201).json(payment);
});

export const getPayment = asyncHandler(async (req, res) => {
  const payment = await PaymentService.getPaymentById(req.params.id, req.user._id);
  res.json(payment);
});
