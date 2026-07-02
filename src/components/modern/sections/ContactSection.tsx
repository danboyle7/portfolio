"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactInfo } from "@/lib/terminal/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "../SectionHeading";

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
      label: "GitLab",
      value: contact.gitlab,
      href: `https://${contact.gitlab}`,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path d="M12 21 3.5 14.8 5.3 4.8a.8.8 0 0 1 1.5-.16l2.4 5.2h5.6l2.4-5.2a.8.8 0 0 1 1.5.16l1.8 10L12 21Z" />
          <path d="M3.5 14.8 9.2 9.8 12 21l2.8-11.2 5.7 5" />
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
        <SectionHeading
          label="Contact"
          align="center"
          isVisible={isVisible}
          className="mb-16"
          title={
            <>
              Let&apos;s work
              <span className="text-accent"> together</span>
            </>
          }
        >
          <p className="mx-auto mt-4 max-w-lg text-slate-400">
            I&apos;m always interested in hearing about new opportunities,
            interesting projects, or just connecting with fellow developers.
          </p>
        </SectionHeading>

        {/* Contact card */}
        <Card
          rounded="lg"
          size="lg"
          className={`transition-all delay-200 duration-700 ${
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
                  >
                    <Card
                      variant="ghost"
                      size="none"
                      className="group flex h-full items-center gap-4 p-4 transition-all hover:border-blue-500/30 hover:bg-slate-800/50"
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
                    </Card>
                  </a>
                ) : (
                  <Card
                    variant="ghost"
                    size="none"
                    className="flex h-full items-center gap-4 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/30 text-slate-400">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs tracking-wider text-slate-500 uppercase">
                        {item.label}
                      </div>
                      <div className="text-slate-200">{item.value}</div>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 border-t border-slate-800/50 pt-8 text-center">
            <Button size="lg" className="rounded-xl" asChild>
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
        </Card>
      </div>
    </section>
  );
}
