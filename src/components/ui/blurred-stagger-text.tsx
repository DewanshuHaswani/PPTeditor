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
    <div className={cn("min-w-0 max-w-full", className)}>
      <motion.span
        variants={container}
        initial="hidden"
        animate="show"
        className={cn("block max-w-full whitespace-normal break-words text-base [overflow-wrap:anywhere]", textClassName)}
        aria-label={headingText}
      >
        {headingText.split("").map((char, index) => (
          <motion.span key={`${char}-${index}`} variants={letterAnimation} transition={{ duration }} aria-hidden="true">
            {char}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
};
