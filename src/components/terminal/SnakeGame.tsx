"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: () => void;
  onGameOver: (score: number) => void;
}

const INITIAL_SPEED = 100;
const CELL_CHAR_WIDTH = 2; // Each cell is 2 characters wide for better proportions
const CHAR_WIDTH = 8.4; // Approximate width of monospace character in pixels
const CHAR_HEIGHT = 16; // Approximate height of line in pixels

export function SnakeGame({ onExit, onGameOver }: SnakeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 60, height: 20 });

  // Calculate grid size based on container
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Account for padding, borders, header, footer - generous padding to ensure boundaries visible
        const availableWidth = rect.width - 80; // More padding for visible boundaries
        const availableHeight = rect.height - 120; // header + footer + padding

        // Clamp grid dimensions to reasonable ranges
        const gridWidth = Math.min(
          45,
          Math.max(
            15,
            Math.floor(availableWidth / (CHAR_WIDTH * CELL_CHAR_WIDTH)),
          ),
        );
        const gridHeight = Math.min(
          20,
          Math.max(6, Math.floor(availableHeight / CHAR_HEIGHT)),
        );

        setDimensions({ width: gridWidth, height: gridHeight });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const GRID_WIDTH = dimensions.width;
  const GRID_HEIGHT = dimensions.height;

  const initialSnakePos = useMemo(
    () => ({
      x: Math.floor(GRID_WIDTH / 2),
      y: Math.floor(GRID_HEIGHT / 2),
    }),
    [GRID_WIDTH, GRID_HEIGHT],
  );

  const initialFoodPos = useMemo(
    () => ({
      x: Math.floor(GRID_WIDTH * 0.75),
      y: Math.floor(GRID_HEIGHT / 2),
    }),
    [GRID_WIDTH, GRID_HEIGHT],
  );

  const [snake, setSnake] = useState<Position[]>([initialSnakePos]);
  const [food, setFood] = useState<Position>(initialFoodPos);
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">(
    "RIGHT",
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  // Reset game when dimensions change
  useEffect(() => {
    setSnake([initialSnakePos]);
    setFood(initialFoodPos);
    setDirection("RIGHT");
    setScore(0);
    setFinalScore(0);
    setGameOver(false);
  }, [initialSnakePos, initialFoodPos]);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Call onGameOver when game ends (NOT during render)
  useEffect(() => {
    if (gameOver && finalScore > 0) {
      const timer = setTimeout(() => {
        onGameOver(finalScore);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gameOver, finalScore, onGameOver]);

  // Generate random food position
  const generateFood = useCallback(
    (currentSnake: Position[]): Position => {
      let newFood: Position;
      do {
        newFood = {
          x: Math.floor(Math.random() * GRID_WIDTH),
          y: Math.floor(Math.random() * GRID_HEIGHT),
        };
      } while (
        currentSnake.some((seg) => seg.x === newFood.x && seg.y === newFood.y)
      );
      return newFood;
    },
    [GRID_WIDTH, GRID_HEIGHT],
  );

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0]! };
      const currentDirection = directionRef.current;

      switch (currentDirection) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_WIDTH ||
        head.y < 0 ||
        head.y >= GRID_HEIGHT
      ) {
        setFinalScore(score);
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        setFinalScore(score);
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [
    gameOver,
    isPaused,
    food,
    score,
    highScore,
    generateFood,
    GRID_WIDTH,
    GRID_HEIGHT,
  ]);

  // Start game loop
  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(gameLoop, INITIAL_SPEED);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameLoop, gameOver, isPaused]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === "r" || e.key === "R") {
          setSnake([initialSnakePos]);
          setFood(initialFoodPos);
          setDirection("RIGHT");
          setScore(0);
          setFinalScore(0);
          setGameOver(false);
        } else if (e.key === "q" || e.key === "Q" || e.key === "Escape") {
          onExit();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (directionRef.current !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (directionRef.current !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (directionRef.current !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (directionRef.current !== "LEFT") setDirection("RIGHT");
          break;
        case "p":
        case "P":
          setIsPaused((p) => !p);
          break;
        case "q":
        case "Q":
        case "Escape":
          e.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, onExit, initialSnakePos, initialFoodPos]);

  // Render the grid
  const renderGrid = () => {
    const grid: string[][] = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[y]![x] = "  ";
      }
    }

    snake.forEach((segment, index) => {
      if (
        segment.y >= 0 &&
        segment.y < GRID_HEIGHT &&
        segment.x >= 0 &&
        segment.x < GRID_WIDTH
      ) {
        grid[segment.y]![segment.x] = index === 0 ? "@@" : "oo";
      }
    });

    if (
      food.y >= 0 &&
      food.y < GRID_HEIGHT &&
      food.x >= 0 &&
      food.x < GRID_WIDTH
    ) {
      grid[food.y]![food.x] = "**";
    }

    return grid;
  };

  const grid = renderGrid();

  return (
    <div
      ref={containerRef}
      className="terminal-text flex h-full w-full flex-col bg-black font-mono"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-green-700 px-4 py-2 text-green-400">
        <span className="text-lg font-bold">SNAKE</span>
        <span className="text-sm">
          Score: <span className="font-bold text-yellow-400">{score}</span> |
          High: <span className="text-cyan-400">{highScore}</span>
        </span>
      </div>

      {/* Game area - fills remaining space */}
      <div className="flex flex-1 items-center justify-center overflow-hidden p-4">
        <div className="relative border border-green-700 bg-gray-950">
          <pre
            className="leading-none text-green-500 select-none"
            style={{ fontSize: "14px", lineHeight: "16px" }}
          >
            <span className="text-green-700">
              {"╔" + "═".repeat(GRID_WIDTH * CELL_CHAR_WIDTH) + "╗"}
            </span>
            {"\n"}
            {grid.map((row, y) => (
              <React.Fragment key={y}>
                <span className="text-green-700">║</span>
                {row.map((cell, x) => {
                  if (cell === "@@")
                    return (
                      <span
                        key={x}
                        className="bg-green-900 font-bold text-green-300"
                      >
                        @@
                      </span>
                    );
                  if (cell === "oo")
                    return (
                      <span key={x} className="bg-green-950 text-green-500">
                        oo
                      </span>
                    );
                  if (cell === "**")
                    return (
                      <span
                        key={x}
                        className="animate-pulse font-bold text-red-400"
                      >
                        **
                      </span>
                    );
                  return (
                    <span key={x} className="text-gray-900">
                      {" "}
                    </span>
                  );
                })}
                <span className="text-green-700">║</span>
                {"\n"}
              </React.Fragment>
            ))}
            <span className="text-green-700">
              {"╚" + "═".repeat(GRID_WIDTH * CELL_CHAR_WIDTH) + "╝"}
            </span>
          </pre>

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <div className="mb-2 text-2xl font-bold text-red-500">
                GAME OVER
              </div>
              <div className="mb-4 text-lg text-yellow-400">
                Final Score: {score}
              </div>
              <div className="text-sm text-gray-400">
                [R] Restart | [Q/ESC] Quit
              </div>
            </div>
          )}

          {/* Pause overlay */}
          {isPaused && !gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <div className="text-xl font-bold text-yellow-400">PAUSED</div>
              <div className="mt-2 text-sm text-gray-500">[P] Resume</div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between border-t border-green-700 px-4 py-2 text-xs text-gray-500">
        <span>[W/A/S/D or Arrows] Move</span>
        <span>[P] Pause | [Q/ESC] Quit</span>
      </div>
    </div>
  );
}
