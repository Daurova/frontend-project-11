import type { Locator } from '@playwright/test';
import { ui } from '../locale/ru';
import { BasePage } from './base-page';

export class RssReaderPage extends BasePage {
  async open() {
    await this.goto('/');
  }

  urlInput(): Locator {
    return this.page.locator('input[aria-label="url"]');
  }

  submitButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  feedback(): Locator {
    return this.page.locator('.feedback');
  }

  feedsSection(): Locator {
    return this.page.locator('.feeds');
  }

  postsSection(): Locator {
    return this.page.locator('.posts');
  }

  feedTitle(title: string): Locator {
    return this.feedsSection().getByRole('heading', { name: title, level: 3 });
  }

  feedDescription(text: string): Locator {
    return this.feedsSection().getByText(text);
  }

  postLink(title: string): Locator {
    return this.postsSection().getByRole('link', { name: title });
  }

  postPreviewButton(title: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('link', { name: title }) })
      .getByRole('button', { name: ui.buttons.preview });
  }

  modal(): Locator {
    return this.page.locator('#modal');
  }

  modalBody(): Locator {
    return this.modal().locator('.modal-body');
  }

  modalCloseButton(): Locator {
    return this.modal().locator('[data-bs-dismiss="modal"]').first();
  }

  modalFullArticleLink(): Locator {
    return this.modal().getByRole('link', { name: ui.buttons.readFull });
  }

  async submitRss(url: string) {
    await this.urlInput().fill(url);
    await this.submitButton().click();
  }
}
