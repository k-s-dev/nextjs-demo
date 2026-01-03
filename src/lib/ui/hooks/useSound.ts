import { useRef, useEffect, useState } from "react";

export const useWithSound = (audioSource: string) => {
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    soundRef.current = new Audio(audioSource);
    soundRef.current.loop = true;
  }, [audioSource]);

  const playSound = () => {
    if (soundRef.current && !isPlaying) {
      soundRef.current.play();
      setIsPlaying(() => !isPlaying)
    }
  };

  const pauseSound = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(() => !isPlaying)
    }
  };

  const stopSound = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
      setIsPlaying(() => !isPlaying)
    }
  };

  return {
    audioRef: soundRef.current,
    playSound,
    pauseSound,
    stopSound,
  };
};
