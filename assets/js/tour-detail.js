document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');

  if (!slug) {
    document.getElementById('loadingState').innerHTML = '<div class="state empty">Tour not found</div>';
    return;
  }

  try {
    const tour = await API.getTourBySlug(slug);

    // 1. Summary
    const heroImg = document.getElementById('tourHeroImage');
    heroImg.src = tour.heroImageUrl || '';
    heroImg.onerror = () => { heroImg.src = 'https://via.placeholder.com/1200x400?text=No+Image'; };

    document.getElementById('tourName').textContent = tour.name;
    document.getElementById('tourDuration').textContent = `${tour.days} Days / ${tour.nights} Nights`;
    document.getElementById('tourShortDesc').textContent = tour.shortDescription;
    document.getElementById('inquiryTourId').value = tour.id;

    // 2. Description & Video
    document.getElementById('tourFullDescription').textContent = tour.description;

    if (tour.videoUrl) {
      document.getElementById('tourVideoContainer').style.display = 'block';
      let embedUrl = tour.videoUrl;
      // Basic youtube watch to embed conversion if needed
      if (embedUrl.includes('youtube.com/watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/');
      }
      document.getElementById('tourVideoFrame').src = embedUrl;
    }

    // 3. Inclusions & Sidebar Pricing
    const incList = document.getElementById('tourInclusionList');
    const sidebarIncList = document.getElementById('tourSidebarInclusions');
    if (tour.inclusion && tour.inclusion.length) {
        tour.inclusion.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            incList.appendChild(li);

            const sidebarLi = document.createElement('li');
            sidebarLi.textContent = `✓ ${item}`;
            sidebarLi.style.marginBottom = '5px';
            sidebarIncList.appendChild(sidebarLi);
        });
    } else {
        incList.innerHTML = '<li>No inclusions listed</li>';
        sidebarIncList.innerHTML = '<li>-</li>';
    }

    if (tour.price) {
        document.getElementById('tourPrice').textContent = `LKR ${Number(tour.price).toLocaleString()}`;
    } else {
        document.getElementById('tourPrice').textContent = 'Contact for Price';
    }

    const sidebarExcList = document.getElementById('tourSidebarExcludes');
    if (tour.excludes && tour.excludes.length) {
        tour.excludes.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `✗ ${item}`;
            li.style.marginBottom = '5px';
            li.style.color = '#888';
            sidebarExcList.appendChild(li);
        });
    } else {
        sidebarExcList.innerHTML = '<li>-</li>';
    }

    const sidebarCompList = document.getElementById('tourSidebarComplementary');
    if (tour.complementary && tour.complementary.length) {
        tour.complementary.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `✦ ${item}`;
            li.style.marginBottom = '5px';
            sidebarCompList.appendChild(li);
        });
    } else {
        sidebarCompList.innerHTML = '<li>-</li>';
    }

    // 4. Activities
    const actList = document.getElementById('tourActivitiesList');
    if (tour.includedActivities && tour.includedActivities.length) {
        tour.includedActivities.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            actList.appendChild(li);
        });
    } else {
        actList.innerHTML = '<li>No specific activities listed</li>';
    }

    // 5. Itinerary
    render('tourItineraryList', tour.itineraryDays || [], (day) => {
        const t = document.getElementById('itineraryItemTemplate');
        const c = t.content.cloneNode(true);
        c.querySelector('.day-title').textContent = `Day ${day.dayNumber}: ${day.title || ''}`;
        c.querySelector('.day-route').textContent = day.routeText || '';
        c.querySelector('.day-details').textContent = day.details || '';

        const imgGrid = c.querySelector('.day-images-grid');
        if (day.images && day.images.length > 0) {
            day.images.forEach(img => {
                const i = document.createElement('img');
                i.src = img;
                i.style.width = '100%';
                i.style.height = '150px';
                i.style.objectFit = 'cover';
                i.style.borderRadius = '4px';
                imgGrid.appendChild(i);
            });
        }
        return c;
    }, 'No itinerary details');

    // 6. Destinations
    render('tourDestinationsList', tour.destinations || [], (dest) => {
        const t = document.getElementById('destinationItemTemplate');
        const c = t.content.cloneNode(true);
        c.querySelector('.dest-name').textContent = dest.name;
        c.querySelector('.dest-route').textContent = dest.routeText || '';
        c.querySelector('.dest-desc').textContent = dest.description;

        // Images
        const imgGrid = c.querySelector('.gallery-grid');
        if (dest.images && dest.images.length > 0) {
            dest.images.forEach(img => {
                const i = document.createElement('img');
                i.src = img.imageUrl;
                i.style.height = '150px';
                i.style.objectFit = 'cover';
                i.style.borderRadius = '4px';
                imgGrid.appendChild(i);
            });
        }
        return c;
    }, 'No specific destinations listed');

    // 7. Experiences
    render('tourExperiencesList', tour.experiences || [], (exp) => {
        const t = document.getElementById('experienceItemTemplate');
        const c = t.content.cloneNode(true);
        c.querySelector('.exp-title').textContent = exp.title;
        c.querySelector('.exp-desc').textContent = exp.description || '';

        const ul = c.querySelector('.exp-items');
        if (exp.adventureItems && exp.adventureItems.length) {
            exp.adventureItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
        }

        const imgGrid = c.querySelector('.gallery-grid');
        if (exp.images && exp.images.length > 0) {
            exp.images.forEach(img => {
                const i = document.createElement('img');
                i.src = img.imageUrl;
                i.style.height = '150px';
                i.style.objectFit = 'cover';
                i.style.borderRadius = '4px';
                imgGrid.appendChild(i);
            });
        }
        return c;
    }, 'No specific experiences listed');

    // Show Content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('tourContent').style.display = 'block';

  } catch (e) {
    document.getElementById('loadingState').innerHTML = '<div class="state empty">Failed to load tour details</div>';
  }

  // Handle Inquiry
  document.getElementById('inquiryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      data.type = 'TOUR';
      if (data.travelersCount) data.travelersCount = Number(data.travelersCount);

      await API.sendInquiry(data);
      alert('Inquiry sent successfully!');
      e.target.reset();
    } catch (err) {
      alert('Failed to send inquiry: ' + err.message);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
});
