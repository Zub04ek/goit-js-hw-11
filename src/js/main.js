import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { limit, fetchImages } from './fetch-images';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
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

const lightbox = new SimpleLightbox('.gallery a');
const observer = new IntersectionObserver(onLoad, options);

formRef.addEventListener('submit', onSearch);

async function onSearch(evt) {
  try {
    evt.preventDefault();

    const { searchQuery } = evt.currentTarget.elements;
    searchWord = searchQuery.value;

    if (searchWord === '' || searchWord.trim() === '') {
      Notiflix.Notify.info('Please enter a word for searching.');
      clearImageCards();
      return;
    }

    page = 1;

    const { hits, totalHits } = await fetchImages(searchWord, page);
    imagesArray = hits;
    totalImages = totalHits;
    totalPages = totalImages / limit;

    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImageCards();
      observer.unobserve(anchor);
    }

    if (imagesArray.length > 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
      clearImageCards();
      renderImageCards(imagesArray);
      observer.observe(anchor);
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
      return;
    }

    if (page > totalPages) {
      Notiflix.Notify.failure(
        'We`re sorry, but you`ve reached the end of search results.'
      );
      return;
    }
    page += 1;

    const { hits, totalHits } = await fetchImages(searchWord, page);
    imagesArray = hits;
    totalImages = totalHits;
    totalPages = totalImages / limit;

    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImageCards();
      observer.unobserve(anchor);
    }
    renderImageCards(imagesArray);
    if (totalImages <= page * limit) {
      Notiflix.Notify.failure(
        'We`re sorry, but you`ve reached the end of search results.'
      );
      return;
    }
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
