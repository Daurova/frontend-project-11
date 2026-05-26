import { subscribe } from 'valtio/vanilla';
import { state } from './state.js';
import { addRssFeed } from './model.js';

// DOM элементы
const form = document.getElementById('rss-form');
const urlInput = document.getElementById('rss-url');
const submitButton = document.getElementById('btn');

console.log('🔷 view.js загружен');

const renderForm = () => {
  console.log('🎨 renderForm вызван');

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
    errorDiv.textContent = state.form.errorMessage;
  } else {
    urlInput.classList.remove('is-invalid');
    const errorDiv = urlInput.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('invalid-feedback')) {
      errorDiv.remove();
    }
  }
  
  if (state.form.isSubmitting) {
    submitButton.disabled = true;
    submitButton.textContent = 'Добавление...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = 'Добавить';
  }

  if (state.form.isSuccess) {
    // let successDiv = urlInput.nextElementSibling
   let successDiv = document.createElement('div');
    successDiv.classList.add('success') 
    console.log(state.form.isSuccess)
    urlInput.parentNode.insertBefore(successDiv, urlInput.nextSibling);
    successDiv.textContent = 'RSS успешно загружен'

  }
};

subscribe(state, () => {
  console.log('🔔 SUBSCRIBE сработал');
  renderForm();
});

form.addEventListener('submit', (event) => {
  console.log('📤 1. Событие submit произошло');
  event.preventDefault();
  
  const url = urlInput.value.trim();
  console.log('📤 2. Получен URL:', url);
  
  console.log('📤 3. Сохраняю в state.form.url');
  state.form.url = url;
  
  if (!url) {
    console.log('📤 4. URL пустой → устанавливаю ошибку');
    state.form.isValid = false;
    state.form.errorMessage = 'Не должно быть пустым';
    console.log('📤 5. Выход из обработчика (return)');
    return;
  }
  
  console.log('📤 6. URL не пустой, сейчас вызову addRssFeed');
  console.log('📤 7. Вызов addRssFeed с аргументом:', url);
  
  // Проверка, что addRssFeed определена
  console.log('📤 8. Тип addRssFeed:', typeof addRssFeed);
  
  const result = addRssFeed(url);
  console.log('📤 9. addRssFeed вернула:', result);
  
  console.log('📤 10. Обработчик submit завершен');
});

urlInput.focus();
renderForm();