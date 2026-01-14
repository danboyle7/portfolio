'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ZoomProvider } from './ZoomContext';

interface ComputerBackgroundProps {
  children: React.ReactNode;
  enabled?: boolean;
}

/* ============================================
   EASY ADJUSTMENT SETTINGS
   All values are percentages of the image dimensions
   ============================================ */

// TERMINAL SCREEN - Position on monitor (% of image)
const SCREEN_BOUNDS = {
  top: 11.9,
  left: 31.6,
  bottom: 56.8,
  right: 68.4,
};

// ZOOM SETTINGS - Zooms the whole monitor for better UX
const ZOOM_CONFIG = {
  scale: 1.6,
  translateY: 14.5,
  translateX: 0,
};

// POWER BUTTON - Position on the monitor (% of image)
const POWER_BUTTON = {
  top: 62.6,
  left: 32.6,
  width: 2.8,
  height: 3.5,
};

// ZOOM BUTTON - Position on monitor (% of image)
const ZOOM_BUTTON = {
  top: 63.3,
  left: 64,
  width: 1.8,
  height: 2.1,
};

// CRT ANIMATION TIMING (milliseconds)
const CRT_TIMING = {
  shrinkDuration: 150,
  lineDuration: 100,
  offDuration: 800,
  onDuration: 200,
};

/* ============================================
   COMPONENT
   ============================================ */

