import { useEffect, useMemo, useState } from "react";
import { cloneData } from "../utils/layout";
import { presentationData } from "../data/presentationData";

const STORAGE_KEY = "ahm-premium-presentation-data";
const STORAGE_SIGNAL_KEY = "ahm-premium-presentation-data-signal";
const SAVE_EVENT = "ahm-premium-presentation-data-saved";
const DB_NAME = "ahm-premium-presentation-db";
const DB_VERSION = 1;
const STORE_NAME = "presentation";
const DATA_KEY = "current";

function openPresentationDb() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Unable to open IndexedDB."));
  });
}

async function readIndexedData() {
  const db = await openPresentationDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(DATA_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error || new Error("Unable to read saved presentation."));
    transaction.oncomplete = () => db.close();
  });
}

async function writeIndexedData(data) {
  const db = await openPresentationDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(data, DATA_KEY);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error || new Error("Unable to save presentation."));
    transaction.oncomplete = () => db.close();
  });
}

function readLegacyData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function writeSaveSignal() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(STORAGE_SIGNAL_KEY, String(Date.now()));
  } catch {
    // If legacy localStorage is already over quota, IndexedDB still has the data.
  }
  window.dispatchEvent(new Event(SAVE_EVENT));
}

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
    if (slide && defaultSlide && defaultSummaryId && (!currentSummary || currentSummary.businessUpdateVersion !== 3)) {
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
  const canPersist = typeof window !== "undefined" && window.location.pathname === "/edit";
  const [data, setData] = useState(() => {
    try {
      const saved = readLegacyData();
      return saved ? migratePresentationData(saved) : cloneData(presentationData);
    } catch {
      return cloneData(presentationData);
    }
  });

  useEffect(() => {
    if (!canPersist) return;
    writeIndexedData(data).catch(() => {
      // Explicit Save Changes reports storage failures; autosave should not break editing.
    });
  }, [canPersist, data]);

  useEffect(() => {
    const loadSavedData = async (rawValue) => {
      try {
        const indexedData = await readIndexedData();
        if (indexedData) {
          setData(migratePresentationData(indexedData));
          return;
        }
        if (rawValue) setData(migratePresentationData(JSON.parse(rawValue)));
      } catch {
        try {
          const legacyData = readLegacyData();
          if (legacyData) setData(migratePresentationData(legacyData));
        } catch {
          // Ignore malformed local edits and keep the current presentation open.
        }
      }
    };

    const onStorage = (event) => {
      if (event.key === STORAGE_SIGNAL_KEY || event.key === STORAGE_KEY) loadSavedData(event.newValue);
    };

    const onSaved = () => {
      loadSavedData(localStorage.getItem(STORAGE_KEY));
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") onSaved();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(SAVE_EVENT, onSaved);
    window.addEventListener("focus", onSaved);
    window.addEventListener("pageshow", onSaved);
    document.addEventListener("visibilitychange", onVisible);
    onSaved();
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SAVE_EVENT, onSaved);
      window.removeEventListener("focus", onSaved);
      window.removeEventListener("pageshow", onSaved);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const actions = useMemo(
    () => ({
      setData,
      save: async () => {
        try {
          await writeIndexedData(data);
          writeSaveSignal();
          return { ok: true, message: "All presentation changes saved." };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Unable to save changes."
          };
        }
      },
      reset: () => {
        const nextData = cloneData(presentationData);
        setData(nextData);
        return nextData;
      },
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
