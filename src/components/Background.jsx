import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import AnimatedGradient from "@/components/ui/animated-gradient";
import { themeMap } from "../utils/layout";

export const Background = memo(function Background({ theme = "indigo", heroImage }) {
  const gradientConfig = useMemo(
    () => ({
      preset: "custom",
      color1: "#030711",
      color2: theme === "warm" ? "#f2b56b" : theme === "teal" || theme === "green" ? "#39b8b2" : "#7894ff",
      color3: theme === "purple" ? "#b18cff" : theme === "blue" ? "#8db6ff" : "#1f2a62",
      rotation: -36,
      proportion: 42,
      scale: 0.42,
      speed: 10,
      distortion: 9,
      swirl: 38,
      swirlIterations: 7,
      softness: 92,
      offset: -120,
      shape: "Edge",
      shapeSize: 42
    }),
    [theme]
  );
  const noise = useMemo(() => ({ opacity: 0.12, scale: 0.8 }), []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-gradient-to-br ${themeMap[theme] || themeMap.indigo}`}>
      <AnimatedGradient
        config={gradientConfig}
        noise={noise}
        style={{ zIndex: 0, opacity: 0.86 }}
      />
      {heroImage ? <img src={heroImage} className="absolute inset-0 z-[1] h-full w-full object-cover opacity-[0.34] mix-blend-screen" alt="" /> : null}
      <motion.div
        className="absolute left-[8%] top-[12%] z-[2] h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl"
        animate={{ x: [0, 42, -16, 0], y: [0, -18, 28, 0], scale: [1, 1.14, 0.96, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[8%] z-[2] h-96 w-96 rounded-full bg-violet-300/20 blur-3xl"
        animate={{ x: [0, -36, 22, 0], y: [0, 28, -20, 0], scale: [1, 0.92, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.20),transparent_28%),linear-gradient(120deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,255,255,0.08)_72%,transparent)]" />
      <div className="absolute inset-0 z-[4] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:84px_84px] opacity-20" />
    </div>
  );
});
