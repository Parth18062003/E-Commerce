// components/FullscreenVideo.tsx
"use client"
import React, { useRef, useState } from 'react';

const FullscreenVideo: React.FC<{ videoSrc: string }> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[30rem] md:h-[90vh]  overflow-hidden">
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted={isMuted}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-10 left-10 p-2 bg- rounded shadow"
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default FullscreenVideo;
