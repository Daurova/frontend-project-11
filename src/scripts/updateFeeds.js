import { fetchRssFeed } from "./rssService";
import { parseRss } from "./rssParser";
import { state } from "./state";

const updateFeed = (feed) => {
    return fetchRssFeed(feed.url)
       .then(xmlString=>parseRss(xmlString))
       .then(({posts}) => {
         const existingIds = new Set(state.posts.map(p => p.link)); // или используйте id, если он уникален
         const newPosts = posts.filter(post => !existingIds.has(post.link));
      
         if (newPosts.length > 0) {
         const postsWithFeedId = newPosts.map((post, index) => ({
          id: `${feed.id}-${Date.now()}-${index}`,
          feedId: feed.id,
          title: post.title,
          link: post.link,
        }));
        state.posts.push(...postsWithFeedId);
        console.log(`Добавлено ${newPosts.length} новых постов в фид "${feed.title}"`);
       }})
       .catch((error)=>console.warn(`Ошибка обновления фида ${feed.url}:`, error.message))
}

const updateAllFeeds = () => {
  const feeds = state.feeds;
  if (feeds.length === 0) {
    scheduleNextUpdate();
    return;
  }
  
  Promise.all(feeds.map(feed => updateFeed(feed)))
    .then(() => scheduleNextUpdate())
    .catch(() => scheduleNextUpdate()); // даже при ошибке планируем дальше
};

const scheduleNextUpdate = () => {
  setTimeout(updateAllFeeds, 5000);
};

export default updateAllFeeds