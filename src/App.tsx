/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] font-terminal relative overflow-x-hidden select-none noise-bg crt-flicker">
      <div className="absolute inset-0 scanlines pointer-events-none z-50"></div>
      
      <div className="relative z-10 flex flex-col items-center p-4 md:p-8 w-full">
        {/* Header */}
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-4 border-[#f0f] pb-6 gap-4">
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl text-[#f0f] font-pixel uppercase mb-2 animate-pulse">SYS.ERR // OVR_RIDE</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-pixel text-white uppercase glitch-text leading-tight" data-text="NEONSNAKE">
              NEONSNAKE
            </h1>
          </div>
          <div className="flex gap-8 text-right hidden md:flex font-pixel text-xs tracking-widest">
            <div className="flex flex-col">
              <span className="text-[#f0f] uppercase mb-2">TARGET_MODULE</span>
              <span className="text-[#0ff]">AUDIO_SNAKE.EXE</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#f0f] uppercase mb-2">SYSTEM_STATUS</span>
              <span className="text-[#0ff] animate-bounce">FATAL_ERROR</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-8 w-full max-w-7xl justify-center items-center xl:items-start text-left">
          
          {/* Snake Game Container */}
          <div className="flex-grow flex flex-col items-center justify-center w-full max-w-2xl">
             <SnakeGame />
          </div>
           
          {/* Music Player Container */}
          <div className="w-full max-w-md xl:max-w-sm flex flex-col">
             <MusicPlayer />
          </div>
          
        </div>
      </div>
    </div>
  );
}
