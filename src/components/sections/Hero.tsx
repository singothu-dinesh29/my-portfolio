"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap-setup";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import styles from "./Hero.module.css";

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Video Refs
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  
  // Element Refs for GSAP
  const taglineRef = useRef<HTMLSpanElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showSoundBadge, setShowSoundBadge] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  // 1. Native sync for the ambient blurred background playhead with the main video
  const handleTimeUpdate = () => {
    const main = mainVideoRef.current;
    const ambient = ambientVideoRef.current;
    if (main && ambient) {
      const drift = Math.abs(main.currentTime - ambient.currentTime);
      if (drift > 0.15) {
        ambient.currentTime = main.currentTime;
      }
    }
  };

  // 2. GSAP Animations on Video Load
  useEffect(() => {
    if (!videoLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo(
        [firstNameRef.current, lastNameRef.current],
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.5, stagger: 0.2, ease: "power4.out" },
        "-=0.8"
      )
      .fromTo(
        roleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(
        [controlsRef.current, scrollRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );
    }, containerRef);

    return () => ctx.revert();
  }, [videoLoaded]);

  // 3. Play / Pause Handler
  const handlePlayPause = () => {
    const main = mainVideoRef.current;
    const ambient = ambientVideoRef.current;
    if (!main) return;

    if (isPlaying) {
      main.pause();
      ambient?.pause();
    } else {
      main.play().catch((err) => console.error("Play failed:", err));
      ambient?.play().catch((err) => console.error("Ambient play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  // 4. Mute / Unmute Handler
  const handleMuteUnmute = () => {
    const main = mainVideoRef.current;
    if (!main) return;

    main.muted = !isMuted;
    setIsMuted(!isMuted);
    if (showSoundBadge) {
      setShowSoundBadge(false);
    }
  };

  // 5. Sound Badge Handler (Unmutes and fades badge)
  const handleSoundBadgeClick = () => {
    const main = mainVideoRef.current;
    if (!main) return;

    main.muted = false;
    setIsMuted(false);
    setShowSoundBadge(false);
  };

  // 6. Handle Video Meta Load
  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
  };

  return (
    <section ref={containerRef} className={styles.heroContainer} id="home">
      
      {/* 1. Blurred Ambient Background Video (Hidden on mobile for performance, loaded after main video) */}
      {!isMobile && (
        <div className={`${styles.ambientVideoWrapper} ${videoLoaded ? styles.fadeIn : ""}`}>
          <video
            ref={ambientVideoRef}
            src={videoLoaded ? "/portfolio.mp4" : undefined}
            autoPlay
            loop
            muted
            playsInline
            className={styles.ambientVideo}
          />
        </div>
      )}

      {/* 2. Primary Fullscreen Video Layer */}
      <div className={`${styles.videoWrapper} ${videoLoaded ? styles.fadeIn : ""}`}>
        <video
          ref={mainVideoRef}
          src="/portfolio.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onCanPlayThrough={handleVideoCanPlay}
          onTimeUpdate={handleTimeUpdate}
          className={styles.mainVideo}
        />
      </div>

      {/* 3. Cinematic Gradients */}
      <div className={styles.cinematicOverlay} />

      {/* 4. Text Content Column */}
      <div className={styles.content}>
        <span ref={taglineRef} className={styles.tagline} style={{ opacity: videoLoaded ? 1 : 0 }}>
          CREATIVE DEVELOPER Portfolio
        </span>

        <h1 className={styles.nameStack}>
          <span className={styles.titleRow}>
            <span ref={firstNameRef} className={styles.firstName} style={{ display: "inline-block", opacity: videoLoaded ? 1 : 0 }}>
              Dinesh
            </span>
          </span>
          <span className={styles.titleRow}>
            <span ref={lastNameRef} className={styles.lastName} style={{ display: "inline-block", opacity: videoLoaded ? 1 : 0 }}>
              Singothu
            </span>
          </span>
        </h1>

        <p ref={roleRef} className={styles.role} style={{ opacity: videoLoaded ? 1 : 0 }}>
          Engineering award-winning immersive interfaces utilizing Next.js architectures, strict systems orchestration, and WebGL physics engines.
        </p>
      </div>

      {/* 5. Glassmorphic Control Panel */}
      <div ref={controlsRef} className={styles.controlsBar} style={{ opacity: videoLoaded ? 1 : 0 }}>
        
        {/* Pulsating Tap for Sound Badge */}
        {showSoundBadge && (
          <div className={styles.soundBadge} onClick={handleSoundBadgeClick}>
            <div className={styles.soundIconWave}>
              <div className={styles.waveLine} />
              <div className={styles.waveLine} />
              <div className={styles.waveLine} />
            </div>
            <span className={styles.soundBadgeText}>Tap for Sound</span>
          </div>
        )}

        {/* Play / Pause */}
        <button className={styles.glassBtn} onClick={handlePlayPause} aria-label="Toggle Play/Pause">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Mute / Unmute */}
        <button className={styles.glassBtn} onClick={handleMuteUnmute} aria-label="Toggle Sound">
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

      </div>

      {/* 6. Scroll Indicator */}
      <div ref={scrollRef} className={styles.scrollIndicator} style={{ opacity: videoLoaded ? 1 : 0 }}>
        <span>Explore Works</span>
        <div className={styles.scrollLine} />
      </div>

    </section>
  );
};
export default Hero;
