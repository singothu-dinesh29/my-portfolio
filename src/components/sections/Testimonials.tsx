"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Testimonials.module.css";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "Aura redesigned our cinematic studio portfolio. The combination of background WebGL shaders and smooth layout transitions is spectacular. Our site load time is faster than ever.",
    name: "Sarah Jenkins",
    role: "VP of Product, Helios Pictures"
  },
  {
    quote: "Securing our collaboration forms with strict validation and custom rate limiting was critical. Aura delivered an enterprise-grade backend while maintaining a premium, minimalist design.",
    name: "Marcus Thorne",
    role: "Founder, Nova Corporation"
  },
  {
    quote: "The interactive particle field and magnetic hover details wow every client we send to the site. Aura acts as both a premium developer and a visual creative director.",
    name: "Elena Rostova",
    role: "Creative Director, Future Lab"
  }
];

export const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and slide testimonials in stagger format
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 40 },
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
    <section ref={containerRef} className={styles.testimonials} id="testimonials">
      <div className={styles.header}>
        <span className={styles.overTitle}>PARTNER FEEDBACK</span>
        <h2 className={styles.title}>Testimonials</h2>
      </div>

      <div className={styles.grid}>
        {TESTIMONIALS.map((item, idx) => (
          <div key={idx} className={styles.card}>
            <p className={styles.quote}>{item.quote}</p>
            <div className={styles.authorInfo}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.role}>{item.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Testimonials;
