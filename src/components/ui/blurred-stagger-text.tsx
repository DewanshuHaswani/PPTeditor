"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BlurredStagger = ({
  text = "we love hextaui.com",
  className,
  textClassName,
  duration = 0.3,
  stagger = 0.015
}: {
  text: string;
  className?: string;
  textClassName?: string;
  duration?: number;
  stagger?: number;
}) => {
  const headingText = text;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger
      }
    }
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)"
    },
    show: {
      opacity: 1,
      filter: "blur(0px)"
    }
  };

  return (
    <div className={className}>
      <motion.span variants={container} initial="hidden" animate="show" className={cn("block text-base", textClassName)} aria-label={headingText}>
        {headingText.split("").map((char, index) => (
          <motion.span key={`${char}-${index}`} variants={letterAnimation} transition={{ duration }} aria-hidden="true">
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
};
