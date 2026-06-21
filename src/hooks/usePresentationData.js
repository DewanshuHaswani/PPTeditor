import { useEffect, useMemo, useState } from "react";
import { cloneData } from "../utils/layout";
import { presentationData } from "../data/presentationData";

const STORAGE_KEY = "ahm-premium-presentation-data";

export function usePresentationData() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : cloneData(presentationData);
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
