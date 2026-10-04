import { viewUrl } from "../utils/navigation";
import { ArrowLeft, Keyboard } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { flattenSlides } from "../utils/layout";
import { GlassButton } from "./GlassButton";
import { SlideCanvas } from "./SlideCanvas";

function StorySlide({ slide, data, first }) {
  const element = useRef(null);
  const [visible, setVisible] = useState(first);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '200px 0px' });
    observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={element} className="absolute inset-0">{visible && <SlideCanvas slide={slide} data={data} />}</div>;
}

export function StoryPresentationMode({ data }) {
  const slides = useMemo(() => flattenSlides(data), [data]);

  return (
    <main className="relative bg-slate-950 text-white">
      <div className="fixed left-5 top-5 z-50 flex gap-3">
        <a href={viewUrl("present")}>
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
            <StorySlide slide={slide} data={data} first={index === 0} />
          </FlowSection>
        ))}
      </FlowArt>
      <a href={viewUrl("present")} className="fixed bottom-5 right-5 z-50">
        <GlassButton>
          <Keyboard className="h-4 w-4" /> Keyboard Mode
        </GlassButton>
      </a>
    </main>
  );
}
