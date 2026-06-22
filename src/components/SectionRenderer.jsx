import {
  Award,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  CircleDot,
  Clapperboard,
  FileQuestion,
  Layers3,
  Mic2,
  MessageCircle,
  Pencil,
  Sparkles,
  Trophy,
  UsersRound
} from "lucide-react";
import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { resolveLayout } from "../utils/layout";

const FeatureShaderCards = lazy(() => import("@/components/ui/feature-shader-cards"));

const riseTransition = { duration: 0.36, ease: [0.22, 1, 0.36, 1] };

const textSizeClasses = {
  sm: "text-sm leading-relaxed xl:text-base",
  md: "text-base leading-relaxed xl:text-lg",
  lg: "text-lg leading-snug xl:text-xl",
  xl: "text-xl leading-snug xl:text-2xl"
};

const displayTextSizeClasses = {
  sm: "text-xl leading-tight xl:text-2xl",
  md: "text-2xl leading-tight xl:text-3xl",
  lg: "text-3xl leading-tight xl:text-4xl",
  xl: "text-4xl leading-tight xl:text-5xl"
};

function textScale(size = "md", fallback = "text-base leading-relaxed xl:text-lg") {
  return textSizeClasses[size] || fallback;
}

function displayTextScale(size = "md", fallback = "text-2xl leading-tight xl:text-3xl") {
  return displayTextSizeClasses[size] || fallback;
}

function imageStyle(image = {}) {
  return {
    objectFit: image.fit || "cover",
    objectPosition: image.position || "center"
  };
}

function imageHeightClass(image = {}, large = false) {
  if (large || image.size === "hero") return "min-h-80";
  if (image.size === "wide") return "min-h-64";
  if (image.size === "small") return "min-h-32";
  return "min-h-44";
}

