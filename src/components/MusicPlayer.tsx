import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { tracks } from '../lib/music';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Need to handle autoplay restrictions gracefully
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.warn("Playback prevented", e);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      if (duration && !isNaN(duration)) {
        setProgress((currentTime / duration) * 100);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="flex flex-col h-full w-full select-none font-terminal">
      <h3 className="text-xl md:text-2xl text-[#f0f] uppercase w-full border-b-4 border-[#0ff] pb-2 mb-6 font-pixel">
        &gt; AUDIO_THREAD
      </h3>

      <div className="flex-1 flex flex-col justify-center mb-6 mt-2 relative">
        <div className="relative aspect-square w-32 md:w-48 mx-auto mb-6 bg-black border-4 border-[#0ff] shadow-[-8px_8px_0_#f0f] overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiAvPgo8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIwLjEiIC8+Cjwvc3ZnPg==')] z-0 mix-blend-overlay opacity-50"></div>
          <Disc3 
            size={64} 
            className={`md:w-24 md:h-24 transition-all duration-75 z-10 ${isPlaying ? 'animate-spin' : ''}`}
            style={{ 
              color: isPlaying ? '#0ff' : '#666', 
              animationDuration: '2s', 
              filter: isPlaying ? `drop-shadow(4px 4px 0 #f0f)` : 'none',
              transform: isPlaying ? 'scale(1.1)' : 'scale(1)'
            }} 
          />
          {isPlaying && <div className="absolute inset-0 bg-[#0ff]/10 animate-pulse pointer-events-none"></div>}
        </div>

        <div className="w-full bg-black border-4 border-[#f0f] p-4 text-left flex flex-col mb-4">
          <h3 className="text-xl md:text-2xl font-bold uppercase text-white glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-sm text-[#0ff] uppercase tracking-widest mt-2">&gt; ARTIST: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="w-full mt-auto bg-black border-4 border-[#0ff] shadow-[8px_8px_0_#f0f] p-4 md:p-6 flex flex-col gap-6 font-pixel">
        {/* Progress Bar */}
        <div className="w-full flex items-center gap-4">
          <span className="text-[10px] text-[#f0f]">
            {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '0:00'}
          </span>
          <div className="flex-1 h-4 bg-[#222] border-2 border-[#555] relative cursor-pointer">
            <input
              title="Seek"
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />
            <div 
               className="h-full relative z-10" 
               style={{ 
                 width: `${progress}%`, 
                 background: 'repeating-linear-gradient(45deg, #0ff, #0ff 10px, transparent 10px, transparent 20px)' 
               }}
            ></div>
          </div>
          <span className="text-[10px] text-[#0ff]">
            {audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) + ':' + Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : '0:00'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-2">
           <button onClick={() => setIsMuted(!isMuted)} className="text-[#0ff] hover:text-[#f0f] transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-[#f0f] hover:text-white transition-all">
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-16 h-16 border-4 border-[#0ff] flex items-center justify-center transition-colors text-[#0ff] hover:bg-[#0ff] hover:text-black shadow-[4px_4px_0_#f0f]"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="translate-x-1" />}
            </button>
            <button onClick={handleNext} className="text-[#f0f] hover:text-white transition-all">
              <SkipForward size={24} />
            </button>
          </div>

          <div className="w-5"></div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
        crossOrigin="anonymous"
      />
    </div>
  );
}
