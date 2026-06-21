"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

// Dynamic imports for offscreen sections to split the bundle and optimize initial load
const About = dynamic(() => import("@/components/sections/About"), { ssr: true });
const Timeline = dynamic(() => import("@/components/sections/Timeline"), { ssr: true });
const Skills = dynamic(() => import("@/components/sections/Skills"), { ssr: true });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: true });
const Innovation = dynamic(() => import("@/components/sections/Innovation"), { ssr: true });
const Achievements = dynamic(() => import("@/components/sections/Achievements"), { ssr: true });
const Vision = dynamic(() => import("@/components/sections/Vision"), { ssr: true });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), { ssr: true });
const Collaborate = dynamic(() => import("@/components/sections/Collaborate"), { ssr: true });
const Footer = dynamic(() => import("@/components/sections/Footer"), { ssr: true });

export default function Home() {
  return (
    <>
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. About Me Section */}
      <About />

      {/* 3. My Journey Timeline Section */}
      <Timeline />

      {/* 4. Skills & Technologies Section */}
      <Skills />

      {/* 5. Featured Projects Section */}
      <Projects />

      {/* 6. AI & Innovation Section */}
      <Innovation />

      {/* 7. Achievements Dashboard Section */}
      <Achievements />

      {/* 8. Future Vision Section */}
      <Vision />

      {/* 9. Testimonials Section */}
      <Testimonials />

      {/* 10. Let's Collaborate Inquiry Form */}
      <Collaborate />

      {/* 11. Contact Footer */}
      <Footer />
    </>
  );
}