function Rise({ children, index = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ ...riseTransition, delay: index * 0.035 }}
      className={`min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

function RevealCopy({ text, className = "", stagger = 0.01 }) {
  if (!text) return null;
  const safeClassName = `min-w-0 max-w-full break-words [overflow-wrap:anywhere] ${className}`;
  if (String(text).length > 90) {
    return (
      <motion.p initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={riseTransition} className={safeClassName}>
        {text}
      </motion.p>
    );
  }
  return <BlurredStagger text={String(text)} stagger={stagger} textClassName={safeClassName} />;
}

function FastCopy({ text, className = "" }) {
  if (!text) return null;
  return (
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={riseTransition} className={`min-w-0 max-w-full break-words [overflow-wrap:anywhere] ${className}`}>
      {text}
    </motion.p>
  );
}

function Placeholder({ caption }) {
  return (
    <Rise>
      <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="flex min-h-44 min-w-0 flex-col items-center justify-center overflow-hidden border border-dashed border-white/30 bg-white/10 p-6 text-center text-white/70">
        <RevealCopy text={caption || "Image Placeholder"} className="text-sm font-semibold" />
      </LiquidGlassCard>
    </Rise>
  );
}

function ImageCaption({ image, fast = false }) {
  const title = image?.title || image?.caption;
  const subtitle = image?.subtitle;
  if (!title && !subtitle) return null;
  const Copy = fast ? FastCopy : RevealCopy;
  return (
    <figcaption className="border-t border-white/10 bg-slate-950/35 px-4 py-3 text-white/78">
      {title ? <Copy text={title} className="text-sm font-black leading-tight text-white/88" /> : null}
      {subtitle ? <Copy text={subtitle} className="mt-1 text-xs font-semibold leading-snug text-white/55" /> : null}
    </figcaption>
  );
}

function ImageTile({ image, large = false }) {
  if (!image?.src) return <Placeholder caption={image?.caption} />;
  return (
    <motion.figure initial={{ opacity: 0, y: 22, scale: 0.98, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} transition={riseTransition} className={`min-w-0 overflow-hidden rounded-[28px] border border-white/15 bg-white/10 shadow-glass ${imageHeightClass(image, large)}`}>
      <img src={image.src} alt={image.caption || "Uploaded content"} className="h-full min-h-[inherit] w-full" style={imageStyle(image)} loading="lazy" />
      <ImageCaption image={image} />
    </motion.figure>
  );
}

function BusinessImageCard({ image, index, onExpand, expandable = true, compact = false, fill = false }) {
  return (
    <Rise index={index}>
      <motion.figure
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={riseTransition}
        onClick={() => expandable && onExpand?.({ type: "image", image, title: image?.title || image?.caption, subtitle: image?.subtitle, details: image?.details })}
        className={`min-w-0 overflow-hidden rounded-[24px] border border-white/14 bg-white/10 shadow-glass ${fill ? "flex h-full flex-col" : ""} ${expandable ? "cursor-pointer transition hover:border-white/28 hover:bg-white/14" : ""}`}
      >
        <div className={`flex ${fill ? "min-h-0 flex-1" : compact ? "aspect-[5/3]" : "aspect-[16/9]"} items-center justify-center bg-white/[0.07]`}>
          {image?.src ? (
            <img src={image.src} alt={image.title || image.caption || "Business update image"} className="h-full w-full" style={{ ...imageStyle(image), objectFit: "contain" }} loading="lazy" />
          ) : (
            <div className="h-full w-full border border-dashed border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))]" />
          )}
        </div>
        <ImageCaption image={image} fast />
      </motion.figure>
    </Rise>
  );
}

function BusinessDetailOverlay({ item, onClose }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-6 backdrop-blur-2xl" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={riseTransition}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[86vh] w-full max-w-6xl overflow-hidden rounded-[34px] border border-white/20 bg-[#07111f] shadow-glow"
      >
        <div className={item.type === "image" ? "grid max-h-[86vh] lg:grid-cols-[0.82fr_1.18fr]" : "max-h-[86vh]"}>
          <div className="min-w-0 p-7 lg:p-8">
            {item.kicker ? <div className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-cyan-100/70">{item.kicker}</div> : null}
            <h3 className="text-3xl font-black leading-tight text-white lg:text-4xl">{item.title || "Details"}</h3>
            {item.subtitle ? <p className="mt-3 text-lg font-semibold text-white/72">{item.subtitle}</p> : null}
            {item.details ? <p className="mt-6 max-h-[48vh] overflow-y-auto rounded-[24px] border border-white/10 bg-white/[0.08] p-5 whitespace-pre-wrap text-lg leading-relaxed text-white/90">{item.details}</p> : null}
          </div>
          {item.type === "image" ? (
            <div className="flex min-h-[340px] items-center justify-center border-t border-white/10 bg-black/35 p-5 lg:border-l lg:border-t-0">
              {item.image?.src ? (
                <img src={item.image.src} alt={item.title || "Expanded image"} className="h-auto max-h-[74vh] w-auto max-w-full rounded-[24px] object-contain" />
              ) : (
                <div className="flex h-full min-h-[320px] w-full items-center justify-center rounded-[24px] border border-dashed border-white/20 bg-white/[0.06] text-sm font-black uppercase tracking-[0.18em] text-white/48">
                  Image Placeholder
                </div>
              )}
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

function textLines(text = "") {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function BentoPanel({ children, className = "" }) {
  return (
    <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass ${className}`}>
      {children}
    </LiquidGlassCard>
  );
}

