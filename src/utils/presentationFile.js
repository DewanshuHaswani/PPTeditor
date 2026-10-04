import { layoutOptions, blockTypeOptions, blockSizeOptions, textSizeOptions, imageFitOptions, imagePositionOptions, themeMap } from "./layout.js";

// One format for disk saves, imports and portable exports.
export function validatePresentation(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.slides) || !value.slides.length) {
    throw new Error('Choose a presentation JSON file containing at least one slide.');
  }
  const types = new Set(['intro', 'title', 'quote', 'quiz', 'break', 'timer', 'thanks', 'activity', 'group', 'content', 'leadership']);
  const checkIds = (items, label) => {
    const seen = new Set();
    for (const item of items) {
      if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !item.id || seen.has(item.id)) {
        throw new Error(`${label} must have unique, non-empty IDs.`);
      }
      seen.add(item.id);
    }
  };
  const strings = ['title', 'subtitle', 'groupName', 'body', 'question', 'link', 'text', 'caption', 'src', 'details', 'metricValue', 'date', 'theme', 'heroImage', 'buttonText', 'notes'];
  const checkContent = (item, kind = 'content') => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Invalid ${kind} in presentation.`);
    for (const field of strings) {
      if (item[field] !== undefined && field !== 'details' && typeof item[field] !== 'string') throw new Error(`Invalid ${field} in presentation.`);
    }
    for (const field of ['visible', 'fullSlide', 'expandable', 'objectsEdited', 'isPlaceholder']) {
      if (item[field] !== undefined && typeof item[field] !== 'boolean') throw new Error(`Invalid ${field} in presentation.`);
    }
    const enums = { layout: layoutOptions, size: blockSizeOptions, textSize: textSizeOptions, fit: imageFitOptions, position: imagePositionOptions, theme: Object.keys(themeMap) };
    for (const [field, options] of Object.entries(enums)) {
      if (item[field] !== undefined && !options.includes(item[field])) throw new Error(`Unsupported ${field} in presentation.`);
    }
    for (const field of ['link', 'kahootLink']) {
      if (typeof item[field] === 'string' && /^(javascript|vbscript|data):/i.test(item[field].trim())) throw new Error('Use an HTTP or HTTPS quiz link.');
    }
    if (kind === 'image' && item.details !== undefined && typeof item.details !== 'string') throw new Error('Image details must be text.');
    for (const field of ['bullets', 'details']) {
      if (item[field] !== undefined && (!Array.isArray(item[field]) || item[field].some((line) => typeof line !== 'string'))) {
        // Image details are plain text; section details are a list.
        if (field !== 'details' || typeof item[field] !== 'string') throw new Error(`Invalid ${field} in presentation.`);
      }
    }
  };
  for (const field of ['eventTitle', 'groupName', 'date', 'kahootLink']) {
    if (value[field] !== undefined && typeof value[field] !== 'string') throw new Error(`Invalid ${field}.`);
    if (field === 'kahootLink' && /^(javascript|vbscript|data):/i.test((value[field] || '').trim())) throw new Error('Use an HTTP or HTTPS quiz link.');
  }
  checkIds(value.slides, 'Slides');
  for (const slide of value.slides) {
    if (!types.has(slide.type)) throw new Error('Unsupported slide type.');
    checkContent(slide);
    if (slide.notes !== undefined && typeof slide.notes !== "string") throw new Error("Invalid speaker notes.");
    if (slide.sections !== undefined && !Array.isArray(slide.sections)) throw new Error('Invalid slide sections.');
    checkIds(slide.sections || [], 'Sections');
    for (const section of slide.sections || []) {
      checkContent(section);
      if (section.details !== undefined && !Array.isArray(section.details)) throw new Error("Section details must be a list.");
      for (const field of ['images', 'blocks']) {
        if (section[field] !== undefined && !Array.isArray(section[field])) throw new Error(`Invalid ${field}.`);
        checkIds(section[field] || [], field);
        for (const item of section[field] || []) {
          checkContent(item, field === 'images' ? 'image' : 'object');
          if (field === 'blocks' && !blockTypeOptions.includes(item.type)) throw new Error('Unsupported object type.');
          if (item.image !== undefined && item.image !== null) checkContent(item.image, 'image');
        }
      }
    }
  }
  return value;
}

export function downloadFile(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export function safeFilename(title = 'presentation') {
  return title.replace(/[^a-z0-9 _-]/gi, '').trim().replace(/\s+/g, '-').slice(0, 80) || 'presentation';
}
