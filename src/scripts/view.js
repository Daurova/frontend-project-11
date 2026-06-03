import i18next from '../i18n.js'
import { subscribe } from 'valtio/vanilla';
import { state } from './state.js';
import { addRssFeed } from './model.js';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';


// DOM элементы
const form = document.getElementById('rss-form');
const urlInput = document.getElementById('rss-url');
const submitButton = document.getElementById('btn');
const viewPostsButton = document.getElementById('btn-view-posts')

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
  renderFeedsAndPosts()
});

document.getElementById('lang-en').addEventListener('click', () => {
  i18next.changeLanguage('en');
  renderForm();
  renderFeedsAndPosts()
  
});

const renderFeedsAndPosts = () => {
  const feedsContainer = document.getElementById('feeds-container');
  const postsContainer = document.getElementById('posts-container');
  
  document.querySelector('[data-i18n="feedsTitle"]').textContent = i18next.t('feedsTitle');
  document.querySelector('[data-i18n="postsTitle"]').textContent = i18next.t('postsTitle')

  feedsContainer.innerHTML = state.feeds.map(feed => `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${escapeHtml(feed.title)}</h5>
        <p class="card-text">${escapeHtml(feed.description)}</p>
      </div>
    </div>
  `).join('');

  postsContainer.innerHTML = state.posts.map(post => `
    <div class="mb-2">
      <a href="${escapeHtml(post.link)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(post.title)}
      </a>
    </div>
  `).join('');
    
  viewPostsButton.textContent = i18next.t('buttonViewPosts') 

};

viewPostsButton.addEventListener('click', () => {
  // Наполняем модальное окно актуальными постами
  const modalBody = document.getElementById('postsModalBody');
  const modalHeader  = document.getElementById('postsModalHeader')

  modalHeader.textContent = i18next.t('postsTitle')
  if (state.posts.length === 0) {
    modalBody.innerHTML = '<p>Нет загруженных постов.</p>';
  } else {
    const postsList = state.posts.map(post => `
      <div class="mb-2">
        <a href="${escapeHtml(post.link)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(post.title)}
        </a>
      </div>
    `).join('');
    modalBody.innerHTML = postsList;
  }

  // Открываем модалку с помощью Bootstrap
  const modalElement = document.getElementById('postsModal');
  const modal = new Modal(modalElement);
  modal.show();
});

// Функция для защиты от XSS
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}
subscribe(state, () => {
  renderForm();
  renderFeedsAndPosts();
});
urlInput.focus();
renderForm();
renderFeedsAndPosts();
