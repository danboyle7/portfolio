'use client';

import React, { createContext, useContext } from 'react';

interface ZoomContextType {
  isZoomed: boolean;
  zoomScale: number;
}

const ZoomContext = createContext<ZoomContextType>({
  isZoomed: false,
  zoomScale: 1,
});

export function ZoomProvider({
  children,
  isZoomed,
  zoomScale
}: {
  children: React.ReactNode;
  isZoomed: boolean;
  zoomScale: number;
}) {
  return (
    <ZoomContext.Provider value={{ isZoomed, zoomScale }}>
      {children}
    </ZoomContext.Provider>
  );
}

export function useZoom() {
  return useContext(ZoomContext);
}

