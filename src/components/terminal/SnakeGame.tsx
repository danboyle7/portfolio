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

const GRID_WIDTH = 30;
const GRID_HEIGHT = 15;
const INITIAL_SPEED = 150;

export function SnakeGame({ onExit, onGameOver }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>([{ x: 15, y: 7 }]);
  const [food, setFood] = useState<Position>({ x: 20, y: 7 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  // Update direction ref when direction changes
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

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
        setGameOver(true);
        onGameOver(score);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        onGameOver(score);
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
  }, [gameOver, isPaused, food, score, highScore, generateFood, onGameOver]);

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
          setSnake([{ x: 15, y: 7 }]);
          setFood({ x: 20, y: 7 });
          setDirection('RIGHT');
          setScore(0);
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
        grid[y]![x] = ' ';
      }
    }

    // Place snake
    snake.forEach((segment, index) => {
      if (segment.y >= 0 && segment.y < GRID_HEIGHT && segment.x >= 0 && segment.x < GRID_WIDTH) {
        grid[segment.y]![segment.x] = index === 0 ? '@' : 'o';
      }
    });

    // Place food
    if (food.y >= 0 && food.y < GRID_HEIGHT && food.x >= 0 && food.x < GRID_WIDTH) {
      grid[food.y]![food.x] = '*';
    }

    return grid;
  };

  const grid = renderGrid();

  return (
    <div className="bg-black border border-green-900 rounded-lg p-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 text-green-400">
        <span className="font-bold">SNAKE</span>
        <span>Score: {score} | High: {highScore}</span>
      </div>

      {/* Game area */}
      <div className="border border-green-800 p-1 bg-black">
        <pre className="text-green-500 leading-none">
          <span className="text-green-800">{'┌' + '─'.repeat(GRID_WIDTH) + '┐'}</span>
          {'\n'}
          {grid.map((row, y) => (
            <React.Fragment key={y}>
              <span className="text-green-800">│</span>
              {row.map((cell, x) => {
                if (cell === '@') return <span key={x} className="text-green-400 font-bold">@</span>;
                if (cell === 'o') return <span key={x} className="text-green-500">o</span>;
                if (cell === '*') return <span key={x} className="text-red-500">*</span>;
                return <span key={x}> </span>;
              })}
              <span className="text-green-800">│</span>
              {'\n'}
            </React.Fragment>
          ))}
          <span className="text-green-800">{'└' + '─'.repeat(GRID_WIDTH) + '┘'}</span>
        </pre>
      </div>

      {/* Game over overlay */}
      {gameOver && (
        <div className="mt-2 text-center">
          <div className="text-red-500 font-bold">GAME OVER</div>
          <div className="text-gray-500 text-xs mt-1">
            Final Score: {score}
          </div>
          <div className="text-gray-600 text-xs mt-2">
            [R] Restart | [Q] Quit
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {isPaused && !gameOver && (
        <div className="mt-2 text-center">
          <div className="text-yellow-500">PAUSED</div>
          <div className="text-gray-600 text-xs mt-1">[P] Resume</div>
        </div>
      )}

      {/* Controls */}
      {!gameOver && !isPaused && (
        <div className="mt-2 flex justify-between text-gray-600 text-xs">
          <span>[WASD/Arrows] Move</span>
          <span>[P] Pause | [Q] Quit</span>
        </div>
      )}
    </div>
  );
}

