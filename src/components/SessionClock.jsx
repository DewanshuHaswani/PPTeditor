import { useEffect, useState } from 'react';
export function SessionClock() {
  const [started] = useState(Date.now);
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const elapsed = Math.floor((now - started) / 1000);
  return <div className="text-xs tabular-nums text-white/70">{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Elapsed {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</div>;
}
