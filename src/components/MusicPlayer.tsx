import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "NEON_OVERDRIVE.WAV",
    artist: "CYBER_MINDS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "DIGITAL_HORIZON.WAV",
    artist: "NEURAL_NET",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "SYNTH_PROTOCOL.WAV",
    artist: "GHOST_MACHINE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#000] border-t-4 border-[#f0f] p-4 font-pixel uppercase">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-full md:w-1/3">
          <div className="w-16 h-16 bg-[#000] border-2 border-[#0ff] flex items-center justify-center shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 scanlines opacity-50"></div>
            <span className="text-[#0ff] text-xs animate-pulse">AUDIO</span>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[#f0f] text-xs md:text-sm truncate glitch-text mb-2" data-text={currentTrack.title}>
              {currentTrack.title}
            </span>
            <span className="text-[#0ff] text-[10px] truncate">SRC: {currentTrack.artist}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-full md:w-1/3 gap-4">
          <div className="flex items-center gap-4 text-xs md:text-sm">
            <button onClick={prevTrack} className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] border-2 border-transparent hover:border-[#f0f] px-2 py-1 transition-none cursor-pointer">
              [ &lt;&lt; ]
            </button>
            <button 
              onClick={togglePlay} 
              className="px-4 py-2 bg-[#000] border-2 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-[#000] transition-none cursor-pointer shadow-[2px_2px_0px_#0ff] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              {isPlaying ? '[ || ]' : '[ |> ]'}
            </button>
            <button onClick={nextTrack} className="text-[#0ff] hover:text-[#f0f] hover:bg-[#0ff] border-2 border-transparent hover:border-[#f0f] px-2 py-1 transition-none cursor-pointer">
              [ &gt;&gt; ]
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 relative h-4 border-2 border-[#0ff] bg-[#000]">
            <div 
              className="absolute top-0 left-0 h-full bg-[#f0f] opacity-80"
              style={{ width: `${progress}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Volume / Extras */}
        <div className="flex items-center justify-end w-full md:w-1/3 gap-4 text-xs">
          <button onClick={toggleMute} className="text-[#0ff] hover:text-[#000] hover:bg-[#0ff] border-2 border-[#0ff] px-2 py-1 transition-none cursor-pointer">
            {isMuted ? 'MUTED' : 'VOL_ON'}
          </button>
        </div>
      </div>
    </div>
  );
}
