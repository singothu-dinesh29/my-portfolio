"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransitionContext } from "./TransitionProvider";
import styles from "./Navbar.module.css";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { startTransition } = useTransitionContext();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a hash link, let default anchor behavior scroll smoothly
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    // Otherwise, perform cinematic route transition
    e.preventDefault();
    if (pathname === href) return;
    
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <header className={styles.navbar}>
      <Link href="/" className={styles.logo} onClick={(e) => handleNavClick(e, "/")}>
        Aura<span className={styles.logoAccent}>.</span>
      </Link>

      <nav className={styles.links}>
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className={`${styles.link} ${
              pathname === item.href || (item.href.startsWith("#") && typeof window !== "undefined" && window.location.hash === item.href)
                ? styles.active
                : ""
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className={styles.cta}>
        <a 
          href="#contact" 
          onClick={(e) => handleNavClick(e, "#contact")} 
          style={{
            fontSize: "0.75rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            border: "1px solid var(--accent-gold)",
            padding: "0.6rem 1.2rem",
            color: "var(--accent-gold)",
            borderRadius: "1px",
            transition: "all 0.4s var(--transition-smooth)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--accent-gold)";
            e.currentTarget.style.color = "var(--bg-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--accent-gold)";
          }}
        >
          Let&apos;s Talk
        </a>
      </div>
    </header>
  );
};
