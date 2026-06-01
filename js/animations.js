document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const intensity = mobile ? .5 : 1;

  if(window.Lenis && !reduceMotion){
    const lenis = new Lenis({
      duration:1.2,
      smoothWheel:true,
      syncTouch:!mobile,
      autoRaf:false,
      anchors:true,
      allowNestedScroll:true,
      stopInertiaOnNavigate:true,
      prevent:node => Boolean(node.closest?.(".cart-drawer, .nav-links, .search-overlay"))
    });

    const raf = time => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };

    window.vyroLenis = lenis;
    if(window.ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
    window.requestAnimationFrame(raf);
  }

  if(!window.gsap) return;
  if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  gsap.to(".loader",{autoAlpha:0,duration:.28,delay:.04,ease:"power2.out",onComplete(){document.querySelectorAll(".loader").forEach(loader => loader.remove())}});
  gsap.from(".hero-image",{autoAlpha:0,duration:.55,ease:"power2.out",delay:.02});

  if(reduceMotion || !window.ScrollTrigger) return;

  const scrub = true;
  const addParallax = (selector, y, trigger = ".hero") => {
    if(!document.querySelector(selector)) return;
    gsap.to(selector,{
      y:y * intensity,
      ease:"none",
      scrollTrigger:{trigger,start:"top top",end:"bottom top",scrub}
    });
  };

  if(document.querySelector(".hero")){
    gsap.fromTo(".hero-image",
      {scale:1.05,y:0},
      {scale:1,y:-100 * intensity,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}}
    );
    gsap.to(".hero-content h1",{
      y:-180 * intensity,
      opacity:.85,
      ease:"none",
      scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
    });
    gsap.to(".hero-description",{
      y:-120 * intensity,
      ease:"none",
      scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
    });
    gsap.to(".hero-cta-motion",{
      y:-100 * intensity,
      ease:"none",
      scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
    });
    addParallax("[data-parallax='leaf']",-28);
    addParallax("[data-parallax='fruit']",-36);
    addParallax("[data-parallax='circle']",-20);
  }

  if(document.querySelector(".offer-banner")){
    gsap.fromTo(".offer-visual img",
      {scale:1.1,y:0},
      {scale:1.05,y:-80 * intensity,ease:"none",scrollTrigger:{trigger:".offer-banner",start:"top bottom",end:"bottom top",scrub}}
    );
    gsap.fromTo(".offer-splash",
      {scale:1,opacity:.68},
      {scale:1.045,opacity:.84,ease:"none",scrollTrigger:{trigger:".offer-banner",start:"top bottom",end:"bottom top",scrub}}
    );
  }

  const productCards = gsap.utils.toArray(".flavor-card, .product-card");
  if(productCards.length){
    gsap.from(productCards,{
      opacity:0,
      y:64 * intensity,
      stagger:.14,
      duration:.9,
      ease:"power3.out",
      scrollTrigger:{trigger:productCards[0].parentElement,start:"top 86%",once:true}
    });
  }

  gsap.utils.toArray(".reveal").forEach(element => {
    if(element.matches(".flavors, .offer-banner")) return;
    gsap.from(element,{
      scrollTrigger:{trigger:element,start:"top 86%",once:true},
      y:36 * intensity,
      autoAlpha:0,
      duration:.8,
      ease:"power3.out"
    });
  });

  window.addEventListener("load",() => ScrollTrigger.refresh(),{once:true});
});
