import { ArrowLeft, Keyboard } from "lucide-react";
import { useMemo } from "react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { flattenSlides } from "../utils/layout";
import { GlassButton } from "./GlassButton";
import { SlideCanvas } from "./SlideCanvas";

export function StoryPresentationMode({ data }) {
  const slides = useMemo(() => flattenSlides(data), [data]);

  return (
    <main className="relative bg-slate-950 text-white">
      <div className="fixed left-5 top-5 z-50 flex gap-3">
        <a href="/present">
          <GlassButton>
            <ArrowLeft className="h-4 w-4" /> Presentation
          </GlassButton>
        </a>
        <div className="hidden rounded-full border border-white/12 bg-slate-950/38 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-xl md:flex">
          Scroll to move through FlowArt slides
        </div>
      </div>
      <FlowArt aria-label="All Hands Meet Story Scroll">
        {slides.map((slide, index) => (
          <FlowSection key={slide.id} aria-label={slide.title || `Slide ${index + 1}`} style={{ backgroundColor: "#020617", color: "#fff" }}>
            <div className="absolute inset-0">
              <SlideCanvas slide={slide} data={data} />
            </div>
          </FlowSection>
        ))}
      </FlowArt>
      <a href="/present" className="fixed bottom-5 right-5 z-50">
        <GlassButton>
          <Keyboard className="h-4 w-4" /> Keyboard Mode
        </GlassButton>
      </a>
    </main>
  );
}
