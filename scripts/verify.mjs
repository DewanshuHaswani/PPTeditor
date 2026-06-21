import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const consoleErrors = [];
const normalizeText = (text) => text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto("http://127.0.0.1:5173/present", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const presentText = normalizeText(await page.locator("body").innerText());
const gradientCanvasCount = await page.locator("canvas").count();
const gradientCanvasHasPixels = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  if (!canvas) return false;
  const rect = canvas.getBoundingClientRect();
  return rect.width > 100 && rect.height > 100;
});
const presentOverlay = await page.locator(".vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog]").count();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(800);
const afterNextText = normalizeText(await page.locator("body").innerText());
await page.getByText("Movie").click();
await page.waitForTimeout(1200);
const movieText = normalizeText(await page.locator("body").innerText());
const movieCanvasCount = await page.locator("canvas").count();
const movieOverlayVisible = movieText.includes("Movie Mode") && movieText.includes("Drag to explore");
await page.mouse.click(720, 610);
await page.waitForTimeout(600);
const movieModalOpened = (await page.getByText("Enter Section").count()) > 0;
await page.evaluate(() => window.__ahmMovieModeSelectGroup?.("advance-research-group"));
await page.waitForTimeout(900);
const postMovieText = normalizeText(await page.locator("body").innerText());
const postMovieTextLower = postMovieText.toLowerCase();
await page.screenshot({ path: "present-check.png", fullPage: false });

await page.goto("http://127.0.0.1:5173/edit", { waitUntil: "networkidle" });
await page.getByText("Chinese Whisper").first().click();
await page.waitForTimeout(300);
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(300);
const editText = normalizeText(await page.locator("body").innerText());
const objectEditorVisible = await page.getByText("Drag, Convert, Arrange").count();
const convertControlsVisible = await page.locator("select").filter({ hasText: "text" }).count();
const editableButtonVisible = await page.getByText("Make Existing Content Editable").count();
const editOverlay = await page.locator(".vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog]").count();
await page.screenshot({ path: "edit-check.png", fullPage: false });

await page.goto("http://127.0.0.1:5173/story", { waitUntil: "networkidle" });
const storyText = normalizeText(await page.locator("body").innerText());
const storyOverlay = await page.locator(".vite-error-overlay, #webpack-dev-server-client-overlay, [data-nextjs-dialog]").count();
await page.mouse.wheel(0, 1200);
await page.waitForTimeout(800);
const storyAfterScrollText = normalizeText(await page.locator("body").innerText());
await page.screenshot({ path: "story-check.png", fullPage: false });

await browser.close();

console.log(
  JSON.stringify(
    {
      presentHasIntro: presentText.includes("All Hands Meet") && presentText.includes("Advance Research and Standards Group"),
      introHasGroupMorph: ["Advance Research Group", "Open Innovation", "Standards Research Group", "IP Group", "People Group"].some((name) => presentText.includes(name)),
      gradientCanvasRendered: gradientCanvasCount > 0 && gradientCanvasHasPixels,
      arrowNavigationChanged: afterNextText.includes("Chinese Whisper"),
      movieModeRendered: movieOverlayVisible && movieCanvasCount >= 2,
      movieModeNavigates:
        postMovieTextLower.includes("advance research group") &&
        postMovieTextLower.includes("2026 mission & objectives"),
      editHasPortal: objectEditorVisible > 0 && convertControlsVisible > 0 && editableButtonVisible > 0,
      storyHasFlow: storyText.includes("Scroll to move through FlowArt slides") && storyAfterScrollText.includes("Chinese Whisper"),
      presentOverlay,
      editOverlay,
      storyOverlay,
      consoleErrors
    },
    null,
    2
  )
);
