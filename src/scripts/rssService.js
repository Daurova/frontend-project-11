import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

export const fetchRssFeed = (url) => {
  const encodedUrl = encodeURIComponent(url);
  const requestUrl = `${PROXY_URL}?url=${encodedUrl}&disableCache=true`;
  return axios.get(requestUrl)
    .then(response => {
      // Мок возвращает { contents: '...' }, реальный прокси тоже
      if (response.data?.contents) {
        return response.data.contents;
      }
      throw new Error('Network error');
    })
    .catch(() => {
      throw new Error('Network error');
    });
};