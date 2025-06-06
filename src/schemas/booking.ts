import { z } from 'zod';
import { SkipSchema } from './skip';

export const CustomerDetailsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
});

export const BookingFormDataSchema = z.object({
  postcode: z.string().min(3, 'Postcode must be at least 3 characters'),
  area: z.string().optional(),
  wasteType: z.string().min(1, 'Waste type is required'),
  selectedSkip: SkipSchema.optional(),
  permitRequired: z.boolean().optional(),
  permitDetails: z.string().optional(),
  deliveryDate: z.string().optional(),
  collectionDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  customerDetails: CustomerDetailsSchema.optional(),
});

export const WasteTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;
export type BookingFormData = z.infer<typeof BookingFormDataSchema>;
export type WasteType = z.infer<typeof WasteTypeSchema>;