function setupChrome(){
  if(!document.querySelector(".announcement")){
    document.body.insertAdjacentHTML("afterbegin", `<div class="announcement"><div class="marquee-track"><span>NATURAL CAFFEINE</span><span>ZERO SUGAR</span><span>NO CRASH</span><span>B12 + B6</span><span>CLEAN ENERGY</span><span>PERFORMANCE DRINK</span><span>NATURAL CAFFEINE</span><span>ZERO SUGAR</span><span>NO CRASH</span><span>B12 + B6</span><span>CLEAN ENERGY</span><span>PERFORMANCE DRINK</span></div></div>`);
  }
  const navbar = document.querySelector(".navbar");
  if(navbar){
    navbar.style.opacity = "1";
    navbar.style.visibility = "visible";
  }
  let navTicking = false;
  const setNav = () => {
    if(navbar) navbar.classList.toggle("scrolled", window.scrollY > 18);
    navTicking = false;
  };
  const requestNavUpdate = () => {
    if(navTicking) return;
    navTicking = true;
    window.requestAnimationFrame(setNav);
  };
  setNav();
  window.addEventListener("scroll", requestNavUpdate, {passive:true});

  document.querySelectorAll(".menu-toggle").forEach(button => button.addEventListener("click", () => document.body.classList.toggle("nav-open")));
  document.querySelectorAll(".cart-toggle").forEach(button => button.addEventListener("click", () => {
    window.location.href = "cart.html";
  }));
  document.addEventListener("click", event => {
    if(event.target.closest(".cart-close") || event.target.classList.contains("backdrop")){
      document.body.classList.remove("nav-open");
    }
  });
  document.querySelectorAll(".search-toggle").forEach(button => button.addEventListener("click", () => document.body.classList.add("search-open")));
  document.querySelectorAll(".close-search").forEach(button => button.addEventListener("click", () => document.body.classList.remove("search-open")));
}

function productCard(product){
  return `
    <article class="product-card" data-name="${product.name.toLowerCase()}" data-category="${product.category}" data-price="${product.price}">
      <a href="product.html"><img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async"></a>
      <h3>${product.name}</h3>
      <p>${product.tag}</p>
      <div class="meta"><span>${product.flavor}</span><strong>$${product.price}</strong></div>
      <div class="card-actions"><button class="btn primary" data-add="${product.id}">Add To Cart</button><button class="quick-btn" data-quick="${product.id}" aria-label="Quick view"><i class="fa-regular fa-eye"></i></button></div>
    </article>`;
}

function getVyroProducts(){
  const products = window.VYRO_PRODUCTS || (typeof VYRO_PRODUCTS !== "undefined" ? VYRO_PRODUCTS : []);
  if(!Array.isArray(products)){
    console.warn("[VYRO Shop] Product data is not an array.", products);
    return [];
  }
  return products.filter(product => {
    const valid = product && product.id && product.name && Number.isFinite(Number(product.price)) && product.image;
    if(!valid) console.warn("[VYRO Shop] Skipping invalid product.", product);
    return valid;
  });
}

