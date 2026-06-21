"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitizer";
import { logger } from "@/lib/logger";
import { CollaborationLeadSchema } from "@/lib/schemas";
import { sendVisitorConfirmation, sendOwnerNotification } from "@/lib/mailer";

export interface CollaborationResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export async function submitCollaboration(formData: FormData): Promise<CollaborationResponse> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  // 1. Rate Limiting (Limit to 5 requests per 10 minutes per IP)
  const isLimited = isRateLimited(ip, { limit: 5, windowMs: 600000 });
  if (isLimited) {
    logger.warn("Collaboration form rate limit exceeded", { ip });
    return {
      success: false,
      message: "Too many requests. Please try again in 10 minutes."
    };
  }

  // 2. Spam Honeypot Protection
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    logger.warn("Spam honeypot triggered by bot submission", { ip, honeypot });
    return {
      success: true,
      message: "Thank you! Your collaboration inquiry has been submitted successfully."
    };
  }

  // 3. Extract and Sanitize Inputs
  const rawFullName = formData.get("fullName")?.toString() ?? "";
  const rawEmail = formData.get("email")?.toString() ?? "";
  const rawCompany = formData.get("company")?.toString() ?? "";
  const rawProjectIdea = formData.get("projectIdea")?.toString() ?? "";
  const rawBudget = formData.get("budget")?.toString() ?? "";

  const sanitizedData = {
    fullName: sanitizeString(rawFullName),
    email: sanitizeString(rawEmail).toLowerCase(),
    company: rawCompany ? sanitizeString(rawCompany) : undefined,
    projectIdea: sanitizeString(rawProjectIdea),
    budget: sanitizeString(rawBudget),
  };

  // 4. Validate with Zod
  const validation = CollaborationLeadSchema.safeParse(sanitizedData);
  if (!validation.success) {
    const errorMessages = validation.error.issues.map((err) => err.message);
    logger.warn("Validation failed for collaboration submission", {
      ip,
      errors: errorMessages,
      payload: logger.maskPayload(sanitizedData),
    });
    return {
      success: false,
      message: "Please correct the invalid inputs.",
      errors: errorMessages,
    };
  }

  const { fullName, email, company, projectIdea, budget } = validation.data;

  // 5. Store Data in PostgreSQL using Prisma
  try {
    const lead = await prisma.collaborationLead.create({
      data: {
        fullName,
        email,
        company: company || null,
        projectIdea,
        budget,
      },
    });

    logger.info("New collaboration lead created successfully", {
      leadId: lead.id,
      ip,
      payload: logger.maskPayload({ fullName, email, company, budget }),
    });

    // 6. Send Automated Emails (Fire-and-forget concurrently in background)
    Promise.allSettled([
      sendVisitorConfirmation(email, fullName),
      sendOwnerNotification({ fullName, email, company: company || null, projectIdea, budget }),
    ]).then((results) => {
      results.forEach((res, index) => {
        if (res.status === "rejected") {
          logger.error(
            `Automated email ${index === 0 ? "Visitor Confirmation" : "Owner Notification"} failed`,
            res.reason
          );
        }
      });
    });

    return {
      success: true,
      message: "Thank you! Your collaboration inquiry has been submitted successfully."
    };
  } catch (error) {
    logger.error("Database error saving collaboration lead", error, {
      ip,
      payload: logger.maskPayload(sanitizedData),
    });

    return {
      success: false,
      message: "An internal server error occurred. Please try again later."
    };
  }
}
