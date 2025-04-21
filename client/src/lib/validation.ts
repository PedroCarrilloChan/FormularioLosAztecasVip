import * as z from "zod";

export const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  birthMonth: z.string().optional(),
  birthDay: z.string().optional(),
  chatbotUserId: z.string().optional()
});

export type RegistrationData = z.infer<typeof registrationSchema>;