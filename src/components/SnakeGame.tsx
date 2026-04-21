import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

const generateFood = (snake: Point[]): Point => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    const isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOccupied) break;
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === ' ' && (gameOver || !isPlaying)) {
       resetGame();
       return;
    }

    if (!isPlaying) return;

    const currentDir = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isPlaying, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver) return;

    directionRef.current = nextDirectionRef.current;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y
      };

      // Check walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        handleGameOver();
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPlaying, gameOver, food]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
    setHighScore(prev => Math.max(prev, score));
  };

  useEffect(() => {
    const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="flex w-full mb-8 gap-4 px-2 font-pixel">
        <div className="p-4 bg-black border-4 border-[#0ff] flex flex-col items-center flex-1 text-center shadow-[4px_4px_0_#f0f]">
          <span className="text-[10px] md:text-xs tracking-widest text-[#f0f] uppercase mb-4 animate-pulse">SCORE</span>
          <span className="text-2xl md:text-3xl text-[#0ff]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="p-4 bg-black border-4 border-[#f0f] flex flex-col items-center flex-1 text-center shadow-[4px_4px_0_#0ff]">
          <span className="text-[10px] md:text-xs tracking-widest text-[#0ff] uppercase mb-4 animate-pulse">MAX</span>
          <span className="text-2xl md:text-3xl text-[#f0f]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative p-2 border-4 border-[#0ff] bg-black shadow-[8px_8px_0_#f0f] w-full max-w-[420px]">
        <div 
          className="relative bg-[#111] overflow-hidden w-full aspect-square"
        >
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none z-0" 
            style={{ backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)', backgroundSize: '5% 5%' }}
          ></div>
          {snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute bg-[#0ff] z-10 border border-black`}
              style={{
                width: '5%',
                height: '5%',
                left: `${segment.x * 5}%`,
                top: `${segment.y * 5}%`,
              }}
            />
          ))}
        
        <div
          className="absolute bg-[#f0f] z-10 animate-ping"
          style={{
            width: '5%',
            height: '5%',
            left: `${food.x * 5}%`,
            top: `${food.y * 5}%`,
          }}
        >
        </div>

        {(!isPlaying || gameOver) && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 p-6 text-center">
            {gameOver && (
              <h2 className="text-white text-3xl md:text-4xl font-pixel mb-6 glitch-text" data-text="GAME OVER">
                GAME OVER
              </h2>
            )}
            <button
              onClick={resetGame}
              className="w-full max-w-[240px] py-4 mt-4 border-4 border-[#f0f] bg-black text-[#0ff] font-pixel text-xs hover:bg-[#f0f] hover:text-black transition-colors shadow-[4px_4px_0_#0ff]"
            >
              {gameOver ? 'REBOOT' : 'EXECUTE'}
            </button>
            {!gameOver && <p className="mt-8 font-pixel text-[#f0f] text-[10px] animate-pulse">AWAITING SYSTEM START // PRESS SPACE</p>}
          </div>
        )}
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-12 w-full max-w-[420px] justify-center font-pixel text-[#0ff] text-[10px]">
        <div className="text-center">CTRL: W_A_S_D</div>
        <div className="text-center">HALT: SPACE</div>
      </div>
    </div>
  );
}
