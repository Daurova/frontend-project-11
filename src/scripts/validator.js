import i18next from '../i18n.js';
import * as yup from 'yup';

export const validateUrl = (url, existingFeeds) => {
  console.log('🔍 validateUrl вызван');
  console.log('   url =', url);
  console.log('   existingFeeds =', existingFeeds.map(feed => feed.url));

  const schema = yup.string()
    .required()
    .test('unique', () => i18next.t('errorNotUniqueMessage'), (value) => {
      console.log('   [test unique] value =', value);
      if (!value) return true;
      const isDuplicate = existingFeeds.some(feed => feed.url === value);
      console.log('   [test unique] isDuplicate =', isDuplicate);
      return !isDuplicate;
    })
    .url();

  return schema.validate(url)
    .then(result => {
      console.log('✅ Валидация успешна, результат:', result);
      return result;
    })
    .catch(error => {
      console.log('❌ Ошибка валидации:', error.message);
      console.log('   Тип ошибки:', error.type);
      throw error;
    });
};