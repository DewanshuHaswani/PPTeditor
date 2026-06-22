import { X } from "lucide-react";
import { useEffect } from "react";
import StellarCardGallerySingle from "@/components/ui/3d-image-gallery";
import { GlassButton } from "./GlassButton";

const groupCards = [
  {
    id: "advance-research-group",
    title: "Advance Research Group",
    subtitle: "AI, spatial sensing, quantum-inspired research",
    alt: "Advance Research Group cinematic abstract card",
    imageUrl: "/assets/movie-mode/advance-research-group.png"
  },
  {
    id: "open-innovation",
    title: "Open Innovation",
    subtitle: "Startup incubation and strategic partnerships",
    alt: "Open Innovation cinematic abstract card",
    imageUrl: "/assets/movie-mode/open-innovation.png"
  },
  {
    id: "standards-research-group",
    title: "Standards Research Group",
    subtitle: "6G, Wi-Fi, global standards leadership",
    alt: "Standards Research Group cinematic abstract card",
    imageUrl: "/assets/movie-mode/standards-research-group.png"
  },
  {
    id: "ip-group",
    title: "IP Group",
    subtitle: "Patents, invention portfolio, protected ideas",
    alt: "IP Group cinematic abstract card",
    imageUrl: "/assets/movie-mode/ip-group.png"
  },
  {
    id: "people-group",
    title: "People Group",
    subtitle: "Culture, recognition, team connection",
    alt: "People Group cinematic abstract card",
    imageUrl: "/assets/movie-mode/people-group.png"
  }
];

export function MovieModeOverlay({ onClose, onSelectGroup, groupTargets = {} }) {
  const cards = groupCards.map((card) => ({
    ...card,
    slideNumber: groupTargets[card.id]
  }));

  const handleSelectGroup = (groupId) => {
    onSelectGroup(groupId);
  };

  useEffect(() => {
    window.__ahmMovieModeSelectGroup = handleSelectGroup;
    return () => {
      delete window.__ahmMovieModeSelectGroup;
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <StellarCardGallerySingle
        title="Movie Mode"
        subtitle="Drag to explore - Scroll to zoom - Click a group card, then press Enter Section"
        cards={cards}
        onSelect={(card) => {
          handleSelectGroup(card.id);
        }}
      />
      <div className="absolute inset-x-0 bottom-6 z-[60] flex justify-center px-5" aria-label="Movie Mode quick navigation">
        <div className="flex max-w-6xl flex-wrap justify-center gap-2 rounded-[28px] border border-white/12 bg-black/48 p-2 shadow-glass backdrop-blur-2xl">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            data-movie-target={card.id}
            onClick={() => handleSelectGroup(card.id)}
            className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/82 transition hover:bg-white/18"
          >
            {card.slideNumber ? `Slide ${card.slideNumber}` : "Slide"} - {card.title}
          </button>
        ))}
        </div>
      </div>
      <div className="absolute right-5 top-5 z-[60]">
        <GlassButton onClick={onClose}>
          <X className="h-4 w-4" /> Close
        </GlassButton>
      </div>
    </div>
  );
}
