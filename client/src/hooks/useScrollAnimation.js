import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ftco-animated');
          entry.target.classList.remove('item-animate'); // If using stagger logic
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.ftco-animate');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }); // Run on every render to catch new elements or use dependency array if stable
};

export default useScrollAnimation;
