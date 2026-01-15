"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationProps {
  onBack?: () => void;
}

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_IDS = ["hero", ...NAV_ITEMS.map((item) => item.id)];

export function Navigation({ onBack }: NavigationProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();

  // Normalize pathname by removing trailing slash for consistent comparison
  const normalizedPath = pathname?.replace(/\/$/, "") ?? "";
  const isOnBlogPage = normalizedPath.startsWith("/blog");
  // A blog post page is any path like /blog/some-slug (but not /blog itself)
  const isOnBlogPostPage =
    normalizedPath !== "/blog" && normalizedPath.startsWith("/blog/");
  const isOnPortfolioPage = pathname === "/portfolio";
  const canScrollToSections = isOnPortfolioPage || !!onBack;

  // Track scroll position and active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Only track active section when on portfolio page or embedded mode
      if (!canScrollToSections) return;

      const scrollPosition = window.scrollY + 150;

      for (const section of SECTION_IDS) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            // hero doesn't have a nav item, so set null
            setActiveSection(section === "hero" ? null : section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [canScrollToSections]);

  // Compute effective active section - null when not on portfolio page
  const effectiveActiveSection = canScrollToSections ? activeSection : null;

  // Handle section navigation on portfolio page (scroll directly)
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Get the style for a nav item based on whether it's active
  const getNavItemClass = (itemId: string) => {
    const isActive = effectiveActiveSection === itemId;
    return `rounded-lg px-4 py-2 text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-500/10 text-blue-400"
        : "text-white hover:bg-slate-800/50"
    }`;
  };

  const getMobileNavItemClass = (itemId: string) => {
    const isActive = effectiveActiveSection === itemId;
    return `w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-500/10 text-blue-400"
        : "text-white hover:bg-slate-800/50"
    }`;
  };

  // Get the style for the blog link
  const getBlogLinkClass = () => {
    return `rounded-lg px-4 py-2 text-sm font-medium transition-all ${
      isOnBlogPage
        ? "bg-blue-500/10 !text-blue-400"
        : "text-white hover:bg-slate-800/50"
    }`;
  };

  const getMobileBlogLinkClass = () => {
    return `w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all ${
      isOnBlogPage
        ? "bg-blue-500/10 !text-blue-400"
        : "text-white hover:bg-slate-800/50"
    }`;
  };

  // Determine back button destination based on current page
  const getBackDestination = () => {
    if (isOnBlogPostPage) {
      return "/blog"; // From blog post -> blog list
    }
    if (onBack) {
      return null; // Use callback for embedded mode (e.g., splash page)
    }
    return "/"; // Default to home
  };

  const backDestination = getBackDestination();

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-slate-800/50 bg-slate-950/90 shadow-lg shadow-slate-950/50 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* Back button - far left */}
        {backDestination ? (
          <Link
            href={backDestination}
            className="group absolute left-6 flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
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
            <span className="hidden text-sm font-medium sm:inline">Back</span>
          </Link>
        ) : (
          <button
            onClick={onBack}
            className="group absolute left-6 flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
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
            <span className="hidden text-sm font-medium sm:inline">Back</span>
          </button>
        )}

        {/* Desktop Navigation - centered */}
        <div className="mx-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            isOnPortfolioPage || onBack ? (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`cursor-pointer ${getNavItemClass(item.id)}`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={`/portfolio#${item.id}`}
                className={getNavItemClass(item.id)}
              >
                {item.label}
              </Link>
            ),
          )}
          {/* Blog link - separate page */}
          <Link href="/blog" className={getBlogLinkClass()}>
            Blog
          </Link>
        </div>

        {/* Mobile menu button - far right */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="absolute right-6 cursor-pointer p-2 text-slate-400 transition-colors hover:text-white md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="space-y-1 border-t border-slate-800/50 bg-slate-950/95 px-6 py-4 backdrop-blur-xl">
          {NAV_ITEMS.map((item) =>
            isOnPortfolioPage || onBack ? (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`cursor-pointer ${getMobileNavItemClass(item.id)}`}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={`/portfolio#${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block ${getMobileNavItemClass(item.id)}`}
              >
                {item.label}
              </Link>
            ),
          )}
          {/* Blog link - separate page */}
          <Link
            href="/blog"
            className={`block ${getMobileBlogLinkClass()}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}
