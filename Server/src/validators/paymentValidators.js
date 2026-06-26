import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().regex(/^[a-z]{3}$/, 'Currency must be a 3-letter ISO code'),
  description: z.string().trim().max(500).optional().default(''),
  metadata: z.record(z.string()).optional().default({}),
});
