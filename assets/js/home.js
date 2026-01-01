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
});
