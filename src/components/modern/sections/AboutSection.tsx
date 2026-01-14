"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { About, ContactInfo } from "@/lib/terminal/types";

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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const highlights = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "AI/ML Engineering",
      description: "Deep expertise from research to production deployment",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      title: "Systems Programming",
      description: "Strong foundation in C/C++ and embedded systems",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      title: "Full-Stack Development",
      description: "Modern frameworks with best practices",
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Mission-Critical Systems",
      description: "Defense & aerospace experience",
    },
  ];

  const stats = [
    { value: "10+", label: "Years Experience" },
    { value: "4", label: "Companies" },
    { value: "30+", label: "Technologies" },
    { value: "3", label: "Degrees" },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            About Me
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Passionate about building
            <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              exceptional software
            </span>
          </h2>
          {/* Locations */}
          <div
            className={`mt-4 flex flex-wrap justify-center gap-3 transition-all delay-400 duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {contact.locations.map((location, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-slate-400"
              >
                <svg
                  className="h-4 w-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">{location}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Three Column Layout */}
        <div className="grid gap-6 md:gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Section - Image + Bio (grouped together) */}
          <div className="grid items-stretch gap-6 md:grid-cols-[auto_1fr] md:gap-8 lg:col-span-8">
            {/* Profile Image */}
            <div
              className={`transition-all delay-100 duration-700 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border border-slate-700/50 bg-linear-to-br from-slate-800/50 to-slate-900/50 md:mx-0 md:aspect-auto md:h-full md:w-[240px] md:max-w-none lg:aspect-auto lg:h-full lg:w-[320px]">
                <Image
                  src="https://media.licdn.com/dms/image/v2/C4E03AQEyaAZMhih_KA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1558729641546?e=1770249600&v=beta&t=53Wkqm6Ku1qUOaZRD-D1yPPFupKwYySvKayQYD1FDm8"
                  alt="Daniel Boyle"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Bio & Stats */}
            <div className="space-y-8">
              {/* Bio paragraphs */}
              <div className="space-y-4">
                <p
                  className={`text-base leading-relaxed text-slate-400 transition-all duration-700 sm:text-lg ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  {about.bio}
                </p>
              </div>

              {/* Stats Row */}
              <div
                className={`grid grid-cols-4 gap-4 border-y border-slate-800/50 py-6 transition-all delay-300 duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Expertise Cards */}
          <div
            className={`grid grid-cols-2 gap-3 transition-all delay-200 duration-700 md:grid-cols-4 lg:col-span-4 lg:grid-cols-2 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group rounded-xl border border-slate-800/50 bg-slate-900/30 p-3 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-900/50 lg:p-4"
                style={{ transitionDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                  <div className="h-5 w-5">{item.icon}</div>
                </div>
                <h3 className="mb-0.5 text-sm font-semibold text-slate-200">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