export function ComputerBackground({ children, enabled = true }: ComputerBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLayout, setImageLayout] = useState({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0
  });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [crtPhase, setCrtPhase] = useState<'on' | 'shrinking' | 'line' | 'dot' | 'off' | 'expanding'>('on');
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      // Only switch to terminal-only mode on actual mobile devices
      setIsMobile(window.innerWidth < 640 || window.innerHeight < 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate the rendered image layout (size and position within container)
  // Uses "cover" behavior: fill height, crop sides if needed (keeps monitor centered)
  const calculateImageLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container || !imageLoaded || imageDimensions.width === 0) return;

    const containerRect = container.getBoundingClientRect();
    const imgAspect = imageDimensions.width / imageDimensions.height;

    // Always fill the height, let width extend beyond container if needed
    const renderedHeight = containerRect.height;
    const renderedWidth = renderedHeight * imgAspect;

    // Center horizontally (will be negative if image is wider than container, causing crop)
    const offsetX = (containerRect.width - renderedWidth) / 2;
    const offsetY = 0;

    setImageLayout({ width: renderedWidth, height: renderedHeight, offsetX, offsetY });
  }, [imageLoaded, imageDimensions]);

  useEffect(() => {
    if (!imageLoaded || isMobile) return;

    calculateImageLayout();
    window.addEventListener('resize', calculateImageLayout);
    return () => window.removeEventListener('resize', calculateImageLayout);
  }, [imageLoaded, isMobile, calculateImageLayout]);

  // Load image and get dimensions
  useEffect(() => {
    if (isMobile) return;

    const img = new window.Image();
    img.src = '/computer2.png';
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
    };
  }, [isMobile]);

  // Handle power button click - CRT off/on effect
  const handlePowerClick = () => {
    if (crtPhase !== 'on') return;

    setCrtPhase('shrinking');

    setTimeout(() => {
      setCrtPhase('line');
    }, CRT_TIMING.shrinkDuration);

    setTimeout(() => {
      setCrtPhase('dot');
    }, CRT_TIMING.shrinkDuration + CRT_TIMING.lineDuration);

    setTimeout(() => {
      setCrtPhase('off');
    }, CRT_TIMING.shrinkDuration + CRT_TIMING.lineDuration + 50);

    setTimeout(() => {
      setCrtPhase('expanding');
    }, CRT_TIMING.shrinkDuration + CRT_TIMING.lineDuration + 50 + CRT_TIMING.offDuration);

    setTimeout(() => {
      setCrtPhase('on');
    }, CRT_TIMING.shrinkDuration + CRT_TIMING.lineDuration + 50 + CRT_TIMING.offDuration + CRT_TIMING.onDuration);
  };

  // Handle zoom toggle
  const handleZoomToggle = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  // ESC key to zoom out
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  // On mobile or when disabled, just render children normally
  if (!enabled || isMobile) {
    return (
      <ZoomProvider isZoomed={false} zoomScale={1}>
        {children}
      </ZoomProvider>
    );
  }

  // CRT animation styles
  const getCrtStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      transformOrigin: 'center center',
    };

    switch (crtPhase) {
      case 'shrinking':
        return {
          ...base,
          transform: 'scaleY(0.008)',
          transition: `transform ${CRT_TIMING.shrinkDuration}ms ease-in`,
          filter: 'brightness(1.8)',
        };
      case 'line':
        return {
          ...base,
          transform: 'scaleY(0.008) scaleX(0)',
          transition: `transform ${CRT_TIMING.lineDuration}ms ease-in`,
          filter: 'brightness(2.5)',
        };
      case 'dot':
        return {
          ...base,
          transform: 'scale(0)',
          transition: 'transform 30ms ease-in',
          filter: 'brightness(4)',
        };
      case 'off':
        return {
          ...base,
          transform: 'scale(0)',
          opacity: 0,
        };
      case 'expanding':
        return {
          ...base,
          transform: 'scale(1)',
          transition: `transform ${CRT_TIMING.onDuration}ms ease-out`,
          filter: 'brightness(1.2)',
        };
      default:
        return {
          ...base,
          transform: 'scale(1)',
          transition: 'filter 200ms ease-out',
        };
    }
  };

  // Calculate position style from bounds (percentage of image)
  const getPositionStyle = (bounds: { top: number; left: number; width?: number; height?: number; bottom?: number; right?: number }): React.CSSProperties => {
    if (bounds.width !== undefined && bounds.height !== undefined) {
      return {
        top: `${bounds.top}%`,
        left: `${bounds.left}%`,
        width: `${bounds.width}%`,
        height: `${bounds.height}%`,
      };
    } else {
      return {
        top: `${bounds.top}%`,
        left: `${bounds.left}%`,
        width: `${(bounds.right ?? 0) - bounds.left}%`,
        height: `${(bounds.bottom ?? 0) - bounds.top}%`,
      };
    }
  };

  // Zoom transform - scales the whole monitor
  const zoomTransform = isZoomed
    ? `scale(${ZOOM_CONFIG.scale}) translate(${ZOOM_CONFIG.translateX}%, ${ZOOM_CONFIG.translateY}%)`
    : 'scale(1) translate(0%, 0%)';

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-black">
      {/* Wrapper that positions and transforms everything together */}
      <div
        className="absolute transition-transform duration-500"
        style={{
          left: `${imageLayout.offsetX}px`,
          top: `${imageLayout.offsetY}px`,
          width: `${imageLayout.width}px`,
          height: `${imageLayout.height}px`,
          transform: zoomTransform,
          transformOrigin: 'center center',
        }}
      >
        {/* Computer image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/computer2.png"
          alt="Vintage computer monitor"
          className="absolute inset-0 w-full h-full"
        />

        {/* Terminal screen - positioned relative to image */}
        {imageLoaded && (
          <div
            className="absolute overflow-hidden bg-black"
            style={{
              ...getPositionStyle(SCREEN_BOUNDS),
              borderRadius: isZoomed ? '12px' : '6px',
              ...getCrtStyle(),
            }}
          >
            {/* Screen content */}
            <div
              className="absolute inset-0"
              style={{
                opacity: crtPhase === 'off' ? 0 : 1,
                visibility: crtPhase === 'off' ? 'hidden' : 'visible',
              }}
            >
              <ZoomProvider isZoomed={isZoomed} zoomScale={isZoomed ? ZOOM_CONFIG.scale : 1}>
                {children}
              </ZoomProvider>
            </div>

            {/* Screen glare */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
              }}
            />
          </div>
        )}

        {/* Power button */}
        {imageLoaded && (
          <button
            onClick={handlePowerClick}
            className="absolute cursor-pointer rounded transition-colors border border-transparent hover:border-gray-800/50 hover:bg-gray-800/10"
            style={getPositionStyle(POWER_BUTTON)}
            title="Power (click to turn off display)"
            aria-label="Power button"
          />
        )}

        {/* Zoom button */}
        {imageLoaded && (
          <button
            onClick={handleZoomToggle}
            className="absolute cursor-pointer rounded transition-colors border border-transparent hover:border-gray-800/50 hover:bg-gray-800/10"
            style={getPositionStyle(ZOOM_BUTTON)}
            title={isZoomed ? "Zoom out (ESC)" : "Zoom in"}
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          />
        )}
      </div>

      {/* Fixed zoom out button (always visible when zoomed) */}
      {isZoomed && (
        <button
          onClick={handleZoomToggle}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-black/80 border border-green-500/50 text-green-500 rounded hover:bg-green-500/10 transition-colors text-sm font-mono"
        >
          [ESC] Zoom Out
        </button>
      )}
    </div>
  );
}
