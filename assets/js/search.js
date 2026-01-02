document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');

  let debounceTimer;
  input.addEventListener('input', (e) => {
    const q = e.target.value;
    clearTimeout(debounceTimer);

    if (q.length < 2) {
      resultsContainer.innerHTML = '<div class="state empty">Enter at least 2 characters</div>';
      return;
    }

    debounceTimer = setTimeout(async () => {
      resultsContainer.innerHTML = '<div class="state loading">Searching...</div>';
      try {
        const data = await API.search(q);
        resultsContainer.innerHTML = '';

        const hasTours = data.tours && data.tours.length > 0;
        const hasDest = data.destinations && data.destinations.length > 0;
        const hasExp = data.experiences && data.experiences.length > 0;

        if (!hasTours && !hasDest && !hasExp) {
           resultsContainer.innerHTML = '<div class="state empty">No results found</div>';
           return;
        }

        const appendResult = (type, title, url) => {
           const t = document.getElementById('resultItemTemplate');
           const c = t.content.cloneNode(true);
           c.querySelector('.type-badge').textContent = type;
           c.querySelector('.card-title').textContent = title;
           c.querySelector('a').href = url;
           resultsContainer.appendChild(c);
        };

        if (hasTours) {
            const h = document.createElement('h3'); h.textContent = 'Tours'; h.style.marginTop = '20px';
            resultsContainer.appendChild(h);
            data.tours.forEach(t => appendResult('Tour', t.name, `tour.html?slug=${t.slug}`));
        }

        if (hasDest) {
            const h = document.createElement('h3'); h.textContent = 'Destinations'; h.style.marginTop = '20px';
            resultsContainer.appendChild(h);
            data.destinations.forEach(d => appendResult('Destination', d.name, `tour.html?slug=${d.tour.slug}`));
        }

        if (hasExp) {
            const h = document.createElement('h3'); h.textContent = 'Experiences'; h.style.marginTop = '20px';
            resultsContainer.appendChild(h);
            data.experiences.forEach(e => appendResult('Experience', e.title, `tour.html?slug=${e.tour.slug}`));
        }

      } catch (e) {
        resultsContainer.innerHTML = '<div class="state empty">Search failed</div>';
      }
    }, 500);
  });
});
