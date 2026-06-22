# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 10-application.spec.ts >> modal
- Location: tests\__tests__\10-application.spec.ts:80:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('#modal').locator('.modal-body')
Expected substring: "Цель: Научиться извлекать из дерева необходимые данные"
Received string:    ""
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('#modal').locator('.modal-body')
    14 × locator resolved to <p id="modal-body" class="modal-body"></p>
       - unexpected value ""

```

```yaml
- paragraph
```

# Test source

```ts
  1   | import fs from 'node:fs';
  2   | import { expect, test } from '@playwright/test';
  3   | import { corsProxy, mockRss } from './helpers/mock-rss';
  4   | import { ui } from './locale/ru';
  5   | import { RssReaderPage } from './pages/rss-reader-page';
  6   | 
  7   | const readFixture = (filename: string) =>
  8   |   fs.readFileSync(
  9   |     new URL(`../__fixtures__/${filename}`, import.meta.url),
  10  |     'utf-8'
  11  |   );
  12  | 
  13  | const rss1 = readFixture('rss1.xml');
  14  | const rssUrl = 'https://example-rss.test/feed.rss';
  15  | 
  16  | const html = readFixture('document.html');
  17  | const htmlUrl = 'https://ru.hexlet.io';
  18  | 
  19  | let rss: RssReaderPage;
  20  | 
  21  | test.beforeEach(async ({ page }) => {
  22  |   rss = new RssReaderPage(page);
  23  |   await rss.open();
  24  | });
  25  | 
  26  | test('adding', async ({ page }) => {
  27  |   await mockRss(page, [{ url: rssUrl, body: rss1 }]);
  28  | 
  29  |   await rss.submitRss(rssUrl);
  30  | 
  31  |   await expect(rss.feedback()).toContainText(ui.feedback.success);
  32  | });
  33  | 
  34  | test('validation (unique)', async ({ page }) => {
  35  |   await mockRss(page, [{ url: rssUrl, body: rss1 }]);
  36  | 
  37  |   await rss.submitRss(rssUrl);
  38  |   await expect(rss.feedback()).toContainText(ui.feedback.success);
  39  | 
  40  |   await rss.submitRss(rssUrl);
  41  |   await expect(rss.feedback()).toContainText(ui.feedback.exists);
  42  | });
  43  | 
  44  | test('validation (valid url)', async () => {
  45  |   await rss.submitRss('wrong');
  46  |   await expect(rss.feedback()).toContainText(ui.feedback.invalidUrl);
  47  | });
  48  | 
  49  | test('handling non-rss url', async ({ page }) => {
  50  |   await mockRss(page, [{ url: htmlUrl, body: html }]);
  51  | 
  52  |   await rss.submitRss(htmlUrl);
  53  | 
  54  |   await expect(rss.feedback()).toContainText(ui.feedback.noRss);
  55  | });
  56  | 
  57  | test('handling network error', async ({ page }) => {
  58  |   await page.route(`${corsProxy}/**`, (route) =>
  59  |     route.abort('internetdisconnected')
  60  |   );
  61  | 
  62  |   await rss.submitRss(rssUrl);
  63  | 
  64  |   await expect(rss.feedback()).toContainText(ui.feedback.network);
  65  | });
  66  | 
  67  | test.describe('load feeds', () => {
  68  |   test('render feed and posts', async ({ page }) => {
  69  |     await mockRss(page, [{ url: rssUrl, body: rss1 }]);
  70  | 
  71  |     await rss.submitRss(rssUrl);
  72  | 
  73  |     await expect(rss.feedTitle(ui.feed.title)).toBeVisible();
  74  |     await expect(rss.feedDescription(ui.feed.description)).toBeVisible();
  75  |     await expect(rss.postLink(ui.posts.aggregation)).toBeVisible();
  76  |     await expect(rss.postLink(ui.posts.traversal)).toBeVisible();
  77  |   });
  78  | });
  79  | 
  80  | test('modal', async ({ page }) => {
  81  |   await mockRss(page, [{ url: rssUrl, body: rss1 }]);
  82  | 
  83  |   await rss.submitRss(rssUrl);
  84  | 
  85  |   const postTitle = rss.postLink(ui.posts.aggregation);
  86  |   const previewButton = rss.postPreviewButton(ui.posts.aggregation);
  87  | 
  88  |   await expect(postTitle).toHaveClass(/fw-bold/);
  89  | 
  90  |   await previewButton.click();
  91  | 
  92  |   await expect(rss.modal()).toBeVisible();
> 93  |   await expect(rss.modalBody()).toContainText(ui.posts.modalDescription);
      |                                 ^ Error: expect(locator).toContainText(expected) failed
  94  | 
  95  |   await rss.modalCloseButton().click();
  96  | 
  97  |   await expect(rss.modal()).toBeHidden();
  98  |   await expect(postTitle).toHaveClass(/link-secondary/);
  99  | });
  100 | 
```