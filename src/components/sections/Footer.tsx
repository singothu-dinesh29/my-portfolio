"use client";

import React from "react";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", id);
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <span className={styles.logo}>
            Aura<span className={styles.logoAccent}>.</span>
          </span>
          <p className={styles.tagline}>
            Crafting premium interactive digital experiences with cinematic details and modern motion systems.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className={styles.linksCol}>
          <span className={styles.colTitle}>EXPLORE</span>
          <a href="#home" onClick={(e) => handleScrollToSection(e, "#home")}>Home</a>
          <a href="#projects" onClick={(e) => handleScrollToSection(e, "#projects")}>Projects</a>
          <a href="#about" onClick={(e) => handleScrollToSection(e, "#about")}>About</a>
          <a href="#contact" onClick={(e) => handleScrollToSection(e, "#contact")}>Contact</a>
        </div>

        {/* Resources / Tech Column */}
        <div className={styles.linksCol}>
          <span className={styles.colTitle}>SYSTEMS</span>
          <a href="#skills" onClick={(e) => handleScrollToSection(e, "#skills")}>Tech Stack</a>
          <a href="#timeline" onClick={(e) => handleScrollToSection(e, "#timeline")}>Progression</a>
          <a href="#achievements" onClick={(e) => handleScrollToSection(e, "#achievements")}>Dashboard</a>
          <a href="#vision" onClick={(e) => handleScrollToSection(e, "#vision")}>Vision</a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span className={styles.copyright}>
          © {new Date().getFullYear()} AURA. ALL RIGHTS RESERVED.
        </span>

        <div className={styles.socials}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">X / Twitter</a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