function setupShop(){
  const grid = document.getElementById("productGrid");
  const related = document.querySelector(".related-products");
  const search = document.getElementById("productSearch");
  const sort = document.getElementById("sortProducts");
  const tabs = document.querySelector("[data-filter-tabs]");
  let activeCategory = "all";
  const productsSource = getVyroProducts();

  console.info("[VYRO Shop] Product grid found:", Boolean(grid));
  console.info("[VYRO Shop] Product count:", productsSource.length);
  productsSource.forEach(product => {
    const image = new Image();
    image.onerror = () => console.warn("[VYRO Shop] Missing image:", product.name, product.image);
    image.src = product.image;
  });

  const renderEmpty = message => {
    if(!grid) return;
    grid.innerHTML = `<div class="product-empty">${message}</div>`;
    console.warn("[VYRO Shop] Render fallback:", message);
  };

  const logFirstProductCardStyles = () => {
    const firstCard = grid?.querySelector(".product-card");
    if(!firstCard) return;
    const styles = window.getComputedStyle(firstCard);
    console.info("[VYRO Shop] First product card computed styles:", {
      display: styles.display,
      opacity: styles.opacity,
      visibility: styles.visibility,
      transform: styles.transform,
      pointerEvents: styles.pointerEvents,
      height: styles.height,
      width: styles.width
    });
  };

  const forceVisibleProductCards = () => {
    grid?.querySelectorAll(".product-card").forEach(card => {
      card.style.opacity = "1";
      card.style.visibility = "visible";
      card.style.transform = "none";
      card.style.pointerEvents = "auto";
      card.style.scale = "1";
    });
    logFirstProductCardStyles();
  };

  const draw = () => {
    if(!grid){
      console.warn("[VYRO Shop] #productGrid container is missing.");
      return;
    }
    if(!productsSource.length){
      renderEmpty("No products available");
      return;
    }
    const query = (search?.value || "").toLowerCase();
    let products = productsSource.filter(product => {
      const categoryMatch = activeCategory === "all" || product.category.includes(activeCategory);
      const queryMatch = `${product.name} ${product.tag} ${product.flavor}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
    if(sort?.value === "price-low") products.sort((a,b) => a.price - b.price);
    if(sort?.value === "price-high") products.sort((a,b) => b.price - a.price);
    console.info("[VYRO Shop] Filter results:", {activeCategory, query, count:products.length});
    if(!products.length){
      renderEmpty("No products available");
      return;
    }
    grid.innerHTML = products.map(productCard).join("");
    console.info("[VYRO Shop] Render status:", `Rendered ${products.length} product cards.`);
    requestAnimationFrame(forceVisibleProductCards);
  };

  tabs?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if(!button) return;
    tabs.querySelectorAll("button").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    draw();
  });
  search?.addEventListener("input", draw);
  sort?.addEventListener("change", draw);
  draw();

  if(related) related.innerHTML = productsSource.slice(1,4).map(productCard).join("");
}

function setupQuickView(){
  const modal = document.getElementById("quickView");
  const content = document.getElementById("quickContent");
  if(!modal || !content) return;
  let quickQty = 1;
  let activeProduct = null;

  const quickDescription = product => {
    const descriptions = {
      berry: "Wild berry, acai and lime combine with clean green-tea energy for a smooth, zero-sugar boost.",
      citrus: "Lemon peel, yuzu and ginger deliver bright citrus energy with a clean, zero-sugar finish.",
      tropic: "Mango and pineapple notes layered with light sea salt create a vibrant, smooth energy lift.",
      blue: "Blue raspberry, mint and citrus blend into a crisp, cooling zero-sugar focus ritual."
    };
    return descriptions[product.id] || product.tag;
  };

  const splitTitle = name => {
    const words = String(name || "").trim().split(/\s+/);
    if(words.length < 2) return name;
    const first = words.slice(0, -1).join(" ");
    const last = words.slice(-1).join(" ");
    return `${first}<br>${last}`;
  };

  const openQuickView = id => {
    const product = getVyroProducts().find(item => item.id === id);
    if(!product) return;
    activeProduct = product;
    quickQty = Math.max(1, typeof getCartQty === "function" ? getCartQty(product.id) || 1 : 1);
    content.innerHTML = `
      <div class="quick-content">
        <div class="quick-media">
          <img src="${product.image}" alt="${product.name}" decoding="async">
        </div>
        <div class="quick-details">
          <span class="quick-eyebrow">Discover Flavor</span>
          <h2 class="quick-title">${splitTitle(product.name)}</h2>
          <p class="quick-description">${quickDescription(product)}</p>
          <div class="quick-ingredients"><span>Ingredients</span><strong>${product.flavor}, green tea caffeine, B12 + B6, electrolytes.</strong></div>
          <p class="quick-price">$${product.price}.00</p>
          <div class="quick-qty" aria-label="Quantity selector">
            <button type="button" data-quick-step="-1" aria-label="Decrease quantity">-</button>
            <span data-quick-qty>${quickQty}</span>
            <button type="button" data-quick-step="1" aria-label="Increase quantity">+</button>
          </div>
          <div class="quick-actions">
            <button class="quick-buy-now" type="button" data-quick-buy="${product.id}">Buy Now <i class="fa-solid fa-arrow-right"></i></button>
            <button class="quick-add-cart" type="button" data-quick-add="${product.id}"><i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>
          </div>
        </div>
      </div>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
  };

  window.openVyroQuickView = openQuickView;

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-quick]");
    if(!button) return;
    event.preventDefault();
    event.stopPropagation();
    openQuickView(button.dataset.quick);
  });
  document.addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-quick-step]");
    if(qtyButton){
      quickQty = Math.max(1, quickQty + Number(qtyButton.dataset.quickStep));
      const qty = content.querySelector("[data-quick-qty]");
      if(qty) qty.textContent = quickQty;
      return;
    }

    const buyNow = event.target.closest("[data-quick-buy]");
    if(!buyNow) return;
    if(typeof addToCart === "function") addToCart(buyNow.dataset.quickBuy, quickQty, false);
    window.location.href = "checkout.html";
  });
  document.addEventListener("click", event => {
    const quickAdd = event.target.closest(".quick-add-cart[data-quick-add]");
    if(!quickAdd || !activeProduct) return;
    event.preventDefault();
    event.stopPropagation();
    if(typeof addToCart === "function") addToCart(activeProduct.id, quickQty, true);
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
  });
  modal.addEventListener("click", event => {
    if(event.target === modal || event.target.closest(".quick-close")){
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden","true");
    }
  });
}

