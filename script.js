const slides = [...document.querySelectorAll('.deck-slide')];
const tabs = [...document.querySelectorAll('[data-go]')];
const count = document.querySelector('.deck-count b');
let activeSlide = 0;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    const active = i === activeSlide;
    slide.hidden = !active;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  tabs.forEach((tab, i) => {
    const active = i === activeSlide;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  count.textContent = String(activeSlide + 1).padStart(2, '0');
}

document.querySelector('.deck-prev').addEventListener('click', () => showSlide(activeSlide - 1));
document.querySelector('.deck-next').addEventListener('click', () => showSlide(activeSlide + 1));
tabs.forEach((tab) => tab.addEventListener('click', () => showSlide(Number(tab.dataset.go))));
