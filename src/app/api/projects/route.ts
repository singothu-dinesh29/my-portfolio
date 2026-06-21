import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_PROJECTS = [
  {
    id: "1",
    title: "Ethereal Shaders",
    slug: "ethereal-shaders",
    description: "A generative WebGL simulation exploring spatial audio and interactive fluid dynamics.",
    category: "WebGL / Creative Dev",
    client: "Future Lab",
    role: "Lead Creative Developer",
    year: 2025,
    coverImage: "/project_shaders.png",
    images: [],
    tags: ["Three.js", "GLSL", "React Three Fiber", "GSAP"],
    demoUrl: "https://example.com/shaders",
    githubUrl: "https://github.com/example/shaders",
    isFeatured: true
  },
  {
    id: "2",
    title: "Helios Cinematic Studio",
    slug: "helios-cinematic",
    description: "A highly cinematic web experience for an independent production company with physics-based transitions.",
    category: "Web Experience / Brand",
    client: "Helios Pictures",
    role: "Frontend Architect",
    year: 2024,
    coverImage: "/project_helios.png",
    images: [],
    tags: ["Next.js", "GSAP ScrollTrigger", "CSS Modules", "Framer Motion"],
    demoUrl: "https://example.com/helios",
    githubUrl: "https://github.com/example/helios",
    isFeatured: true
  },
  {
    id: "3",
    title: "Nova Interface System",
    slug: "nova-interface",
    description: "An enterprise design system and framework utilizing hardware-accelerated layouts and interactions.",
    category: "Design System / Engineering",
    client: "Nova Corp",
    role: "Lead Frontend Engineer",
    year: 2025,
    coverImage: "/project_nova.png",
    images: [],
    tags: ["React", "TypeScript", "GSAP", "CSS Modules", "Lottie"],
    demoUrl: "https://example.com/nova",
    githubUrl: "https://github.com/example/nova",
    isFeatured: false
  }
];

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // If database connection is success but table has no items, merge/return fallback
    if (projects.length === 0) {
      return NextResponse.json({ success: true, data: FALLBACK_PROJECTS, isFallback: true });
    }
    
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.warn("Prisma connection/query failed. Falling back to static mock data:", error);
    
    // Return static data so UI is functional and previewable without a running PostgreSQL DB
    return NextResponse.json({ 
      success: true, 
      data: FALLBACK_PROJECTS, 
      isFallback: true 
    });
  }
}
export const dynamic = "force-dynamic";
