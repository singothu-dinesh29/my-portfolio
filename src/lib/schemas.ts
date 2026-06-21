import { z } from "zod";

/**
 * Zod validation schema for Collaboration Leads
 */
export const CollaborationLeadSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be under 100 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
  company: z
    .string()
    .max(100, { message: "Company name must be under 100 characters." })
    .optional()
    .or(z.literal("")),
  projectIdea: z
    .string()
    .min(10, { message: "Project description must be at least 10 characters." })
    .max(2000, { message: "Project description must be under 2000 characters." }),
  budget: z
    .string()
    .min(1, { message: "Please specify a budget range." })
    .max(100, { message: "Budget representation is too long." }),
});

export type CollaborationLeadInput = z.infer<typeof CollaborationLeadSchema>;

/**
 * Zod validation schema for Contact Messages
 */
export const ContactMessageSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be under 100 characters." }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(2000, { message: "Message must be under 2000 characters." }),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

/**
 * Zod validation schema for Newsletter Subscribers
 */
export const NewsletterSubscriberSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(255, { message: "Email must be under 255 characters." }),
});

export type NewsletterSubscriberInput = z.infer<typeof NewsletterSubscriberSchema>;
