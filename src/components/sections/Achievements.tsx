"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Achievements.module.css";

interface StatItem {
  target: number;
  label: string;
  suffix: string;
}

const STATS: StatItem[] = [
  { target: 48, label: "Completed Projects", suffix: "+" },
  { target: 12, label: "Industry Awards", suffix: "+" },
  { target: 6, label: "Years Experience", suffix: "" },
  { target: 100, label: "Happy Partners", suffix: "%" }
];

export const Achievements: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation logic using GSAP container-scoped lookups
      const counters = containerRef.current?.querySelectorAll("[data-target]");
      counters?.forEach((counterEl) => {
        const targetVal = Number(counterEl.getAttribute("data-target")) || 0;
        const counterVal = { val: 0 };
        gsap.to(counterVal, {
          val: targetVal,
          duration: 2.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counterEl,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            (counterEl as HTMLElement).innerText = String(Math.floor(counterVal.val));
          }
        });
      });

      // Fade in stat cards
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
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
    <section ref={containerRef} className={styles.achievements} id="achievements">
      <div className={styles.header}>
        <span className={styles.overTitle}>MILESTONES & NUMBERS</span>
        <h2 className={styles.title}>Achievements Dashboard</h2>
      </div>

      <div className={styles.grid}>
        {STATS.map((stat, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.number}>
              <span data-target={stat.target}>0</span>
              <span className={styles.numberAccent}>{stat.suffix}</span>
            </div>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Achievements;
