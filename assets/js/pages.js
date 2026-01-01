document.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;
  const isAbout = path.includes('about.html');
  const isContact = path.includes('contact.html');
  const key = isAbout ? 'ABOUT' : (isContact ? 'CONTACT' : null);

  if (key) {
    try {
      const page = await API.getPage(key);
      document.getElementById('pageContent').innerHTML = page.contentHtml;
    } catch (e) {
      document.getElementById('pageContent').innerHTML = '<div class="state empty">Content not available</div>';
    }
  }

  // Contact Page Specifics
  if (isContact) {
    try {
      const settings = await API.getSettings();
      if (settings) {
        const emailEl = document.getElementById('settingEmail');
        const phoneEl = document.getElementById('settingPhone');
        const addressEl = document.getElementById('settingAddress');

        if(emailEl) emailEl.textContent = settings.contactEmail || 'N/A';
        if(phoneEl) phoneEl.textContent = settings.phone || 'N/A';
        if(addressEl) addressEl.textContent = settings.address || 'N/A';
      }
    } catch(e) {
        console.error('Failed to load settings');
    }

    const form = document.getElementById('generalInquiryForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        try {
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData.entries());
          data.type = 'GENERAL';

          await API.sendInquiry(data);
          alert('Message sent successfully!');
          e.target.reset();
        } catch (err) {
          alert('Failed to send message: ' + err.message);
        } finally {
          btn.textContent = originalText;
          btn.disabled = false;
        }
      });
    }
  }
});
