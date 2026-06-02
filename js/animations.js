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

  const one = selector => document.querySelector(selector);
  const all = selector => gsap.utils.toArray(selector);

  if(one(".loader")){
    gsap.to(".loader",{autoAlpha:0,duration:.32,delay:.04,ease:"power3.out",onComplete(){document.querySelectorAll(".loader").forEach(loader => loader.remove())}});
  }
  if(one(".hero-image")){
    gsap.from(".hero-image",{autoAlpha:0,duration:.7,ease:"power3.out",delay:.02});
  }

  if(reduceMotion || !window.ScrollTrigger) return;

  const scrub = .75;
  const addParallax = (selector, y, trigger = ".hero") => {
    if(!one(selector) || !one(trigger)) return;
    gsap.to(selector,{
      y:y * intensity,
      ease:"none",
      scrollTrigger:{trigger,start:"top top",end:"bottom top",scrub}
    });
  };

  if(one(".hero")){
    if(one(".hero-image")){
      gsap.fromTo(".hero-image",
        {scale:1.035,y:0},
        {scale:1,y:-70 * intensity,ease:"none",scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}}
      );
    }
    if(one(".hero-content h1")){
      gsap.to(".hero-content h1",{
        y:-145 * intensity,
        opacity:.88,
        ease:"none",
        scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".hero-description")){
      gsap.to(".hero-description",{
        y:-95 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".hero-cta-motion")){
      gsap.to(".hero-cta-motion",{
        y:-80 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".hero",start:"top top",end:"bottom top",scrub}
      });
    }
    addParallax("[data-parallax='leaf']",-28);
    addParallax("[data-parallax='fruit']",-36);
    addParallax("[data-parallax='circle']",-20);
  }

  if(one(".offer-banner")){
    if(one(".offer-visual img")){
      gsap.fromTo(".offer-visual img",
        {scale:1.08,y:0},
        {scale:1.04,y:-52 * intensity,ease:"none",scrollTrigger:{trigger:".offer-banner",start:"top bottom",end:"bottom top",scrub}}
      );
    }
    if(one(".offer-splash")){
      gsap.fromTo(".offer-splash",
        {scale:1,opacity:.68},
        {scale:1.035,opacity:.8,ease:"none",scrollTrigger:{trigger:".offer-banner",start:"top bottom",end:"bottom top",scrub}}
      );
    }
  }

  if(one(".product-story")){
    if(one(".story-product-can")) gsap.to(".story-product-can",{
      y:-12 * intensity,
      duration:4.4,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });
    if(one(".story-can-shadow")) gsap.to(".story-can-shadow",{
      scaleX:.88,
      opacity:.72,
      duration:4.4,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });
    if(one(".energy-pulse")) gsap.to(".energy-pulse",{
      scale:1.08,
      opacity:.9,
      duration:2.8,
      repeat:-1,
      yoyo:true,
      ease:"sine.inOut"
    });
    if(one(".fruit-accent")) gsap.to(".fruit-accent",{
      y:index => (index % 2 ? 10 : -10) * intensity,
      x:index => (index % 2 ? -6 : 6) * intensity,
      duration:3.8,
      repeat:-1,
      yoyo:true,
      stagger:.18,
      ease:"sine.inOut"
    });
    if(one(".story-visual")) gsap.to(".story-visual",{
      y:-28 * intensity,
      ease:"none",
      scrollTrigger:{trigger:".product-story",start:"top bottom",end:"bottom top",scrub}
    });
    const storyBlocks = all(".product-story .story-copy, .product-story .story-panel");
    if(storyBlocks.length) gsap.from(storyBlocks,{
        scrollTrigger:{trigger:".product-story",start:"top 78%",once:true},
        y:38 * intensity,
        autoAlpha:0,
        duration:.8,
        stagger:.12,
        ease:"power4.out"
      });
    if(one(".story-pill") && one(".story-pills")) gsap.from(".story-pill",{
      scrollTrigger:{trigger:".story-pills",start:"top 88%",once:true},
      y:18 * intensity,
      autoAlpha:0,
      duration:.65,
      stagger:.08,
      ease:"power3.out"
    });
  }

  if(one(".about-page")){
    const aboutHeroItems = all(".about-hero-copy > *");
    if(aboutHeroItems.length){
      gsap.from(aboutHeroItems,{
        autoAlpha:0,
        y:42 * intensity,
        duration:.9,
        stagger:.1,
        ease:"power4.out"
      });
    }
    if(one(".about-hero-can")){
      gsap.to(".about-hero-can",{
        y:-16 * intensity,
        duration:4.8,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
      });
      gsap.to(".about-hero-can",{
        y:-70 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".about-hero-visual")){
      gsap.to(".about-hero-visual",{
        y:-34 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".about-hero-watermark")){
      gsap.to(".about-hero-watermark",{
        y:-46 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    const aboutParticles = all(".about-particle");
    if(aboutParticles.length){
      gsap.to(aboutParticles,{
        y:index => (index % 2 ? 18 : -18) * intensity,
        x:index => (index % 2 ? -10 : 10) * intensity,
        duration:3.8,
        repeat:-1,
        yoyo:true,
        stagger:.14,
        ease:"sine.inOut"
      });
      gsap.to(aboutParticles,{
        y:index => (index % 2 ? -36 : -24) * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".about-ring")){
      gsap.to(".about-ring",{
        rotate:index => index ? -10 : 12,
        duration:8,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut",
        stagger:.18
      });
    }
    if(one(".timeline-progress") && one(".about-timeline-section")){
      gsap.to(".timeline-progress",{
        scaleX:1,
        ease:"none",
        scrollTrigger:{trigger:".about-timeline-section",start:"top 68%",end:"bottom 72%",scrub:true}
      });
    }
    if(one(".ingredient-can-stage")){
      gsap.to(".ingredient-can-stage",{
        y:-46 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-ingredients",start:"top bottom",end:"bottom top",scrub:true}
      });
    }
    if(one(".ingredient-can")){
      gsap.to(".ingredient-can",{
        y:-14 * intensity,
        rotate:mobile ? 1.5 : 2.5,
        duration:5.2,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
      });
    }
    const ingredientHotspots = all(".ingredient-hotspot");
    if(ingredientHotspots.length){
      gsap.from(ingredientHotspots,{
        scrollTrigger:{trigger:".ingredients-visual",start:"top 76%",once:true},
        autoAlpha:0,
        x:index => (index < 2 ? -34 : 34) * intensity,
        duration:.78,
        stagger:.1,
        ease:"power4.out"
      });
    }
    const hotspotLines = all(".hotspot-line");
    if(hotspotLines.length){
      gsap.to(hotspotLines,{
        scaleX:1,
        duration:.85,
        stagger:.08,
        ease:"power3.out",
        scrollTrigger:{trigger:".ingredients-visual",start:"top 72%",once:true}
      });
    }
    const fruitOrbits = all(".fruit-orbit");
    if(fruitOrbits.length){
      gsap.to(fruitOrbits,{
        y:index => (index % 2 ? 16 : -16) * intensity,
        x:index => (index % 2 ? -8 : 8) * intensity,
        duration:4.2,
        repeat:-1,
        yoyo:true,
        stagger:.12,
        ease:"sine.inOut"
      });
      gsap.to(fruitOrbits,{
        y:index => (index % 2 ? -34 : -22) * intensity,
        ease:"none",
        scrollTrigger:{trigger:".about-ingredients",start:"top bottom",end:"bottom top",scrub:true}
      });
    }
    const countEls = all("[data-count]");
    countEls.forEach(element => {
      const target = Number(element.dataset.count);
      if(Number.isNaN(target)) return;
      const counter = {value:0};
      gsap.to(counter,{
        value:target,
        duration:1.4,
        ease:"power3.out",
        scrollTrigger:{trigger:element,start:"top 88%",once:true},
        onUpdate(){element.textContent = Math.round(counter.value).toString();}
      });
    });
    const aboutReveal = all(".about-reveal");
    if(aboutReveal.length){
      const revealSections = [...new Set(aboutReveal.map(element => element.closest("section")).filter(Boolean))];
      revealSections.forEach(section => {
        const items = gsap.utils.toArray(section.querySelectorAll(".about-reveal"));
        if(!items.length) return;
        gsap.from(items,{
          scrollTrigger:{trigger:section,start:"top 84%",once:true},
          y:34 * intensity,
          autoAlpha:0,
          duration:.78,
          stagger:.08,
          ease:"power4.out"
        });
      });
    }
    if(one(".about-final-cta h2")){
      gsap.from(".about-final-cta h2",{
        scrollTrigger:{trigger:".about-final-cta",start:"top 78%",once:true},
        scale:.94,
        autoAlpha:0,
        duration:.9,
        ease:"power4.out"
      });
    }
  }

  if(one(".contact-page")){
    const contactHeroItems = all(".contact-hero-copy > *");
    if(contactHeroItems.length){
      gsap.from(contactHeroItems,{
        autoAlpha:0,
        y:42 * intensity,
        duration:.9,
        stagger:.1,
        ease:"power4.out"
      });
    }
    if(one(".contact-hero-can")){
      gsap.to(".contact-hero-can",{
        y:-16 * intensity,
        rotate:mobile ? 1 : 2,
        duration:4.8,
        repeat:-1,
        yoyo:true,
        ease:"sine.inOut"
      });
      gsap.to(".contact-hero-can",{
        y:-64 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".contact-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    if(one(".contact-watermark")){
      gsap.to(".contact-watermark",{
        y:-44 * intensity,
        ease:"none",
        scrollTrigger:{trigger:".contact-hero",start:"top top",end:"bottom top",scrub}
      });
    }
    const contactParticles = all(".contact-particle");
    if(contactParticles.length){
      gsap.to(contactParticles,{
        y:index => (index % 2 ? 18 : -18) * intensity,
        x:index => (index % 2 ? -10 : 10) * intensity,
        duration:3.9,
        repeat:-1,
        yoyo:true,
        stagger:.13,
        ease:"sine.inOut"
      });
      gsap.to(contactParticles,{
        y:index => (index % 2 ? -34 : -22) * intensity,
        ease:"none",
        scrollTrigger:{trigger:".contact-hero",start:"top top",end:"bottom top",scrub:true}
      });
    }
    const ctaParticles = all(".cta-particle");
    if(ctaParticles.length){
      gsap.to(ctaParticles,{
        y:index => (index % 2 ? 18 : -18) * intensity,
        x:index => (index % 2 ? -8 : 8) * intensity,
        duration:4.1,
        repeat:-1,
        yoyo:true,
        stagger:.13,
        ease:"sine.inOut"
      });
      gsap.to(ctaParticles,{
        y:index => (index % 2 ? -30 : -20) * intensity,
        ease:"none",
        scrollTrigger:{trigger:".contact-final-cta",start:"top bottom",end:"bottom top",scrub:true}
      });
    }
    const contactReveal = all(".contact-reveal");
    if(contactReveal.length){
      const contactSections = [...new Set(contactReveal.map(element => element.closest("section")).filter(Boolean))];
      contactSections.forEach(section => {
        const items = gsap.utils.toArray(section.querySelectorAll(".contact-reveal"));
        if(!items.length) return;
        gsap.from(items,{
          scrollTrigger:{trigger:section,start:"top 84%",once:true},
          y:34 * intensity,
          autoAlpha:0,
          duration:.78,
          stagger:.08,
          ease:"power4.out"
        });
      });
    }
    const contactCounters = all("[data-contact-count]");
    contactCounters.forEach(element => {
      const target = Number(element.dataset.contactCount);
      if(Number.isNaN(target)) return;
      const decimals = element.dataset.contactCount.includes(".") ? 1 : 0;
      const counter = {value:0};
      gsap.to(counter,{
        value:target,
        duration:1.4,
        ease:"power3.out",
        scrollTrigger:{trigger:element,start:"top 88%",once:true},
        onUpdate(){element.textContent = counter.value.toFixed(decimals);}
      });
    });
    if(one(".contact-final-inner h2")){
      gsap.from(".contact-final-inner h2",{
        scrollTrigger:{trigger:".contact-final-cta",start:"top 78%",once:true},
        scale:.94,
        autoAlpha:0,
        duration:.9,
        ease:"power4.out"
      });
    }
  }

  if(one(".cart-page")){
    const cartHeroItems = all(".cart-hero-inner > *");
    if(cartHeroItems.length){
      gsap.from(cartHeroItems,{
        autoAlpha:0,
        y:34 * intensity,
        duration:.82,
        stagger:.1,
        ease:"power4.out"
      });
    }
    const cartCards = all(".premium-cart-item");
    if(cartCards.length){
      gsap.from(cartCards,{
        autoAlpha:0,
        y:36 * intensity,
        duration:.78,
        stagger:.08,
        ease:"power4.out"
      });
    }
    if(one(".order-summary")){
      gsap.from(".order-summary",{
        autoAlpha:0,
        y:34 * intensity,
        duration:.86,
        delay:.08,
        ease:"power4.out"
      });
    }
  }

  const flavorCards = all(".flavor-card");
  if(flavorCards.length){
    gsap.set(flavorCards,{autoAlpha:1,scale:1});
    gsap.from(flavorCards,{
      y:52 * intensity,
      stagger:.12,
      duration:1,
      ease:"power4.out",
      scrollTrigger:{trigger:flavorCards[0].parentElement,start:"top 86%",once:true}
    });
  }

  all(".reveal").forEach(element => {
    if(element.matches(".flavors, .offer-banner, .product-story, .product-card")) return;
    gsap.from(element,{
      scrollTrigger:{trigger:element,start:"top 86%",once:true},
      y:32 * intensity,
      autoAlpha:0,
      duration:.9,
      ease:"power4.out"
    });
  });

  window.addEventListener("load",() => ScrollTrigger.refresh(),{once:true});
});
