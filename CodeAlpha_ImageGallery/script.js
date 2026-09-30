const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentFilter = "all";
let currentItems = Array.from(galleryItems);
let currentIndex = 0;

function getFilteredItems() {
  if (currentFilter === "all") {
    return Array.from(galleryItems);
  }

  return Array.from(galleryItems).filter(
    item => item.dataset.category === currentFilter
  );
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach(item => {
      if (currentFilter === "all" || item.dataset.category === currentFilter) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });

    currentItems = getFilteredItems();
  });
});

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    currentItems = getFilteredItems();
    currentIndex = currentItems.indexOf(item);

    if (currentIndex !== -1) {
      openLightbox();
    }
  });
});

function openLightbox() {
  const image = currentItems[currentIndex].querySelector("img");

  lightboxImg.src = image.src;
  lightboxImg.alt = image.alt;
  lightbox.classList.add("show");
}

function closeLightbox() {
  lightbox.classList.remove("show");
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % currentItems.length;
  openLightbox();
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  openLightbox();
}

closeBtn.addEventListener("click", closeLightbox);
nextBtn.addEventListener("click", showNextImage);
prevBtn.addEventListener("click", showPrevImage);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") showNextImage();
  if (event.key === "ArrowLeft") showPrevImage();
});