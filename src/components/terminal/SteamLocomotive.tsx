"use client";

import React, { useState, useEffect, useRef } from "react";

interface SteamLocomotiveProps {
  onComplete: () => void;
}

// Static train body - smoke and wheels animated separately
const TRAIN_BODY = [
  "        ====        ________                ___________                            ",
  "    _D _|  |_______/        \\__I_I_____===__|_________|___________________________  ",
  "     |(_)---  |   H\\________/ |   |        =|___ ___|      _________________       |",
  "     /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A|",
  "    |      |  |   H  |__--------------------| [___] |   =|                        | ",
  "    | ________|___H__/__|_____/[][]~\\_______|       |   -|                        | ",
  "    |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_",
];

// Smoke frames (2 frames, animate slower)
const SMOKE_FRAMES = [
  [
    "                         (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O",
    "                    (@@@)",
    "                (    )",
    "             (@@@@)",
    "           (   )",
  ],
  [
    "                         (@@) (  ) (@)  ( )  @@    ()    @     O     @     O      @",
    "                    (   )",
    "                (@@@)",
    "             (    )",
    "           (@@@@)",
  ],
];

// Wheel/connecting rod frames based on original sl.h D51 patterns
// When rod is at TOP/BOTTOM, wheel spokes show ||
// When rod is at CENTER (left/right), wheel bases show \__/
// Back cart wheels stay completely static
const WHEEL_FRAMES = [
  // Frame 1 (D51WHL1) - rod at BOTTOM
  [
    "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    " |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
  // Frame 2 (D51WHL2) - rod at CENTER (moving up)
  [
    "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    " |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
  // Frame 3 (D51WHL3) - rod at TOP
  [
    "__/ =| o |=-O=====O=====O=====O \\ ____Y___________|__|__________________________|_",
    " |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
  // Frame 4 (D51WHL5) - rod at CENTER (moving down)
  [
    "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    " |/-=|___|=   O=====O=====O=====O|_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "  \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
];

export function SteamLocomotive({ onComplete }: SteamLocomotiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(100); // Start off-screen right (percentage)
  const [smokeFrame, setSmokeFrame] = useState(0);
  const [wheelFrame, setWheelFrame] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;

      setPosition((prev) => {
        const newPos = prev - 1.5; // Move left
        // Train is done when it's fully off screen left (use -150 to ensure fully gone)
        if (newPos < -150) {
          clearInterval(interval);
          setTimeout(onComplete, 100);
          return prev;
        }
        return newPos;
      });

      // Wheel animation every 4 ticks (slower than movement)
      if (tickRef.current % 4 === 0) {
        setWheelFrame((f) => (f + 1) % 4);
      }

      // Smoke animation every 8 ticks (even slower)
      if (tickRef.current % 8 === 0) {
        setSmokeFrame((f) => (f + 1) % 2);
      }
    }, 40); // ~25fps

    return () => clearInterval(interval);
  }, [onComplete]);

  // Compose the full train from parts
  const currentSmoke = SMOKE_FRAMES[smokeFrame] ?? SMOKE_FRAMES[0]!;
  const currentWheels = WHEEL_FRAMES[wheelFrame] ?? WHEEL_FRAMES[0]!;
  const fullTrain = [...currentSmoke, ...TRAIN_BODY, ...currentWheels];

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden font-mono"
      style={{ fontSize: "12px", lineHeight: "14px", backgroundColor: "#000" }}
    >
      <pre
        className="absolute whitespace-pre text-white"
        style={{
          left: `${position}%`,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "monospace",
          background: "transparent",
          backgroundColor: "transparent",
          margin: 0,
          padding: 0,
        }}
      >
        {fullTrain.map((line, i) => (
          <React.Fragment key={i}>
            {i < 5 ? (
              <span className="text-gray-400">{line}</span>
            ) : (
              <span className="text-white">{line}</span>
            )}
            {"\n"}
          </React.Fragment>
        ))}
      </pre>
    </div>
  );
}
