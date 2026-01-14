"use client";

import { useState, useEffect } from "react";
import { getContentData } from "@/lib/terminal/file-system";
import type {
  About,
  Experience,
  Education,
  SkillCategory,
  ContactInfo,
} from "@/lib/terminal/types";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { EducationSection } from "./sections/EducationSection";
import { ContactSection } from "./sections/ContactSection";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: string;
  github: string;
  live?: string;
  stars: number;
}

export function ModernPortfolio({ onBack }: { onBack: () => void }) {
  // Initialize loaded state - CSS transition handles the fade-in effect
  const [isLoaded, setIsLoaded] = useState(false);

  // Load content data
  const about = getContentData("about") as About;
  const experience = getContentData("experience") as Experience[];
  const education = getContentData("education") as Education[];
  const skills = getContentData("skills") as SkillCategory[];
  const projects = getContentData("projects") as Project[];
  const contact = getContentData("contact") as ContactInfo;

  // Use requestAnimationFrame for mount animation to avoid React Compiler warning
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`modern-portfolio modern-scrollbar min-h-screen bg-slate-950 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      style={{
        fontFamily:
          "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Fixed background that stays in place while content scrolls */}
      <div className="pointer-events-none fixed inset-0 bg-slate-950">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600/20 blur-[128px]" />
        <div
          className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-600/15 blur-[100px]"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-600/10 blur-[120px]" />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-transparent to-indigo-950/20" />
      </div>

      <Navigation onBack={onBack} />

      <main className="relative">
        <HeroSection
          about={about}
          contact={contact}
          onScrollDown={() => scrollToSection("about")}
        />
        <AboutSection about={about} contact={contact} />
        <ExperienceSection experiences={experience} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <EducationSection education={education} />
        <ContactSection contact={contact} />
      </main>

      <Footer about={about} />
    </div>
  );
}
