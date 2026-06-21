import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safely register GSAP plugins on the client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Set default ease for luxury cinematic motion
  // We use power4.out with a longer duration for a smooth, weightless feel
  gsap.defaults({
    ease: "power4.out",
    duration: 1.6,
  });
}

/**
 * Reusable GSAP cinematic transitions embodying Apple-level minimalism
 */
export const cinematicAnimations = {
  // Reveal text with a clip-path mask
  revealFromBottom: (element: HTMLElement | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { y: "100%", opacity: 0 },
      { y: "0%", opacity: 1, delay, ease: "power4.out", duration: 1.6 }
    );
  },
  
  // Luxury fade-in with a soft vertical drift
  luxuryFadeIn: (element: HTMLElement | string, delay = 0) => {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, delay, ease: "power4.out", duration: 1.8 }
    );
  },
  
  // Stagger animate elements sequentially with premium spacing
  staggerFadeIn: (elements: HTMLElement[] | string, delay = 0) => {
    return gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, delay, stagger: 0.18, ease: "power4.out", duration: 1.4 }
    );
  },

  // Premium background zoom or drift
  cinematicDrift: (element: HTMLElement | string) => {
    return gsap.fromTo(
      element,
      { scale: 1.04, rotation: 0.005 },
      { scale: 1, rotation: 0, ease: "none", scrollTrigger: {
        trigger: element,
        start: "top top",
        end: "bottom top",
        scrub: true
      }}
    );
  },

  // Soft parallax scroll mapping (scrub with slight smoothing lag for premium feel)
  softParallax: (element: HTMLElement | string, speed = -15) => {
    return gsap.to(
      element,
      {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6 // Adds a soft lag to the parallax motion
        }
      }
    );
  }
};

export { gsap, ScrollTrigger };
export default gsap;
