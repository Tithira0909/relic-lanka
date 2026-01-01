document.addEventListener('DOMContentLoaded', async () => {
  // Load Featured Tours
  try {
    const response = await API.getTours('', 3); // Get 3 items
    render('featuredToursGrid', response, (tour) => {
      const template = document.getElementById('tourCardTemplate');
      const clone = template.content.cloneNode(true);

      const img = clone.querySelector('img');
      img.src = tour.heroImageUrl || '';
      img.onerror = () => { img.src = 'https://via.placeholder.com/400x200?text=No+Image'; };

      clone.querySelector('.card-title').textContent = tour.name;
      clone.querySelector('.card-meta').textContent = `${tour.days} Days / ${tour.nights} Nights`;
      clone.querySelector('.short-desc').textContent = tour.shortDescription;
      clone.querySelector('a').href = `tour.html?slug=${tour.slug}`;
      return clone;
    }, 'No tours available');
  } catch (e) {
    document.getElementById('featuredToursGrid').innerHTML = '<div class="state empty">Failed to load tours</div>';
  }

  // Load Gallery
  try {
    const gallery = await API.getGallery();
    render('homeGalleryGrid', gallery, (item) => {
      const template = document.getElementById('galleryItemTemplate');
      const clone = template.content.cloneNode(true);

      const img = clone.querySelector('img');
      img.src = item.imageUrl;
      img.onerror = () => { img.src = 'https://via.placeholder.com/400x250?text=No+Image'; };

      clone.querySelector('.card-title').textContent = item.title || '';
      clone.querySelector('p').textContent = item.caption || '';
      return clone;
    }, 'No images in gallery');
  } catch (e) {
    document.getElementById('homeGalleryGrid').innerHTML = '<div class="state empty">Failed to load gallery</div>';
  }
});
