export const themeMap = {
  indigo: "from-[#071225] via-[#182a62] to-[#7f67d9]",
  teal: "from-[#061b24] via-[#113b48] to-[#39b8b2]",
  blue: "from-[#06172f] via-[#153f75] to-[#8db6ff]",
  purple: "from-[#120d2a] via-[#34245f] to-[#b18cff]",
  green: "from-[#071d1d] via-[#1c4d49] to-[#90d7bd]",
  navy: "from-[#030711] via-[#0b1731] to-[#415a9f]",
  warm: "from-[#21150e] via-[#5b3f2d] to-[#f2b56b]"
};

export const layoutOptions = [
  "auto",
  "business-update",
  "bento",
  "steps",
  "text-cards",
  "text-heavy",
  "hero-image",
  "two-column",
  "image-grid",
  "diagram-gallery",
  "timeline-gallery",
  "process",
  "roadmap",
  "metrics",
  "recognition",
  "masonry",
  "carousel",
  "placeholder"
];

export const blockTypeOptions = ["text", "bullets", "image", "metric", "quote", "placeholder"];
export const blockSizeOptions = ["small", "normal", "wide", "hero"];
export const textSizeOptions = ["sm", "md", "lg", "xl"];
export const imageFitOptions = ["cover", "contain"];
export const imagePositionOptions = ["center", "top", "bottom", "left", "right"];

export function legacySectionBlocks(section = {}) {
  const blocks = [];
  if (section.text) {
    blocks.push({
      id: `${section.id || "section"}-text`,
      type: section.layout === "metrics" ? "metric" : section.layout === "recognition" ? "quote" : "text",
      title: "Text",
      text: section.text,
      bullets: [],
      image: null,
      metricValue: "",
      caption: "",
      size: section.text.length > 260 ? "wide" : "normal",
      textSize: section.text.length > 260 ? "sm" : "md",
      visible: true
    });
  }
  if (section.bullets?.length) {
    blocks.push({
      id: `${section.id || "section"}-bullets`,
      type: "bullets",
      title: "Bullets",
      text: "",
      bullets: section.bullets,
      image: null,
      metricValue: "",
      caption: "",
      size: section.bullets.length > 4 ? "wide" : "normal",
      textSize: section.bullets.length > 6 ? "sm" : "md",
      visible: true
    });
  }
  section.images?.forEach((image, index) => {
    blocks.push({
      id: image.id || `${section.id || "section"}-image-${index}`,
      type: "image",
      title: image.caption || `Image ${index + 1}`,
      text: "",
      bullets: [],
      image,
      metricValue: "",
      caption: image.caption || "",
      size: image.size || (index === 0 && section.images.length === 1 ? "hero" : "normal"),
      textSize: "md",
      visible: true
    });
  });
  return blocks;
}

export function resolveLayout(section = {}) {
  const blocks = section.blocks?.filter((block) => block.visible !== false) || [];
  if (blocks.length) {
    const imageCount = blocks.filter((block) => block.type === "image").length;
    const textCount = blocks.filter((block) => ["text", "bullets", "quote"].includes(block.type)).length;
    if (section.layout && section.layout !== "auto") return section.layout;
    if (imageCount > 4) return "masonry";
    if (imageCount >= 2 && textCount >= 1) return "two-column";
    if (imageCount >= 2) return "image-grid";
    if (blocks.length >= 4) return "bento";
    return imageCount === 1 ? "hero-image" : "text-cards";
  }
  if (section.layout && section.layout !== "auto") return section.layout;
  const imageCount = section.images?.filter(Boolean).length || 0;
  const bulletCount = section.bullets?.length || 0;
  const textLength = section.text?.length || 0;
  const hasTextContent = bulletCount > 0 || textLength > 0;
  if (/hall|fame|recognition/i.test(section.title || "")) return "recognition";
  if (/roadmap|fast forward|timeline/i.test(section.title || "")) return "roadmap";
  if (/metric|achievement/i.test(section.title || "") && bulletCount <= 6) return "metrics";
  if (imageCount > 6) return "masonry";
  if (imageCount >= 1 && hasTextContent) return "two-column";
  if (imageCount >= 3) return "image-grid";
  if (imageCount === 2) return "two-column";
  if (imageCount === 1) return "hero-image";
  if (bulletCount >= 7 || textLength > 500) return "text-heavy";
  if (bulletCount >= 3) return "bento";
  return "text-cards";
}

export function flattenSlides(data) {
  const flattened = [];
  data.slides.forEach((slide) => {
    const visibleSections = slide.sections?.filter((section) => section.visible !== false) || [];
    if (slide.type === "group") {
      const packs = [];
      visibleSections.forEach((section) => {
        if (section.fullSlide === false && packs.length) {
          packs[packs.length - 1].push(section);
        } else {
          packs.push([section]);
        }
      });
      packs.forEach((sections, sectionIndex) => {
        const section = sections[0];
        flattened.push({
          ...slide,
          id: `${slide.id}__${section.id}`,
          originalSlideId: slide.id,
          activeSectionId: section.id,
          activeSection: section,
          activeSections: sections,
          sectionIndex,
          totalSections: packs.length,
          title: section.title || slide.groupName,
          subtitle: slide.groupName
        });
      });
      return;
    }
    flattened.push({ ...slide, originalSlideId: slide.id });
  });
  return flattened;
}

export function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
