'use client';

import { useState, useEffect } from 'react';
import { getContentData } from '@/lib/terminal/file-system';
import type { About, Experience, Education, SkillCategory, ContactInfo } from '@/lib/terminal/types';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { EducationSection } from './sections/EducationSection';
import { ContactSection } from './sections/ContactSection';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

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
  const [activeSection, setActiveSection] = useState('hero');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load content data
  const about = getContentData('about') as About;
  const experience = getContentData('experience') as Experience[];
  const education = getContentData('education') as Education[];
  const skills = getContentData('skills') as SkillCategory[];
  const projects = getContentData('projects') as Project[];
  const contact = getContentData('contact') as ContactInfo;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'experience', 'skills', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onBack={onBack}
      />

      <main>
        <HeroSection about={about} onScrollDown={() => scrollToSection('about')} />
        <AboutSection about={about} />
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