function MixedBentoCard({ item, index, tall = false, wide = false }) {
  if (item?.kind === "image") {
    return <ImageTile image={{ ...item.image, size: item.size || item.image?.size }} large={tall || wide} />;
  }

  if (item?.kind === "metric") {
    return (
      <BentoPanel>
        <div className="mb-5 text-5xl font-black text-white">{item.value || String(index + 1).padStart(2, "0")}</div>
        <RevealCopy text={item.title} className="text-xl font-black leading-tight text-white" />
        <RevealCopy text={item.text} className={`mt-3 text-white/76 ${textScale(item.textSize)}`} />
      </BentoPanel>
    );
  }

  return (
    <BentoPanel>
      <div className="mb-5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/16 text-cyan-100">
        {index % 3 === 0 ? <Sparkles /> : index % 3 === 1 ? <Layers3 /> : <CircleDot />}
      </div>
      <RevealCopy text={item?.title || `Item ${index + 1}`} className="text-xl font-black leading-tight text-white" />
      <RevealCopy text={item?.text} className={`mt-3 font-semibold text-white/80 ${textScale(item?.textSize)}`} />
    </BentoPanel>
  );
}

function MixedBento({ items }) {
  const normalized = [...items];
  while (normalized.length < 6) {
    normalized.push({
      kind: "text",
      title: "Editable Placeholder",
      text: "Add text or upload an image from the edit portal."
    });
  }

  return (
    <BentoGridShowcase
      className="max-h-[62vh]"
      integration={<MixedBentoCard item={normalized[0]} index={0} tall />}
      trackers={<MixedBentoCard item={normalized[1]} index={1} />}
      statistic={<MixedBentoCard item={normalized[2]} index={2} />}
      focus={<MixedBentoCard item={normalized[3]} index={3} />}
      productivity={<MixedBentoCard item={normalized[4]} index={4} />}
      shortcuts={<MixedBentoCard item={normalized[5]} index={5} wide />}
    />
  );
}

function sectionToMixedBentoItems(section) {
  const items = [];
  const images = (section.images || []).filter(Boolean);
  const lines = section.bullets?.length ? section.bullets : textLines(section.text);

  images.forEach((image) => {
    items.push({ kind: "image", image });
  });

  if (section.text && !section.text.includes("ADD_")) {
    items.push({ kind: "text", title: section.title || "Overview", text: section.text });
  }

  lines.forEach((line, index) => {
    items.push({ kind: "text", title: `Point ${String(index + 1).padStart(2, "0")}`, text: line });
  });

  return items;
}

function Bento({ section }) {
  if (section.images?.some(Boolean)) {
    const items = sectionToMixedBentoItems(section);
    if (items.some((item) => item.kind === "image")) return <MixedBento items={items} />;
  }

  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/16 text-cyan-100">
              {index % 3 === 0 ? <Sparkles /> : index % 3 === 1 ? <Layers3 /> : <CircleDot />}
            </div>
            <RevealCopy text={item} className="text-balance text-lg font-semibold leading-snug text-white xl:text-xl" />
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function BusinessUpdate({ section }) {
  const [expandedItem, setExpandedItem] = useState(null);
  const images = [...(section.images || [])];
  const bullets = section.bullets?.length ? section.bullets : textLines(section.text);
  const details = section.details || [];
  const canExpand = section.expandable !== false;
  const compactImages = images.length > 6;
  const fillImages = images.length > 0 && images.length <= 4;
  const imageGridClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : images.length === 3
          ? "grid-cols-3"
          : images.length === 4
            ? "grid-cols-2"
            : images.length > 8
              ? "grid-cols-3 xl:grid-cols-4"
              : "grid-cols-2 xl:grid-cols-3";
  const imageAreaClass = images.length > 6 ? "max-h-[68vh] overflow-y-auto" : "h-full min-h-[52vh] max-h-[68vh] overflow-hidden";

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-[0.72fr_1.28fr]">
        <Rise>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="flex h-full min-w-0 flex-col overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass">
            {section.text && !section.text.includes("ADD_") ? <FastCopy text={section.text} className="text-lg font-black leading-snug text-white/92 xl:text-xl" /> : null}
            <div className="mt-4 grid gap-3">
              {bullets.map((bullet, index) => (
                <button
                  type="button"
                  key={bullet + index}
                  onClick={() => canExpand && setExpandedItem({ type: "text", kicker: `Update ${String(index + 1).padStart(2, "0")}`, title: bullet, details: details[index] || bullet })}
                  className={`min-w-0 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-left ${canExpand ? "cursor-pointer transition hover:border-white/24 hover:bg-white/12" : ""}`}
                >
                  <div className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-cyan-100/55">{String(index + 1).padStart(2, "0")}</div>
                  <FastCopy text={bullet} className="text-sm font-semibold leading-snug text-white/82 xl:text-base" />
                </button>
              ))}
            </div>
          </LiquidGlassCard>
        </Rise>
        <div className={`grid min-w-0 ${imageAreaClass} ${imageGridClass} gap-3 pr-1`}>
          {images.length ? (
            images.map((image, index) => (
              <BusinessImageCard key={image.id || index} image={image} index={index} fill={fillImages} compact={compactImages} expandable={canExpand && image.expandable !== false} onExpand={setExpandedItem} />
            ))
          ) : (
            <div className="col-span-full flex min-h-[52vh] items-center justify-center rounded-[28px] border border-dashed border-white/18 bg-white/[0.06] p-8 text-center text-sm font-black uppercase tracking-[0.18em] text-white/48">
              No images selected
            </div>
          )}
        </div>
      </div>
      {expandedItem ? <BusinessDetailOverlay item={expandedItem} onClose={() => setExpandedItem(null)} /> : null}
    </>
  );
}

