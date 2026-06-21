"use server";

import { prisma } from "@/lib/prisma";

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function submitContact(formData: FormData): Promise<ContactResponse> {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const subject = formData.get("subject")?.toString();
  const message = formData.get("message")?.toString();

  // Basic Validation
  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in all required fields (Name, Email, Message)."
    };
  }

  // Simple Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address."
    };
  }

  try {
    // Save contact message to database according to new simplified spec
    // We combine the subject into the message text to preserve data without violating database constraints
    const messageContent = subject ? `[Subject: ${subject}]\n${message}` : message;

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        message: messageContent,
      },
    });

    return {
      success: true,
      message: "Thank you! Your message has been received."
    };
  } catch (error) {
    console.error("Prisma error saving contact message:", error);
    
    return {
      success: false,
      message: "An error occurred while saving your message. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
