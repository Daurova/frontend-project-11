import i18next from '../i18n.js'
import { subscribe } from 'valtio/vanilla';
import { state } from './state.js';
import { addRssFeed } from './model.js';

// DOM элементы
const form = document.getElementById('rss-form');
const urlInput = document.getElementById('rss-url');
const submitButton = document.getElementById('btn');

console.log('🔷 view.js загружен');

const renderForm = () => {
  const existingFeedbacks = urlInput.parentNode.querySelectorAll('.invalid-feedback, .valid-feedback, .success');
  existingFeedbacks.forEach(el => el.remove());  

  if (urlInput.value !== state.form.url) {
    urlInput.value = state.form.url;
  }

  if (!state.form.isValid) {
    urlInput.classList.add('is-invalid');
    
    let errorDiv = urlInput.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      urlInput.parentNode.insertBefore(errorDiv, urlInput.nextSibling);
    }
    errorDiv.textContent = i18next.t(state.form.errorMessage);
  } else {
    urlInput.classList.remove('is-invalid');
    const errorDiv = urlInput.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
      errorDiv.remove();
    }
  }
  
  if (state.form.isSubmitting) {
    submitButton.disabled = true;
    submitButton.textContent = i18next.t('buttonLoadingText')
  } else {
    submitButton.disabled = false;
    submitButton.textContent = i18next.t('buttonText');
  }

  if (state.form.isSuccess) {
    // let successDiv = urlInput.nextElementSibling
   let successDiv = document.createElement('div');
    successDiv.classList.add('success') 
    console.log(state.form.isSuccess)
    urlInput.parentNode.insertBefore(successDiv, urlInput.nextSibling);
    successDiv.textContent = i18next.t('successMessage')

  }

document.getElementById('slogan').textContent = i18next.t('slogan');
document.getElementById('example').textContent = i18next.t('example');
urlInput.placeholder = i18next.t('inputPlaceholder');
};

subscribe(state, () => {
  renderForm();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const url = urlInput.value.trim();
 
  state.form.url = url;
  
  if (!url) {
    state.form.isValid = false;
    state.form.errorMessage =  'errorEmptyInputMessage';
    return;
  }
  
 
  
  
  const result = addRssFeed(url);
  console.log('📤 9. addRssFeed вернула:', result);
  
  console.log('📤 10. Обработчик submit завершен');
});

document.getElementById('lang-ru').addEventListener('click', () => {
  i18next.changeLanguage('ru');
  renderForm(); // перерендер
});

document.getElementById('lang-en').addEventListener('click', () => {
  i18next.changeLanguage('en');
  renderForm();
});

urlInput.focus();
renderForm();