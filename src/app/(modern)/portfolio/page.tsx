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
import { HeroSection } from "@/components/modern/sections/HeroSection";
import { AboutSection } from "@/components/modern/sections/AboutSection";
import { ExperienceSection } from "@/components/modern/sections/ExperienceSection";
import { SkillsSection } from "@/components/modern/sections/SkillsSection";
import { ProjectsSection } from "@/components/modern/sections/ProjectsSection";
import { EducationSection } from "@/components/modern/sections/EducationSection";
import { ContactSection } from "@/components/modern/sections/ContactSection";
import { Footer } from "@/components/modern/Footer";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: string;
  github: string;
  live?: string;
  stars: number;
}

export default function PortfolioPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Load content data
  const about = getContentData("about") as About;
  const experience = getContentData("experience") as Experience[];
  const education = getContentData("education") as Education[];
  const skills = getContentData("skills") as SkillCategory[];
  const projects = getContentData("projects") as Project[];
  const contact = getContentData("contact") as ContactInfo;

  // Use requestAnimationFrame for mount animation
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle hash navigation on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={`relative transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
    >
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
