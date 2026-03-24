import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 70;

const generateFood = (snake: {x: number, y: number}[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
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
  }, [food, gameOver, isPaused, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }
      
      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto font-pixel">
      <div className="flex flex-col md:flex-row justify-between w-full mb-4 px-4 items-center md:items-end gap-4">
        <div className="flex items-center gap-2 text-[#0ff]">
          <span className="text-sm md:text-xl font-bold">DATA_FRAGMENTS: {score}</span>
        </div>
        <div className="flex items-center gap-2 text-[#f0f]">
          <span className="text-sm md:text-xl font-bold">MAX_CAPACITY: {highScore}</span>
        </div>
      </div>

      <div className="relative bg-[#000] p-2 border-4 border-[#0ff] shadow-[8px_8px_0px_#0ff]">
        <div 
          className="grid bg-[#111] border-2 border-[#333] overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(80vw, 500px)',
            height: 'min(80vw, 500px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex((segment) => segment.x === x && segment.y === y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;

            const trailOpacity = isSnake && !isHead ? Math.max(0.2, 1 - (snakeIndex / snake.length)) : 1;

            return (
              <div
                key={i}
                className={`w-full h-full border-[1px] border-[#222] ${
                  isHead ? 'bg-[#fff] shadow-[2px_2px_0px_#0ff] z-10' :
                  isFood ? 'bg-[#f0f] shadow-[2px_2px_0px_#f0f]' :
                  ''
                }`}
                style={
                  isSnake && !isHead ? {
                    backgroundColor: `rgba(0, 255, 255, ${trailOpacity})`,
                    boxShadow: `2px 2px 0px rgba(0, 255, 255, ${trailOpacity})`,
                  } : {}
                }
              />
            );
          })}
        </div>

        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-[#f0f] m-2">
            {gameOver ? (
              <>
                <h2 className="text-2xl md:text-4xl font-bold text-[#f0f] mb-4 text-center glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                <p className="text-[#0ff] mb-8 text-xs md:text-sm">FRAGMENTS RECOVERED: {score}</p>
                <button 
                  onClick={resetGame}
                  className="px-6 py-4 bg-[#000] border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-[#000] transition-none cursor-pointer text-sm md:text-base font-bold shadow-[4px_4px_0px_#f0f] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                >
                  [ REBOOT_SEQUENCE ]
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-4xl font-bold text-[#0ff] mb-8 text-center glitch-text" data-text="INITIALIZE?">INITIALIZE?</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-4 bg-[#000] border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-[#000] transition-none cursor-pointer text-sm md:text-base font-bold shadow-[4px_4px_0px_#0ff] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                >
                  [ EXECUTE ]
                </button>
                <p className="mt-8 text-[10px] md:text-xs text-[#0ff]/70">INPUT: ARROWS / WASD</p>
                <p className="text-[10px] md:text-xs text-[#0ff]/70">INTERRUPT: SPACE</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
