import type { Page } from '@playwright/test';

export const corsProxy = 'https://allorigins.hexlet.app';

export type MockEntry = {
  url: string;
  body: string;
};

export async function mockRss(page: Page, entries: MockEntry[]) {
  await page.route(`${corsProxy}/**`, (route) => {
    const url = new URL(route.request().url());
    if (url.pathname !== '/get') {
      return route.fulfill({ status: 500 });
    }

    if (!url.searchParams.get('disableCache')) {
      return route.fulfill({ status: 500 });
    }

    const target = url.searchParams.get('url');
    const entry = entries.find((item) => item.url === target);
    if (!entry) {
      return route.fulfill({ status: 500 });
    }

    return route.fulfill({
      status: 200,
      contentType: 'text/xml',
      body: JSON.stringify({ contents: entry.body })
    });
  });
}
