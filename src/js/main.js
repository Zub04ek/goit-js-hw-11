import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more');
const anchor = document.querySelector('.js-observer');

let page = 1;
let searchWord = '';
let totalImages = 0;
let imagesArray = [];
let options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
let totalPages = 0;
const limit = 40;
const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `32969662-b8725bfa5831874f5f8e98166`;
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: limit,
});

const lightbox = new SimpleLightbox('.gallery a');
const observer = new IntersectionObserver(onLoad, options);

formRef.addEventListener('submit', onSearch);
btnRef.addEventListener('click', onLoadMore);

btnRef.hidden = true;

async function fetchImages(searchValue) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchValue}&${searchParams}&page=${page}`
  );
  const data = await response.data;

  totalImages = data.totalHits;
  imagesArray = await data.hits;
  totalPages = totalImages / limit;

  if (imagesArray.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    clearImageCards();
    observer.unobserve(anchor);
    btnRef.hidden = true;
    // document.removeEventListener('scroll', onScrollPage);
  }
  return imagesArray;
}

async function onSearch(evt) {
  try {
    evt.preventDefault();

    const { searchQuery } = evt.currentTarget.elements;
    searchWord = searchQuery.value;

    if (searchWord === '' || searchWord.trim() === '') {
      Notiflix.Notify.info('Please enter a word for searching.');
      clearImageCards();
      btnRef.hidden = true;
      return;
    }

    page = 1;

    const images = await fetchImages(searchWord);

    if (imagesArray.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
      btnRef.hidden = false;
      clearImageCards();
      renderImageCards(images);
    }
    if (imagesArray.length === limit) {
      observer.observe(anchor);
      // document.addEventListener('scroll', onScrollPage);
    }
  } catch (err) {
    console.log(err);
  }
}

function renderImageCards(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
              <a href="${largeImageURL}" class="gallery__link">
                <div class="thumb">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                </div>
              </a>
              <div class="info">
                <p class="info-item">
                  <b>Likes</b> ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b> ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b> ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b> ${downloads}
                </p>
              </div>
            </div>`
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearImageCards() {
  galleryRef.innerHTML = '';
}

async function onLoadMore() {
  try {
    if (searchWord === '' || searchWord.trim() === '') {
      clearImageCards();
      btnRef.hidden = true;
      return;
    }

    if (page > totalPages) {
      Notiflix.Notify.failure(
        'We`re sorry, but you`ve reached the end of search results.'
      );
      btnRef.hidden = true;
      return;
    }
    page += 1;
    const images = await fetchImages(searchWord);
    renderImageCards(images);
  } catch (err) {
    console.log(err);
  }
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
      if (page > totalPages) {
        observer.unobserve(anchor);
      }
    }
  });
}

// Функція для сповільнення скролу сторінки

// function onScrollPage() {
//   const { height: cardHeight } =
//     galleryRef.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }
