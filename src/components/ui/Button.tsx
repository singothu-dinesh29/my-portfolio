"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap-setup";
import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "primary";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled = false
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const button = buttonRef.current;
    const text = textRef.current;
    
    if (!wrapper || !button || !text || typeof window === "undefined") return;

    // Magnetic effect implementation
    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      // Translate the button container slightly towards the cursor
      gsap.to(button, {
        x: relX * 0.35,
        y: relY * 0.35,
        duration: 0.3,
        ease: "power2.out",
      });

      // Shift text slightly in the same direction for depth
      gsap.to(text, {
        x: relX * 0.15,
        y: relY * 0.15,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Return everything to initial state
      gsap.to([button, text], {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.buttonWrapper}>
      <button
        ref={buttonRef}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${styles.button} ${variant === "primary" ? styles.primary : ""}`}
      >
        <span className={styles.buttonFill} />
        <span ref={textRef} className={styles.buttonText}>
          {children}
        </span>
      </button>
    </div>
  );
};
