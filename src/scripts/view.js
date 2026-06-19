import i18next from '../i18n.js'
import { subscribe } from 'valtio/vanilla';
import { state } from './state.js';
import { addRssFeed } from './model.js';
import { Modal } from 'bootstrap';


// DOM элементы
const form = document.getElementById('rss-form');
const urlInput = document.getElementById('rss-url');
const submitButton = document.getElementById('btn');
const modal = new Modal(document.getElementById('modal-posts'))

console.log('🔷 view.js загружен');

const renderForm = () => {
  const existingFeedbacks = urlInput.parentNode.querySelectorAll('.invalid-feedback, .valid-feedback, .success .feedback');
  existingFeedbacks.forEach(el => el.remove());  

  if (urlInput.value !== state.form.url) {
    urlInput.value = state.form.url;
  }

  if (!state.form.isValid) {
    urlInput.classList.add('is-invalid');
    
    let errorDiv = urlInput.nextElementSibling;
    if (!errorDiv || !errorDiv.classList.contains('invalid-feedback')) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback feedback';
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
    successDiv.classList.add('success feedback') 
    console.log(state.form.isSuccess)
    urlInput.parentNode.insertBefore(successDiv, urlInput.nextSibling);
    successDiv.textContent = i18next.t('successMessage')

  }

document.getElementById('title').textContent = i18next.t('title')  
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
    <div class=" mb-3">
      <div class="">
        <h5 class="">${escapeHtml(feed.title)}</h5>
        <p class="">${escapeHtml(feed.description)}</p>
      </div>
    </div>
  `).join('');

  postsContainer.innerHTML = state.posts.map(post => `
    <div class="mb-2">
      <a href="${escapeHtml(post.link)}" target="_blank" rel="noopener noreferrer" class="${post.isVisited ? 'fw-normal link-secondary': 'fw-bold'}">
        ${escapeHtml(post.title)}
      </a>
      <button class = 'btn-view-posts' id = ${post.id}>${i18next.t('buttonViewPosts')}</button>
    </div>
  `).join('');
   const viewPostsButtons = document.querySelectorAll('.btn-view-posts')
   console.log(viewPostsButtons, 'buttons')

viewPostsButtons.forEach(button => button.addEventListener('click', () => {

    const postToRender = state.posts.filter(post => post.id === button.id)[0]
    console.log(postToRender, 'posttorender', button)
    document.getElementById('modal-title').innerText = postToRender.title
    document.getElementById('modal-body').innerText = postToRender.description ? postToRender.description: i18next.t('noDescription')
    const buttonReadAll = document.getElementById('btn-modal-readAll')
    buttonReadAll.innerText = i18next.t('buttonReadAll')
    buttonReadAll.addEventListener('click',()=>{window.open(postToRender.link)})
    document.getElementById('btn-modal-close').innerText = i18next.t('buttonClose')
    console.log(postToRender, 'posttorender', button)
    postToRender.isVisited = true

    modal.show()
}));


console.log(state.posts[0])
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
};


subscribe(state, () => {
  renderForm();
  renderFeedsAndPosts();
});
urlInput.focus();
renderForm();
renderFeedsAndPosts();
