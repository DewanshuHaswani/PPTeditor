import {
  Award,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDot,
  Image as ImageIcon,
  Layers3,
  MessageCircle,
  Sparkles,
  Trophy,
  UsersRound
} from "lucide-react";
import { motion } from "framer-motion";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { resolveLayout } from "../utils/layout";

const riseTransition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] };

function Rise({ children, index = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, scale: 0.96, filter: "blur(14px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ ...riseTransition, delay: index * 0.06 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealCopy({ text, className = "", stagger = 0.01 }) {
  if (!text) return null;
  if (String(text).length > 220) {
    return (
      <motion.p initial={{ opacity: 0, y: 18, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={riseTransition} className={className}>
        {text}
      </motion.p>
    );
  }
  return <BlurredStagger text={String(text)} stagger={stagger} textClassName={className} />;
}

function Placeholder({ caption }) {
  return (
    <Rise>
      <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="flex min-h-44 flex-col items-center justify-center border border-dashed border-white/30 bg-white/10 p-6 text-center text-white/70">
        <ImageIcon className="mb-3 h-9 w-9" />
        <RevealCopy text={caption || "Image Placeholder"} className="text-sm font-semibold" />
      </LiquidGlassCard>
    </Rise>
  );
}

function ImageTile({ image, large = false }) {
  if (!image?.src) return <Placeholder caption={image?.caption} />;
  return (
    <motion.figure initial={{ opacity: 0, y: 30, scale: 0.97, filter: "blur(12px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={riseTransition} className={`overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-glass ${large ? "min-h-80" : "min-h-44"}`}>
      <img src={image.src} alt={image.caption || "Uploaded content"} className="h-full min-h-[inherit] w-full object-cover" />
      {image.caption ? (
        <figcaption className="border-t border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-white/78">
          <RevealCopy text={image.caption} className="text-sm text-white/78" />
        </figcaption>
      ) : null}
    </motion.figure>
  );
}

function textLines(text = "") {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function Bento({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/12 p-5 shadow-glass">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/16 text-cyan-100">
              {index % 3 === 0 ? <Sparkles /> : index % 3 === 1 ? <Layers3 /> : <CircleDot />}
            </div>
            <RevealCopy text={item} className="text-balance text-xl font-semibold leading-snug text-white" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function Steps({ section }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      {section.bullets?.map((step, index) => (
        <Rise key={step + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="relative overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 text-lg font-black">{index + 1}</span>
              {index % 4 === 0 ? <MessageCircle className="text-cyan-100" /> : index % 4 === 1 ? <UsersRound className="text-cyan-100" /> : index % 4 === 2 ? <Check className="text-cyan-100" /> : <ChevronRight className="text-cyan-100" />}
            </div>
            <RevealCopy text={step} className="text-xl font-semibold leading-snug text-white/92" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function TextCards({ section }) {
  const lines = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
      {section.text && !section.text.includes("ADD_") ? (
        <Rise className="lg:col-span-2">
          <div className="rounded-[32px] border border-white/16 bg-white/14 p-7 text-2xl leading-relaxed text-white/90 shadow-glass backdrop-blur-2xl">
            <RevealCopy text={section.text} className="text-2xl leading-relaxed text-white/90" />
          </div>
        </Rise>
      ) : null}
      {lines.map((line, index) => (
        <Rise key={line + index} index={index + 1}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/10 p-5 text-xl font-semibold leading-snug text-white/90 shadow-glass">
            <RevealCopy text={line} className="text-xl font-semibold leading-snug text-white/90" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function TextHeavy({ section }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <Rise>
        <div className="rounded-[32px] border border-white/16 bg-white/14 p-6 shadow-glass backdrop-blur-2xl">
          <RevealCopy text={section.text} className="whitespace-pre-wrap text-lg leading-relaxed text-white/90" />
        </div>
      </Rise>
      <div className="grid gap-3">
        {section.bullets?.map((bullet, index) => (
          <Rise key={bullet + index} index={index + 1}>
            <details open={index < 3} className="rounded-[22px] border border-white/14 bg-white/10 p-4 text-white shadow-glass backdrop-blur-xl">
            <summary className="cursor-pointer text-lg font-bold"><RevealCopy text={bullet} className="inline text-lg font-bold" /></summary>
            <p className="mt-3 text-sm leading-relaxed text-white/72">Editable detail area. Add exact source text in the edit portal.</p>
          </details>
          </Rise>
        ))}
      </div>
    </div>
  );
}

function Gallery({ section, variant = "grid" }) {
  const images = section.images?.length ? section.images : [{ id: "empty", caption: "Image Placeholder" }];
  const grid = variant === "masonry" ? "columns-1 gap-4 md:columns-2 xl:columns-3" : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4";
  return (
    <div className={`w-full ${grid}`}>
      {images.map((image, index) => (
        <Rise key={image.id || index} index={index} className={variant === "masonry" ? "mb-4 break-inside-avoid" : ""}>
          <ImageTile image={image} large={images.length === 1} />
        </Rise>
      ))}
    </div>
  );
}

function TwoColumn({ section }) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
      <Rise>
      <div className="rounded-[32px] border border-white/16 bg-white/14 p-7 shadow-glass backdrop-blur-2xl">
        <RevealCopy text={section.text} className="whitespace-pre-wrap text-xl leading-relaxed text-white/90" />
        <div className="mt-5 grid gap-3">
          {section.bullets?.map((bullet, index) => (
            <Rise key={bullet} index={index + 1}>
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 text-white/88">
              <Check className="mt-1 h-5 w-5 shrink-0 text-cyan-100" />
              <RevealCopy text={bullet} className="text-white/88" />
            </div>
            </Rise>
          ))}
        </div>
      </div>
      </Rise>
      <Gallery section={section} />
    </div>
  );
}

function Roadmap({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="w-full rounded-[36px] border border-white/16 bg-white/12 p-8 shadow-glass backdrop-blur-2xl">
      <div className="grid gap-5 lg:grid-cols-5">
        {items.map((item, index) => (
        <Rise key={item + index} index={index} className="relative">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 text-xl font-black">{index + 1}</div>
            <RevealCopy text={item} className="text-lg font-bold leading-snug text-white" />
            {index < items.length - 1 ? <div className="absolute left-16 top-7 hidden h-px w-[calc(100%-3rem)] bg-white/28 lg:block" /> : null}
          </Rise>
        ))}
      </div>
    </div>
  );
}

function Metrics({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/12 p-6 shadow-glass">
            <div className="mb-8 text-5xl font-black text-white">{String(index + 1).padStart(2, "0")}</div>
            <RevealCopy text={item} className="text-xl font-bold leading-tight text-white/92" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function Recognition({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="34px" glowIntensity="md" shadowIntensity="sm" className="border border-white/18 bg-white/14 p-7 text-center shadow-glow">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950">
              {index === 0 ? <Trophy /> : <Award />}
            </div>
            <RevealCopy text={item} className="text-2xl font-black leading-tight text-white" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function Process({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="flex gap-4 border border-white/16 bg-white/12 p-5 shadow-glass">
            <CalendarClock className="h-8 w-8 shrink-0 text-cyan-100" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">Update {index + 1}</div>
              <RevealCopy text={item} className="mt-2 text-xl font-bold leading-snug text-white" />
            </div>
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function BlockObject({ block, index }) {
  const spanClass = block.size === "hero" ? "lg:col-span-3 min-h-80" : block.size === "wide" ? "lg:col-span-2" : "";

  if (block.type === "image") {
    return (
      <Rise index={index} className={spanClass}>
        <ImageTile image={block.image || { caption: block.caption || block.title }} large={block.size === "hero"} />
      </Rise>
    );
  }

  if (block.type === "metric") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/12 p-6 shadow-glass">
          <div className="mb-7 text-6xl font-black text-white">{block.metricValue || String(index + 1).padStart(2, "0")}</div>
          <RevealCopy text={block.title} className="text-2xl font-black leading-tight text-white" />
          {block.text ? <RevealCopy text={block.text} className="mt-3 text-lg leading-relaxed text-white/75" /> : null}
        </LiquidGlassCard>
      </Rise>
    );
  }

  if (block.type === "quote") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="34px" glowIntensity="md" shadowIntensity="sm" className="border border-white/18 bg-white/14 p-7 text-center shadow-glow">
          <Trophy className="mx-auto mb-5 h-10 w-10 text-cyan-100" />
          <RevealCopy text={block.text || block.title} className="text-balance text-3xl font-black leading-tight text-white" />
          {block.caption ? <RevealCopy text={block.caption} className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-white/55" /> : null}
        </LiquidGlassCard>
      </Rise>
    );
  }

  if (block.type === "bullets") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/12 p-6 shadow-glass">
          <RevealCopy text={block.title} className="mb-5 text-2xl font-black text-white" />
          <div className="grid gap-3">
            {(block.bullets || []).map((bullet, bulletIndex) => (
              <Rise key={bullet + bulletIndex} index={bulletIndex}>
                <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 text-white/88">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-cyan-100" />
                  <RevealCopy text={bullet} className="text-white/88" />
                </div>
              </Rise>
            ))}
          </div>
        </LiquidGlassCard>
      </Rise>
    );
  }

  if (block.type === "placeholder") {
    return <Placeholder caption={block.title || "Object Placeholder"} />;
  }

  return (
    <Rise index={index} className={spanClass}>
      <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="border border-white/16 bg-white/12 p-6 shadow-glass">
        {block.title ? <RevealCopy text={block.title} className="mb-4 text-2xl font-black text-white" /> : null}
        <RevealCopy text={block.text} className="whitespace-pre-wrap text-xl leading-relaxed text-white/86" />
      </LiquidGlassCard>
    </Rise>
  );
}

function ObjectLayout({ section }) {
  const blocks = (section.blocks || []).filter((block) => block.visible !== false);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, index) => (
        <BlockObject key={block.id || `${block.type}-${index}`} block={block} index={index} />
      ))}
    </div>
  );
}

export function SectionRenderer({ section }) {
  if (section.blocks?.some((block) => block.visible !== false)) return <ObjectLayout section={section} />;
  const layout = resolveLayout(section);
  if (layout === "steps") return <Steps section={section} />;
  if (layout === "bento") return <Bento section={section} />;
  if (layout === "text-heavy") return <TextHeavy section={section} />;
  if (layout === "hero-image") return <Gallery section={section} />;
  if (layout === "two-column" || layout === "diagram-gallery" || layout === "timeline-gallery") return <TwoColumn section={section} />;
  if (layout === "image-grid" || layout === "carousel") return <Gallery section={section} />;
  if (layout === "masonry") return <Gallery section={section} variant="masonry" />;
  if (layout === "roadmap") return <Roadmap section={section} />;
  if (layout === "metrics") return <Metrics section={section} />;
  if (layout === "recognition") return <Recognition section={section} />;
  if (layout === "process") return <Process section={section} />;
  if (layout === "placeholder") return <TextCards section={section} />;
  return <TextCards section={section} />;
}
