import { Copy, Download, Eye, FileInput, ImagePlus, LayoutGrid, List, Plus, Quote, Save, Text, Trash2, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createContentBlock, createImagePlaceholder, createSection, createSlide, presentationData } from "../data/presentationData";
import { blockSizeOptions, blockTypeOptions, fileToDataUrl, flattenSlides, imageFitOptions, imagePositionOptions, layoutOptions, legacySectionBlocks, textSizeOptions } from "../utils/layout";
import { GlassButton } from "./GlassButton";
import { SlideCanvas } from "./SlideCanvas";
import { SortableList } from "./SortableList";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";

const themes = ["indigo", "teal", "blue", "purple", "green", "navy", "warm"];

function updateAt(array, index, updater) {
  return array.map((item, itemIndex) => (itemIndex === index ? updater(item) : item));
}

function TextInput({ label, value, onChange, textarea = false, rows = 3 }) {
  const Component = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <Component
        value={value || ""}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        value={value || options[0]}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function objectIcon(type) {
  if (type === "image") return <ImagePlus className="h-4 w-4" />;
  if (type === "bullets") return <List className="h-4 w-4" />;
  if (type === "quote") return <Quote className="h-4 w-4" />;
  return <Text className="h-4 w-4" />;
}

export function EditPortal({ data, actions }) {
  const [selectedSlideId, setSelectedSlideId] = useState(data.slides[0]?.id);
  const [selectedSectionId, setSelectedSectionId] = useState(data.slides[0]?.sections?.[0]?.id);
  const importRef = useRef(null);
  const selectedSlideIndex = Math.max(0, data.slides.findIndex((slide) => slide.id === selectedSlideId));
  const selectedSlide = data.slides[selectedSlideIndex] || data.slides[0];
  const selectedSectionIndex = selectedSlide?.sections?.findIndex((section) => section.id === selectedSectionId) ?? -1;
  const selectedSection = selectedSlide?.sections?.[selectedSectionIndex] || selectedSlide?.sections?.[0];

  const previewSlide = useMemo(() => {
    if (!selectedSlide) return flattenSlides(data)[0];
    if (selectedSlide.type === "group" || selectedSlide.type === "activity" || selectedSlide.type === "content") {
      const section = selectedSection || selectedSlide.sections?.[0];
      return {
        ...selectedSlide,
        id: `${selectedSlide.id}-preview-${section?.id || "slide"}`,
        activeSection: section,
        activeSections: [section].filter(Boolean),
        activeSectionId: section?.id,
        title: selectedSlide.type === "group" ? section?.title || selectedSlide.groupName : selectedSlide.title,
        subtitle: selectedSlide.type === "group" ? selectedSlide.groupName : selectedSlide.subtitle,
        sectionIndex: Math.max(0, selectedSectionIndex),
        totalSections: selectedSlide.sections?.length || 0
      };
    }
    return selectedSlide;
  }, [data, selectedSlide, selectedSection, selectedSectionIndex]);

  const setSlide = (updater) => {
    actions.setData((current) => ({
      ...current,
      slides: updateAt(current.slides, selectedSlideIndex, updater)
    }));
  };

  const setSection = (updater) => {
    if (selectedSectionIndex < 0) return;
    setSlide((slide) => ({
      ...slide,
      sections: updateAt(slide.sections || [], selectedSectionIndex, updater)
    }));
  };

  const addSlide = () => {
    const slide = createSlide();
    actions.setData((current) => ({ ...current, slides: [...current.slides, slide] }));
    setSelectedSlideId(slide.id);
    setSelectedSectionId(slide.sections[0]?.id);
  };

  const duplicateSlide = () => {
    const copy = JSON.parse(JSON.stringify(selectedSlide));
    copy.id = crypto.randomUUID();
    copy.title = `${copy.title || copy.groupName} Copy`;
    copy.sections = copy.sections?.map((section) => ({
      ...section,
      id: crypto.randomUUID(),
      images: section.images?.map((image) => ({ ...image, id: crypto.randomUUID() })) || []
    }));
    actions.setData((current) => {
      const slides = [...current.slides];
      slides.splice(selectedSlideIndex + 1, 0, copy);
      return { ...current, slides };
    });
    setSelectedSlideId(copy.id);
    setSelectedSectionId(copy.sections?.[0]?.id);
  };

  const deleteSlide = () => {
    if (data.slides.length <= 1) return;
    actions.setData((current) => ({ ...current, slides: current.slides.filter((slide) => slide.id !== selectedSlide.id) }));
    const next = data.slides[selectedSlideIndex + 1] || data.slides[selectedSlideIndex - 1];
    setSelectedSlideId(next.id);
    setSelectedSectionId(next.sections?.[0]?.id);
  };

  const addSection = () => {
    const section = createSection();
    setSlide((slide) => ({ ...slide, sections: [...(slide.sections || []), section] }));
    setSelectedSectionId(section.id);
  };

  const deleteSection = () => {
    if (!selectedSection || (selectedSlide.sections?.length || 0) <= 1) return;
    setSlide((slide) => ({ ...slide, sections: slide.sections.filter((section) => section.id !== selectedSection.id) }));
    const next = selectedSlide.sections[selectedSectionIndex + 1] || selectedSlide.sections[selectedSectionIndex - 1];
    setSelectedSectionId(next?.id);
  };

  const handleImageUpload = async (file, imageIndex = null) => {
    const src = await fileToDataUrl(file);
    setSection((section) => {
      const images = [...(section.images || [])];
      const item = {
        id: imageIndex === null ? crypto.randomUUID() : images[imageIndex]?.id || crypto.randomUUID(),
        src,
        title: imageIndex === null ? images[imageIndex]?.title || file.name : images[imageIndex]?.title || file.name,
        subtitle: imageIndex === null ? images[imageIndex]?.subtitle || "" : images[imageIndex]?.subtitle || "",
        caption: imageIndex === null ? file.name : images[imageIndex]?.caption || file.name,
        role: imageIndex === null ? "gallery" : images[imageIndex]?.role || "gallery",
        size: imageIndex === null ? "normal" : images[imageIndex]?.size || "normal",
        fit: imageIndex === null ? "cover" : images[imageIndex]?.fit || "cover",
        position: imageIndex === null ? "center" : images[imageIndex]?.position || "center",
        isPlaceholder: false
      };
      if (imageIndex === null) images.push(item);
      else images[imageIndex] = item;
      return { ...section, images };
    });
  };

  const materializeBlocks = (section) => {
    if (section.blocks?.length) return section.blocks;
    return legacySectionBlocks(section).map((block) => ({ ...block, id: crypto.randomUUID() }));
  };

  const setBlock = (blockIndex, updater) => {
    setSection((section) => ({
      ...section,
      blocks: updateAt(materializeBlocks(section), blockIndex, updater)
    }));
  };

  const addBlock = (type = "text") => {
    const block = createContentBlock(type);
    setSection((section) => ({
      ...section,
      blocks: [...materializeBlocks(section), block]
    }));
  };

  const duplicateBlock = (blockIndex) => {
    setSection((section) => {
      const blocks = materializeBlocks(section);
      const copy = JSON.parse(JSON.stringify(blocks[blockIndex]));
      copy.id = crypto.randomUUID();
      copy.title = `${copy.title || "Object"} Copy`;
      const next = [...blocks];
      next.splice(blockIndex + 1, 0, copy);
      return { ...section, blocks: next };
    });
  };

  const deleteBlock = (blockIndex) => {
    setSection((section) => ({
      ...section,
      blocks: materializeBlocks(section).filter((_, index) => index !== blockIndex)
    }));
  };

  const convertBlock = (blockIndex, type) => {
    setBlock(blockIndex, (block) => {
      const converted = {
        ...block,
        type,
        title: block.title || createContentBlock(type).title,
        image: type === "image" ? block.image || createImagePlaceholder(block.title || "Image Object") : block.image,
        bullets: type === "bullets" ? block.bullets?.length ? block.bullets : block.text ? block.text.split("\n").filter(Boolean) : ["Editable bullet"] : block.bullets || [],
        text: type === "image" ? "" : block.text || "",
        metricValue: type === "metric" ? block.metricValue || "01" : block.metricValue || "",
        size: type === "image" && block.size === "normal" ? "wide" : block.size || "normal",
        textSize: block.textSize || "md"
      };
      return converted;
    });
  };

  const handleBlockImageUpload = async (file, blockIndex) => {
    const src = await fileToDataUrl(file);
    setBlock(blockIndex, (block) => ({
      ...block,
      type: "image",
      image: {
        ...(block.image || {}),
        id: block.image?.id || crypto.randomUUID(),
        src,
        title: block.image?.title || block.title || file.name,
        subtitle: block.image?.subtitle || "",
        caption: block.caption || file.name,
        role: "gallery",
        size: block.image?.size || block.size || "wide",
        fit: block.image?.fit || "cover",
        position: block.image?.position || "center",
        isPlaceholder: false
      },
      caption: block.caption || file.name,
      title: block.title || file.name
    }));
  };

  const selectedBlocks = selectedSection ? (selectedSection.blocks?.length ? selectedSection.blocks : legacySectionBlocks(selectedSection)) : [];

  return (
    <main className="min-h-screen bg-[#eef2f7] text-slate-950">
      <div className="grid min-h-screen grid-cols-1 xl:grid-cols-[320px_1fr]">
        <aside className="border-r border-slate-200 bg-white/85 p-4 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Edit Portal</div>
              <h1 className="text-2xl font-black">All Hands Meet</h1>
            </div>
            <a href="/present" className="rounded-full border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50" title="Open presentation">
              <Eye className="h-5 w-5" />
            </a>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <button onClick={addSlide} className="rounded-2xl bg-slate-950 px-3 py-3 text-xs font-bold text-white">
              <Plus className="mx-auto mb-1 h-4 w-4" /> Add
            </button>
            <button onClick={duplicateSlide} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700">
              <Copy className="mx-auto mb-1 h-4 w-4" /> Copy
            </button>
            <button onClick={deleteSlide} className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-3 text-xs font-bold text-rose-700">
              <Trash2 className="mx-auto mb-1 h-4 w-4" /> Delete
            </button>
          </div>

          <SortableList
            ids={data.slides.map((slide) => slide.id)}
            onReorder={(_, oldIndex, newIndex) => {
              actions.setData((current) => {
                const slides = [...current.slides];
                const [removed] = slides.splice(oldIndex, 1);
                slides.splice(newIndex, 0, removed);
                return { ...current, slides };
              });
            }}
            className="space-y-2"
          >
            {(SortableRow) =>
              data.slides.map((slide, index) => (
                <SortableRow key={slide.id} id={slide.id}>
                  <button
                    onClick={() => {
                      setSelectedSlideId(slide.id);
                      setSelectedSectionId(slide.sections?.[0]?.id);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      selectedSlideId === slide.id ? "border-indigo-200 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, "0")}</div>
                    <div className="truncate text-sm font-black">{slide.title || slide.groupName}</div>
                    <div className="truncate text-xs font-semibold text-slate-500">{slide.type}</div>
                  </button>
                </SortableRow>
              ))
            }
          </SortableList>
        </aside>

        <section className="grid grid-cols-1 gap-5 p-5 2xl:grid-cols-[minmax(420px,0.9fr)_minmax(600px,1.1fr)]">
          <div className="space-y-5">
            <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="border border-slate-200 bg-white/86 p-5 shadow-sm">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-500">Slide Settings</div>
                  <h2 className="text-2xl font-black">{selectedSlide?.title || selectedSlide?.groupName}</h2>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="dark" onClick={actions.exportJson}>
                    <Download className="h-4 w-4" /> Export JSON
                  </GlassButton>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    hidden
                    onChange={(event) => event.target.files?.[0] && actions.importJson(event.target.files[0])}
                  />
                  <GlassButton variant="light" onClick={() => importRef.current?.click()}>
                    <FileInput className="h-4 w-4" /> Import
                  </GlassButton>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Title" value={selectedSlide?.title || ""} onChange={(value) => setSlide((slide) => ({ ...slide, title: value }))} />
                <TextInput label="Subtitle" value={selectedSlide?.subtitle || ""} onChange={(value) => setSlide((slide) => ({ ...slide, subtitle: value }))} />
                <TextInput label="Group Name" value={selectedSlide?.groupName || ""} onChange={(value) => setSlide((slide) => ({ ...slide, groupName: value }))} />
                <SelectInput label="Theme" value={selectedSlide?.theme || "indigo"} onChange={(value) => setSlide((slide) => ({ ...slide, theme: value }))} options={themes} />
                <TextInput label="Body / Question" value={selectedSlide?.body || selectedSlide?.question || ""} onChange={(value) => setSlide((slide) => ({ ...slide, body: value, question: slide.question !== undefined ? value : slide.question }))} textarea rows={4} />
                <TextInput label="Kahoot / Link" value={selectedSlide?.link || ""} onChange={(value) => setSlide((slide) => ({ ...slide, link: value }))} />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <GlassButton variant="light" onClick={() => actions.setData((current) => ({ ...current }))}>
                  <Save className="h-4 w-4" /> Save Changes
                </GlassButton>
                <GlassButton variant="light" onClick={actions.reset}>
                  Reset to Default
                </GlassButton>
              </div>
            </LiquidGlassCard>

            <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="border border-slate-200 bg-white/86 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-500">Sections</div>
                  <h2 className="text-2xl font-black">Group Content</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={addSection} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                    Add Section
                  </button>
                  <button onClick={deleteSection} className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                    Delete
                  </button>
                </div>
              </div>

              {selectedSlide?.sections?.length ? (
                <SortableList
                  ids={selectedSlide.sections.map((section) => section.id)}
                  onReorder={(_, oldIndex, newIndex) => {
                    setSlide((slide) => {
                      const sections = [...slide.sections];
                      const [removed] = sections.splice(oldIndex, 1);
                      sections.splice(newIndex, 0, removed);
                      return { ...slide, sections };
                    });
                  }}
                  className="mb-5 space-y-2"
                >
                  {(SortableRow) =>
                    selectedSlide.sections.map((section) => (
                      <SortableRow key={section.id} id={section.id}>
                        <button
                          onClick={() => setSelectedSectionId(section.id)}
                          className={`w-full rounded-2xl border p-3 text-left text-sm font-black transition ${
                            selectedSection?.id === section.id ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <span className={section.visible === false ? "text-slate-400 line-through" : ""}>{section.title}</span>
                        </button>
                      </SortableRow>
                    ))
                  }
                </SortableList>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">This slide type has no sections yet. Add one to create editable content blocks.</p>
              )}

              {selectedSection ? (
                <div className="grid gap-4">
                  <TextInput label="Section Title" value={selectedSection.title} onChange={(value) => setSection((section) => ({ ...section, title: value }))} />
                  <SelectInput label="Layout" value={selectedSection.layout || "auto"} onChange={(value) => setSection((section) => ({ ...section, layout: value }))} options={layoutOptions} />
                  <TextInput label="Section Text" value={selectedSection.text} onChange={(value) => setSection((section) => ({ ...section, text: value }))} textarea rows={7} />
                  <TextInput
                    label="Bullet Points (one per line)"
                    value={(selectedSection.bullets || []).join("\n")}
                    onChange={(value) => setSection((section) => ({ ...section, bullets: value.split("\n").map((item) => item.trim()).filter(Boolean) }))}
                    textarea
                    rows={6}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold">
                      <input type="checkbox" checked={selectedSection.visible !== false} onChange={(event) => setSection((section) => ({ ...section, visible: event.target.checked }))} />
                      Visible
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold">
                      <input type="checkbox" checked={selectedSection.fullSlide !== false} onChange={(event) => setSection((section) => ({ ...section, fullSlide: event.target.checked }))} />
                      Full slide
                    </label>
                  </div>
                </div>
              ) : null}
            </LiquidGlassCard>

            {selectedSection ? (
              <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="border border-slate-200 bg-white/86 p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-500">Object Editor</div>
                    <h2 className="text-2xl font-black">Drag, Convert, Arrange</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => addBlock("text")} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                      <Text className="h-4 w-4" /> Text
                    </button>
                    <button onClick={() => addBlock("image")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold">
                      <ImagePlus className="h-4 w-4" /> Image
                    </button>
                    <button onClick={() => addBlock("bullets")} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold">
                      <List className="h-4 w-4" /> Bullets
                    </button>
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-3 text-sm font-semibold text-indigo-950">
                  Drag objects to reorder them. Change an object type to convert text into an image slot, bullets into a text card, or any object into a metric/quote/placeholder.
                </div>

                {selectedBlocks.length ? (
                  <SortableList
                    ids={selectedBlocks.map((block) => block.id)}
                    onReorder={(_, oldIndex, newIndex) => {
                      setSection((section) => {
                        const blocks = [...materializeBlocks(section)];
                        const [removed] = blocks.splice(oldIndex, 1);
                        blocks.splice(newIndex, 0, removed);
                        return { ...section, blocks };
                      });
                    }}
                    className="space-y-3"
                  >
                    {(SortableRow) =>
                      selectedBlocks.map((block, blockIndex) => (
                        <SortableRow key={block.id} id={block.id}>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600">
                                {objectIcon(block.type)}
                                {block.type || "text"} object
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => duplicateBlock(blockIndex)} className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700">
                                  Copy
                                </button>
                                <button onClick={() => deleteBlock(blockIndex)} className="rounded-full bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-4">
                              <TextInput label="Object Title" value={block.title || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, title: value }))} />
                              <SelectInput label="Convert Type" value={block.type || "text"} onChange={(value) => convertBlock(blockIndex, value)} options={blockTypeOptions} />
                              <SelectInput label="Object Size" value={block.size || "normal"} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, size: value }))} options={blockSizeOptions} />
                              <SelectInput label="Text Size" value={block.textSize || "md"} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, textSize: value }))} options={textSizeOptions} />
                            </div>

                            {block.type === "image" ? (
                              <div className="mt-4 grid gap-4 md:grid-cols-[180px_1fr]">
                                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                  {block.image?.src ? (
                                    <img
                                      src={block.image.src}
                                      alt={block.caption || block.title}
                                      className="h-full w-full"
                                      style={{ objectFit: block.image?.fit || "cover", objectPosition: block.image?.position || "center" }}
                                    />
                                  ) : (
                                    <LayoutGrid className="h-9 w-9 text-slate-300" />
                                  )}
                                </div>
                                <div className="grid gap-3">
                                  <TextInput label="Caption" value={block.caption || block.image?.caption || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, caption: value, image: item.image ? { ...item.image, caption: value } : item.image }))} />
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <TextInput label="Image Title" value={block.image?.title || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, image: item.image ? { ...item.image, title: value } : { ...createImagePlaceholder(item.title || "Image Object"), title: value } }))} />
                                    <TextInput label="Image Subtitle" value={block.image?.subtitle || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, image: item.image ? { ...item.image, subtitle: value } : { ...createImagePlaceholder(item.title || "Image Object"), subtitle: value } }))} />
                                  </div>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <SelectInput label="Image Fit" value={block.image?.fit || "cover"} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, image: item.image ? { ...item.image, fit: value } : { ...createImagePlaceholder(item.title || "Image Object"), fit: value } }))} options={imageFitOptions} />
                                    <SelectInput label="Crop Position" value={block.image?.position || "center"} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, image: item.image ? { ...item.image, position: value } : { ...createImagePlaceholder(item.title || "Image Object"), position: value } }))} options={imagePositionOptions} />
                                  </div>
                                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                                    <Upload className="h-4 w-4" /> Upload Image
                                    <input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && handleBlockImageUpload(event.target.files[0], blockIndex)} />
                                  </label>
                                </div>
                              </div>
                            ) : null}

                            {block.type === "bullets" ? (
                              <div className="mt-4">
                                <TextInput
                                  label="Bullet Lines"
                                  value={(block.bullets || []).join("\n")}
                                  onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, bullets: value.split("\n").map((line) => line.trim()).filter(Boolean) }))}
                                  textarea
                                  rows={5}
                                />
                              </div>
                            ) : null}

                            {["text", "quote", "metric"].includes(block.type) ? (
                              <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr]">
                                {block.type === "metric" ? <TextInput label="Metric Value" value={block.metricValue || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, metricValue: value }))} /> : null}
                                <div className={block.type === "metric" ? "" : "md:col-span-2"}>
                                  <TextInput label="Object Text" value={block.text || ""} onChange={(value) => setBlock(blockIndex, (item) => ({ ...item, text: value }))} textarea rows={4} />
                                </div>
                              </div>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-3">
                              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
                                <input type="checkbox" checked={block.visible !== false} onChange={(event) => setBlock(blockIndex, (item) => ({ ...item, visible: event.target.checked }))} />
                                Show object
                              </label>
                              {!selectedSection.blocks?.length ? (
                                <button onClick={() => setSection((section) => ({ ...section, blocks: materializeBlocks(section) }))} className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-bold text-indigo-700">
                                  Make Existing Content Editable
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </SortableRow>
                      ))
                    }
                  </SortableList>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                    No objects yet. Add a text, image, or bullet object to build this section.
                  </div>
                )}
              </LiquidGlassCard>
            ) : null}

            {selectedSection ? (
              <LiquidGlassCard draggable={false} borderRadius="28px" glowIntensity="none" shadowIntensity="xs" className="border border-slate-200 bg-white/86 p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-500">Image Management</div>
                    <h2 className="text-2xl font-black">Assets</h2>
                  </div>
                  <div className="flex gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white">
                      <Upload className="h-4 w-4" /> Upload
                      <input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0])} />
                    </label>
                    <button
                      onClick={() => setSection((section) => ({ ...section, images: [...(section.images || []), createImagePlaceholder()] }))}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold"
                    >
                      <ImagePlus className="h-4 w-4" /> Placeholder
                    </button>
                  </div>
                </div>

                <SortableList
                  ids={(selectedSection.images || []).map((image) => image.id)}
                  strategy="grid"
                  onReorder={(_, oldIndex, newIndex) => {
                    setSection((section) => {
                      const images = [...(section.images || [])];
                      const [removed] = images.splice(oldIndex, 1);
                      images.splice(newIndex, 0, removed);
                      return { ...section, images };
                    });
                  }}
                  className="grid gap-3 md:grid-cols-2"
                >
                  {(SortableRow) =>
                    (selectedSection.images || []).map((image, imageIndex) => (
                      <SortableRow key={image.id} id={image.id}>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-3 flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-white">
                            {image.src ? (
                              <img
                                src={image.src}
                                alt={image.caption}
                                className="h-full w-full"
                                style={{ objectFit: image.fit || "cover", objectPosition: image.position || "center" }}
                              />
                            ) : (
                              <LayoutGrid className="h-8 w-8 text-slate-300" />
                            )}
                          </div>
                          <TextInput
                            label="Caption"
                            value={image.caption || ""}
                            onChange={(value) =>
                              setSection((section) => ({
                                ...section,
                                images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, caption: value }))
                              }))
                            }
                          />
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <TextInput
                              label="Image Title"
                              value={image.title || ""}
                              onChange={(value) =>
                                setSection((section) => ({
                                  ...section,
                                  images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, title: value }))
                                }))
                              }
                            />
                            <TextInput
                              label="Image Subtitle"
                              value={image.subtitle || ""}
                              onChange={(value) =>
                                setSection((section) => ({
                                  ...section,
                                  images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, subtitle: value }))
                                }))
                              }
                            />
                          </div>
                          <div className="mt-3 grid gap-3 md:grid-cols-3">
                            <SelectInput
                              label="Size"
                              value={image.size || "normal"}
                              onChange={(value) =>
                                setSection((section) => ({
                                  ...section,
                                  images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, size: value }))
                                }))
                              }
                              options={blockSizeOptions}
                            />
                            <SelectInput
                              label="Image Fit"
                              value={image.fit || "cover"}
                              onChange={(value) =>
                                setSection((section) => ({
                                  ...section,
                                  images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, fit: value }))
                                }))
                              }
                              options={imageFitOptions}
                            />
                            <SelectInput
                              label="Crop Position"
                              value={image.position || "center"}
                              onChange={(value) =>
                                setSection((section) => ({
                                  ...section,
                                  images: updateAt(section.images || [], imageIndex, (item) => ({ ...item, position: value }))
                                }))
                              }
                              options={imagePositionOptions}
                            />
                          </div>
                          <div className="mt-3 flex gap-2">
                            <label className="flex-1 cursor-pointer rounded-full bg-white px-3 py-2 text-center text-xs font-black text-slate-700">
                              Replace
                              <input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && handleImageUpload(event.target.files[0], imageIndex)} />
                            </label>
                            <button
                              onClick={() => setSection((section) => ({ ...section, images: section.images.filter((_, index) => index !== imageIndex) }))}
                              className="rounded-full bg-rose-50 px-3 py-2 text-xs font-black text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </SortableRow>
                    ))
                  }
                </SortableList>
              </LiquidGlassCard>
            ) : null}
          </div>

          <LiquidGlassCard draggable={false} borderRadius="32px" glowIntensity="sm" shadowIntensity="xs" className="sticky top-5 h-[calc(100vh-2.5rem)] overflow-hidden border border-slate-200 bg-slate-950 shadow-2xl">
            <div className="absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-white/12 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
              Live Preview
            </div>
            {previewSlide ? <SlideCanvas slide={previewSlide} data={data} preview /> : null}
          </LiquidGlassCard>
        </section>
      </div>
    </main>
  );
}
