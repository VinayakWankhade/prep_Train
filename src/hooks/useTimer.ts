import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  onComplete?: () => void;
  onTick?: (timeLeft: number) => void;
  interval?: number;
}

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setDuration: (duration: number) => void;
  progress: number;
}

function useTimer(
  initialDuration: number,
  options: UseTimerOptions = {}
): UseTimerReturn {
  const { onComplete, onTick, interval = 1000 } = options;
  
  const [duration, setDurationState] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
    setIsActive(true);
    if (startTimeRef.current) {
      const pausedDuration = Date.now() - (startTimeRef.current + pausedTimeRef.current);
      pausedTimeRef.current += pausedDuration;
    }
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(duration);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [duration]);

  const setDuration = useCallback((newDuration: number) => {
    setDurationState(newDuration);
    setTimeLeft(newDuration);
    reset();
  }, [reset]);

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current - pausedTimeRef.current) / 1000);
          const newTimeLeft = Math.max(0, duration - elapsed);
          
          setTimeLeft(newTimeLeft);
          onTick?.(newTimeLeft);
          
          if (newTimeLeft === 0) {
            setIsActive(false);
            setIsPaused(false);
            onComplete?.();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }
      }, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, duration, interval, onComplete, onTick]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0;

  return {
    timeLeft,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    reset,
    setDuration,
    progress
  };
}

export default useTimer;
