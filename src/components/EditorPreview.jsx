import { memo, useEffect, useRef, useState } from 'react';
import { SlideCanvas } from './SlideCanvas';

export const EditorPreview = memo(function EditorPreview({ slide, kahootLink }) {
  const container = useRef(null);
  const [width, setWidth] = useState(640);
  const [snapshot, setSnapshot] = useState(slide);
  useEffect(() => {
    if (slide.id !== snapshot?.id) { setSnapshot(slide); return; }
    const timer = setTimeout(() => setSnapshot(slide), 250);
    return () => clearTimeout(timer);
  }, [slide, snapshot?.id]);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={container} className="editor-preview-stage relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-950">
      <div style={{ width: 1440, height: 900, transform: `scale(${width / 1440})`, transformOrigin: 'top left' }}>
        {snapshot && <SlideCanvas slide={snapshot} data={{ kahootLink }} preview />}
      </div>
    </div>
  );
});
