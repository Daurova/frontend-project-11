export const parseRss = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  // Проверка на ошибки парсинга
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid RSS format');
  }

  // Извлечение данных канала
  const title = doc.querySelector('channel > title')?.textContent ?? 'No title';
  const description = doc.querySelector('channel > description')?.textContent ?? '';

  // Извлечение постов (items)
  const items = doc.querySelectorAll('item');
  const posts = Array.from(items).map(item => ({
    title: item.querySelector('title')?.textContent ?? 'No title',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
  }));

  return { feed: { title, description }, posts };
};