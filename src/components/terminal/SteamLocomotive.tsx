"use client";

import React, { useState, useEffect, useRef } from "react";

interface SteamLocomotiveProps {
  onComplete: () => void;
}

// 2 frames for smoke animation only - train body stays static
const TRAIN_FRAMES = [
  // Frame 0
  [
    "                         (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O",
    "                    (@@@)",
    "                (    )",
    "             (@@@@)",
    "           (   )",
    "        ====        ________                ___________                            ",
    "    _D _|  |_______/        \\__I_I_____===__|_________|___________________________  ",
    "     |(_)---  |   H\\________/ |   |        =|___ ___|      _________________       |",
    "     /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A|",
    "    |      |  |   H  |__--------------------| [___] |   =|                        | ",
    "    | ________|___H__/__|_____/[][]~\\_______|       |   -|                        | ",
    "    |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_",
    "  __/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    "   |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "    \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
  // Frame 1 - smoke puffs alternate
  [
    "                         (@@) (  ) (@)  ( )  @@    ()    @     O     @     O      @",
    "                    (   )",
    "                (@@@)",
    "             (    )",
    "           (@@@@)",
    "        ====        ________                ___________                            ",
    "    _D _|  |_______/        \\__I_I_____===__|_________|___________________________  ",
    "     |(_)---  |   H\\________/ |   |        =|___ ___|      _________________       |",
    "     /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A|",
    "    |      |  |   H  |__--------------------| [___] |   =|                        | ",
    "    | ________|___H__/__|_____/[][]~\\_______|       |   -|                        | ",
    "    |/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_",
    "  __/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_",
    "   |/-=|___|=O=====O=====O=====O   |_____/~\\___/          |_D__D__D_|  |_D__D__D_|  ",
    "    \\_/      \\__/  \\__/  \\__/  \\__/      \\_/               \\_/   \\_/    \\_/   \\_/   ",
  ],
];

export function SteamLocomotive({ onComplete }: SteamLocomotiveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(100); // Start off-screen right (percentage)
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
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
      setFrame((f) => f + 1);
    }, 40); // ~25fps

    return () => clearInterval(interval);
  }, [onComplete]);

  // Cycle through 2 frames for smoke animation
  const currentTrain = TRAIN_FRAMES[frame % 2];

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
        {currentTrain?.map((line, i) => (
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
