// Zod schemas for order and payment endpoints.

import { z } from "zod";

export const createOrderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().trim().min(1),
      quantity: z.number().int().positive(),
    }),
  ),
  amount: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  currency: z.string().trim().optional(),
});
