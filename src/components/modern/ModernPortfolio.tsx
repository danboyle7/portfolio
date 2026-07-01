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
import { TechBackground } from "./TechBackground";

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
      <TechBackground />

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
