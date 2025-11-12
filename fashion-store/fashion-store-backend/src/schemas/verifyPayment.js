import { z } from 'zod';

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(3),
  razorpay_payment_id: z.string().min(3),
  razorpay_signature: z.string().min(2),
  meta: z.object({
    display_order_id: z.string().optional(),
    sub: z.number().min(0),
    gst: z.number().min(0),
    total: z.number().min(1),
    rzpAmount: z.number().min(1).optional(),
    rzpCurrency: z.string().default('INR'),
    address: z.object({
      fullName: z.string().min(2),
      email: z.string().email().optional(),
      phone: z.string().min(6).optional(),
      address1: z.string().min(3),
      address2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      pincode: z.string().min(4),
    }),
    items: z.array(z.object({
      id: z.string().optional(),
      sku: z.string().optional(),
      title: z.string().min(1),
      price: z.number().min(0),
      qty: z.number().min(1),
      size: z.string().optional(),
      color: z.string().optional(),
      image: z.string().optional(),
    })).min(1),
  })
});
