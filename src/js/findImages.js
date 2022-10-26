import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './getImages';

const refs = {
   searchImagesForm: document.querySelector('.search-form'),
   searchImagesInputEl: document.querySelector('.js-input'),
   galleryEl: document.querySelector('.gallery'),
   loadMoreBtnEl: document.querySelector('.load-more'),
};

let page = 1;


refs.searchImagesForm.addEventListener('submit', onSubmitRender);
refs.loadMoreBtnEl.addEventListener('click', onClickRender);


async function onSubmitRender(evt) {
   evt.preventDefault();
   refs.loadMoreBtnEl.style = 'display: none;';
   page = 1;
   const trimedValue = refs.searchImagesInputEl.value.trim();
   if (trimedValue === '') {
      return;
   }
   const response = await getImages(trimedValue, page);
   const images = await response.data.hits;
   if (images.length === 0) {
      clearMarkup();
      Notiflix.Notify.failure(
         'Sorry, there are no images matching your search query. Please try again.'
      );
   } else {
      clearMarkup();
      renderImageCards(images);
      lightbox.refresh();
      onSubmitScroll();
      refs.loadMoreBtnEl.style = 'display: flex;';
      Notiflix.Notify.success(
         `Hooray! We found ${response.data.totalHits} images.`
      );
   }
}


async function onClickRender() {
   refs.loadMoreBtnEl.style = 'display: none;';
   const trimedValue = refs.searchImagesInputEl.value.trim();
   page += 1;
   const response = await getImages(trimedValue, page);
   const images = await response.data.hits;
   const totalPages = await response.data.totalHits / 40;
   if (page > totalPages) {
      Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtnEl.style = 'display: none;';
   }
   else {
      refs.loadMoreBtnEl.style = 'display: flex;';
   }
   renderImageCards(images);
   lightbox.refresh();
   const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
   window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
   });
}
function onSubmitScroll() {
   window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
   });
}

function renderImageCards(images) {
   const markup = images
      .map(image => {
         return `<div class="photo-card image-link"><a href="${image.largeImageURL}">
  <img src="${image.webformatURL}" 
  data-source="${image.largeImageURL}"
  alt="${image.tags}" 
  title = "${image.tags}"
  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
  </div>
  </a>
</div>`;
      })
      .join('');
   refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
   captionDelay: 250,
   scrollZoom: false,
});

function clearMarkup() {
   refs.galleryEl.innerHTML = '';
}