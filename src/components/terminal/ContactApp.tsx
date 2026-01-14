"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { getContentData } from "@/lib/terminal/file-system";

interface ContactAppProps {
  onClose: () => void;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  locations?: string[];
  availability?: string;
}

function MessagePopup({
  onClose,
  email,
}: {
  onClose: () => void;
  email?: string;
}) {
  const [messageForm, setMessageForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    popupRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    },
    [onClose],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.email || !messageForm.message) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      <div
        ref={popupRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="terminal-text pointer-events-auto w-full max-w-sm border-2 border-green-500 bg-black font-mono shadow-[0_0_20px_rgba(34,197,94,0.3),_4px_4px_0_rgba(0,0,0,0.8)] outline-none"
      >
        {/* Popup title bar */}
        <div className="flex items-center justify-between border-b border-green-600 bg-green-900/60 px-3 py-1.5">
          <span className="font-bold text-green-400">SEND MESSAGE</span>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-green-400"
          >
            [esc]
          </button>
        </div>

        <div className="p-3">
          {sent ? (
            <div className="py-4 text-center text-green-400">
              <div className="mb-1 text-green-400">[OK]</div>
              <div>Message sent!</div>
              <div className="mt-1 text-gray-500">
                I&apos;ll get back to you soon.
              </div>
              <button
                onClick={onClose}
                className="mt-3 cursor-pointer text-gray-500 hover:text-green-400"
              >
                [close]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="text-gray-500">
                To: {email ?? "contact@example.com"}
              </div>
              <div>
                <input
                  type="text"
                  value={messageForm.name}
                  onChange={(e) =>
                    setMessageForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-green-900 bg-black px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={messageForm.email}
                  onChange={(e) =>
                    setMessageForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full border border-green-900 bg-black px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <textarea
                  value={messageForm.message}
                  onChange={(e) =>
                    setMessageForm((f) => ({ ...f, message: e.target.value }))
                  }
                  rows={4}
                  className="w-full resize-none border border-green-900 bg-black px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={
                  sending ||
                  !messageForm.name ||
                  !messageForm.email ||
                  !messageForm.message
                }
                className="w-full cursor-pointer border border-green-700 py-1.5 text-green-400 transition-colors hover:bg-green-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? "[ Sending... ]" : "[ Send ]"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function ContactApp({ onClose }: ContactAppProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to batch state update and avoid React Compiler warning
    const frame = requestAnimationFrame(() => {
      const data = getContentData("contact") as ContactInfo;
      setContact(data);
    });
    containerRef.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (showMessagePopup) return;
      if (e.key === "q") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setShowMessagePopup(true);
      }
    },
    [onClose, showMessagePopup],
  );

  const contactLinks = [
    {
      key: "email",
      label: "Email",
      value: contact?.email,
      href: contact?.email ? `mailto:${contact.email}` : undefined,
    },
    {
      key: "phone",
      label: "Phone",
      value: contact?.phone,
      href: contact?.phone
        ? `tel:${contact.phone.replace(/[^0-9+]/g, "")}`
        : undefined,
    },
    {
      key: "github",
      label: "GitHub",
      value: contact?.github,
      href: contact?.github ? `https://${contact.github}` : undefined,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      value: contact?.linkedin,
      href: contact?.linkedin ? `https://${contact.linkedin}` : undefined,
    },
    {
      key: "website",
      label: "Website",
      value: contact?.website,
      href: contact?.website ? `https://${contact.website}` : undefined,
    },
  ].filter((link) => link.value);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="terminal-text relative flex h-full flex-col bg-black font-mono outline-none"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-green-800 px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className="text-green-500">┌─</span>
            <span className="font-bold text-green-400">CONTACT</span>
            <span className="text-green-500">─┐</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMessagePopup(true)}
              className="cursor-pointer border border-green-700 px-2 py-0.5 text-green-400 transition-colors hover:border-green-500 hover:bg-green-900/30"
            >
              [m] Send Message
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer text-gray-500 hover:text-green-400"
            >
              [q] exit
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center overflow-auto p-4">
          <div className="mx-auto w-full max-w-lg space-y-4">
            {/* Status */}
            {contact?.availability && (
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-green-400">{contact.availability}</span>
              </div>
            )}

            {contact?.locations && contact.locations.length > 0 && (
              <div className="text-gray-400">
                Location:{" "}
                <span className="text-green-500">
                  {contact.locations.join(" | ")}
                </span>
              </div>
            )}

            {/* Contact links */}
            <div className="border border-green-800 p-4">
              <div className="mb-3 border-b border-green-900 pb-2 text-green-600">
                Contact Information
              </div>
              <div className="space-y-2">
                {contactLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target={
                      link.key !== "email" && link.key !== "phone"
                        ? "_blank"
                        : undefined
                    }
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-gray-400 transition-colors hover:text-green-400"
                  >
                    <span className="w-20 text-gray-500">{link.label}:</span>
                    <span className="text-green-500 group-hover:underline">
                      {link.value}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Hint text */}
            <div className="text-center text-gray-600">
              Press <span className="text-green-700">[m]</span> or click the
              button above to send a message
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 gap-4 border-t border-green-800 px-3 py-1.5 text-gray-600">
          <span>
            <span className="text-green-700">[m]</span> message
          </span>
          <span>
            <span className="text-green-700">[q]</span> exit
          </span>
        </div>

        {/* Message popup overlay */}
        {showMessagePopup && (
          <MessagePopup
            onClose={() => setShowMessagePopup(false)}
            email={contact?.email}
          />
        )}
      </div>
    </div>
  );
}
