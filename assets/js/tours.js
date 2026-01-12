document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('toursSearchInput');

  const loadTours = async (query = '') => {
    const grid = document.getElementById('toursGrid');
    if (!grid) return;

    // Preserve loading state styling
    grid.innerHTML = '<div class="state loading">Loading amazing journeys...</div>';

    try {
      const response = await API.getTours(query);
      render('toursGrid', response, (tour) => {
        const template = document.getElementById('tourCardTemplate');
        const clone = template.content.cloneNode(true);

        const img = clone.querySelector('.tour-card-img');
        if (img) {
            img.src = tour.heroImageUrl || 'images/destination-1.jpg'; // Better fallback
            img.onerror = () => { img.src = 'images/destination-1.jpg'; };
        }

        const titleEl = clone.querySelector('.tour-card-title');
        if (titleEl) titleEl.textContent = tour.name;

        const durationEl = clone.querySelector('.duration-text');
        if (durationEl) durationEl.textContent = `${tour.days} Days / ${tour.nights} Nights`;

        const descEl = clone.querySelector('.tour-card-desc');
        if (descEl) descEl.textContent = tour.shortDescription;

        const linkEl = clone.querySelector('a');
        if (linkEl) linkEl.href = `tour.html?slug=${tour.slug}`;

        return clone;
      }, 'No tours found matching your search.');
    } catch (e) {
      console.error(e);
      grid.innerHTML = '<div class="state empty">Failed to load tours. Please try again later.</div>';
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