function Steps({ section }) {
  const iconClassName = "h-7 w-7";
  const icons = [
    <MessageCircle className={iconClassName} />,
    <UsersRound className={iconClassName} />,
    <Mic2 className={iconClassName} />,
    <FileQuestion className={iconClassName} />,
    <Clapperboard className={iconClassName} />,
    <Pencil className={iconClassName} />,
    <Clock3 className={iconClassName} />,
    <Sparkles className={iconClassName} />
  ];
  const features = (section.bullets || []).map((step, index) => ({
    title: `Step ${String(index + 1).padStart(2, "0")}`,
    description: step,
    icon: icons[index % icons.length]
  }));

  if (features.length) {
    return (
      <Suspense
        fallback={
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <LiquidGlassCard key={feature.title} draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="min-h-44 border border-white/16 bg-white/12 p-5 shadow-glass">
                <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-100/55">{feature.title}</div>
                <FastCopy text={feature.description} className="text-base font-semibold leading-snug text-white/86" />
              </LiquidGlassCard>
            ))}
          </div>
        }
      >
        <FeatureShaderCards features={features} />
      </Suspense>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      {section.bullets?.map((step, index) => (
        <Rise key={step + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="relative min-w-0 overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass">
            <div className="mb-6 flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 text-lg font-black">{index + 1}</span>
              {index % 4 === 0 ? <MessageCircle className="text-cyan-100" /> : index % 4 === 1 ? <UsersRound className="text-cyan-100" /> : index % 4 === 2 ? <Check className="text-cyan-100" /> : <ChevronRight className="text-cyan-100" />}
            </div>
            <RevealCopy text={step} className="text-lg font-semibold leading-snug text-white/92 xl:text-xl" />
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
          <div className="min-w-0 overflow-hidden rounded-[32px] border border-white/16 bg-white/14 p-7 text-2xl leading-relaxed text-white/90 shadow-glass backdrop-blur-2xl">
            <RevealCopy text={section.text} className="text-xl leading-relaxed text-white/90 xl:text-2xl" />
          </div>
        </Rise>
      ) : null}
      {lines.map((line, index) => (
        <Rise key={line + index} index={index + 1}>
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/10 p-5 text-xl font-semibold leading-snug text-white/90 shadow-glass">
            <RevealCopy text={line} className="text-lg font-semibold leading-snug text-white/90 xl:text-xl" />
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
        <div className="min-w-0 overflow-hidden rounded-[32px] border border-white/16 bg-white/14 p-6 shadow-glass backdrop-blur-2xl">
          <RevealCopy text={section.text} className="whitespace-pre-wrap text-lg leading-relaxed text-white/90" />
        </div>
      </Rise>
      <div className="grid gap-3">
        {section.bullets?.map((bullet, index) => (
          <Rise key={bullet + index} index={index + 1}>
            <details open={index < 3} className="min-w-0 overflow-hidden rounded-[22px] border border-white/14 bg-white/10 p-4 text-white shadow-glass backdrop-blur-xl">
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
  const items = sectionToMixedBentoItems(section);
  const hasImage = items.some((item) => item.kind === "image");
  const hasText = items.some((item) => item.kind !== "image");
  if (hasImage && hasText) {
    return <MixedBento items={items} />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
      <Rise>
      <div className="min-w-0 overflow-hidden rounded-[32px] border border-white/16 bg-white/14 p-7 shadow-glass backdrop-blur-2xl">
        <RevealCopy text={section.text} className="whitespace-pre-wrap text-xl leading-relaxed text-white/90" />
        <div className="mt-5 grid gap-3">
          {section.bullets?.map((bullet, index) => (
            <Rise key={bullet} index={index + 1}>
            <div className="flex min-w-0 items-start gap-3 overflow-hidden rounded-2xl bg-white/10 p-3 text-white/88">
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
    <div className="w-full min-w-0 overflow-hidden rounded-[36px] border border-white/16 bg-white/12 p-7 shadow-glass backdrop-blur-2xl">
      <div className="grid gap-4 lg:grid-cols-5">
        {items.map((item, index) => (
        <Rise key={item + index} index={index} className="relative">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-950 text-xl font-black">{index + 1}</div>
            <RevealCopy text={item} className="text-base font-bold leading-snug text-white xl:text-lg" />
            {index < items.length - 1 ? <div className="absolute left-16 top-7 hidden h-px w-[calc(100%-4rem)] bg-white/28 lg:block" /> : null}
          </Rise>
        ))}
      </div>
    </div>
  );
}

function Metrics({ section }) {
  const items = section.bullets?.length ? section.bullets : textLines(section.text);
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item, index) => (
        <Rise key={item + index} index={index}>
          <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/12 p-5 shadow-glass">
            <div className="mb-6 text-4xl font-black text-white xl:text-5xl">{String(index + 1).padStart(2, "0")}</div>
            <RevealCopy text={item} className="text-base font-bold leading-tight text-white/92 xl:text-lg" />
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
          <LiquidGlassCard draggable={false} borderRadius="34px" glowIntensity="md" shadowIntensity="sm" className="min-w-0 overflow-hidden border border-white/18 bg-white/14 p-7 text-center shadow-glow">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-slate-950">
              {index === 0 ? <Trophy /> : <Award />}
            </div>
            <RevealCopy text={item} className="text-xl font-black leading-tight text-white xl:text-2xl" />
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
          <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="xs" shadowIntensity="xs" className="flex min-w-0 gap-4 overflow-hidden border border-white/16 bg-white/12 p-4 shadow-glass">
            <CalendarClock className="h-8 w-8 shrink-0 text-cyan-100" />
            <div className="min-w-0">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">Update {index + 1}</div>
              <RevealCopy text={item} className="mt-2 text-base font-bold leading-snug text-white xl:text-lg" />
            </div>
          </LiquidGlassCard>
        </Rise>
      ))}
    </div>
  );
}

function BlockObject({ block, index }) {
  const spanClass = block.size === "hero" ? "lg:col-span-3 min-h-80" : block.size === "wide" ? "lg:col-span-2" : block.size === "small" ? "lg:col-span-1" : "";
  const copyClass = textScale(block.textSize);

  if (block.type === "image") {
    return (
      <Rise index={index} className={spanClass}>
        <ImageTile image={{ ...(block.image || { caption: block.caption || block.title }), size: block.size }} large={block.size === "hero"} />
      </Rise>
    );
  }

  if (block.type === "metric") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/12 p-6 shadow-glass">
          <div className="mb-7 text-6xl font-black text-white">{block.metricValue || String(index + 1).padStart(2, "0")}</div>
          <RevealCopy text={block.title} className="text-xl font-black leading-tight text-white xl:text-2xl" />
          {block.text ? <RevealCopy text={block.text} className={`mt-3 text-white/75 ${copyClass}`} /> : null}
        </LiquidGlassCard>
      </Rise>
    );
  }

  if (block.type === "quote") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="34px" glowIntensity="md" shadowIntensity="sm" className="min-w-0 overflow-hidden border border-white/18 bg-white/14 p-7 text-center shadow-glow">
          <Trophy className="mx-auto mb-5 h-10 w-10 text-cyan-100" />
          <RevealCopy text={block.text || block.title} className={`text-balance font-black text-white ${displayTextScale(block.textSize)}`} />
          {block.caption ? <RevealCopy text={block.caption} className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-white/55" /> : null}
        </LiquidGlassCard>
      </Rise>
    );
  }

  if (block.type === "bullets") {
    return (
      <Rise index={index} className={spanClass}>
        <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/12 p-6 shadow-glass">
          <RevealCopy text={block.title} className={`mb-5 font-black text-white ${displayTextScale(block.textSize, "text-2xl leading-tight")}`} />
          <div className="grid gap-3">
            {(block.bullets || []).map((bullet, bulletIndex) => (
              <Rise key={bullet + bulletIndex} index={bulletIndex}>
                <div className="flex min-w-0 items-start gap-3 overflow-hidden rounded-2xl bg-white/10 p-3 text-white/88">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-cyan-100" />
                  <RevealCopy text={bullet} className={`text-white/88 ${copyClass}`} />
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
      <LiquidGlassCard draggable={false} borderRadius="30px" glowIntensity="xs" shadowIntensity="xs" className="min-w-0 overflow-hidden border border-white/16 bg-white/12 p-6 shadow-glass">
        {block.title ? <RevealCopy text={block.title} className="mb-4 text-2xl font-black text-white" /> : null}
        <RevealCopy text={block.text} className={`whitespace-pre-wrap text-white/86 ${textScale(block.textSize, "text-xl leading-relaxed")}`} />
      </LiquidGlassCard>
    </Rise>
  );
}

function ObjectLayout({ section }) {
  const blocks = (section.blocks || []).filter((block) => block.visible !== false);
  const imageBlocks = blocks.filter((block) => block.type === "image");
  const contentBlocks = blocks.filter((block) => block.type !== "image");

  if (imageBlocks.length && contentBlocks.length && (section.layout === "auto" || section.layout === "bento" || section.layout === "two-column" || section.layout === "diagram-gallery" || section.layout === "timeline-gallery")) {
    const items = blocks.map((block, index) => {
      if (block.type === "image") {
        return {
          kind: "image",
          image: { ...(block.image || { caption: block.caption || block.title }), size: block.size },
          size: block.size
        };
      }
      if (block.type === "metric") {
        return {
          kind: "metric",
          value: block.metricValue || String(index + 1).padStart(2, "0"),
          title: block.title,
          text: block.text,
          textSize: block.textSize
        };
      }
      return {
        kind: "text",
        title: block.title || block.caption || `Object ${index + 1}`,
        text: block.text || (block.bullets || []).join("\n"),
        textSize: block.textSize
      };
    });
    return <MixedBento items={items} />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block, index) => (
        <BlockObject key={block.id || `${block.type}-${index}`} block={block} index={index} />
      ))}
    </div>
  );
}

export function SectionRenderer({ section }) {
  const layout = resolveLayout(section);
  if (layout === "business-update") return <BusinessUpdate section={section} />;
  if (section.blocks?.some((block) => block.visible !== false)) return <ObjectLayout section={section} />;
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
