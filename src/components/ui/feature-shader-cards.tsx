// @ts-nocheck
"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Warp } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureShaderCardsProps {
  features: Feature[];
  className?: string;
}

function getShaderConfig(index: number) {
  const configs = [
    {
      proportion: 0.32,
      softness: 0.9,
      distortion: 0.14,
      swirl: 0.48,
      swirlIterations: 8,
      shape: "checks" as const,
      shapeScale: 0.08,
      colors: ["hsl(225, 70%, 22%)", "hsl(196, 90%, 62%)", "hsl(252, 72%, 38%)", "hsl(210, 90%, 74%)"]
    },
    {
      proportion: 0.4,
      softness: 1.15,
      distortion: 0.18,
      swirl: 0.7,
      swirlIterations: 10,
      shape: "dots" as const,
      shapeScale: 0.1,
      colors: ["hsl(180, 78%, 21%)", "hsl(166, 85%, 58%)", "hsl(205, 74%, 34%)", "hsl(188, 90%, 72%)"]
    },
    {
      proportion: 0.34,
      softness: 1,
      distortion: 0.16,
      swirl: 0.58,
      swirlIterations: 9,
      shape: "checks" as const,
      shapeScale: 0.09,
      colors: ["hsl(262, 68%, 26%)", "hsl(286, 76%, 62%)", "hsl(225, 68%, 33%)", "hsl(260, 84%, 72%)"]
    },
    {
      proportion: 0.42,
      softness: 1.05,
      distortion: 0.17,
      swirl: 0.62,
      swirlIterations: 11,
      shape: "dots" as const,
      shapeScale: 0.08,
      colors: ["hsl(36, 78%, 25%)", "hsl(48, 86%, 62%)", "hsl(340, 56%, 35%)", "hsl(34, 90%, 74%)"]
    },
    {
      proportion: 0.38,
      softness: 0.95,
      distortion: 0.15,
      swirl: 0.66,
      swirlIterations: 10,
      shape: "checks" as const,
      shapeScale: 0.1,
      colors: ["hsl(216, 84%, 25%)", "hsl(232, 88%, 66%)", "hsl(190, 70%, 34%)", "hsl(220, 92%, 76%)"]
    },
    {
      proportion: 0.44,
      softness: 1.1,
      distortion: 0.18,
      swirl: 0.68,
      swirlIterations: 12,
      shape: "dots" as const,
      shapeScale: 0.1,
      colors: ["hsl(320, 64%, 28%)", "hsl(348, 80%, 62%)", "hsl(285, 60%, 36%)", "hsl(330, 88%, 74%)"]
    }
  ];
  return configs[index % configs.length];
}

export default function FeatureShaderCards({ features, className }: FeatureShaderCardsProps) {
  const compact = features.length > 6;

  return (
    <div className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {features.map((feature, index) => {
        const shaderConfig = getShaderConfig(index);
        return (
          <motion.div
            key={`${feature.title}-${index}`}
            initial={{ opacity: 0, y: 34, scale: 0.96, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1], delay: index * 0.055 }}
            className={cn("relative min-w-0 overflow-hidden rounded-[28px]", compact ? "min-h-[10.75rem]" : "min-h-[13.5rem]")}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[28px]">
              <Warp
                style={{ height: "100%", width: "100%" }}
                proportion={shaderConfig.proportion}
                softness={shaderConfig.softness}
                distortion={shaderConfig.distortion}
                swirl={shaderConfig.swirl}
                swirlIterations={shaderConfig.swirlIterations}
                shape={shaderConfig.shape}
                shapeScale={shaderConfig.shapeScale}
                scale={1}
                rotation={0}
                speed={0.42}
                colors={shaderConfig.colors}
              />
            </div>

            <div className={cn("relative z-10 flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/20 bg-slate-950/78 text-white shadow-glass backdrop-blur-md", compact ? "min-h-[10.75rem] p-4" : "min-h-[13.5rem] p-5")}>
              <div className={cn("flex shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/14 text-white drop-shadow-lg", compact ? "mb-3 h-10 w-10" : "mb-5 h-12 w-12")}>
                {feature.icon}
              </div>

              <h3 className={cn("mb-2 min-w-0 break-words font-black leading-tight text-white [overflow-wrap:anywhere]", compact ? "text-base" : "text-xl")}>{feature.title}</h3>

              <p className={cn("min-w-0 flex-grow break-words font-semibold text-white/84 [overflow-wrap:anywhere]", compact ? "text-sm leading-snug" : "text-base leading-relaxed")}>{feature.description}</p>

              <div className={cn("flex items-center text-xs font-black uppercase tracking-[0.2em] text-cyan-100/78", compact ? "mt-3" : "mt-5")}>
                <span className="mr-2">Activity Rule</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
