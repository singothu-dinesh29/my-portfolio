"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-setup";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { submitCollaboration, type CollaborationResponse } from "@/app/actions/collaboration";
import styles from "./Collaborate.module.css";

const BUDGET_OPTIONS = [
  { label: "< $10k", value: "under_10k" },
  { label: "$10k - $25k", value: "10k_to_25k" },
  { label: "$25k - $50k", value: "25k_to_50k" },
  { label: "$50k+", value: "over_50k" }
];

export const Collaborate: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedBudget, setSelectedBudget] = useState("10k_to_25k");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [status, setStatus] = useState<CollaborationResponse | null>(null);

  // Form Fields & Real-time validation states
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    company: "",
    projectIdea: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    projectIdea: ""
  });

  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    projectIdea: false
  });

  // GSAP Entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.4,
          ease: "power4.out",
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

  // Validation Logic
  const validateField = (name: string, value: string) => {
    let errorMsg = "";

    if (name === "fullName") {
      if (value.trim().length < 2) {
        errorMsg = "Name must be at least 2 characters.";
      }
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address.";
      }
    }

    if (name === "projectIdea") {
      if (value.trim().length < 10) {
        errorMsg = "Project overview must be at least 10 characters.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleInputBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, fields[name as keyof typeof fields]);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ fullName: true, email: true, projectIdea: true });
    
    // Validate all
    validateField("fullName", fields.fullName);
    validateField("email", fields.email);
    validateField("projectIdea", fields.projectIdea);

    if (errors.fullName || errors.email || errors.projectIdea || !fields.fullName || !fields.email || !fields.projectIdea) {
      return;
    }

    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    formData.append("budget", selectedBudget);

    const result = await submitCollaboration(formData);
    
    setLoading(false);

    if (result.success) {
      // Trigger Cinematic Success Animations
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          setIsSuccess(true);
          // Animate Success Screen
          gsap.fromTo(
            successRef.current,
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power4.out" }
          );
        }
      });
    } else {
      setStatus(result);
    }
  };

  return (
    <section ref={containerRef} className={styles.collaborate} id="contact">
      <div className={styles.header}>
        <span className={styles.overTitle}>COLLABORATION PORTAL</span>
        <h2 className={styles.title}>Let&apos;s Collaborate</h2>
      </div>

      <div ref={cardRef} className={styles.formCard}>
        
        {/* Form Screen */}
        {!isSuccess ? (
          <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
            
            {/* Honeypot anti-spam field */}
            <input 
              type="text" 
              name="website" 
              tabIndex={-1} 
              autoComplete="off" 
              className={styles.honeypot} 
            />

            {/* Name Input */}
            <div className={`${styles.inputGroup} ${touched.fullName && errors.fullName ? styles.inputError : ""}`}>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" "
                value={fields.fullName}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur("fullName")}
                required
              />
              <label htmlFor="fullName">Full Name *</label>
              {touched.fullName && errors.fullName && (
                <span className={styles.validationWarning}>{errors.fullName}</span>
              )}
            </div>

            {/* Email Input */}
            <div className={`${styles.inputGroup} ${touched.email && errors.email ? styles.inputError : ""}`}>
              <input
                type="email"
                id="email"
                name="email"
                placeholder=" "
                value={fields.email}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur("email")}
                required
              />
              <label htmlFor="email">Email Address *</label>
              {touched.email && errors.email && (
                <span className={styles.validationWarning}>{errors.email}</span>
              )}
            </div>

            {/* Company Input */}
            <div className={styles.inputGroup}>
              <input
                type="text"
                id="company"
                name="company"
                placeholder=" "
                value={fields.company}
                onChange={handleInputChange}
              />
              <label htmlFor="company">Company / Organization</label>
            </div>

            {/* Budget Selector */}
            <div className={styles.budgetGroup}>
              <span className={styles.budgetLabel}>Estimated Project Budget *</span>
              <div className={styles.budgetSelector}>
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.budgetBtn} ${selectedBudget === opt.value ? styles.budgetActive : ""}`}
                    onClick={() => setSelectedBudget(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Overview */}
            <div className={`${styles.inputGroup} ${touched.projectIdea && errors.projectIdea ? styles.inputError : ""}`}>
              <textarea
                id="projectIdea"
                name="projectIdea"
                placeholder=" "
                rows={6}
                value={fields.projectIdea}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur("projectIdea")}
                required
              />
              <label htmlFor="projectIdea">Project Overview *</label>
              {touched.projectIdea && errors.projectIdea && (
                <span className={styles.validationWarning}>{errors.projectIdea}</span>
              )}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Sending Details..." : "Initiate Proposal"}
              </Button>
            </div>

            {status && !status.success && (
              <div className={styles.statusMsg} style={{ display: "block" }}>
                <div className={styles.statusError}>{status.message}</div>
              </div>
            )}

          </form>
        ) : (
          /* Cinematic Success Screen */
          <div ref={successRef} className={styles.successCard}>
            <div className={styles.successIconWrapper}>
              <Check className={styles.successIcon} size={36} />
            </div>
            
            <h3 className={styles.successTitle}>Inquiry Sent</h3>
            <p className={styles.successText}>
              Your idea has entered my creative universe.<br />
              I will review your vision and connect with you soon.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
export default Collaborate;
