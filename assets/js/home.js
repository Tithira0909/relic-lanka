document.addEventListener('DOMContentLoaded', async () => {
    // Fallback items
    const fallbackItems = [
      { name: "Sigiriya", img: "images/img_1.jpg" },
      { name: "Kandy", img: "images/img_2.jpg" },
      { name: "Ella", img: "images/img_3.jpg" },
      { name: "Galle", img: "images/img_4.jpg" },
      { name: "Yala", img: "images/img_5.jpg" },
      { name: "Mirissa", img: "images/img_6.jpg" },
      { name: "Nuvara Eliya", img: "images/img_7.jpg" },
      { name: "Polonnaruwa", img: "images/img_8.jpg" },
      { name: "Anuradhapura", img: "images/img_9.jpg" },
      { name: "Trincomalee", img: "images/img_10.jpg" },
    ];

    try {
        const gallery = await API.getGallery();

        if (gallery && gallery.length > 0) {
            const items = gallery.map(item => ({
                name: item.title || 'Sri Lanka',
                img: item.imageUrl
            }));

            initTelescope(items);
        } else {
            console.log("No gallery items found, using fallback.");
            initTelescope(fallbackItems);
        }
    } catch (e) {
        console.error("Failed to load gallery for telescope", e);
        initTelescope(fallbackItems);
    }

    // Load Featured Destinations (Places)
    try {
        const destinations = await API.getFeaturedDestinations();
        render('home-destinations', destinations, renderHomeDestinationCard, 'No destinations found.');
    } catch (e) {
        console.error("Failed to load featured destinations", e);
    }

    // Load Featured Experiences
    try {
        const experiences = await API.getFeaturedExperiences();
        render('home-experiences', experiences, renderHomeExperienceCard, 'No experiences found.');
    } catch (e) {
        console.error("Failed to load featured experiences", e);
    }
});

function renderHomeDestinationCard(item) {
    // Expect item: { name, description, images: [{imageUrl}], tour: { slug } }
    const imgUrl = (item.images && item.images.length > 0) ? item.images[0].imageUrl : 'images/destination-1.jpg'; // Placeholder
    // Fallback if no images and no placeholder available, use a generic one
    const safeImg = imgUrl || 'images/image_1.jpg';
    const link = item.tour ? `tour.html?slug=${item.tour.slug}` : '#';

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated';

    col.innerHTML = `
        <div class="project">
            <div class="img">
                <img src="${safeImg}" class="img-fluid" alt="${item.name}">
                <div class="text">
                    <span>${item.name}</span>
                    <h3><a href="${link}">${item.description ? item.description.substring(0, 50) + '...' : 'Explore'}</a></h3>
                </div>
            </div>
        </div>
    `;
    return col;
}

function renderHomeExperienceCard(item) {
    // Expect item: { title, images: [{imageUrl}], tour: { slug } }
    const imgUrl = (item.images && item.images.length > 0) ? item.images[0].imageUrl : 'images/image_2.jpg';
    const link = item.tour ? `tour.html?slug=${item.tour.slug}` : '#';

    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3 ftco-animate fadeInUp ftco-animated';

    col.innerHTML = `
        <div class="project">
            <div class="img">
                <img src="${imgUrl}" class="img-fluid" alt="${item.title}">
                <div class="text">
                    <span>Experience</span>
                    <h3><a href="${link}">${item.title}</a></h3>
                </div>
            </div>
        </div>
    `;
    return col;
}
