'use client';

import React, { useState, useEffect } from 'react';

interface ComputerBackgroundProps {
  children: React.ReactNode;
  enabled?: boolean;
}

// Screen coordinates (percentages of the image)
// These are calibrated to the computer.png image
const SCREEN_BOUNDS = {
  // Top-left corner of the screen
  top: 7.5,
  left: 26.5,
  // Bottom-right corner of the screen  
  bottom: 53,
  right: 73.5,
};

export function ComputerBackground({ children, enabled = true }: ComputerBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Disable on mobile/small screens - just show regular terminal
      setIsMobile(window.innerWidth < 900 || window.innerHeight < 600);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile or when disabled, just render children normally
  if (!enabled || isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Background image - zoomed in slightly for larger screen */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/computer.png)',
          backgroundSize: '115% auto',
          backgroundPosition: 'center 30%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Terminal positioned over the screen area */}
      <div 
        className="absolute overflow-hidden"
        style={{
          top: `${SCREEN_BOUNDS.top}%`,
          left: `${SCREEN_BOUNDS.left}%`,
          right: `${100 - SCREEN_BOUNDS.right}%`,
          bottom: `${100 - SCREEN_BOUNDS.bottom}%`,
          // Slight rounding to match CRT screen shape
          borderRadius: '8px',
        }}
      >
        {/* Inner container with slight padding for screen edge */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          {children}
        </div>
        
        {/* Screen glare overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}

