"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Innovation.module.css";

export const Innovation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade content in
      gsap.fromTo(
        contentRef.current ? Array.from(contentRef.current.children) : [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.innovation} id="innovation">
      <div className={styles.header}>
        <span className={styles.overTitle}>INTELLIGENT SYSTEMS</span>
        <h2 className={styles.title}>AI & Innovation</h2>
      </div>

      <div className={styles.grid}>
        {/* Content Info */}
        <div ref={contentRef} className={styles.content}>
          <h3 className={styles.subtitle}>Supercharging Creativity via Machine Intelligence</h3>
          <p className={styles.desc}>
            I leverage state-of-the-art AI assistant workflows, custom automation, and LLM orchestration to optimize code outputs, automate assets processing pipelines, and validate strict TypeScript compilation.
          </p>
          
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>Custom model pipelines to build interactive WebGL shader materials.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>10x deployment speed with pre-validated error checks.</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.bullet}>{"//"}</span>
              <span className={styles.featureText}>Generative UI design systems tailored dynamically to user preferences.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Innovation;
