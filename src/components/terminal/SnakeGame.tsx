'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onExit: () => void;
  onGameOver: (score: number) => void;
}

// Larger grid for fullscreen effect
const GRID_WIDTH = 60;
const GRID_HEIGHT = 25;
const INITIAL_SPEED = 100;
const CELL_CHAR_WIDTH = 2; // Each cell is 2 characters wide for better proportions

export function SnakeGame({ onExit, onGameOver }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 30, y: 12 }]);
  const [food, setFood] = useState<Position>({ x: 45, y: 12 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Call onGameOver when game ends (NOT during render)
  useEffect(() => {
    if (gameOver && finalScore > 0) {
      // Use setTimeout to ensure this happens after render
      const timer = setTimeout(() => {
        onGameOver(finalScore);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gameOver, finalScore, onGameOver]);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_WIDTH),
        y: Math.floor(Math.random() * GRID_HEIGHT),
      };
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0]! };
      const currentDirection = directionRef.current;

      // Move head
      switch (currentDirection) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        setFinalScore(score);
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setFinalScore(score);
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        // Don't remove tail - snake grows
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameOver, isPaused, food, score, highScore, generateFood]);

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
        if (e.key === 'r' || e.key === 'R') {
          // Restart
          setSnake([{ x: 30, y: 12 }]);
          setFood({ x: 45, y: 12 });
          setDirection('RIGHT');
          setScore(0);
          setFinalScore(0);
          setGameOver(false);
        } else if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') {
          onExit();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (directionRef.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (directionRef.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (directionRef.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (directionRef.current !== 'LEFT') setDirection('RIGHT');
          break;
        case 'p':
        case 'P':
          setIsPaused(p => !p);
          break;
        case 'q':
        case 'Q':
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, onExit]);

  // Render the grid
  const renderGrid = () => {
    const grid: string[][] = [];

    // Initialize empty grid
    for (let y = 0; y < GRID_HEIGHT; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[y]![x] = '  '; // Two spaces for better proportions
      }
    }

    // Place snake
    snake.forEach((segment, index) => {
      if (segment.y >= 0 && segment.y < GRID_HEIGHT && segment.x >= 0 && segment.x < GRID_WIDTH) {
        grid[segment.y]![segment.x] = index === 0 ? '@@' : 'oo';
      }
    });

    // Place food
    if (food.y >= 0 && food.y < GRID_HEIGHT && food.x >= 0 && food.x < GRID_WIDTH) {
      grid[food.y]![food.x] = '**';
    }

    return grid;
  };

  const grid = renderGrid();

  return (
    <div
      ref={containerRef}
      className="bg-black border-2 border-green-600 rounded-lg p-4 font-mono w-full overflow-x-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-green-400 text-lg">
        <span className="font-bold text-xl">
          {'>>> SNAKE <<<'}
        </span>
        <span className="text-base">
          Score: <span className="text-yellow-400 font-bold">{score}</span> | High: <span className="text-cyan-400">{highScore}</span>
        </span>
      </div>

      {/* Game area - fullscreen style */}
      <div className="border border-green-700 bg-gray-950 relative overflow-hidden">
        <pre className="text-green-500 leading-none select-none" style={{ fontSize: '14px', lineHeight: '16px' }}>
          <span className="text-green-700">{'╔' + '═'.repeat(GRID_WIDTH * CELL_CHAR_WIDTH) + '╗'}</span>
          {'\n'}
          {grid.map((row, y) => (
            <React.Fragment key={y}>
              <span className="text-green-700">║</span>
              {row.map((cell, x) => {
                if (cell === '@@') return <span key={x} className="text-green-300 font-bold bg-green-900">@@</span>;
                if (cell === 'oo') return <span key={x} className="text-green-500 bg-green-950">oo</span>;
                if (cell === '**') return <span key={x} className="text-red-400 font-bold animate-pulse">**</span>;
                return <span key={x} className="text-gray-900">  </span>;
              })}
              <span className="text-green-700">║</span>
              {'\n'}
            </React.Fragment>
          ))}
          <span className="text-green-700">{'╚' + '═'.repeat(GRID_WIDTH * CELL_CHAR_WIDTH) + '╝'}</span>
        </pre>

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <div className="text-red-500 font-bold text-3xl mb-2">GAME OVER</div>
            <div className="text-yellow-400 text-xl mb-4">
              Final Score: {score}
            </div>
            <div className="text-gray-400 text-sm">
              [R] Restart | [Q/ESC] Quit
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-yellow-400 font-bold text-2xl">PAUSED</div>
            <div className="text-gray-500 text-sm mt-2">[P] Resume</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex justify-between text-gray-500 text-sm">
        <span>[W/A/S/D or Arrow Keys] Move</span>
        <span>[P] Pause | [Q/ESC] Quit</span>
      </div>
    </div>
  );
}
