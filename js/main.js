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
  document.querySelectorAll(".cart-toggle").forEach(button => button.addEventListener("click", () => document.body.classList.add("cart-open")));
  document.addEventListener("click", event => {
    if(event.target.closest(".cart-close") || event.target.classList.contains("backdrop")){
      document.body.classList.remove("cart-open","nav-open");
    }
  });
  document.querySelectorAll(".search-toggle").forEach(button => button.addEventListener("click", () => document.body.classList.add("search-open")));
  document.querySelectorAll(".close-search").forEach(button => button.addEventListener("click", () => document.body.classList.remove("search-open")));
}

function productCard(product){
  return `
    <article class="product-card reveal" data-name="${product.name.toLowerCase()}" data-category="${product.category}" data-price="${product.price}">
      <a href="product.html"><img src="${product.image}" alt="${product.name}" loading="lazy" decoding="async"></a>
      <h3>${product.name}</h3>
      <p>${product.tag}</p>
      <div class="meta"><span>${product.flavor}</span><strong>$${product.price}</strong></div>
      <div class="card-actions"><button class="btn primary" data-add="${product.id}">Add To Cart</button><button class="quick-btn" data-quick="${product.id}" aria-label="Quick view"><i class="fa-regular fa-eye"></i></button></div>
    </article>`;
}

function setupShop(){
  const grid = document.getElementById("productGrid");
  const related = document.querySelector(".related-products");
  const search = document.getElementById("productSearch");
  const sort = document.getElementById("sortProducts");
  const tabs = document.querySelector("[data-filter-tabs]");
  let activeCategory = "all";

  const draw = () => {
    if(!grid) return;
    const query = (search?.value || "").toLowerCase();
    let products = VYRO_PRODUCTS.filter(product => {
      const categoryMatch = activeCategory === "all" || product.category.includes(activeCategory);
      const queryMatch = `${product.name} ${product.tag} ${product.flavor}`.toLowerCase().includes(query);
      return categoryMatch && queryMatch;
    });
    if(sort?.value === "price-low") products.sort((a,b) => a.price - b.price);
    if(sort?.value === "price-high") products.sort((a,b) => b.price - a.price);
    grid.innerHTML = products.map(productCard).join("");
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

  if(related) related.innerHTML = VYRO_PRODUCTS.slice(1,4).map(productCard).join("");
}

function setupQuickView(){
  const modal = document.getElementById("quickView");
  const content = document.getElementById("quickContent");
  if(!modal || !content) return;

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

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-quick]");
    if(!button) return;
    const product = VYRO_PRODUCTS.find(item => item.id === button.dataset.quick);
    if(!product) return;
    content.innerHTML = `
      <div class="quick-content">
        <div class="quick-media">
          <img src="${product.image}" alt="${product.name}" decoding="async">
        </div>
        <div class="quick-details">
          <span class="quick-eyebrow">Discover Flavor</span>
          <h2 class="quick-title">${splitTitle(product.name)}</h2>
          <p class="quick-description">${quickDescription(product)}</p>
          <p class="quick-price">$${product.price}.00</p>
          <div class="quick-actions">
            <button class="quick-buy-now" type="button" data-quick-buy="${product.id}">Buy Now <i class="fa-solid fa-arrow-right"></i></button>
            <button class="quick-add-cart" type="button" data-add="${product.id}"><i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>
          </div>
        </div>
      </div>`;
    modal.classList.add("open");
  });
  document.addEventListener("click", event => {
    const buyNow = event.target.closest("[data-quick-buy]");
    if(!buyNow) return;
    if(typeof addToCart === "function") addToCart(buyNow.dataset.quickBuy, 1, false);
    window.location.href = "checkout.html";
  });
  modal.addEventListener("click", event => {
    if(event.target === modal || event.target.closest(".quick-close")) modal.classList.remove("open");
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

  // Never preselect on load.
  setActiveCard(null);

  cards.forEach(card => {
    card.dataset.productUrl = card.dataset.productUrl || productRoute(card.dataset.flavor);
    renderCardAction(card);
    card.addEventListener("click", event => {
      if(event.target.closest("[data-card-add],[data-card-buy],[data-card-step]")) return;
      setActiveCard(card);
      window.location.href = card.dataset.productUrl;
    });
    card.addEventListener("keydown", event => {
      if(event.key === "Enter" || event.key === " "){
        event.preventDefault();
        setActiveCard(card);
        window.location.href = card.dataset.productUrl;
      }
    });
  });
  document.querySelector(".flavor-grid")?.addEventListener("click", event => {
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
