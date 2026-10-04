// Keep editable objects and the business layout on the same source of truth.
export function sectionWithBlocks(section, blocks) {
  const next = { ...section, blocks, objectsEdited: true };
  if (section.layout !== 'business-update') return next;
  const visible = blocks.filter((block) => block.visible !== false);
  const textBlocks = visible.filter((block) => ['text', 'quote', 'metric'].includes(block.type));
  const summary = textBlocks.find((block) => block.role === 'summary') || textBlocks.find((block) => block.title === 'Text') || textBlocks[0];
  const bulletBlock = visible.find((block) => block.type === 'bullets');
  const detailBlocks = textBlocks.filter((block) => block !== summary);
  next.text = summary?.text || '';
  next.bullets = bulletBlock ? bulletBlock.bullets || [] : detailBlocks.map((block) => block.title || block.text || '');
  next.details = bulletBlock ? bulletBlock.details || section.details || [] : detailBlocks.map((block) => block.text || block.title || '');
  next.images = visible.filter((block) => block.type === 'image').map((block) => ({
    ...(block.image || {}), id: block.image?.id || block.id,
    title: block.image?.title ?? block.title ?? '', subtitle: block.image?.subtitle || '',
    details: block.image?.details || '', caption: block.caption ?? block.image?.caption ?? block.title ?? '',
    size: block.size || block.image?.size || 'normal', fit: block.image?.fit || 'contain',
    position: block.image?.position || 'center', expandable: block.image?.expandable !== false
  }));
  return next;
}

export function convertContentBlock(block, type) {
  const text = block.type === 'bullets' ? (block.bullets || []).join('\n') : block.text || '';
  return {
    ...block, type, text,
    bullets: type === 'bullets' && block.type !== 'bullets' ? text.split('\n') : block.bullets || [],
    metricValue: type === 'metric' ? block.metricValue || '01' : block.metricValue || '',
    size: type === 'image' && block.size === 'normal' ? 'wide' : block.size || 'normal',
    textSize: block.textSize || 'md'
  };
}
