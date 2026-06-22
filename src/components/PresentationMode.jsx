import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Edit3, Film, Maximize2, ScrollText } from "lucide-react";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { flattenSlides } from "../utils/layout";
import { GlassButton } from "./GlassButton";
import { SlideCanvas } from "./SlideCanvas";

const MovieModeOverlay = lazy(() => import("./MovieModeOverlay").then((module) => ({ default: module.MovieModeOverlay })));

export function PresentationMode({ data }) {
  const slides = useMemo(() => flattenSlides(data), [data]);
  const [index, setIndex] = useState(0);
  const [movieModeOpen, setMovieModeOpen] = useState(false);
  const current = slides[Math.min(index, slides.length - 1)] || slides[0];
  const movieGroupTargets = useMemo(
    () =>
      Object.fromEntries(
        ["advance-research-group", "open-innovation", "standards-research-group", "ip-group", "people-group"].map((groupId) => {
          const targetIndex = slides.findIndex((slide) => slide.originalSlideId === groupId || slide.id === groupId || slide.id.startsWith(`${groupId}__`));
          return [groupId, targetIndex >= 0 ? targetIndex + 1 : null];
        })
      ),
    [slides]
  );

  const next = () => setIndex((value) => Math.min(value + 1, slides.length - 1));
  const previous = () => setIndex((value) => Math.max(value - 1, 0));
  const jumpToGroup = (groupId) => {
    const targetIndex = slides.findIndex((slide) => slide.originalSlideId === groupId || slide.id === groupId || slide.id.startsWith(`${groupId}__`));
    if (targetIndex >= 0) {
      setIndex(targetIndex);
      setMovieModeOpen(false);
    }
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight" || event.key === " ") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  const progress = ((index + 1) / Math.max(slides.length, 1)) * 100;

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <AnimatePresence mode="sync">
        <SlideCanvas slide={current} data={data} />
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-5">
        <div className="mx-auto flex max-w-7xl items-center gap-4 rounded-full border border-white/12 bg-slate-950/38 px-4 py-3 shadow-glass backdrop-blur-2xl pointer-events-auto">
          <GlassButton onClick={previous} className="h-11 w-11 px-0" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </GlassButton>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="min-w-20 text-center text-sm font-bold text-white/70">
            {index + 1} / {slides.length}
          </div>
          <GlassButton onClick={next} className="h-11 w-11 px-0" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </GlassButton>
          <a href="/edit" className="hidden md:inline-flex">
            <GlassButton>
              <Edit3 className="h-4 w-4" /> Edit
            </GlassButton>
          </a>
          <a href="/story" className="hidden md:inline-flex">
            <GlassButton>
              <ScrollText className="h-4 w-4" /> Story
            </GlassButton>
          </a>
          <GlassButton onClick={() => setMovieModeOpen(true)}>
            <Film className="h-4 w-4" /> Movie
          </GlassButton>
          <GlassButton onClick={() => document.documentElement.requestFullscreen?.()} aria-label="Fullscreen">
            <Maximize2 className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
      {movieModeOpen ? (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-black" />}>
          <MovieModeOverlay onClose={() => setMovieModeOpen(false)} onSelectGroup={jumpToGroup} groupTargets={movieGroupTargets} />
        </Suspense>
      ) : null}
    </main>
  );
}
