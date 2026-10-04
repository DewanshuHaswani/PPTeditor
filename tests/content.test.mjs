import test from 'node:test';
import assert from 'node:assert/strict';
import { flattenSlides, legacySectionBlocks } from '../src/utils/layout.js';
import { sectionWithBlocks, convertContentBlock } from '../src/utils/content.js';
import { externalLink } from '../src/utils/navigation.js';

test('all section-based slide types show visible sections and respect page packing', () => {
  for (const type of ['group', 'activity', 'content']) {
    const pages = flattenSlides({ slides: [{ id: 'slide', type, title: 'Title', groupName: 'Team', sections: [
      { id: 'one', title: 'One' }, { id: 'hidden', visible: false },
      { id: 'two', title: 'Two' }, { id: 'paired', fullSlide: false }
    ] }] });
    assert.equal(pages.length, 2);
    assert.deepEqual(pages.map((page) => page.activeSections.map((section) => section.id)), [['one'], ['two', 'paired']]);
    assert.equal(pages[0].originalSlideId, 'slide');
    assert.equal(pages[0].title, type === 'group' ? 'One' : 'Title');
    assert.equal(flattenSlides({ slides: [{ id: 'slide', type, sections: [{ id: 'hidden', visible: false }] }] }).length, 0);
  }
});
test('editing a business summary preserves its expanded details and image settings', () => {
  const section = { id: 'business', layout: 'business-update', text: 'Summary', bullets: ['A', 'B'], details: ['Long A', 'Long B'], images: [{ id: 'image', caption: 'Image', size: 'normal', fit: 'cover', src: '/assets/photo.png' }] };
  const blocks = legacySectionBlocks(section);
  blocks[0] = { ...blocks[0], title: 'Renamed summary', text: 'New summary' };
  blocks[2] = { ...blocks[2], size: 'hero' };
  const result = sectionWithBlocks(section, blocks);
  assert.equal(result.text, 'New summary');
  assert.deepEqual(result.details, ['Long A', 'Long B']);
  assert.equal(result.images[0].size, 'hero');
  assert.equal(result.images[0].fit, 'cover');
  assert.deepEqual(sectionWithBlocks(result, blocks.filter((block) => block.type !== 'bullets')).bullets, []);
  assert.deepEqual(sectionWithBlocks(result, []).details, []);
});
test('converting bullets, text and image objects preserves recoverable content', () => {
  const bullets = { type: 'bullets', bullets: ['One', '', '  Two '], text: '', size: 'normal' };
  const text = convertContentBlock(bullets, 'text');
  assert.equal(text.text, 'One\n\n  Two ');
  const image = convertContentBlock(text, 'image');
  const back = convertContentBlock(image, 'bullets');
  assert.deepEqual(back.bullets, bullets.bullets);
});
test('quiz links normalize valid domains and leave placeholders and executable URLs inactive', () => {
  assert.equal(externalLink(' kahoot.it '), 'https://kahoot.it/');
  assert.equal(externalLink('https://example.com/quiz'), 'https://example.com/quiz');
  for (const link of ['', 'PASTE_KAHOOT_LINK_HERE', 'javascript:alert(1)', 'data:text/html,test', 'https://user:pass@example.com']) assert.equal(externalLink(link), null);
});
