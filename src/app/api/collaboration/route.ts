import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitizer";
import { logger } from "@/lib/logger";
import { CollaborationLeadSchema } from "@/lib/schemas";
import { sendVisitorConfirmation, sendOwnerNotification } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";

  // 1. Rate Limiting (5 requests per 10 minutes per IP)
  const isLimited = isRateLimited(ip, { limit: 5, windowMs: 600000 });
  if (isLimited) {
    logger.warn("Collaboration API rate limit exceeded", { ip });
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again in 10 minutes." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // 2. Spam Honeypot Protection
    if (body.website) {
      logger.warn("Collaboration API spam honeypot triggered by bot submission", { ip, honeypot: body.website });
      return NextResponse.json({
        success: true,
        message: "Thank you! Your collaboration inquiry has been submitted successfully."
      });
    }

    // 3. Extract and Sanitize Inputs
    const rawFullName = body.fullName ?? "";
    const rawEmail = body.email ?? "";
    const rawCompany = body.company ?? "";
    const rawProjectIdea = body.projectIdea ?? "";
    const rawBudget = body.budget ?? "";

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
      logger.warn("Validation failed for collaboration API submission", {
        ip,
        errors: errorMessages,
        payload: logger.maskPayload(sanitizedData),
      });
      return NextResponse.json(
        { success: false, message: "Validation failed.", errors: errorMessages },
        { status: 400 }
      );
    }

    const { fullName, email, company, projectIdea, budget } = validation.data;

    // 5. Store in Database
    const lead = await prisma.collaborationLead.create({
      data: {
        fullName,
        email,
        company: company || null,
        projectIdea,
        budget,
      },
    });

    logger.info("New collaboration lead created successfully via API", {
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

    return NextResponse.json({
      success: true,
      message: "Thank you! Your collaboration inquiry has been submitted successfully."
    });
  } catch (error) {
    logger.error("API error in collaboration endpoint", error, { ip });
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
