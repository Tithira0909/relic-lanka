// api-integration.js

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Fetch and render Tours for the Tour List page (or Home/Destination sections)
 * @param {string} containerSelector - The CSS selector for the container to append tours to.
 * @param {number} limit - Number of tours to fetch.
 */
async function fetchAndRenderTours(containerSelector, limit = 6) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tours?limit=${limit}`);
        const data = await response.json();
        const tours = data.data;

        container.innerHTML = ''; // Clear existing content

        if (tours.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>No tours available at the moment.</p></div>';
            return;
        }

        tours.forEach(tour => {
            const tourHtml = `
                <div class="col-md-4 ftco-animate fadeInUp ftco-animated">
                    <div class="project-wrap">
                        <a href="tour-detail.html?slug=${tour.slug}" class="img" style="background-image: url('${tour.heroImageUrl || 'images/placeholder.jpg'}');">
                            <span class="price">${tour.days} Days / ${tour.nights} Nights</span>
                        </a>
                        <div class="text p-4">
                            <span class="days">${tour.days} Days Tour</span>
                            <h3><a href="tour-detail.html?slug=${tour.slug}">${tour.name}</a></h3>
                            <p class="location"><span class="fa fa-map-marker"></span> ${tour.slug.replace(/-/g, ' ')}</p>
                            <ul>
                                <li><span class="flaticon-shower"></span>${tour.nights}</li>
                                <li><span class="flaticon-king-size"></span>${tour.days}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', tourHtml);
        });

    } catch (error) {
        console.error('Error fetching tours:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger"><p>Failed to load tours.</p></div>';
    }
}

/**
 * Fetch and render Tour Details for the Detail page
 * Looks for 'slug' in URL query params.
 */
async function fetchAndRenderTourDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) return; // Not on detail page or no slug

    try {
        const response = await fetch(`${API_BASE_URL}/tours/${slug}`);
        if (!response.ok) throw new Error('Tour not found');

        const tour = await response.json();

        // 1. Hero Section
        const heroBg = document.querySelector('.hero-wrap'); // Assuming standard class
        if (heroBg && tour.heroImageUrl) heroBg.style.backgroundImage = `url(${tour.heroImageUrl})`;

        const heroTitle = document.querySelector('.hero-wrap h1');
        if (heroTitle) heroTitle.textContent = tour.name;

        // 2. Content
        const contentContainer = document.getElementById('tour-content');
        if (contentContainer) {
            let html = `
                <div class="tour-description mb-5">
                    <h2>${tour.name}</h2>
                    <p>${tour.description || tour.shortDescription}</p>
                </div>

                <div class="tour-meta mb-5">
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Inclusions</h4>
                            <ul class="list-unstyled">
                                ${(tour.inclusion || []).map(item => `<li><i class="fa fa-check text-success mr-2"></i>${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h4>Activities</h4>
                             <div class="d-flex flex-wrap">
                                ${(tour.includedActivities || []).map(item => `<span class="badge badge-info mr-2 mb-2 p-2">${item}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tour-itinerary mb-5">
                    <h3>Itinerary</h3>
                    <div class="accordion" id="accordionItinerary">
                        ${(tour.itineraryDays || []).map((day, index) => `
                            <div class="card">
                                <div class="card-header" id="heading${index}">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${index}">
                                            Day ${day.dayNumber}: ${day.title || ''} <small class="text-muted">(${day.routeText || ''})</small>
                                        </button>
                                    </h5>
                                </div>
                                <div id="collapse${index}" class="collapse ${index === 0 ? 'show' : ''}" data-parent="#accordionItinerary">
                                    <div class="card-body">
                                        ${day.details || ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Destinations
             if (tour.destinations && tour.destinations.length > 0) {
                html += `<h3>Destinations</h3><div class="row">`;
                tour.destinations.forEach(dest => {
                    html += `
                        <div class="col-md-6 mb-4">
                            <div class="destination-card border rounded p-3">
                                <h4>${dest.name}</h4>
                                ${dest.routeText ? `<p class="text-muted"><small>${dest.routeText}</small></p>` : ''}
                                <p>${dest.description}</p>
                                ${dest.images && dest.images.length > 0 ? `<img src="${dest.images[0].imageUrl}" class="img-fluid rounded mb-2">` : ''}
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
             }

            contentContainer.innerHTML = html;
        }

    } catch (error) {
        console.error('Error fetching tour detail:', error);
    }
}

/**
 * Fetch and render Gallery
 * @param {string} containerSelector
 */
async function fetchAndRenderGallery(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/gallery`);
        const items = await response.json();

        // Assuming owl-carousel structure based on existing HTML
        // Note: For dynamic owl-carousel updates, we usually need to destroy and re-init,
        // or append items before init.
        // For simplicity, we'll replace innerHTML and rely on the page initializing carousel AFTER this runs,
        // or manual re-init if needed.

        // However, existing HTML uses owl-carousel class directly on container.
        // It's safer to generate HTML string and insert it if the carousel hasn't started,
        // or use Owl Carousel API to add items.
        // For this demo, let's assume we are populating a simple grid if carousel logic is complex to bridge remotely.
        // Or we try to populate .spotlight-images if that's what was requested for Home.
        // Requirement: "Home page: Gallery section that displays images uploaded from backend"

        // Let's populate the container.
        let html = '';
        items.forEach(item => {
             html += `
                <div class="item">
                    <div class="project-destination">
                        <a href="#" class="img" style="background-image: url('${item.imageUrl}');">
                            <div class="text">
                                <h3>${item.title || ''}</h3>
                                <span>${item.caption || ''}</span>
                            </div>
                        </a>
                    </div>
                </div>
             `;
        });
        container.innerHTML = html;

    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

/**
 * Setup Inquiry Form
 */
function setupInquiryForm(formSelector, type = 'GENERAL', tourId = null) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            ...data,
            type,
            tourId,
            travelersCount: data.travelersCount ? Number(data.travelersCount) : undefined
        };

        try {
            const res = await fetch(`${API_BASE_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Inquiry sent successfully!');
                form.reset();
            } else {
                const err = await res.json();
                alert('Error: ' + JSON.stringify(err));
            }
        } catch (error) {
            alert('Failed to send inquiry');
        }
    });
}
