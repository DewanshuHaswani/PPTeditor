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

export function MovieModeOverlay({ onClose, onSelectGroup }) {
  const handleSelectGroup = (groupId) => {
    onSelectGroup(groupId);
    onClose();
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
        cards={groupCards}
        title="Movie Mode"
        subtitle="Drag to explore - Scroll to zoom - Click a group card to enter that section"
        onSelect={(card) => {
          handleSelectGroup(card.id);
        }}
      />
      <div className="sr-only" aria-label="Movie Mode quick navigation">
        {groupCards.map((card) => (
          <button key={card.id} type="button" data-movie-target={card.id} onClick={() => handleSelectGroup(card.id)}>
            Enter {card.title}
          </button>
        ))}
      </div>
      <div className="absolute right-5 top-5 z-[60]">
        <GlassButton onClick={onClose}>
          <X className="h-4 w-4" /> Close
        </GlassButton>
      </div>
    </div>
  );
}
