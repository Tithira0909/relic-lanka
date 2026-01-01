document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('toursSearchInput');

  const loadTours = async (query = '') => {
    const grid = document.getElementById('toursGrid');
    if (!grid) return;

    grid.innerHTML = '<div class="state loading">Loading...</div>';

    try {
      const response = await API.getTours(query);
      render('toursGrid', response, (tour) => {
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
      }, 'No tours found');
    } catch (e) {
      grid.innerHTML = '<div class="state empty">Failed to load tours</div>';
    }
  };

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadTours(e.target.value);
      }, 500);
    });
  }

  loadTours();
});
