import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

export const fetchRssFeed = (url) => {
  const isLocal = url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1') || url.startsWith('/');
  if (isLocal) {
    return axios.get(url).then(response => {
      if (response.status !== 200) {
        throw new Error('Network error');
      }
      return response.data;
    });
  }
  
  const encodedUrl = encodeURIComponent(url);
  const requestUrl = `${PROXY_URL}?url=${encodedUrl}&disableCache=true`;
  return axios.get(requestUrl).then(response => {
    if (response.data.status?.http_code !== 200) {
      throw new Error('Network error');
    }
    return response.data.contents;
  });
};