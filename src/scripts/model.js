import { validateUrl } from './validator.js';
import { state } from './state.js';

export const addRssFeed = (url) => {
  console.log('🟢 addRssFeed НАЧАЛО, url =', url);
  console.log('   текущий state.form.isSubmitting =', state.form.isSubmitting);
  state.form.isSubmitting = true;

  return validateUrl(url, state.feeds)
    .then(() => {
      console.log('✅ validateUrl УСПЕХ');
      state.feeds.push({ id: Date.now(), url });
      state.form.url = '';
      state.form.isValid = true;
      state.form.errorMessage = '';
      state.form.isSuccess = true;
      state.form.isSubmitting = false;
      console.log('   success: isSuccess = true, isSubmitting = false');
      setTimeout(() => {
        state.form.isSuccess = false;
        console.log('   success message auto-hidden');
      }, 2000);
    })
    .catch((err) => {
      console.log('❌ validateUrl ОШИБКА:', err);
      console.log('   err.type =', err.type);
      state.form.isValid = false;
      if (err.type === 'required') state.form.errorMessage = 'errorEmptyInputMessage';
      else if (err.type === 'url') state.form.errorMessage = 'errorMessage';
      else if (err.type === 'unique') state.form.errorMessage = 'errorNotUniqueMessage';
      else state.form.errorMessage = 'errorMessage';
      state.form.isSubmitting = false;
      console.log('   после обработки: errorMessage =', state.form.errorMessage);
    });
};