'use client';

import { useEffect, useRef, useState } from 'react';
import type { About, ContactInfo } from '@/lib/terminal/types';

interface AboutSectionProps {
  about: About;
  contact: ContactInfo;
}

export function AboutSection({ about, contact }: AboutSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'AI/ML Engineering',
      description: 'Deep expertise from research to production deployment',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Systems Programming',
      description: 'Strong foundation in C/C++ and embedded systems',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Full-Stack Development',
      description: 'Modern frameworks with best practices',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Mission-Critical Systems',
      description: 'Defense & aerospace experience',
    },
  ];

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '4', label: 'Companies' },
    { value: '30+', label: 'Technologies' },
    { value: '3', label: 'Degrees' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Passionate about building
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> exceptional software</span>
          </h2>
          {/* Locations */}
          <div
            className={`flex flex-wrap gap-3 transition-all duration-700 delay-400 justify-center mt-4 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {contact.locations.map((location, index) => (
              <div key={index} className="flex items-center gap-2 text-slate-400">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Three Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Profile Image */}
          <div
            className={`lg:col-span-3 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="aspect-3/4 w-full max-w-[240px] mx-auto lg:mx-0 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 overflow-hidden">
              {/* Placeholder for profile image */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600 tracking-wide">Profile Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Bio & Stats */}
          <div className="lg:col-span-5 space-y-8">
            {/* Bio paragraphs */}
            <div className="space-y-4">
              <p
                className={`text-slate-400 text-base sm:text-lg leading-relaxed transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {about.bio}
              </p>
            </div>

            {/* Stats Row */}
            <div
              className={`grid grid-cols-4 gap-4 py-6 border-y border-slate-800/50 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Expertise Cards */}
          <div
            className={`lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all duration-300"
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-slate-200 font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
