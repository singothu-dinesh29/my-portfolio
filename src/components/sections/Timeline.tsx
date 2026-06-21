"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Timeline.module.css";

interface TimelineEvent {
  year: string;
  role: string;
  company: string;
  desc: string;
}

const EVENTS: TimelineEvent[] = [
  {
    year: "2024 - PRESENT",
    role: "Lead Frontend Architect & Creative Director",
    company: "Aura Studio / Independent",
    desc: "Directing cinematic web applications, engineering spatial layout configurations, and coordinating interactive WebGL experiences for global digital campaigns.",
  },
  {
    year: "2022 - 2024",
    role: "Senior Creative Developer",
    company: "Pixel & Light Agency",
    desc: "Pioneered motion graphics integrations using GSAP, Three.js shaders, and custom physics-based UI modules to create high-performance interactive visual platforms.",
  },
  {
    year: "2020 - 2022",
    role: "Frontend Architect",
    company: "Nexus Digital Corp",
    desc: "Designed scalable layout designs and backend API layers utilizing Next.js, and migrated legacy structures into strictly compiled typescript configurations.",
  }
];

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate vertical progress line height on scroll
      gsap.fromTo(
        progressLineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 50%",
            end: "bottom 50%",
            scrub: true,
          },
        }
      );

      // Fade and slide timeline cards in sequentially
      gsap.fromTo(
        `.${styles.item}`,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.3,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.timeline} id="timeline">
      <div className={styles.header}>
        <span className={styles.overTitle}>MY PROGRESSION</span>
        <h2 className={styles.title}>The Journey Line</h2>
      </div>

      <div ref={triggerRef} className={styles.timelineContainer}>
        {/* Vertical Line Base */}
        <div className={styles.line}>
          <div ref={progressLineRef} className={styles.progressLine} />
        </div>

        {EVENTS.map((event, idx) => (
          <div key={idx} className={styles.item}>
            {/* Dot Indicator */}
            <div className={`${styles.dot} ${styles.activeDot}`} />
            
            <span className={styles.year}>{event.year}</span>
            <div className={styles.card}>
              <h3 className={styles.role}>{event.role}</h3>
              <span className={styles.company}>{event.company}</span>
              <p className={styles.desc}>{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Timeline;
