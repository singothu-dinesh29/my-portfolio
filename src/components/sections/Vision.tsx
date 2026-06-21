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
          &quot;We are moving from static pixel containers to <span className={styles.quoteAccent}>fluid spatial computing</span> where web layouts are alive, context-aware, and powered by three-dimensional shaders.&quot;
        </p>

        <div ref={colsRef} className={styles.columns}>
          <div className={styles.column}>
            <h4>Spatial Layouts</h4>
            <p>
              In the future, web applications will transcend flat sheets of paper. They will exist as volume objects in spatial computing formats, adapting to user gaze, ambient lighting, and physics-driven scroll modules.
            </p>
          </div>

          <div className={styles.column}>
            <h4>Semantic Web Architecture</h4>
            <p>
              By combining AI-driven generative design systems and strict structural databases, interfaces will compose themselves on-the-fly, generating custom code paths tailored to each individual client context.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Vision;
