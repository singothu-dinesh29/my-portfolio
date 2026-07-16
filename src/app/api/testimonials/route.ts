import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TESTIMONIAL_SCHEMA = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  content: z.string().min(10, "Testimonial must be at least 10 characters").max(1000),
});

const STATIC_TESTIMONIALS = [
  {
    id: "static-1",
    name: "Sarah Jenkins",
    role: "VP of Product",
    company: "Helios Pictures",
    content: "Aura redesigned our cinematic studio portfolio. The combination of background WebGL shaders and smooth layout transitions is spectacular. Our site load time is faster than ever.",
    createdAt: new Date("2026-06-20T10:00:00Z").toISOString(),
  },
  {
    id: "static-2",
    name: "Marcus Thorne",
    role: "Founder",
    company: "Nova Corporation",
    content: "Securing our collaboration forms with strict validation and custom rate limiting was critical. Aura delivered an enterprise-grade backend while maintaining a premium, minimalist design.",
    createdAt: new Date("2026-06-20T11:00:00Z").toISOString(),
  },
  {
    id: "static-3",
    name: "Elena Rostova",
    role: "Creative Director",
    company: "Future Lab",
    content: "The interactive particle field and magnetic hover details wow every client we send to the site. Aura acts as both a premium developer and a visual creative director.",
    createdAt: new Date("2026-06-20T12:00:00Z").toISOString(),
  }
];

export async function GET() {
  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    // Merge static testimonials with db testimonials (newest db testimonials first)
    const formattedDb = dbTestimonials.map(t => ({
      id: t.id,
      name: t.name,
      role: t.role || "",
      company: t.company || "",
      content: t.content,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: [...formattedDb, ...STATIC_TESTIMONIALS],
    });
  } catch (error) {
    console.warn("Prisma query for testimonials failed. Falling back to static mock data:", error);
    return NextResponse.json({
      success: true,
      data: STATIC_TESTIMONIALS,
      isFallback: true
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = TESTIMONIAL_SCHEMA.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, role, company, content } = result.data;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || null,
        company: company || null,
        content,
        isApproved: true, // Approve instantly for real-time demonstration
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role || "",
        company: testimonial.company || "",
        content: testimonial.content,
        createdAt: testimonial.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to submit testimonial:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Database may need schema synchronization." },
      { status: 500 }
    );
  }
}
