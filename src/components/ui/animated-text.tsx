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
}

export function AnimatedText({
  text,
  fontSize = 150,
  minWeight = 0,
  maxWeight = 840,
  animationDuration = 1.5,
  delayMultiplier = 0.25,
  className,
  textClassName
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
        animation: `ahm-title-breath ${animationDuration}s alternate cubic-bezier(0.37, 0, 0.63, 1) infinite`,
        animationFillMode: "both",
        fontVariationSettings: `"wght" ${minWeight}`,
        fontWeight: minWeight || 100
      }}
    >
      {char}
    </span>
  ));

  return (
    <div className={cn("flex items-center justify-center", className)}>
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
      <style>{`
        @keyframes ahm-title-breath {
          0% {
            font-variation-settings: "wght" var(--ahm-title-min-weight);
            font-weight: var(--ahm-title-min-weight);
          }
          100% {
            font-variation-settings: "wght" var(--ahm-title-max-weight);
            font-weight: var(--ahm-title-max-weight);
          }
        }
      `}</style>
    </div>
  );
}
