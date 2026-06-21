"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import { Code2, Terminal, Database, Cpu } from "lucide-react";
import styles from "./Skills.module.css";

interface SkillItem {
  name: string;
  level: number; // percentage
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
  variant?: "gold" | "blue";
  icon: React.ReactNode;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend Development",
    variant: "gold",
    icon: <Code2 size={22} style={{ color: "var(--accent-gold)" }} />,
    skills: [
      { name: "HTML & CSS Web Layouts", level: 95 },
      { name: "JavaScript Engine Mechanics", level: 90 },
      { name: "React.js Applications Development", level: 92 },
    ]
  },
  {
    title: "Backend Engineering",
    variant: "blue",
    icon: <Terminal size={22} style={{ color: "var(--accent-blue)" }} />,
    skills: [
      { name: "Python & FastAPI Server Design", level: 85 },
      { name: "Data Structures & Algorithms (DSA)", level: 88 },
    ]
  },
  {
    title: "Databases & Full Stack",
    variant: "blue",
    icon: <Database size={22} style={{ color: "var(--accent-blue)" }} />,
    skills: [
      { name: "SQL Database Architectures", level: 86 },
      { name: "MERN Stack Systems Integrations", level: 90 },
    ]
  },
  {
    title: "AI & Communication",
    variant: "gold",
    icon: <Cpu size={22} style={{ color: "var(--accent-gold)" }} />,
    skills: [
      { name: "Artificial Intelligence & ML Solutions", level: 85 },
      { name: "Technical Communication & Presentation", level: 92 },
    ]
  }
];

export const Skills: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate progress bars on scroll using container-relative queries
      const bars = containerRef.current?.querySelectorAll(`.${styles.barFill}`);
      bars?.forEach((bar) => {
        const level = bar.getAttribute("data-level");
        if (level) {
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${level}%`,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bar,
                start: "top 90%",
                toggleActions: "play none none reverse",
              }
            }
          );
        }
      });

      // Fade category cards in
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
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
    <section ref={containerRef} className={styles.skills} id="skills">
      <div className={styles.header}>
        <span className={styles.overTitle}>TECH STACK</span>
        <h2 className={styles.title}>Capabilities Grid</h2>
      </div>

      <div className={styles.grid}>
        {SKILL_CATEGORIES.map((category, catIdx) => (
          <div 
            key={catIdx} 
            className={`${styles.card} ${category.variant === "blue" ? styles.blueBar : ""}`}
          >
            <h3 className={styles.categoryTitle} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {category.icon}
              <span>{category.title}</span>
            </h3>
            
            <div className={styles.skillList}>
              {category.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className={styles.skillItem}>
                  <div className={styles.skillMeta}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  
                  <div className={styles.barContainer}>
                    <div 
                      data-level={skill.level}
                      className={styles.barFill} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Skills;
