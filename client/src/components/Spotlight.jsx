import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const Spotlight = ({ items }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const container = containerRef.current;

    // Config
    const config = {
      gap: 0.08,
      speed: 0.3,
      arcRadius: 500,
    };

    // Initialize Lenis
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tickerFunc = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFunc);
    gsap.ticker.lagSmoothing(0);

    // Elements
    const titlesContainer = container.querySelector(".spotlight-titles");
    const imagesContainer = container.querySelector(".spotlight-images");
    const spotlightHeader = container.querySelector(".spotlight-header");
    const titlesContainerElement = container.querySelector(".spotlight-titles-container");
    const introTextElements = container.querySelectorAll(".spotlight-intro-text");
    const bgImg = container.querySelector(".spotlight-bg-img");
    const bgImgImg = container.querySelector(".spotlight-bg-img img");

    // Clear and populate
    titlesContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    const imageElements = [];

    items.forEach((item, index) => {
      const titleElement = document.createElement("h1");
      titleElement.textContent = item.name;
      if (index === 0) titleElement.style.opacity = "1";
      titlesContainer.appendChild(titleElement);

      const imgWrapper = document.createElement("div");
      imgWrapper.className = "spotlight-img";
      const imgElement = document.createElement("img");
      imgElement.src = item.img;
      imgElement.alt = item.name;
      imgWrapper.appendChild(imgElement);
      imagesContainer.appendChild(imgWrapper);
      imageElements.push(imgWrapper);
    });

    const titleElements = titlesContainer.querySelectorAll("h1");
    let currentActiveIndex = 0;

    const containerWidth = window.innerWidth * 0.3;
    const containerHeight = window.innerHeight;
    const arcStartX = containerWidth - 220;
    const arcStartY = -200;
    const arcEndY = containerHeight + 200;
    const arcControlPointX = arcStartX + config.arcRadius;
    const arcControlPointY = containerHeight / 2;

    function getBezierPosition(t) {
      const x =
        (1 - t) * (1 - t) * arcStartX +
        2 * (1 - t) * t * arcControlPointX +
        t * t * arcStartX;
      const y =
        (1 - t) * (1 - t) * arcStartY +
        2 * (1 - t) * t * arcControlPointY +
        t * t * arcEndY;
      return { x, y };
    }

    function getImgProgressState(index, overallProgress) {
      const startTime = index * config.gap;
      const endTime = startTime + config.speed;

      if (overallProgress < startTime) return -1;
      if (overallProgress > endTime) return 2;

      return (overallProgress - startTime) / config.speed;
    }

    imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        if (progress <= 0.2) {
          const animationProgress = progress / 0.2;
          const moveDistance = window.innerWidth * 0.6;

          if (introTextElements[0]) gsap.set(introTextElements[0], { x: -animationProgress * moveDistance, opacity: 1 });
          if (introTextElements[1]) gsap.set(introTextElements[1], { x: animationProgress * moveDistance, opacity: 1 });

          if (bgImg) gsap.set(bgImg, { transform: `scale(${animationProgress})` });
          if (bgImgImg) gsap.set(bgImgImg, { transform: `scale(${1.5 - animationProgress * 0.5})` });

          imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
          if (spotlightHeader) spotlightHeader.style.opacity = "0";
          if (titlesContainerElement) {
             titlesContainerElement.style.setProperty("--before-opacity", "0");
             titlesContainerElement.style.setProperty("--after-opacity", "0");
          }
        } else if (progress > 0.2 && progress <= 0.25) {
          if (bgImg) gsap.set(bgImg, { transform: "scale(1)" });
          if (bgImgImg) gsap.set(bgImgImg, { transform: "scale(1)" });

          if (introTextElements[0]) gsap.set(introTextElements[0], { opacity: 0 });
          if (introTextElements[1]) gsap.set(introTextElements[1], { opacity: 0 });

          imageElements.forEach((img) => gsap.set(img, { opacity: 0 }));
          if (spotlightHeader) spotlightHeader.style.opacity = "1";
          if (titlesContainerElement) {
            titlesContainerElement.style.setProperty("--before-opacity", "1");
            titlesContainerElement.style.setProperty("--after-opacity", "1");
          }
        } else if (progress > 0.25 && progress <= 0.95) {
          if (bgImg) gsap.set(bgImg, { transform: "scale(1)" });
          if (bgImgImg) gsap.set(bgImgImg, { transform: "scale(1)" });
          if (introTextElements[0]) gsap.set(introTextElements[0], { opacity: 0 });
          if (introTextElements[1]) gsap.set(introTextElements[1], { opacity: 0 });
          if (spotlightHeader) spotlightHeader.style.opacity = "1";
          if (titlesContainerElement) {
            titlesContainerElement.style.setProperty("--before-opacity", "1");
            titlesContainerElement.style.setProperty("--after-opacity", "1");
          }

          const switchProgress = (progress - 0.25) / 0.7;
          const viewportHeight = window.innerHeight;
          const titlesContainerHeight = titlesContainer.scrollHeight;
          const startPosition = viewportHeight;
          const targetPosition = -titlesContainerHeight;
          const totalDistance = startPosition - targetPosition;
          const currentY = startPosition - switchProgress * totalDistance;

          gsap.set(titlesContainer, { transform: `translateY(${currentY}px)` });

          imageElements.forEach((img, index) => {
            const imageProgress = getImgProgressState(index, switchProgress);
            if (imageProgress < 0 || imageProgress > 1) {
              gsap.set(img, { opacity: 0 });
            } else {
              const pos = getBezierPosition(imageProgress);
              gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
            }
          });

          // Sync titles
          const viewportMiddle = viewportHeight / 2;
          let closestIndex = 0;
          let closestDistance = Infinity;

          titleElements.forEach((title, index) => {
            const titleRect = title.getBoundingClientRect();
            const titleCenter = titleRect.top + titleRect.height / 2;
            const distanceFromCenter = Math.abs(titleCenter - viewportMiddle);
            if (distanceFromCenter < closestDistance) {
              closestDistance = distanceFromCenter;
              closestIndex = index;
            }
          });

          if (closestIndex !== currentActiveIndex) {
             if (titleElements[currentActiveIndex]) titleElements[currentActiveIndex].style.opacity = "0.25";
             if (titleElements[closestIndex]) {
                 titleElements[closestIndex].style.opacity = "1";
                 if (bgImgImg && items[closestIndex]) bgImgImg.src = items[closestIndex].img;
             }
             currentActiveIndex = closestIndex;
          }

        } else if (progress > 0.95) {
          if (spotlightHeader) spotlightHeader.style.opacity = "0";
          if (titlesContainerElement) {
             titlesContainerElement.style.setProperty("--before-opacity", "0");
             titlesContainerElement.style.setProperty("--after-opacity", "0");
          }
        }
      },
    });

    return () => {
        st.kill();
        lenis.destroy();
        gsap.ticker.remove(tickerFunc);
    };
  }, [items]);

  return (
    <section className="spotlight" ref={containerRef}>
      <div className="spotlight-intro-text-wrapper">
        <div className="spotlight-intro-text"><p>Nature</p></div>
        <div className="spotlight-intro-text"><p>Culture</p></div>
      </div>

      <div className="spotlight-bg-img">
        <img src={items && items.length > 0 ? items[0].img : "/images/img_1.jpg"} alt="Background" />
      </div>

      <div className="spotlight-titles-container">
        <div className="spotlight-titles"></div>
      </div>

      <div className="spotlight-images"></div>

      <div className="spotlight-header">
        <p>Unforgettable</p>
      </div>
    </section>
  );
};

export default Spotlight;
