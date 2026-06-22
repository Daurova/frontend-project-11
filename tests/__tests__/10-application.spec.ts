import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import { corsProxy, mockRss } from './helpers/mock-rss';
import { ui } from './locale/ru';
import { RssReaderPage } from './pages/rss-reader-page';

const readFixture = (filename: string) =>
  fs.readFileSync(
    new URL(`../__fixtures__/${filename}`, import.meta.url),
    'utf-8'
  );

const rss1 = readFixture('rss1.xml');
const rssUrl = 'https://example-rss.test/feed.rss';

const html = readFixture('document.html');
const htmlUrl = 'https://ru.hexlet.io';

let rss: RssReaderPage;

test.beforeEach(async ({ page }) => {
  rss = new RssReaderPage(page);
  await rss.open();
});

test('adding', async ({ page }) => {
  await mockRss(page, [{ url: rssUrl, body: rss1 }]);

  await rss.submitRss(rssUrl);

  await expect(rss.feedback()).toContainText(ui.feedback.success);
});

test('validation (unique)', async ({ page }) => {
  await mockRss(page, [{ url: rssUrl, body: rss1 }]);

  await rss.submitRss(rssUrl);
  await expect(rss.feedback()).toContainText(ui.feedback.success);

  await rss.submitRss(rssUrl);
  await expect(rss.feedback()).toContainText(ui.feedback.exists);
});

test('validation (valid url)', async () => {
  await rss.submitRss('wrong');
  await expect(rss.feedback()).toContainText(ui.feedback.invalidUrl);
});

test('handling non-rss url', async ({ page }) => {
  await mockRss(page, [{ url: htmlUrl, body: html }]);

  await rss.submitRss(htmlUrl);

  await expect(rss.feedback()).toContainText(ui.feedback.noRss);
});

test('handling network error', async ({ page }) => {
  await page.route(`${corsProxy}/**`, (route) =>
    route.abort('internetdisconnected')
  );

  await rss.submitRss(rssUrl);

  await expect(rss.feedback()).toContainText(ui.feedback.network);
});

test.describe('load feeds', () => {
  test('render feed and posts', async ({ page }) => {
    await mockRss(page, [{ url: rssUrl, body: rss1 }]);

    await rss.submitRss(rssUrl);

    await expect(rss.feedTitle(ui.feed.title)).toBeVisible();
    await expect(rss.feedDescription(ui.feed.description)).toBeVisible();
    await expect(rss.postLink(ui.posts.aggregation)).toBeVisible();
    await expect(rss.postLink(ui.posts.traversal)).toBeVisible();
  });
});

test('modal', async ({ page }) => {
  await mockRss(page, [{ url: rssUrl, body: rss1 }]);

  await rss.submitRss(rssUrl);

  const postTitle = rss.postLink(ui.posts.aggregation);
  const previewButton = rss.postPreviewButton(ui.posts.aggregation);

  await expect(postTitle).toHaveClass(/fw-bold/);

  await previewButton.click();

  await expect(rss.modal()).toBeVisible();
  await expect(rss.modalBody()).toContainText(ui.posts.modalDescription);

  await rss.modalCloseButton().click();

  await expect(rss.modal()).toBeHidden();
  await expect(postTitle).toHaveClass(/link-secondary/);
});
