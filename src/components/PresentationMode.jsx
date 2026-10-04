import { isPortable, viewUrl } from "../utils/navigation";
import { SessionClock } from "./SessionClock";
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
  const [notesOpen, setNotesOpen] = useState(false);
  const [blank, setBlank] = useState(false);
  const [fullscreenError, setFullscreenError] = useState("");
  const [movieModeOpen, setMovieModeOpen] = useState(false);
  const current = slides[Math.min(index, slides.length - 1)] || slides[0];
  const groups = useMemo(() => data.slides.filter((slide) => slide.type === "group"), [data]);
  const movieGroupTargets = useMemo(() => Object.fromEntries(groups.map((group) => {
    const targetIndex = slides.findIndex((slide) => slide.originalSlideId === group.id);
    return [group.id, targetIndex >= 0 ? targetIndex + 1 : null];
  })), [groups, slides]);

  const next = () => setIndex((value) => Math.max(0, Math.min(value + 1, slides.length - 1)));
  const previous = () => setIndex((value) => Math.max(value - 1, 0));
  const jumpToGroup = (groupId) => {
    const targetIndex = slides.findIndex((slide) => slide.originalSlideId === groupId || slide.id === groupId || slide.id.startsWith(`${groupId}__`));
    if (targetIndex >= 0) {
      setIndex(targetIndex);
      setMovieModeOpen(false);
    }
  };

  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen?.();
    } catch { setFullscreenError("Fullscreen is unavailable in this browser. Use the browser's fullscreen control."); }
  };
  useEffect(() => { setIndex((value) => Math.max(0, Math.min(value, slides.length - 1))); }, [slides.length]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setBlank(false); setNotesOpen(false); return; }
      if (event.target.closest?.("input, textarea, select, [contenteditable], [role=dialog]") || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === " " && event.target.closest?.("button, a")) return;
      if (movieModeOpen || notesOpen || document.querySelector('[role="dialog"]')) return;
      if (["ArrowRight", " ", "PageDown"].includes(event.key)) { event.preventDefault(); next(); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); previous(); }
      if (event.key === "Home") { event.preventDefault(); setIndex(0); }
      if (event.key === "End") { event.preventDefault(); setIndex(Math.max(0, slides.length - 1)); }
      if (event.key.toLowerCase() === "f") fullscreen();
      if (event.key.toLowerCase() === "n") setNotesOpen(true);
      if (event.key.toLowerCase() === "b") setBlank((value) => !value);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, movieModeOpen, notesOpen]);

  const progress = slides.length ? ((Math.min(index, slides.length - 1) + 1) / slides.length) * 100 : 0;

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <AnimatePresence mode="sync">
        {current ? <SlideCanvas slide={current} data={data} /> : <div className="p-12">No visible slides. Open the editor and enable a section.</div>}
      </AnimatePresence>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 rounded-3xl border border-white/12 bg-slate-950/38 px-4 py-3 shadow-glass backdrop-blur-2xl pointer-events-auto">
          <GlassButton disabled={index <= 0} onClick={previous} className="h-11 w-11 px-0" aria-label="Previous slide">
            <ChevronLeft className="h-5 w-5" />
          </GlassButton>
          <div className="h-2 min-w-16 flex-1 overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="min-w-20 text-center text-sm font-bold text-white/70">
            {slides.length ? index + 1 : 0} / {slides.length}
          </div>
          <GlassButton disabled={index >= slides.length - 1} onClick={next} className="h-11 w-11 px-0" aria-label="Next slide">
            <ChevronRight className="h-5 w-5" />
          </GlassButton>
          {!isPortable() && <a href="/edit" className="inline-flex">
            <GlassButton>
              <Edit3 className="h-4 w-4" /> Edit
            </GlassButton>
          </a>}
          <a href={viewUrl("story")} className="hidden md:inline-flex">
            <GlassButton>
              <ScrollText className="h-4 w-4" /> Story
            </GlassButton>
          </a>
          <GlassButton onClick={() => setMovieModeOpen(true)}>
            <Film className="h-4 w-4" /> Movie
          </GlassButton>
          <select disabled={!slides.length} aria-label="Jump to slide" value={Math.min(index, Math.max(0, slides.length - 1))} onChange={(event) => setIndex(Number(event.target.value))} className="max-w-44 rounded-xl bg-slate-900 px-2 py-2 text-sm text-white">
            {slides.map((slide, slideIndex) => <option key={slide.id} value={slideIndex}>{slideIndex + 1}. {slide.title || slide.groupName}</option>)}
          </select>
          <GlassButton onClick={() => setNotesOpen(true)}>Notes</GlassButton>
          <SessionClock />
          <GlassButton onClick={fullscreen} aria-label="Fullscreen">
            <Maximize2 className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
      {fullscreenError && <div role="status" className="fixed left-5 top-5 z-50 rounded-xl bg-slate-900 p-3 text-sm" onClick={() => setFullscreenError("")}>{fullscreenError}</div>}
      {blank && <button className="fixed inset-0 z-[80] bg-black" aria-label="Resume presentation" onClick={() => setBlank(false)} />}
      {notesOpen && <div role="dialog" aria-modal="true" aria-label="Speaker notes" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" onClick={() => setNotesOpen(false)}>
        <div className="max-h-[80vh] w-full max-w-xl overflow-auto rounded-3xl bg-slate-900 p-6" onClick={(event) => event.stopPropagation()}>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Speaker notes</h2><GlassButton autoFocus onClick={() => setNotesOpen(false)}>Close</GlassButton></div>
          <p className="whitespace-pre-wrap leading-relaxed">{current?.notes || "Add speaker notes for this slide in the editor."}</p>
          <p className="mt-5 text-sm text-white/60">Arrow keys / Space: navigate · Home / End: jump · F: fullscreen · B: blank screen · N: notes · Esc: close</p>
        </div>
      </div>}
      {movieModeOpen ? (
        <Suspense fallback={<div role="status" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black text-white"><span>Loading Movie mode…</span><GlassButton onClick={() => setMovieModeOpen(false)}>Cancel</GlassButton></div>}>
          <MovieModeOverlay groups={groups} onClose={() => setMovieModeOpen(false)} onSelectGroup={jumpToGroup} groupTargets={movieGroupTargets} />
        </Suspense>
      ) : null}
    </main>
  );
}
