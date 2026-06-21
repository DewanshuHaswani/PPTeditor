import { motion } from "framer-motion";
import { Coffee, ExternalLink, PartyPopper, PencilRuler, Sparkles, Trophy } from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-text";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { Background } from "./Background";
import { GlassButton } from "./GlassButton";
import { SectionRenderer } from "./SectionRenderer";
import { TimerSlide } from "./TimerSlide";

const slideVariants = {
  initial: { opacity: 0, y: 26, scale: 0.985, filter: "blur(10px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -22, scale: 1.015, filter: "blur(10px)" }
};

const groupNames = ["Advance Research Group", "Open Innovation", "Standards Research Group", "IP Group", "People Group"];

function TitleBreath({ text, size = 76, className = "", minWeight = 220, maxWeight = 900 }) {
  if (!text) return null;
  return (
    <AnimatedText
      text={text}
      fontSize={size}
      minWeight={minWeight}
      maxWeight={maxWeight}
      animationDuration={1.8}
      delayMultiplier={0.045}
      className={`justify-start text-left ${className}`}
      textClassName="w-full text-white drop-shadow-[0_18px_42px_rgba(15,23,42,0.38)]"
    />
  );
}

function StaggerText({ text, className = "", textClassName = "", stagger = 0.012 }) {
  if (!text) return null;
  return <BlurredStagger text={text} stagger={stagger} className={className} textClassName={textClassName} />;
}

function HeroTitle({ slide }) {
  const isIntro = slide.type === "intro";
  return (
    <LiquidGlassCard draggable={false} borderRadius="40px" glowIntensity="md" shadowIntensity="sm" className="relative mx-auto flex min-h-[62vh] w-full max-w-5xl flex-col items-center justify-center overflow-hidden border border-white/18 bg-white/14 px-10 py-12 text-center shadow-glow">
      <div className="absolute inset-y-0 left-[-30%] w-1/2 bg-gradient-to-r from-transparent via-white/24 to-transparent blur-md animate-sweep" />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950">
        <Sparkles />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8 }} className="w-full">
        <TitleBreath text={slide.title} size={isIntro ? 94 : 82} className="justify-center text-center" minWeight={260} />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.7 }} className="mt-7">
        <StaggerText text={slide.subtitle} textClassName="text-2xl font-semibold text-white/78 md:text-4xl" />
      </motion.div>
      {isIntro ? (
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }} className="mt-9 h-36 w-full max-w-5xl">
          <div className="mb-6 text-xs font-black uppercase tracking-[0.26em] text-cyan-100/70">Presenting Groups</div>
          <GooeyText
            texts={groupNames}
            morphTime={1}
            cooldownTime={0.45}
            className="h-24 font-black"
            textClassName="w-full whitespace-nowrap text-[clamp(1.8rem,4.2vw,4.25rem)] leading-none text-white"
          />
        </motion.div>
      ) : null}
      {slide.date ? (
        <div className="mt-8 rounded-full border border-white/16 bg-white/12 px-5 py-2 text-lg font-bold text-white/72">
          <StaggerText text={slide.date} textClassName="text-lg font-bold text-white/72" stagger={0.025} />
        </div>
      ) : null}
    </LiquidGlassCard>
  );
}

function QuoteSlide({ slide }) {
  return (
    <LiquidGlassCard draggable={false} borderRadius="42px" glowIntensity="md" shadowIntensity="sm" className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center border border-white/18 bg-white/14 p-12 text-center shadow-glow">
      <StaggerText text={slide.body} textClassName="text-balance text-4xl font-black leading-tight text-white md:text-6xl" stagger={0.006} />
    </LiquidGlassCard>
  );
}