function setupProductQty(){
  const input = document.querySelector(".qty-input");
  document.querySelectorAll(".qty-step").forEach(button => button.addEventListener("click", () => {
    const next = Math.max(1, Number(input.value) + Number(button.dataset.step));
    input.value = next;
  }));
  document.querySelector(".add-detail-cart")?.addEventListener("click", () => addToCart("citrus", Number(input.value)));
}

function setupSwiper(){
  if(window.Swiper && document.querySelector(".review-swiper")){
    new Swiper(".review-swiper",{slidesPerView:1.15,spaceBetween:18,loop:true,breakpoints:{760:{slidesPerView:2.2},1040:{slidesPerView:3}}});
  }
}

function setupOfferCountdown(){
  const countdown = document.querySelector("[data-offer-countdown]");
  if(!countdown) return;

  const daysEl = countdown.querySelector('[data-time="days"]');
  const hoursEl = countdown.querySelector('[data-time="hours"]');
  const minsEl = countdown.querySelector('[data-time="minutes"]');
  const secsEl = countdown.querySelector('[data-time="seconds"]');
  const expiredEl = countdown.parentElement?.querySelector(".offer-expired");
  const target = Date.now() + (50 * 24 * 60 * 60 * 1000);

  const update = () => {
    const remaining = target - Date.now();
    if(remaining <= 0){
      daysEl.textContent = "0";
      hoursEl.textContent = "0";
      minsEl.textContent = "0";
      secsEl.textContent = "0";
      countdown.hidden = true;
      if(expiredEl) expiredEl.hidden = false;
      return true;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(minutes).padStart(2, "0");
    secsEl.textContent = String(seconds).padStart(2, "0");
    if(expiredEl) expiredEl.hidden = true;
    return false;
  };

  if(update()) return;
  const timer = setInterval(() => {
    if(update()) clearInterval(timer);
  }, 1000);
}

function setupFlavorSelector(){
  const cards = [...document.querySelectorAll(".flavor-card[data-flavor]")];
  if(!cards.length) return;
  let selectedFlavor = null;
  const storefront = document.querySelector(".flavor-storefront");
  const filters = document.querySelector(".flavor-filters");

  const productRoute = key => ({
    berry: "product.html?flavor=electric-berry",
    citrus: "product.html?flavor=citrus-volt",
    mango: "product.html?flavor=mango-charge",
    blue: "product.html?flavor=blue-rush"
  })[key] || "product.html";

  const cardQty = id => typeof getCartQty === "function" ? getCartQty(id) : 0;

  const renderCardAction = card => {
    const id = card.dataset.cartId;
    const amount = cardQty(id);
    const actions = card.querySelector(".flavor-card-actions");
    if(!actions) return;
    actions.innerHTML = amount > 0 ? `
      <button class="card-buy-now" type="button" data-card-buy="${id}">Buy Now <i class="fa-solid fa-arrow-right"></i></button>
      <div class="card-qty-control quantity-selector" aria-label="Quantity selector">
        <button class="minus-btn qty-btn" type="button" data-card-step="-1" data-card-id="${id}" aria-label="Decrease quantity">−</button>
        <span class="quantity-value qty-value">${amount}</span>
        <button class="plus-btn qty-btn" type="button" data-card-step="1" data-card-id="${id}" aria-label="Increase quantity">+</button>
      </div>`
    : `
      <button class="card-buy-now" type="button" data-card-buy="${id}">Buy Now <i class="fa-solid fa-arrow-right"></i></button>
      <button class="card-add-cart" type="button" data-card-add="${id}"><i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>`;
  };

  const setActiveCard = card => {
    cards.forEach(item => item.classList.remove("active"));
    selectedFlavor = card?.dataset.flavor || null;
    if(card && selectedFlavor) card.classList.add("active");
  };

  const forceFlavorCardsVisible = () => {
    if(storefront){
      storefront.style.display = "grid";
      storefront.style.minHeight = "auto";
      storefront.style.overflow = "visible";
    }
    cards.forEach(card => {
      card.style.opacity = "1";
      card.style.visibility = "visible";
      card.style.pointerEvents = "auto";
      card.style.scale = "1";
      if(!card.classList.contains("is-hidden")) card.style.display = "";
    });
    const firstCard = cards[0];
    const gridStyles = storefront ? window.getComputedStyle(storefront) : null;
    const gridVisible = Boolean(storefront) && gridStyles.display !== "none" && gridStyles.visibility !== "hidden";
    console.info("Product cards rendered:", cards.length > 0);
    console.info("Number of cards:", cards.length);
    console.info("Grid visible:", gridVisible);
    console.info("[VYRO Home] Product cards rendered:", cards.length > 0);
    console.info("[VYRO Home] Number of cards:", cards.length);
    console.info("[VYRO Home] Grid visible:", gridVisible);
    if(firstCard){
      const cardStyles = window.getComputedStyle(firstCard);
      console.info("[VYRO Home] First flavor card styles:", {
        display: cardStyles.display,
        opacity: cardStyles.opacity,
        visibility: cardStyles.visibility,
        transform: cardStyles.transform,
        height: cardStyles.height,
        overflow: cardStyles.overflow
      });
    }
  };

  const applyFilter = filter => {
    storefront?.classList.toggle("is-filtered", filter !== "all");
    cards.forEach(card => {
      card.classList.remove("flavor-featured");
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.flavor !== filter);
    });
    filters?.querySelectorAll("button").forEach(button => button.classList.toggle("active", button.dataset.flavorFilter === filter));
    requestAnimationFrame(forceFlavorCardsVisible);
  };

  // Never preselect on load.
  setActiveCard(null);
  applyFilter("all");

  cards.forEach(card => {
    storefront?.appendChild(card);
    card.classList.remove("flavor-featured","is-hidden");
    card.dataset.productUrl = card.dataset.productUrl || productRoute(card.dataset.flavor);
    renderCardAction(card);
    card.addEventListener("click", event => {
      if(event.target.closest("[data-card-add],[data-card-buy],[data-card-step]")) return;
      event.stopPropagation();
      setActiveCard(card);
      if(typeof window.openVyroQuickView === "function") window.openVyroQuickView(card.dataset.cartId);
    });
    card.addEventListener("keydown", event => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        setActiveCard(card);
        if(typeof window.openVyroQuickView === "function") window.openVyroQuickView(card.dataset.cartId);
      }
    });
  });
  filters?.addEventListener("click", event => {
    const button = event.target.closest("[data-flavor-filter]");
    if(!button) return;
    applyFilter(button.dataset.flavorFilter);
  });
  storefront?.addEventListener("click", event => {
    const control = event.target.closest("[data-card-add],[data-card-buy],[data-card-step]");
    if(!control) return;
    event.preventDefault();
    event.stopPropagation();

    const id = control.dataset.cardAdd || control.dataset.cardBuy || control.dataset.cardId;
    if(control.dataset.cardAdd){
      if(typeof addToCart === "function") addToCart(id, 1, false);
      cards.forEach(renderCardAction);
      return;
    }
    if(control.dataset.cardStep){
      const current = cardQty(id);
      if(Number(control.dataset.cardStep) > 0){
        if(typeof addToCart === "function") addToCart(id, 1, false);
      }else if(current <= 1){
        if(typeof removeCartItem === "function") removeCartItem(id);
      }else if(typeof changeQty === "function"){
        changeQty(id, -1);
      }
      cards.forEach(renderCardAction);
      return;
    }
    if(control.dataset.cardBuy){
      if(cardQty(id) <= 0 && typeof addToCart === "function") addToCart(id, 1, false);
      window.location.href = "checkout.html";
    }
  });
  window.addEventListener("vyro:cart-updated", () => cards.forEach(renderCardAction));
  window.addEventListener("storage", event => {
    if(event.key === "vyroCart") cards.forEach(renderCardAction);
  });
  requestAnimationFrame(forceFlavorCardsVisible);
}

document.addEventListener("DOMContentLoaded", () => {
  setupChrome();
  setupShop();
  setupQuickView();
  setupProductQty();
  setupSwiper();
  setupOfferCountdown();
  setupFlavorSelector();
});
