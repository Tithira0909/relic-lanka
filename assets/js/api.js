const API_BASE_URL = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) {
        // Try to parse error message
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `API Error: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

const API = {
  getGallery: () => fetchAPI('/gallery'),
  getTours: (search = '', limit = 100) => fetchAPI(`/tours?search=${encodeURIComponent(search)}&limit=${limit}`),
  getTourBySlug: (slug) => fetchAPI(`/tours/${slug}`),
  getPage: (key) => fetchAPI(`/pages/${key}`),
  getSettings: () => fetchAPI('/settings'),
  sendInquiry: (data) => fetchAPI('/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  search: (q) => fetchAPI(`/search?q=${encodeURIComponent(q)}`)
};

// Helper to Render
function render(containerId, data, renderer, emptyMessage = 'No items found') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  if (!data || (Array.isArray(data) && data.length === 0)) {
    container.innerHTML = `<div class="state empty">${emptyMessage}</div>`;
    return;
  }

  // Handle paginated response { data: [], meta: {} }
  const list = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : [data]);

  if (list.length === 0) {
     container.innerHTML = `<div class="state empty">${emptyMessage}</div>`;
     return;
  }

  const frag = document.createDocumentFragment();
  list.forEach(item => {
    const el = renderer(item);
    if (el) frag.appendChild(el);
  });
  container.appendChild(frag);
}
