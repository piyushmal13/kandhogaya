import { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoMarker {
  time: number; // In seconds
  label: string;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  isLive?: boolean;
  markers?: VideoMarker[];
}

export function VideoPlayer({ src, poster, title, isLive = false, markers = [] }: Readonly<VideoPlayerProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Keyboard accessibility: Space = play/pause, M = mute, F = fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === videoRef.current) {
        if (e.code === 'Space') {
          e.preventDefault();
          togglePlay();
        } else if (e.code === 'KeyM') {
          toggleMute();
        } else if (e.code === 'KeyF') {
          toggleFullscreen();
        }
      }
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]); // Added dependencies to ensure fresh state in closure if needed, though toggle functions likely handle it

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progressValue = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressValue);
    }
  };

  return (
    <div 
      role="region"
      aria-label="Institutional Video Player"
      className="relative group rounded-xl overflow-hidden bg-black/40 border border-white/10"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Live Badge */}
      {isLive && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {' '}LIVE
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video object-cover cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        aria-label={title}
        controls={false} // Custom controls for institutional styling
        playsInline
        tabIndex={0}
      >
        <track kind="captions" />
      </video>

      {/* Custom Controls Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none"
      >
        <div className="pointer-events-auto">
          {/* Progress Bar */}
          <div className="group/progress mb-4 h-1 hover:h-1.5 bg-white/20 rounded-full overflow-hidden transition-all cursor-pointer relative"
               role="slider"
               aria-label="Video progress"
               aria-valuenow={Math.round(progress)}
               aria-valuemin={0}
               aria-valuemax={100}
               tabIndex={0}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowRight' && videoRef.current) {
                   videoRef.current.currentTime += 5;
                 } else if (e.key === 'ArrowLeft' && videoRef.current) {
                   videoRef.current.currentTime -= 5;
                 }
               }}
               onClick={(e) => {
                 if (videoRef.current) {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   const clickedPercent = x / rect.width;
                   videoRef.current.currentTime = clickedPercent * videoRef.current.duration;
                 }
               }}
          >
            <div 
              className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            
            {/* Event Markers: Institutional Delta Points */}
            {!isLive && markers.map((marker) => {
              const markerPosition = (marker.time / (videoRef.current?.duration || 1)) * 100;
              return (
                <div 
                  key={marker.time}
                  className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 group-hover:bg-white transition-colors"
                  style={{ left: `${markerPosition}%` }}
                  title={marker.label}
                >
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/progress:opacity-100 whitespace-nowrap">
                     {marker.label}
                   </div>
                </div>
              );
            })}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>

            <span className="text-sm text-white/80 font-medium truncate flex-1 uppercase tracking-widest">{title}</span>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Fullscreen"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
