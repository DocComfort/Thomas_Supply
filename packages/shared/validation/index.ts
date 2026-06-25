import { z } from "zod";
import { ADMIN_ROLES, DEALER_ROLES, ORDER_REQUEST_STATUSES } from "../constants";

export const loginSchema = z.object({
  email: z.string().email()
});

export const productSearchSchema = z.object({
  q: z.string().trim().max(120).optional().default("")
});

export const skuParamsSchema = z.object({
  sku: z.string().trim().min(1).max(80)
});

export const dealerAccountIdSchema = z.object({
  dealerAccountId: z.string().trim().min(1)
});

export const addCartItemSchema = z.object({
  sku: z.string().trim().min(1).max(80),
  quantity: z.coerce.number().int().min(1).max(999)
});

export const updateCartItemSchema = z.object({
  sku: z.string().trim().min(1).max(80),
  quantity: z.coerce.number().int().min(0).max(999)
});

export const submitOrderRequestSchema = z.object({
  notes: z.string().trim().max(1000).optional().default("")
});

export const adminUpdateOrderStatusSchema = z.object({
  orderRequestId: z.string().trim().min(1),
  status: z.enum(ORDER_REQUEST_STATUSES)
});

export const dealerMembershipSchema = z.object({
  userId: z.string().trim().min(1),
  dealerAccountId: z.string().trim().min(1),
  role: z.enum(DEALER_ROLES)
});

export const adminUserSchema = z.object({
  userId: z.string().trim().min(1),
  role: z.enum(ADMIN_ROLES)
});

export type ProductSearchInput = z.infer<typeof productSearchSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type SubmitOrderRequestInput = z.infer<typeof submitOrderRequestSchema>;
