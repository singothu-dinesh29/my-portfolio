"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-setup";
import styles from "./About.module.css";

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Luxury fade-in for visual wrapper
      gsap.fromTo(
        visualRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Soft parallax scroll effect on visual card
      gsap.to(visualRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        }
      });

      // 3. Stagger child elements of text content
      gsap.fromTo(
        textRef.current ? Array.from(textRef.current.children) : [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          stagger: 0.18,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.about} id="about">
      <div className={styles.aboutGrid}>
        
        {/* Visual Showcase (renders your premium photo) */}
        <div ref={visualRef} className={styles.visualWrapper}>
          <div className={styles.glowingEdge} />
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image 
              src="/dinesh.jpg" 
              alt="Dinesh Singothu" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.imageVisual}
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <div className={styles.overlayBorder} />
        </div>

        {/* Text Bio */}
        <div ref={textRef} className={styles.content}>
          <span className={styles.overTitle}>MY STORY</span>
          <h2 className={styles.title}>Engineering Intelligent Futures</h2>
          <p className={styles.bioParagraph}>
            Transforming curiosity into intelligent systems and ideas into meaningful digital experiences.
          </p>
          <p className={styles.bioParagraph}>
            As a Computer Science student specializing in Artificial Intelligence and Machine Learning, I focus on designing practical solutions where intelligent algorithms, powerful software, and creative engineering meet.
          </p>
          <p className={styles.bioParagraph}>
            From building AI-driven applications and scalable web platforms to exploring emerging technologies, my work is guided by innovation, continuous growth, and the pursuit of solving real-world problems.
          </p>
          <p className={styles.bioParagraph}>
            Every project is a step toward my vision of becoming an AI Engineer who creates technology that empowers people and transforms the future. My mission is simple: to engineer technology that creates lasting impact and shapes a smarter future.
          </p>
          
          <div className={styles.quoteCard}>
            &quot;The future isn&apos;t something we wait for&mdash;it&apos;s something we engineer.&quot;
          </div>
        </div>

      </div>
    </section>
  );
};
export default About;
