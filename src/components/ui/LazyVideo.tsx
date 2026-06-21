"use client";

import React, { useRef, useState, useEffect } from "react";

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ src, className, ...props }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isIntersected, setIsIntersected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect(); // Stop observing once the asset starts loading
        }
      },
      { rootMargin: "150px" } // Preload 150px before it enters the viewport
    );

    const currentRef = videoRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={isIntersected ? src : undefined}
      className={className}
      {...props}
    />
  );
};
export default LazyVideo;
