"use client";

import React, { useEffect, useState, useRef } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Testimonials.module.css";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  createdAt?: string;
}

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch testimonials on mount
  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTestimonials(data.data);
        }
      })
      .catch((err) => console.error("Error fetching testimonials:", err));
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;

    const ctx = gsap.context(() => {
      // Fade and slide testimonials in stagger format
      gsap.fromTo(
        `.${styles.card}`,
        { opacity: 0, y: 40 },
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
  }, [testimonials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (!name.trim()) {
      setSubmitError("Name is required");
      return;
    }
    if (content.trim().length < 10) {
      setSubmitError("Testimonial must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || undefined,
          company: company.trim() || undefined,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitSuccess(true);
        // Prepend the new testimonial to the list
        setTestimonials((prev) => [data.data, ...prev]);
        
        // Reset form fields
        setName("");
        setRole("");
        setCompany("");
        setContent("");

        // Close form after a short delay
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        setSubmitError(data.error || "Failed to submit testimonial. Make sure the database schema is synced.");
      }
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      setSubmitError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={containerRef} className={styles.testimonials} id="testimonials">
      <div className={styles.header}>
        <span className={styles.overTitle}>PARTNER FEEDBACK</span>
        <h2 className={styles.title}>Testimonials</h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((item) => (
          <div key={item.id} className={styles.card}>
            <p className={styles.quote}>{item.content}</p>
            <div className={styles.authorInfo}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.role}>
                {item.role}
                {item.role && item.company ? ", " : ""}
                {item.company}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actionContainer}>
        {!isFormOpen ? (
          <button 
            className={styles.writeButton}
            onClick={() => setIsFormOpen(true)}
          >
            Leave a Live Testimonial
          </button>
        ) : (
          <div ref={formRef} className={styles.formContainer}>
            <h3 className={styles.formTitle}>Submit Your Feedback</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <input 
                  type="text" 
                  placeholder="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.row}>
                <input 
                  type="text" 
                  placeholder="Role (e.g., VP of Engineering)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={styles.input}
                />
                <input 
                  type="text" 
                  placeholder="Company (e.g., Google)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea 
                  placeholder="Your Testimonial (at least 10 characters) *"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.textarea}
                  rows={4}
                  required
                />
              </div>

              {submitError && <p className={styles.errorText}>{submitError}</p>}
              {submitSuccess && <p className={styles.successText}>Thank you! Your testimonial has been posted in real-time.</p>}

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Testimonial"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
export default Testimonials;
