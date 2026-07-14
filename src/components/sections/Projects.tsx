"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Projects.module.css";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  year: number;
  coverImage: string;
  tags: string[];
  demoUrl?: string | null;
  githubUrl?: string | null;
  isFeatured: boolean;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setProjects(resData.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching projects in section:", err);
      });
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Luxury stagger entrance for project cards
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.28,
          duration: 1.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          }
        }
      );

      // 2. Alternating depth parallax drift on cards
      const cards = gsap.utils.toArray(`.${styles.card}`);
      cards.forEach((card, index) => {
        const speed = index % 2 === 0 ? -30 : -15;
        gsap.to(card as HTMLElement, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: card as HTMLElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={containerRef} className={styles.projects} id="projects">
      <div className={styles.header}>
        <span className={styles.overTitle}>SELECTED PORTFOLIO</span>
        <h2 className={styles.title}>Cinematic Showcase</h2>
      </div>

      <div className={styles.grid}>
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className={`${styles.card} ${idx === 0 ? styles.cardFeatured : ""}`}
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
          >
            <div className={styles.mediaWrapper}>
              {hoveredProjectId === project.id ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src="/ecommerce_preview.png"
                    alt="E-commerce preview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.media}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.media}
                    style={{ objectFit: "cover" }}
                    priority={idx === 0}
                  />
                </div>
              )}
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.projectMeta}>
                <span className={styles.category}>{project.category}</span>
                <span className={styles.year}>{project.year}</span>
              </div>

              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.desc}>{project.description}</p>
              
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className={styles.links}>
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Live Experience
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Projects;