function QuizSlide({ slide, data }) {
  const link = slide.link || data.kahootLink;
  return (
    <div className="grid min-h-[62vh] w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_0.78fr]">
      <LiquidGlassCard draggable={false} borderRadius="40px" glowIntensity="md" shadowIntensity="sm" className="border border-white/18 bg-white/14 p-10 shadow-glow">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-950">
          <PencilRuler />
        </div>
        <TitleBreath text={slide.title} size={72} />
        <StaggerText text={slide.subtitle} className="mt-3" textClassName="text-2xl font-semibold text-white/70" />
        <StaggerText text={slide.question} className="mt-10" textClassName="text-balance text-4xl font-black leading-tight text-white" stagger={0.008} />
        <a href={link} target="_blank" rel="noreferrer" className="mt-10 inline-flex">
          <GlassButton className="px-7 py-4 text-lg">
            {slide.buttonText || "Start Quiz"} <ExternalLink className="h-5 w-5" />
          </GlassButton>
        </a>
      </LiquidGlassCard>
      <LiquidGlassCard draggable={false} borderRadius="40px" glowIntensity="sm" shadowIntensity="xs" className="border border-white/14 bg-white/10 p-8 shadow-glass">
        <div className="aspect-square rounded-[36px] border border-white/14 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.55),rgba(255,255,255,0.08)_36%,transparent_64%)] p-8">
          <div className="flex h-full items-center justify-center rounded-full border border-white/22 bg-white/12 text-center text-8xl font-black text-white shadow-glow">AX</div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}

function BreakSlide({ slide }) {
  return (
    <LiquidGlassCard draggable={false} borderRadius="42px" glowIntensity="md" shadowIntensity="sm" className="mx-auto flex min-h-[58vh] w-full max-w-5xl flex-col items-center justify-center border border-white/18 bg-white/14 p-12 text-center shadow-glow">
      <Coffee className="mb-8 h-20 w-20 text-amber-100" />
      <TitleBreath text={slide.title} size={80} className="justify-center text-center" minWeight={260} />
      <StaggerText text={slide.subtitle} className="mt-4" textClassName="text-3xl font-bold text-white/72" />
    </LiquidGlassCard>
  );
}

function ThanksSlide({ slide }) {
  return (
    <div className="mx-auto flex min-h-[64vh] w-full max-w-5xl flex-col items-center justify-center text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/18 bg-white/14 text-white shadow-glow backdrop-blur-2xl">
        <PartyPopper className="h-10 w-10" />
      </div>
      <TitleBreath text={slide.title} size={96} className="justify-center text-center" minWeight={260} />
      <StaggerText text={slide.subtitle} className="mt-7" textClassName="text-3xl font-bold text-white/76" />
      <StaggerText text={slide.body} className="mt-4" textClassName="text-xl font-semibold text-white/55" />
    </div>
  );
}

function GroupOrActivity({ slide }) {
  const sections = slide.activeSections || [slide.activeSection || slide.sections?.[0]].filter(Boolean);
  const section = sections[0];
  return (
    <div className="w-full">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-bold uppercase tracking-[0.24em] text-white/66">
            <StaggerText text={slide.subtitle || slide.groupName || slide.type} textClassName="text-sm font-bold uppercase tracking-[0.24em] text-white/66" />
          </div>
          <TitleBreath text={slide.title} size={64} />
        </div>
        {slide.totalSections ? (
          <div className="rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-bold text-white/70">
            {slide.sectionIndex + 1} / {slide.totalSections}
          </div>
        ) : null}
      </div>
      <div className={sections.length > 1 ? "grid gap-5 xl:grid-cols-2" : ""}>
        {sections.map((item) => (
          <div key={item.id}>
            {sections.length > 1 ? <h2 className="mb-3 text-2xl font-black text-white">{item.title}</h2> : null}
            <SectionRenderer section={item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SlideCanvas({ slide, data, preview = false }) {
  const theme = slide.theme || "indigo";
  return (
    <div className={`relative min-h-screen overflow-hidden ${preview ? "rounded-[28px]" : ""}`}>
      <Background theme={theme} heroImage={slide.heroImage} />
      <motion.div
        key={slide.id}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 flex min-h-screen items-center justify-center px-7 py-20 ${preview ? "scale-[0.72] origin-center" : ""}`}
      >
        <div className="w-full max-w-[1400px]">
          {slide.type === "intro" || slide.type === "title" ? <HeroTitle slide={slide} /> : null}
          {slide.type === "quote" ? <QuoteSlide slide={slide} /> : null}
          {slide.type === "quiz" ? <QuizSlide slide={slide} data={data} /> : null}
          {slide.type === "break" ? <BreakSlide slide={slide} /> : null}
          {slide.type === "timer" ? <TimerSlide /> : null}
          {slide.type === "thanks" ? <ThanksSlide slide={slide} /> : null}
          {["activity", "group", "content"].includes(slide.type) ? <GroupOrActivity slide={slide} /> : null}
          {slide.type === "leadership" ? (
            <LiquidGlassCard draggable={false} borderRadius="42px" glowIntensity="md" shadowIntensity="sm" className="mx-auto border border-white/18 bg-white/14 p-12 text-center shadow-glow">
              <Trophy className="mx-auto mb-8 h-16 w-16 text-white" />
              <TitleBreath text={slide.title} size={80} className="justify-center text-center" minWeight={260} />
              <StaggerText text={slide.subtitle} className="mt-4" textClassName="text-3xl text-white/70" />
            </LiquidGlassCard>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
