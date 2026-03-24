import React, { useEffect, useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [memoryDump, setMemoryDump] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLines = Array.from({ length: 5 }).map(() => 
        `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')} ${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      );
      setMemoryDump(newLines);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#000] text-[#0ff] flex flex-col font-mono overflow-hidden relative screen-tear crt-flicker">
      <div className="absolute inset-0 noise pointer-events-none z-50"></div>
      <div className="absolute inset-0 scanlines pointer-events-none z-40"></div>
      
      {/* Decorative side elements */}
      <div className="hidden lg:flex flex-col absolute left-4 top-24 bottom-24 w-32 text-[10px] text-[#0ff]/40 pointer-events-none z-10 justify-between">
        <div>
          <p className="mb-2 text-[#f0f]/60">SYS_MEM_DUMP</p>
          {memoryDump.map((line, i) => <p key={i}>{line}</p>)}
        </div>
        <div>
          <p>SEC_PROTOCOL: OVERRIDE</p>
          <p>ENCRYPTION: DISABLED</p>
          <p className="animate-pulse text-[#f0f]/60 mt-2">AWAITING_INPUT...</p>
        </div>
      </div>

      <header className="w-full py-4 px-8 relative z-10 flex flex-col md:flex-row justify-between items-center border-b-4 border-[#f0f] bg-[#000] shadow-[0_4px_0px_rgba(255,0,255,0.3)]">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-[#f0f] animate-ping"></div>
          <h1 className="text-2xl md:text-4xl font-pixel glitch-text text-[#0ff]" data-text="SYS.OP//SNAKE_PROTOCOL">
            SYS.OP//SNAKE_PROTOCOL
          </h1>
        </div>
        <div className="text-[#f0f] font-pixel text-xs animate-pulse mt-4 md:mt-0 border-2 border-[#f0f] px-3 py-1">
          [STATUS: ONLINE]
        </div>
      </header>

      <main className="flex-1 w-full relative z-10 flex flex-col items-center justify-center p-4 md:p-8">
        <SnakeGame />
      </main>

      <div className="relative z-20 mt-auto border-t-4 border-[#0ff] bg-[#000] shadow-[0_-4px_0px_rgba(0,255,255,0.3)]">
        <MusicPlayer />
      </div>
    </div>
  );
}
