import { validateUrl } from './validator.js';
import { state } from './state.js';
import { fetchRssFeed } from './rssService.js';
import { parseRss } from './rssParser.js';

export const addRssFeed = (url) => {
  console.log('🟢 addRssFeed НАЧАЛО, url =', url);
  state.form.isSubmitting = true;
  state.form.isValid = true;
  state.form.errorMessage = '';

  return validateUrl(url, state.feeds)
    .then(() => fetchRssFeed(url))
    .then(xmlString => parseRss(xmlString))
    .then(({ feed, posts }) => {
      const newFeed = {
        id: Date.now(),
        url: url,
        title: feed.title,
        description: feed.description,
      };
      state.feeds.push(newFeed);

      const postsWithFeedId = posts.map((post, index) => ({
        id: `${newFeed.id}-${index}`,
        feedId: newFeed.id,
        title: post.title,
        link: post.link,
        description: post.description,
      }));
      state.posts.push(...postsWithFeedId);

      state.form.url = '';
      state.form.isValid = true;
      state.form.errorMessage = '';
      state.form.isSuccess = true;
      state.form.isSubmitting = false;
      console.log('   success: isSuccess = true, isSubmitting = false');
      // setTimeout(() => {
      //   state.form.isSuccess = false;
      //   console.log('   success message auto-hidden');
      // }, 5000);
    })
    .catch((err) => {
      state.form.isValid = false;
      state.form.isSubmitting = false;

      if (err.type === 'required') {
        state.form.errorMessage = 'errorEmptyInputMessage';
      } else if (err.type === 'url') {
        state.form.errorMessage = 'errorMessage';
      } else if (err.type === 'unique') {
        state.form.errorMessage = 'errorNotUniqueMessage';
      } else if (err.message === 'Network error') {
        state.form.errorMessage = 'networkError';
      } else if (err.message === 'Invalid RSS format') {
        state.form.errorMessage = 'invalidRss';
      } else {
        state.form.errorMessage = 'errorMessage';
      }
      console.log('   после обработки: errorMessage =', state.form.errorMessage);
    });
};