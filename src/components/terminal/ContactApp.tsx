'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

interface ContactAppProps {
  onClose: () => void;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  availability?: string;
}

function MessagePopup({ onClose, email }: { onClose: () => void; email?: string }) {
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    popupRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.name || !messageForm.email || !messageForm.message) return;

    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
      <div
        ref={popupRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-sm bg-black border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3),_4px_4px_0_rgba(0,0,0,0.8)] outline-none terminal-text font-mono pointer-events-auto"
      >
        {/* Popup title bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-green-900/60 border-b border-green-600">
          <span className="text-green-400 font-bold">SEND MESSAGE</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-green-400 cursor-pointer"
          >
            [esc]
          </button>
        </div>

        <div className="p-3">
          {sent ? (
            <div className="text-green-400 py-4 text-center">
              <div className="text-green-400 mb-1">[OK]</div>
              <div>Message sent!</div>
              <div className="text-gray-500 mt-1">I&apos;ll get back to you soon.</div>
              <button
                onClick={onClose}
                className="mt-3 text-gray-500 hover:text-green-400 cursor-pointer"
              >
                [close]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="text-gray-500">
                To: {email || 'contact@example.com'}
              </div>
              <div>
                <input
                  type="text"
                  value={messageForm.name}
                  onChange={e => setMessageForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-black border border-green-900 px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={messageForm.email}
                  onChange={e => setMessageForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-black border border-green-900 px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <textarea
                  value={messageForm.message}
                  onChange={e => setMessageForm(f => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="w-full bg-black border border-green-900 px-2 py-1 text-green-300 focus:border-green-600 focus:outline-none resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={sending || !messageForm.name || !messageForm.email || !messageForm.message}
                className="w-full py-1.5 border border-green-700 text-green-400 hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {sending ? '[ Sending... ]' : '[ Send ]'}
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
    const data = getContentData('contact') as ContactInfo;
    setContact(data);
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showMessagePopup) return;
    if (e.key === 'q') {
      e.preventDefault();
      onClose();
    }
    if (e.key === 'm' || e.key === 'M') {
      e.preventDefault();
      setShowMessagePopup(true);
    }
  }, [onClose, showMessagePopup]);

  const contactLinks = [
    { key: 'email', label: 'Email', value: contact?.email, href: contact?.email ? `mailto:${contact.email}` : undefined },
    { key: 'phone', label: 'Phone', value: contact?.phone, href: contact?.phone ? `tel:${contact.phone.replace(/[^0-9+]/g, '')}` : undefined },
    { key: 'github', label: 'GitHub', value: contact?.github, href: contact?.github ? `https://${contact.github}` : undefined },
    { key: 'linkedin', label: 'LinkedIn', value: contact?.linkedin, href: contact?.linkedin ? `https://${contact.linkedin}` : undefined },
    { key: 'website', label: 'Website', value: contact?.website, href: contact?.website ? `https://${contact.website}` : undefined },
  ].filter(link => link.value);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative h-full flex flex-col outline-none bg-black terminal-text font-mono"
      >
        {/* Header */}
        <div className="shrink-0 px-3 py-1.5 flex items-center justify-between border-b border-green-800">
          <div className="flex items-center gap-2">
            <span className="text-green-500">┌─</span>
            <span className="text-green-400 font-bold">CONTACT</span>
            <span className="text-green-500">─┐</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMessagePopup(true)}
              className="px-2 py-0.5 border border-green-700 text-green-400 hover:bg-green-900/30 hover:border-green-500 transition-colors cursor-pointer"
            >
              [m] Send Message
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-green-400 cursor-pointer"
            >
              [q] exit
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 flex flex-col justify-center">
          <div className="max-w-lg mx-auto w-full space-y-4">
            {/* Status */}
            {contact?.availability && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400">{contact.availability}</span>
              </div>
            )}

            {contact?.location && (
              <div className="text-gray-400">
                Location: <span className="text-green-500">{contact.location}</span>
              </div>
            )}

            {/* Contact links */}
            <div className="border border-green-800 p-4">
              <div className="text-green-600 mb-3 border-b border-green-900 pb-2">Contact Information</div>
              <div className="space-y-2">
                {contactLinks.map(link => (
                  <a
                    key={link.key}
                    href={link.href}
                    target={link.key !== 'email' && link.key !== 'phone' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-400 hover:text-green-400 transition-colors group"
                  >
                    <span className="text-gray-500 w-20">{link.label}:</span>
                    <span className="group-hover:underline text-green-500">{link.value}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Hint text */}
            <div className="text-gray-600 text-center">
              Press <span className="text-green-700">[m]</span> or click the button above to send a message
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-3 py-1.5 border-t border-green-800 text-gray-600 flex gap-4">
          <span><span className="text-green-700">[m]</span> message</span>
          <span><span className="text-green-700">[q]</span> exit</span>
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
