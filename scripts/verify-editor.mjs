import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { unzipSync, strFromU8 } from 'fflate';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = await mkdtemp(path.join(os.tmpdir(), 'ahm-browser-'));
const fixture = {
  eventTitle: 'Verification Deck', kahootLink: '',
  slides: [
    { id: 'intro', type: 'intro', title: 'Saved title survives opening', subtitle: 'Disk is authoritative', heroImage: '/assets/keynote-bg.png', notes: 'Welcome everyone.' },
    { id: 'content', type: 'content', title: 'Editable Content', sections: [{ id: 'section', title: 'Overview', layout: 'auto', text: 'Legacy text', bullets: ['First'], images: [], blocks: [] }] },
    { id: 'timer', type: 'timer', title: 'Round timer' },
    { id: 'group', type: 'group', groupName: 'Business Group', sections: [{ id: 'business', title: 'Update', layout: 'business-update', text: 'Original summary', bullets: ['Original bullet'], details: [], images: [], blocks: [] }] }
  ]
};
await mkdir(path.join(directory, '.local'));
await writeFile(path.join(directory, '.local/presentation.json'), JSON.stringify(fixture));
const port = 5189;
const url = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), ...(process.env.AHM_VERIFY_DEV === '1' ? [] : ['preview']), '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, env: { ...process.env, AHM_DATA_ROOT: directory }, stdio: 'pipe' });
let output = '';
server.stderr.on('data', (chunk) => { output += chunk; });
server.stdout.on('data', (chunk) => { output += chunk; });
let browser;
const errors = [];
const screenshot = path.join(os.tmpdir(), 'ahm-editor-verified.png');
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch(url)).ok) break; } catch { /* Starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : process.platform === 'darwin' ? { executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' } : {}) });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1000 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(60000);
  page.on('dialog', (dialog) => dialog.accept());
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${url}/edit`);
  await page.getByLabel('Title', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Title', { exact: true }).inputValue(), fixture.slides[0].title);
  await page.waitForTimeout(1100);
  assert.equal(JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8')).slides[0].title, fixture.slides[0].title);
  await page.getByRole('button', { name: /Editable Content content/ }).click();
  const bullets = page.getByLabel('Bullet Points (one per line)', { exact: true });
  await bullets.fill('');
  const started = Date.now();
  await bullets.pressSequentially('First line\n\n  Second line \n', { delay: 2 });
  assert.equal(await bullets.inputValue(), 'First line\n\n  Second line \n');
  assert.equal(await bullets.evaluate((el) => document.activeElement === el), true);
  const typingMs = Date.now() - started;
  const legacyText = page.getByLabel('Section Text', { exact: true });
  await legacyText.fill('Text before\n\nText after  ');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  assert.equal(await legacyText.inputValue(), 'Text before\n\nText after  ');
  await page.waitForTimeout(1400);
  const saved = JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8'));
  assert.deepEqual(saved.slides[1].sections[0].bullets, ['First line', '', '  Second line ', '']);
  assert.equal(saved.slides[1].sections[0].text, 'Text before\n\nText after  ');
  const objects = page.getByLabel('Object Text', { exact: true }).first();
  await objects.fill('');
  await objects.pressSequentially('Typing keeps focus and every character.', { delay: 2 });
  assert.equal(await objects.inputValue(), 'Typing keeps focus and every character.');
  assert.equal(await objects.evaluate((el) => document.activeElement === el), true);
  await page.getByLabel('Object Title', { exact: true }).first().fill('Text object');
  const bulletObject = page.getByLabel('Bullet Lines', { exact: true });
  await bulletObject.fill('One\n\n  Two \n');
  assert.equal(await bulletObject.inputValue(), 'One\n\n  Two \n');
  await page.waitForTimeout(700);
  const title = page.getByLabel('Title', { exact: true });
  await title.fill('Undo this title');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  assert.equal(await title.inputValue(), 'Editable Content');
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  assert.equal(await title.inputValue(), 'Undo this title');
  await page.getByRole('button', { name: 'Save to Local File', exact: true }).first().click();
  await page.getByText('Saved on disk · .local/presentation.json', { exact: true }).first().waitFor();
  await page.reload();
  await page.getByRole('button', { name: /Undo this title content/ }).click();
  assert.equal(await page.getByLabel('Object Text', { exact: true }).first().inputValue(), 'Typing keeps focus and every character.');
  const importInput = page.locator('input[type=file][accept="application/json"]');
  await importInput.setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"slides":[]}') });
  await page.getByText('Import failed', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Title', { exact: true }).inputValue(), 'Undo this title');
  // Business summary must clear when the source object is deleted.
  await page.getByRole('button', { name: /Business Group group/ }).click();
  await page.getByLabel('Object Text', { exact: true }).first().fill('Business change');
  await page.locator('label').filter({ hasText: 'Show object' }).first().getByRole('checkbox').uncheck();
  await page.getByRole('button', { name: 'Save to Local File', exact: true }).first().click();
  await page.getByText('Saved on disk · .local/presentation.json', { exact: true }).first().waitFor();
  assert.equal(JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8')).slides[3].sections[0].text, '');
  await page.getByRole('button', { name: /Undo this title content/ }).click();
  await page.screenshot({ path: screenshot });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Mobile editor should not overflow horizontally');
  await page.setViewportSize({ width: 1440, height: 900 });
  const downloadPromise = page.waitForEvent('download', { timeout: 60000 });
  await page.getByRole('button', { name: 'Export Web ZIP' }).click();
  const download = await downloadPromise;
  const zipPath = path.join(directory, 'presentation.zip');
  await download.saveAs(zipPath);
  const zipBytes = await readFile(zipPath);
  const files = unzipSync(zipBytes);
  assert.ok(files['Open Presentation.html'] && files['presentation.json'] && files['READ ME.txt']);
  assert.ok(JSON.parse(strFromU8(files['presentation.json'])).slides[0].heroImage.startsWith('data:image/'), 'Editable ZIP data includes its own image bytes');
  const htmlPath = path.join(directory, 'Open Presentation.html');
  await writeFile(htmlPath, files['Open Presentation.html']);
  assert.match(strFromU8(files['Open Presentation.html']), /Typing keeps focus/);
  const offline = await browser.newContext({ viewport: { width: 1440, height: 900 }, offline: true });
  const viewer = await offline.newPage();
  viewer.setDefaultTimeout(30000);
  viewer.setDefaultNavigationTimeout(60000);
  viewer.on('pageerror', (error) => errors.push(error.message));
  await viewer.goto(pathToFileURL(htmlPath).href);
  await viewer.getByLabel('Jump to slide').waitFor();
  assert.equal(await viewer.getByLabel('Jump to slide').locator('option').count(), 4);
  const hero = viewer.locator('img').first();
  await hero.waitFor();
  assert.ok(await hero.evaluate((image) => image.complete && image.naturalWidth > 0), 'Bundled hero image loads offline');
  await viewer.keyboard.press('ArrowRight');
  assert.equal(await viewer.getByLabel('Jump to slide').inputValue(), '1');
  assert.ok((await viewer.locator('body').innerText()).includes('Typing keeps focus'));
  await viewer.getByLabel('Jump to slide').selectOption('2');
  await viewer.getByRole('button', { name: '1 min', exact: true }).click();
  await viewer.getByRole('button', { name: 'Start', exact: true }).click();
  await viewer.waitForTimeout(1300);
  assert.match(await viewer.getByRole('timer').innerText(), /00:5[89]/);
  await viewer.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await viewer.getByRole('timer').innerText();
  await viewer.waitForTimeout(1100);
  assert.equal(await viewer.getByRole('timer').innerText(), paused);
  await viewer.getByRole('button', { name: '+30 sec', exact: true }).click();
  assert.match(await viewer.getByRole('timer').innerText(), /01:2[89]/);
  await viewer.getByRole('button', { name: 'Reset', exact: true }).click();
  assert.equal(await viewer.getByRole('timer').innerText(), '01:00');
  await viewer.getByRole('button', { name: 'Notes', exact: true }).click();
  await viewer.getByRole('dialog', { name: 'Speaker notes' }).waitFor();
  await viewer.keyboard.press('Escape');
  assert.equal(await viewer.getByRole('dialog').count(), 0);
  await viewer.locator('body').click({ position: { x: 10, y: 10 } });
  await viewer.keyboard.press('b');
  await viewer.getByRole('button', { name: 'Resume presentation' }).waitFor();
  await viewer.keyboard.press('Escape');
  assert.equal(await viewer.getByRole('button', { name: 'Resume presentation' }).count(), 0);
  await viewer.getByRole('button', { name: 'Story', exact: true }).click();
  await viewer.getByText('Scroll to move through FlowArt slides').waitFor();
  await viewer.mouse.wheel(0, 1000);
  await viewer.waitForTimeout(1000);
  assert.ok((await viewer.locator('body').innerText()).includes('Typing keeps focus'), 'Visible Story slide mounts after scrolling');
  await viewer.getByRole('button', { name: 'Presentation', exact: true }).click();
  await viewer.getByRole('button', { name: 'Movie', exact: true }).click();
  await viewer.getByText('Movie Mode', { exact: true }).waitFor();
  await viewer.waitForTimeout(1000);
  assert.equal(await viewer.locator('[data-movie-target]').count(), 1, 'Movie mode uses groups in the current deck');
  await viewer.locator('[data-movie-target="group"]').click();
  assert.equal(await viewer.getByLabel('Jump to slide').inputValue(), '3', 'Movie cards navigate custom group IDs');
  await viewer.getByRole('button', { name: 'Movie', exact: true }).click();
  await viewer.screenshot({ path: path.join(os.tmpdir(), 'ahm-offline-verified.png') });
  await viewer.close();
  // A static hosted deployment also needs a real local download fallback.
  const hostedContext = await browser.newContext({ acceptDownloads: true });
  const hosted = await hostedContext.newPage();
  hosted.setDefaultTimeout(30000);
  hosted.setDefaultNavigationTimeout(60000);
  await hosted.addInitScript(() => Object.defineProperty(window, 'showSaveFilePicker', { value: undefined }));
  await hosted.route('**/api/presentation', (route) => route.fulfill({ status: 404, contentType: 'text/html', body: 'Not found' }));
  await hosted.goto(`${url}/edit`);
  await hosted.getByLabel('Title', { exact: true }).fill('Hosted local download');
  const jsonDownloadPromise = hosted.waitForEvent('download');
  await hosted.getByRole('button', { name: 'Save to Local File', exact: true }).first().click();
  const jsonDownload = await jsonDownloadPromise;
  const jsonPath = path.join(directory, 'hosted.json');
  await jsonDownload.saveAs(jsonPath);
  assert.equal(JSON.parse(await readFile(jsonPath, 'utf8')).slides[0].title, 'Hosted local download');
  await hosted.waitForTimeout(900);
  await hosted.reload();
  await hosted.getByLabel('Title', { exact: true }).waitFor();
  assert.equal(await hosted.getByLabel('Title', { exact: true }).inputValue(), 'Hosted local download', 'Browser recovery survives reload without a local server');
  await hosted.unroute('**/api/presentation');
  await hosted.route('**/api/presentation', (route) => route.abort());
  await hosted.reload();
  await hosted.getByLabel('Title', { exact: true }).waitFor();
  assert.equal(await hosted.getByLabel('Title', { exact: true }).inputValue(), 'Hosted local download', 'Network failure must recover the browser backup');
  await hostedContext.close();

  const moreDeck = {
    eventTitle: 'Additional regressions', slides: [
      { id: 'multi', type: 'activity', title: 'Multiple sections', sections: [
        { id: 'first', title: 'First', layout: 'text-cards', text: 'First visible section' },
        { id: 'hide', visible: false, text: 'HIDDEN SECTION MUST NOT APPEAR' },
        { id: 'second', title: 'Second', text: 'Second visible section' },
        { id: 'paired', title: 'Paired', fullSlide: false, text: 'Paired visible section' }
      ] },
      { id: 'mixed', type: 'content', title: 'Many objects', sections: [{ id: 'mixed-section', layout: 'auto', blocks: [
        { id: 'picture', type: 'image', image: { id: 'picture-image', src: '/assets/movie-mode/people-group.png', caption: 'Offline section image' } },
        ...Array.from({ length: 7 }, (_, index) => ({ id: `object-${index}`, type: 'text', title: `Object ${index + 1}`, text: `Content ${index + 1}` }))
      ] }] },
      { id: 'hidden', type: 'content', title: 'Hidden objects', sections: [{ id: 'hidden-section', text: 'LEGACY TEXT MUST NOT LEAK', blocks: [{ id: 'hidden-block', type: 'text', text: 'HIDDEN OBJECT MUST NOT APPEAR', visible: false }] }] },
      { id: 'custom-group', type: 'group', groupName: 'Custom team', sections: [{ id: 'business', title: 'Business', layout: 'business-update', text: 'Summary', bullets: ['A', 'B'], details: ['Long detail A', 'Long detail B'], images: [{ id: 'business-cover', src: '/assets/movie-mode/people-group.png', caption: 'Business cover', fit: 'cover' }] }] },
      { id: 'quiz', type: 'quiz', title: 'Quiz without link', link: 'PASTE_KAHOOT_LINK_HERE' }
    ]
  };
  await page.locator('input[type=file][accept="application/json"]').setInputFiles({ name: 'regressions.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(moreDeck)) });
  await page.getByRole('button', { name: /Custom team group/ }).click();
  await page.getByLabel('Object Text', { exact: true }).first().fill('Edited summary');
  const detailField = page.getByLabel('Bullet Details (separate cards with ---)', { exact: true });
  assert.equal(await detailField.inputValue(), 'Long detail A\n---\nLong detail B');
  await detailField.fill('Updated detail A\n---\nUpdated detail B');
  await page.getByLabel('Object Title', { exact: true }).first().fill('Renamed summary');
  await page.getByRole('button', { name: 'Save to Local File', exact: true }).first().click();
  await page.getByText('Saved on disk · .local/presentation.json', { exact: true }).first().waitFor();
  const live = await context.newPage();
  live.setDefaultTimeout(30000);
  live.setDefaultNavigationTimeout(60000);
  live.on('pageerror', (error) => errors.push(error.message));
  await live.goto(`${url}/present`);
  await live.getByLabel('Jump to slide').waitFor();
  assert.equal(await live.getByLabel('Jump to slide').locator('option').count(), 6);
  assert.ok((await live.locator('body').innerText()).includes('First visible section'));
  assert.ok(!(await live.locator('body').innerText()).includes('HIDDEN SECTION MUST NOT APPEAR'));
  await live.getByRole('button', { name: 'Next slide', exact: true }).click();
  assert.ok((await live.locator('body').innerText()).includes('Second visible section'));
  assert.ok((await live.locator('body').innerText()).includes('Paired visible section'));
  await live.keyboard.press('ArrowRight');
  assert.equal(await live.getByLabel('Jump to slide').inputValue(), '2', 'Arrow navigation must work after clicking Next');
  await live.getByText('Content 7', { exact: true }).scrollIntoViewIfNeeded();
  assert.ok(await live.getByText('Content 7', { exact: true }).isVisible());
  assert.ok(!(await live.locator('body').innerText()).includes('Editable Placeholder'));
  await live.getByLabel('Jump to slide').selectOption('3');
  assert.ok(!(await live.locator('body').innerText()).includes('LEGACY TEXT MUST NOT LEAK'));
  assert.ok(!(await live.locator('body').innerText()).includes('HIDDEN OBJECT MUST NOT APPEAR'));
  await live.getByLabel('Jump to slide').selectOption('4');
  assert.equal(await live.getByRole('img', { name: 'Business cover', exact: true }).evaluate((image) => image.style.objectFit), 'cover', 'Business images must honor the selected fit');
  await live.getByRole('button', { name: /01 A/ }).click();
  await live.getByRole('dialog', { name: 'Expanded content' }).waitFor();
  assert.ok((await live.getByRole('dialog').innerText()).includes('Updated detail A'));
  await live.keyboard.press('Escape');
  await live.getByLabel('Jump to slide').selectOption('5');
  assert.ok((await live.locator('body').innerText()).includes('Add a valid quiz link'));
  await live.getByRole('button', { name: 'Movie', exact: true }).click();
  await live.getByRole('dialog', { name: 'Movie Mode', exact: true }).waitFor({ timeout: 60000 });
  await live.locator('[data-movie-target="custom-group"]').click();
  assert.equal(await live.getByLabel('Jump to slide').inputValue(), '4');
  await live.close();

  const secondDownloadPromise = page.waitForEvent('download', { timeout: 60000 });
  await page.getByRole('button', { name: 'Export Web ZIP' }).click();
  const secondDownload = await secondDownloadPromise;
  const secondZipPath = path.join(directory, 'more.zip');
  await secondDownload.saveAs(secondZipPath);
  const moreFiles = unzipSync(await readFile(secondZipPath));
  const editable = JSON.parse(strFromU8(moreFiles['presentation.json']));
  assert.ok(editable.slides[1].sections[0].blocks[0].image.src.startsWith('data:image/'));
  const moreHtmlPath = path.join(directory, 'More.html');
  await writeFile(moreHtmlPath, moreFiles['Open Presentation.html']);
  const moreViewer = await offline.newPage();
  moreViewer.on('pageerror', (error) => errors.push(error.message));
  await moreViewer.goto(pathToFileURL(moreHtmlPath).href);
  await moreViewer.getByLabel('Jump to slide').selectOption('2');
  const sectionImage = moreViewer.getByRole('img', { name: 'Offline section image', exact: true });
  await sectionImage.waitFor();
  assert.ok(await sectionImage.evaluate((image) => image.complete && image.naturalWidth > 0), 'Images in sections load from the ZIP offline');
  assert.ok((await moreViewer.locator('body').innerText()).includes('Content 7'));
  await moreViewer.getByLabel('Jump to slide').selectOption('4');
  assert.equal(await moreViewer.getByRole('img', { name: 'Business cover', exact: true }).evaluate((image) => image.style.objectFit), 'cover', 'The offline viewer also honors business image fit');
  await moreViewer.close();

  await page.getByRole('button', { name: /Multiple sections activity/ }).click();
  await page.route('**/api/presentation', (route) => route.request().method() === 'PUT' ? route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"Simulated disk save failure"}' }) : route.continue());
  await page.getByLabel('Title', { exact: true }).fill('Recover latest unsaved changes');
  await page.getByText('Simulated disk save failure', { exact: true }).waitFor();
  await page.reload();
  await page.getByLabel('Title', { exact: true }).waitFor();
  assert.equal(await page.getByLabel('Title', { exact: true }).inputValue(), 'Recover latest unsaved changes', 'Pending browser changes must beat the older disk copy after a failed save');
  await page.unroute('**/api/presentation');
  await page.getByRole('button', { name: 'Save to Local File', exact: true }).first().click();
  await page.getByText('Saved on disk · .local/presentation.json', { exact: true }).first().waitFor();
  assert.equal(JSON.parse(await readFile(path.join(directory, '.local/presentation.json'), 'utf8')).slides[0].title, 'Recover latest unsaved changes');
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log(JSON.stringify({ diskSaveAndReload: true, typingAndWhitespace: true, typingMs, stableObjectFocus: true, undoRedo: true, invalidImportRejected: true, mobileFits: true, businessContentClears: true, offlineZip: true, zipMB: +(zipBytes.length / 1024 / 1024).toFixed(1), offlineImagesAndNavigation: true, timerControls: true, notesAndBlankScreen: true, offlineStoryAndMovie: true, hostedDownloadAndRecovery: true, allSectionsVisible: true, noTruncatedObjects: true, preservedBusinessDetails: true, customMovieGroups: true, offlineSectionImages: true, networkBackupRecovery: true, failedDiskSaveRecovery: true, errors, screenshot }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ browserErrors: errors }, null, 2));
  throw error;
} finally {
  await browser?.close();
  server.kill('SIGTERM');
  await rm(directory, { recursive: true, force: true });
}
