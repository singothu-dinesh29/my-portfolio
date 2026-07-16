"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Vision.module.css";

export const Vision: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const colsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Zoom card slightly on scroll
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // Slide and stagger column items
      gsap.fromTo(
        colsRef.current ? Array.from(colsRef.current.children) : [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: colsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.vision} id="vision">
      <div className={styles.header}>
        <span className={styles.overTitle}>OUTLOOK & STRATEGY</span>
        <h2 className={styles.title}>Future Vision</h2>
      </div>

      <div ref={cardRef} className={styles.card}>
        <div className={styles.orangeGlowCircle} />
        
        <p className={styles.quote}>
          &quot;Dinesh Singothu a passionate Student about building his Future as both a <span className={styles.quoteAccent}>Software Engineer</span> by building projects and A successful <span className={styles.quoteAccent}>Entrepreneur</span> by building community,Leaders,and Products...&quot;
        </p>

        <div ref={colsRef} className={styles.columns}>
          <div className={styles.column}>
            <h4>SOFTWARE ENGINEER</h4>
            <p>
              Focusing on designing practical solutions where intelligent algorithms, powerful software, and creative engineering meet. Building high-performance applications, interactive web systems, and exploring emerging technology.
            </p>
          </div>

          <div className={styles.column}>
            <h4>ENTREPRENEUR</h4>
            <p>
              Building communities like the Smartest People Club (SPC) to connect ambitious minds, develop future leaders, and build innovative products that shape the next generation of changemakers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Vision;
