async function loadHero() {
  try {
    const res = await fetch("http://localhost:1337/api/hero?populate=*");
    const data = await res.json();
    const hero = data.data; // 👈 keep it consistent with Strapi’s structure
console.log("Hero data:", hero);
    const leftImage = hero.HeroImageLeft?.url;
    const rightImage = hero.HeroImageRight?.url;

    if (leftImage) {
      document.querySelector(".hero-bg-left").style.backgroundImage =
        `url("http://localhost:1337${leftImage}")`;
    }

    if (rightImage) {
      document.querySelector(".hero-bg-right").style.backgroundImage =
        `url("http://localhost:1337${rightImage}")`;
    }
  } catch (error) {
    console.error("Error loading hero images:", error);
  }
}

// Call both loaders after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadIntro();
  loadHero();
});