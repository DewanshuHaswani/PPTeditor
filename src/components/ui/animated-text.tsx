"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  text: string;
  fontSize?: number;
  minWeight?: number;
  maxWeight?: number;
  animationDuration?: number;
  delayMultiplier?: number;
  className?: string;
  textClassName?: string;
  shimmer?: boolean;
}

export function AnimatedText({
  text,
  fontSize = 150,
  minWeight = 0,
  maxWeight = 840,
  animationDuration = 1.5,
  delayMultiplier = 0.25,
  className,
  textClassName,
  shimmer = true
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const spans = containerRef.current.querySelectorAll("span");
    const numLetters = spans.length;

    spans.forEach((span, i) => {
      const mappedIndex = i - numLetters / 2;
      span.style.animationDelay = `${mappedIndex * delayMultiplier}s`;
    });
  }, [text, delayMultiplier]);

  const characters = text.split("").map((char, index) => (
    <span
      key={`${char}-${index}`}
      aria-hidden="true"
      className="inline-block whitespace-pre"
      style={{
        animation: `ahm-title-entrance ${animationDuration}s cubic-bezier(0.22, 1, 0.36, 1) 1`,
        animationFillMode: "both",
        fontVariationSettings: `"wght" ${minWeight}`,
        fontWeight: minWeight || 100
      }}
    >
      {char}
    </span>
  ));

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <p
        ref={containerRef}
        aria-label={text}
        className={cn("m-0 max-w-full text-balance font-sans font-black leading-[0.94]", textClassName)}
        style={
          {
            "--ahm-title-min-weight": minWeight,
            "--ahm-title-max-weight": maxWeight,
            fontSize: `${fontSize}px`,
            fontFeatureSettings: '"wght"',
            overflowWrap: "anywhere"
          } as CSSProperties
        }
      >
        {characters}
      </p>
      {shimmer ? <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-1/3 -translate-x-[220%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-sm animate-title-shimmer" /> : null}
      <style>{`
        @keyframes ahm-title-entrance {
          0% {
            font-variation-settings: "wght" var(--ahm-title-min-weight);
            font-weight: var(--ahm-title-min-weight);
            opacity: 0.68;
            transform: translateY(0.04em);
          }
          100% {
            font-variation-settings: "wght" var(--ahm-title-max-weight);
            font-weight: var(--ahm-title-max-weight);
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ahm-title-shimmer {
          0%, 72% {
            transform: translateX(-220%) skewX(-18deg);
            opacity: 0;
          }
          78% {
            opacity: 0.55;
          }
          88%, 100% {
            transform: translateX(420%) skewX(-18deg);
            opacity: 0;
          }
        }

        .animate-title-shimmer {
          animation: ahm-title-shimmer 7.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
