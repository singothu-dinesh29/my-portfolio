"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Innovation.module.css";

export const Innovation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade content in from left
      gsap.fromTo(
        contentRef.current ? Array.from(contentRef.current.children) : [],
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Slide image card in from right
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, x: 30 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.innovation} id="innovation">
      <div className={styles.header}>
        <span className={styles.overTitle}>INTELLIGENT SYSTEMS</span>
        <h2 className={styles.title}>MY INNOVATION</h2>
      </div>

      <div className={styles.grid}>
        {/* Content Info (LEFT) */}
        <div ref={contentRef} className={styles.content}>
          <h3 className={styles.subtitle}>Smartest People Club (SPC)</h3>
          <p className={styles.desc}>
            <strong>Smartest People Club (SPC)</strong> is a student-driven community built to connect ambitious learners, creators, developers, innovators, and future leaders under one powerful network. Our mission is to create an environment where passionate individuals learn faster, build together, and grow beyond academics. Through high-quality content, real-world projects, mentorship, career guidance, networking, and collaborative learning, we empower students to unlock their true potential. We believe that success is not achieved alone—it is built through the right people, the right mindset, and the right opportunities. SPC is more than a community; it is a movement dedicated to shaping the next generation of innovators and changemakers. Together, we learn, build, lead, and inspire.
          </p>
          
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>Learn: High-quality content, mentorship, and career guidance.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>Build: Real-world projects and collaborative learning.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>Grow: Networking, right mindset, and the right opportunities.</span>
            </div>
          </div>

          <div className={styles.ctaWrapper}>
            <a 
              href="https://my-portfolio-beryl-beta-76.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.ctaButton}
            >
              Explore Innovation Hub
            </a>
          </div>
        </div>

        {/* Clickable Image / Visual Card (RIGHT) */}
        <div ref={cardRef} className={styles.displayCard}>
          <a 
            href="https://my-portfolio-beryl-beta-76.vercel.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.imageLink}
          >
            <div className={styles.blueGlowRing} />
            <div className={styles.imageWrapper}>
              <Image
                src="/spc_logo.jpg"
                alt="Smartest People Club Logo"
                width={400}
                height={400}
                className={styles.spcLogo}
                priority
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
export default Innovation;
