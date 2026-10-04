import { RotateCcw, Pause, Play, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { GlassButton } from './GlassButton';

export function TimerSlide() {
  const [customMinutes, setCustomMinutes] = useState('3');
  const [duration, setDuration] = useState(180);
  const [seconds, setSeconds] = useState(180);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const progress = Math.min(1, seconds / duration);
  const circumference = 2 * Math.PI * 138;
  useEffect(() => {
    if (!running) return;
    const update = () => {
      const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (!remaining) setRunning(false);
    };
    update();
    const interval = setInterval(update, 200);
    document.addEventListener('visibilitychange', update);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', update); };
  }, [running]);
  const start = () => {
    if (!seconds || running) return;
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  };
  const pause = () => {
    setSeconds(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    setRunning(false);
  };
  const choose = (value) => { setRunning(false); setDuration(value); setSeconds(value); setCustomMinutes(String(value / 60)); };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <div className="flex flex-wrap justify-center gap-2" aria-label="Timer duration">
        {[60, 180, 300, 600].map((value) => <GlassButton key={value} aria-pressed={duration === value} onClick={() => choose(value)}>{value / 60} min</GlassButton>)}
        <label className="flex items-center gap-2 text-sm text-white">Custom minutes<input aria-label="Custom timer minutes" type="number" min="1" max="180" value={customMinutes} onChange={(event) => setCustomMinutes(event.target.value)} onBlur={() => { const value = Number(customMinutes); if (Number.isFinite(value) && value >= 1 && value <= 180) choose(Math.round(value * 60)); else setCustomMinutes(String(duration / 60)); }} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }} className="w-20 rounded-xl bg-white px-3 py-2 text-slate-950" /></label>
      </div>
      <div className={`relative flex h-[min(360px,70vw)] w-[min(360px,70vw)] items-center justify-center rounded-full border border-white/20 ${seconds === 0 ? 'bg-rose-500/30' : 'bg-white/12'} shadow-glow backdrop-blur-2xl`}>
        <svg viewBox="0 0 320 320" className="absolute inset-5 rotate-[-90deg]" aria-hidden="true">
          <circle cx="160" cy="160" r="138" stroke="rgba(255,255,255,0.16)" strokeWidth="14" fill="none" />
          <circle cx="160" cy="160" r="138" stroke="white" strokeWidth="14" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)} className="transition-all duration-200" />
        </svg>
        <div className="relative z-10 text-center">
          <div role="timer" aria-label="Time remaining" className="text-6xl font-black tabular-nums text-white">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div>
          <div role="status" className="mt-4 text-xl font-bold text-white/70">{seconds === 0 ? "Time's Up!" : running ? 'Round in progress' : `${duration / 60}-minute round`}</div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <GlassButton disabled={running || !seconds} onClick={start}><Play size={16} />{seconds < duration ? 'Resume' : 'Start'}</GlassButton>
        <GlassButton disabled={!running} onClick={pause}><Pause size={16} />Pause</GlassButton>
        <GlassButton onClick={() => { setRunning(false); setSeconds(duration); }}><RotateCcw size={16} />Reset</GlassButton>
        <GlassButton onClick={() => { deadline.current = Date.now() + duration * 1000; setSeconds(duration); setRunning(true); }}><RefreshCw size={16} />Restart</GlassButton>
        <GlassButton onClick={() => { if (running) deadline.current += 30000; setSeconds((value) => value + 30); }}>+30 sec</GlassButton>
      </div>
    </div>
  );
}
