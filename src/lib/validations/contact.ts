import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid business email address." }),
  businessName: z.string().max(100).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().max(150).optional().or(z.literal("")),
  selectedServices: z.array(z.string()),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  description: z
    .string()
    .min(10, { message: "Please provide at least 10 characters describing your request." })
    .max(3000, { message: "Message cannot exceed 3000 characters." }),
  consentAccepted: z.literal(true, {
    message: "You must accept the privacy policy to proceed.",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
