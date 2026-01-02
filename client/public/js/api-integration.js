// js/api-integration.js

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
            // Use heroImageUrl or placeholder
            const imageUrl = tour.heroImageUrl || 'images/destination-1.jpg';

            const tourHtml = `
                <div class="col-md-4 ftco-animate fadeInUp ftco-animated">
                    <div class="project-wrap">
                        <a href="tour-detail.html?slug=${tour.slug}" class="img" style="background-image: url('${imageUrl}');">
                            <span class="price">${tour.days} Days / ${tour.nights} Nights</span>
                        </a>
                        <div class="text p-4">
                            <span class="days">${tour.days} Days Tour</span>
                            <h3><a href="tour-detail.html?slug=${tour.slug}">${tour.name}</a></h3>
                            <p class="location"><span class="fa fa-map-marker"></span> ${tour.slug.replace(/-/g, ' ')}</p>
                            <ul>
                                <li><span class="flaticon-shower"></span>${tour.nights} Nights</li>
                                <li><span class="flaticon-king-size"></span>${tour.days} Days</li>
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

    if (!slug) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tours/${slug}`);
        if (!response.ok) throw new Error('Tour not found');

        const tour = await response.json();

        // 1. Hero Section Update
        const heroSection = document.querySelector('.hero-wrap');
        if (heroSection && tour.heroImageUrl) {
            heroSection.style.backgroundImage = `url(${tour.heroImageUrl})`;
        }
        const heroTitle = document.querySelector('.hero-wrap h1');
        if (heroTitle) heroTitle.textContent = tour.name;

        // Update breadcrumbs
        const breadcrumbSpan = document.querySelector('.breadcrumbs span:last-child');
        if (breadcrumbSpan) breadcrumbSpan.innerHTML = `${tour.name} <i class="fa fa-chevron-right"></i>`;

        // 2. Main Content
        const contentContainer = document.getElementById('tour-content');
        if (contentContainer) {
            let html = `
                <div class="tour-description mb-5">
                    <h2 class="mb-4">${tour.name}</h2>
                    <div class="text-justify">${tour.description || tour.shortDescription}</div>
                </div>

                <div class="tour-meta mb-5 bg-light p-4 rounded">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h4 class="mb-3">Inclusions</h4>
                            <ul class="list-unstyled">
                                ${(tour.inclusion || []).map(item => `<li class="d-flex mb-2"><i class="fa fa-check text-success mr-2 mt-1"></i><span>${item}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h4 class="mb-3">Activities</h4>
                             <div class="d-flex flex-wrap">
                                ${(tour.includedActivities || []).map(item => `<span class="badge badge-info mr-2 mb-2 p-2" style="font-size: 0.9rem;">${item}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tour-itinerary mb-5">
                    <h3 class="mb-4">Itinerary</h3>
                    <div id="accordionItinerary">
                        ${(tour.itineraryDays || []).map((day, index) => `
                            <div class="card mb-2 border-0">
                                <div class="card-header bg-white border p-0" id="heading${index}">
                                    <h5 class="mb-0">
                                        <button class="btn btn-link btn-block text-left p-3 text-dark font-weight-bold" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="${index === 0}" aria-controls="collapse${index}">
                                            <span class="badge badge-primary mr-2">Day ${day.dayNumber}</span> ${day.title || ''}
                                            <small class="text-muted d-block mt-1 ml-5">${day.routeText || ''}</small>
                                        </button>
                                    </h5>
                                </div>
                                <div id="collapse${index}" class="collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-parent="#accordionItinerary">
                                    <div class="card-body pl-5">
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
                html += `<h3 class="mb-4">Destinations</h3><div class="row mb-5">`;
                tour.destinations.forEach(dest => {
                    html += `
                        <div class="col-md-6 mb-4">
                            <div class="destination-card border rounded overflow-hidden shadow-sm h-100">
                                ${dest.images && dest.images.length > 0 ?
                                    `<div style="height: 200px; background: url(${dest.images[0].imageUrl}) center/cover;"></div>` :
                                    `<div style="height: 200px; background: #eee center/cover;"></div>`
                                }
                                <div class="p-3">
                                    <h4>${dest.name}</h4>
                                    ${dest.routeText ? `<p class="text-muted small mb-2"><i class="fa fa-map-signs mr-1"></i>${dest.routeText}</p>` : ''}
                                    <p>${dest.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
             }

            contentContainer.innerHTML = html;
        }

        // Initialize Inquiry Form with Tour ID
        setupInquiryForm('#inquiryForm', 'TOUR', tour.id);

    } catch (error) {
        console.error('Error fetching tour detail:', error);
        const contentContainer = document.getElementById('tour-content');
        if(contentContainer) contentContainer.innerHTML = '<div class="alert alert-danger">Failed to load tour details.</div>';
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

        let html = '';
        items.forEach(item => {
             // Matching 'index.html' owl-carousel item structure if possible,
             // but if we are replacing .spotlight-images content:
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

        // Note: Owl Carousel might need re-init.
        // Ideally we destroy and rebuild it, or just append HTML if it's not initialized yet.
        container.innerHTML = html;

    } catch (error) {
        console.error('Error fetching gallery:', error);
    }
}

/**
 * Fetch and render Page Content (About, Contact, etc.)
 * @param {string} key - Page key (e.g., 'ABOUT', 'CONTACT')
 * @param {string} containerSelector - Selector for the content container
 */
async function fetchAndRenderPageContent(key, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/pages/${key}`);
        if (!response.ok) return; // Silent fail or default content
        const page = await response.json();

        // If the container has a title element, update it separately if needed,
        // or just replace innerHTML with contentHtml.
        // Assuming simple content replacement for now.
        if (page.contentHtml) {
             container.innerHTML = page.contentHtml;
        }

        // Update Title if exists
        const titleEl = document.querySelector(containerSelector + '-title'); // Convention? Or just use specific logic.
        // Let's keep it simple: the user asked for fetching.

    } catch (error) {
        console.error(`Error fetching page ${key}:`, error);
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
        const submitBtn = form.querySelector('input[type="submit"]');
        const originalBtnVal = submitBtn.value;
        submitBtn.value = "Sending...";
        submitBtn.disabled = true;

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
                alert('Error: ' + (err.error ? JSON.stringify(err.error) : 'Failed to send'));
            }
        } catch (error) {
            alert('Failed to send inquiry');
        } finally {
            submitBtn.value = originalBtnVal;
            submitBtn.disabled = false;
        }
    });
}
