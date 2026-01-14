'use client';

import { useState, useEffect } from 'react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onBack: () => void;
}

export function Navigation({ activeSection, onNavigate, onBack }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-slate-950/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-6 py-4 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeSection === item.id
                  ? 'text-blue-400 bg-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
