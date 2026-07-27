import { z } from 'zod';

export const footerNewsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address.'),
});

export type FooterNewsletterFormValues = z.infer<typeof footerNewsletterSchema>;
