// Zod schemas for cart endpoint validation.

import { z } from "zod";

export const cartProductSchema = z.object({
  productId: z.string().trim().min(1),
});

export const cartRemoveSchema = z.object({
  productId: z.string().trim().min(1).optional(),
  cartItemId: z.string().trim().min(1).optional(),
}).refine((data) => data.productId || data.cartItemId, {
  message: "productId or cartItemId is required",
  path: ["productId"],
});

export const updateQuantitySchema = z.object({
  productId: z.string().trim().min(1),
  type: z.enum(["increase", "decrease"]),
});
