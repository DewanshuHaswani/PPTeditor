import { useEffect, useMemo, useState } from "react";
import { cloneData } from "../utils/layout";
import { presentationData } from "../data/presentationData";

const STORAGE_KEY = "ahm-premium-presentation-data";

function migratePresentationData(data) {
  const copy = cloneData(data);
  const defaults = cloneData(presentationData);
  const defaultCollaborationThought = defaults.slides.find((slide) => slide.id === "why-collaboration-matters");
  const leadership = copy.slides?.find((slide) => slide.id === "leadership-address");
  const businessGroupIds = ["advance-research-group", "open-innovation", "standards-research-group", "ip-group", "people-group"];

  if (leadership) {
    leadership.title = "Mohan Roa Goli";
    leadership.subtitle = "";
  }

  businessGroupIds.forEach((groupId) => {
    const slide = copy.slides?.find((item) => item.id === groupId);
    const defaultSlide = defaults.slides.find((item) => item.id === groupId);
    const defaultSummaryId = defaultSlide?.sections?.[0]?.id;
    const currentSummary = slide?.sections?.find((section) => section.id === defaultSummaryId);
    if (slide && defaultSlide && defaultSummaryId && (!currentSummary || currentSummary.businessUpdateVersion !== 2)) {
      slide.sections = cloneData(defaultSlide.sections);
    }
  });

  if (copy.slides && defaultCollaborationThought && !copy.slides.some((slide) => slide.id === "why-collaboration-matters")) {
    const thankYouIndex = copy.slides.findIndex((slide) => slide.id === "thank-you");
    const insertIndex = thankYouIndex >= 0 ? thankYouIndex : copy.slides.length;
    copy.slides.splice(insertIndex, 0, cloneData(defaultCollaborationThought));
  }

  return copy;
}

export function usePresentationData() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? migratePresentationData(JSON.parse(saved)) : cloneData(presentationData);
    } catch {
      return cloneData(presentationData);
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const actions = useMemo(
    () => ({
      setData,
      reset: () => setData(cloneData(presentationData)),
      exportJson: () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "all-hands-presentation.json";
        link.click();
        URL.revokeObjectURL(url);
      },
      importJson: async (file) => {
        const text = await file.text();
        setData(JSON.parse(text));
      }
    }),
    [data]
  );

  return [data, actions];
}
