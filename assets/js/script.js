// script.js
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
// Initialize AOS animations
document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 1000,
    once: true,
  });
});
gsap.to(".word", {
  y: 0,
  opacity: 1,
  duration: 1,
  ease: "power2.out",
  stagger: 0.3,
  delay: 0.2
});
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
gsap.registerPlugin(ScrollTrigger);

const paragraph = document.getElementById('para');
const rawHTML = paragraph.innerHTML; // preserves <br>
paragraph.innerHTML = '';

const parts = rawHTML.split(/<br\s*\/?>/i); // split on <br>, <br/> or <br >

parts.forEach((part, i) => {
  const sentences = part.match(/[^.!?]+[.!?]+/g); // split into sentences
  if (sentences) {
    sentences.forEach((sentence) => {
      const span = document.createElement('span');
      span.className = 'sentence';
      span.textContent = sentence + ' ';
      paragraph.appendChild(span);

      gsap.to(span, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: i * 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: span,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // Add <br><br> after each part to simulate original spacing
  if (i < parts.length - 1) {
    paragraph.appendChild(document.createElement('br'));
    paragraph.appendChild(document.createElement('br'));
  }
});


ScrollSmoother.create({
  smooth: 3, // how long (in seconds) it takes to "catch up" to the native scroll position
  effects: true, // looks for data-speed and data-lag attributes on elements
  smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

// Optional: Add scroll-to-top button logic (if needed later)
// Optional: Add sticky nav behavior or dynamic scroll effects here

// Example: Add smooth scroll fallback (if CSS doesn't cover older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});
