"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactInfo } from "@/lib/terminal/types";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  contact: ContactInfo;
}

export function ContactSection({ contact }: ContactSectionProps) {
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

  const contactLinks = [
    {
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "GitHub",
      value: contact.github,
      href: `https://${contact.github}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: contact.linkedin,
      href: `https://${contact.linkedin}`,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Locations",
      value: contact.locations.join(" · "),
      href: null,
      icon: (
        <svg
          className="h-5 w-5"
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
      ),
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        {/* Section Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Contact
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s work
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              together
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            I&apos;m always interested in hearing about new opportunities,
            interesting projects, or just connecting with fellow developers.
          </p>
        </div>

        {/* Contact card */}
        <div
          className={`rounded-2xl border border-slate-800/50 bg-slate-900/30 p-8 backdrop-blur-sm transition-all delay-200 duration-700 sm:p-12 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Status badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-blue-300">
                {contact.availability}
              </span>
            </div>
          </div>

          {/* Contact links */}
          <div className="grid gap-4 sm:grid-cols-2">
            {contactLinks.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={
                      item.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel={
                      item.href.startsWith("mailto")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="group flex h-full items-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4 transition-all hover:border-blue-500/30 hover:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/30 text-slate-400 transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-400">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs tracking-wider text-slate-500 uppercase">
                        {item.label}
                      </div>
                      <div className="text-slate-200 transition-colors group-hover:text-blue-400">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="flex h-full items-center gap-4 rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/30 text-slate-400">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs tracking-wider text-slate-500 uppercase">
                        {item.label}
                      </div>
                      <div className="text-slate-200">{item.value}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 border-t border-slate-800/50 pt-8 text-center">
            <Button variant="gradient" size="lg" className="rounded-xl" asChild>
              <a href={`mailto:${contact.email}`}>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send me an email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
