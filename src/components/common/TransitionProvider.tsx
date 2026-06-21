"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap-setup";

interface TransitionContextProps {
  isLoaded: boolean;
  isTransitioning: boolean;
  startTransition: (callback: () => void) => void;
  progress: number;
}

const TransitionContext = createContext<TransitionContextProps | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading assets (textures, fonts, etc.) for WebGL/Cinematic feel
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Complete load with animation delay
          setTimeout(() => {
            setIsLoaded(true);
          }, 800);
          
          return 100;
        }
        // Increment progress randomly
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  const startTransition = (callback: () => void) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Create transition overlay animation using GSAP
    const overlay = document.getElementById("page-transition-overlay");
    if (overlay) {
      gsap.timeline({
        onComplete: () => {
          callback();
          // Fade overlay out
          gsap.to(overlay, {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: () => {
              setIsTransitioning(false);
            }
          });
        }
      })
      .set(overlay, {
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
      })
      .to(overlay, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 0.8,
        ease: "power4.inOut"
      });
    } else {
      callback();
      setIsTransitioning(false);
    }
  };

  return (
    <TransitionContext.Provider value={{ isLoaded, isTransitioning, startTransition, progress }}>
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="preloader" style={{ flexDirection: "column", gap: "20px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "4px", fontSize: "1.5rem", color: "var(--accent-gold)" }}>
            CREATIVE PORTFOLIO
          </h2>
          <div style={{ width: "200px", height: "1px", background: "rgba(255,255,255,0.1)", position: "relative" }}>
            <div 
              style={{ 
                height: "100%", 
                background: "var(--accent-gold)", 
                width: `${progress}%`,
                transition: "width 0.1s ease-out" 
              }} 
            />
          </div>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
            LOADING SCENE {progress}%
          </span>
        </div>
      )}

      {/* Page Transition Overlay */}
      <div
        id="page-transition-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "var(--bg-secondary)",
          zIndex: 9998,
          pointerEvents: "none",
          clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
        }}
      />

      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionContext must be used within a TransitionProvider");
  }
  return context;
};
