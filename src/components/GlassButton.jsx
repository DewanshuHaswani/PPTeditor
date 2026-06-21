export function GlassButton({ children, className = "", variant = "default", ...props }) {
  const variants = {
    default: "border-white/18 bg-white/12 text-white hover:bg-white/20",
    dark: "border-slate-300/40 bg-slate-950/70 text-white hover:bg-slate-900/80",
    light: "border-slate-200 bg-white text-slate-950 hover:bg-slate-50"
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-glass outline-none transition duration-200 focus:ring-2 focus:ring-cyan-200/70 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
