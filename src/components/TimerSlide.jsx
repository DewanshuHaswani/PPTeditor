import { RotateCcw, Pause, Play, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GlassButton } from "./GlassButton";

const INITIAL_SECONDS = 180;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export function TimerSlide() {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const [running, setRunning] = useState(false);
  const progress = seconds / INITIAL_SECONDS;
  const circumference = 2 * Math.PI * 138;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    if (!running) return undefined;
    const interval = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setRunning(false);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  const rotation = useMemo(() => (1 - progress) * 360, [progress]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-white/16 bg-white/12 shadow-glow backdrop-blur-2xl">
        <svg viewBox="0 0 320 320" className="absolute inset-5 rotate-[-90deg]">
          <circle cx="160" cy="160" r="138" stroke="rgba(255,255,255,0.16)" strokeWidth="14" fill="none" />
          <circle
            cx="160"
            cy="160"
            r="138"
            stroke="white"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div
          className="absolute left-1/2 top-1/2 h-[132px] w-1 origin-bottom rounded-full bg-cyan-100/90"
          style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
        />
        <div className="relative z-10 text-center">
          <div className="text-7xl font-black tabular-nums text-white">{formatTime(seconds)}</div>
          <div className="mt-4 text-xl font-bold text-white/70">{seconds === 0 ? "Time's Up!" : "3-minute round"}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <GlassButton onClick={() => setRunning(true)}>
          <Play className="h-4 w-4" /> Start
        </GlassButton>
        <GlassButton onClick={() => setRunning(false)}>
          <Pause className="h-4 w-4" /> Pause
        </GlassButton>
        <GlassButton
          onClick={() => {
            setRunning(false);
            setSeconds(INITIAL_SECONDS);
          }}
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </GlassButton>
        <GlassButton
          onClick={() => {
            setSeconds(INITIAL_SECONDS);
            setRunning(true);
          }}
        >
          <RefreshCw className="h-4 w-4" /> Restart
        </GlassButton>
      </div>
    </div>
  );
}
