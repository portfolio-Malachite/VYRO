const VYRO_PRODUCTS = [
  {id:"citrus",name:"Citrus Volt",price:32,category:"core zero",image:"images/webp/can-card-2.webp",tag:"Lemon peel, yuzu, and clean green tea energy.",flavor:"Lemon peel, yuzu, ginger"},
  {id:"berry",name:"Electric Berry",price:34,category:"core zero",image:"images/webp/can-card-1.webp",tag:"A sparkling berry blend with a clean finish.",flavor:"Wild berry, acai, lime"},
  {id:"tropic",name:"Mango Charge",price:34,category:"limited zero",image:"images/webp/can-card-3.webp",tag:"Mango-forward lift for sunny workdays and late sessions.",flavor:"Mango, pineapple, sea salt"},
  {id:"blue",name:"Blue Rush",price:36,category:"core zero",image:"images/webp/can-card-4.webp",tag:"Blue raspberry energy with a mint-citrus edge.",flavor:"Blue raspberry, mint, citrus"},
  {id:"variety",name:"Launch Variety Pack",price:38,category:"limited",image:"images/vyro-can.svg",tag:"All four launch flavors in one premium case.",flavor:"Three cans of every VYRO flavor"},
  {id:"focus",name:"Focus Case",price:62,category:"core",image:"images/vyro-can.svg",tag:"24 cans for creators, gamers, and desk rituals.",flavor:"Citrus Volt double case"},
  {id:"creator",name:"Creator Drop",price:48,category:"limited",image:"images/vyro-can.svg",tag:"Cans, glass, tote, and launch sticker kit.",flavor:"Limited ecommerce bundle"}
];

window.VYRO_PRODUCTS = VYRO_PRODUCTS;

let memoryCart = [];

function readStoredCart(){
  try{
    const stored = window.localStorage?.getItem("vyroCart");
    return JSON.parse(stored || "[]");
  }catch(error){
    console.warn("[VYRO Cart] Storage unavailable, using in-memory cart.", error);
    return memoryCart;
  }
}

function writeStoredCart(items){
  memoryCart = items;
  try{
    window.localStorage?.setItem("vyroCart", JSON.stringify(items));
  }catch(error){
    console.warn("[VYRO Cart] Cart saved in memory only.", error);
  }
}

const cartState = {
  items: readStoredCart()
};

function saveCart(){
  writeStoredCart(cartState.items);
  renderCart();
  window.dispatchEvent(new CustomEvent("vyro:cart-updated"));
}

function getCartQty(id){
  return cartState.items.find(item => item.id === id)?.qty || 0;
}

function setCartQty(id, qty = 1, openDrawer = false){
  const product = VYRO_PRODUCTS.find(item => item.id === id) || VYRO_PRODUCTS[0];
  const existing = cartState.items.find(item => item.id === product.id);
  const nextQty = Math.max(1, qty);
  if(existing){ existing.qty = nextQty; }
  else{ cartState.items.push({...product, qty: nextQty}); }
  saveCart();
}

function addToCart(id, qty = 1, openDrawer = true){
  const current = getCartQty(id);
  setCartQty(id, current + qty, openDrawer);
}

function changeQty(id, step){
  const item = cartState.items.find(product => product.id === id);
  if(!item) return;
  item.qty += step;
  if(item.qty <= 0) cartState.items = cartState.items.filter(product => product.id !== id);
  saveCart();
}

function removeCartItem(id){
  cartState.items = cartState.items.filter(product => product.id !== id);
  saveCart();
}

function renderCart(){
  const totalItems = cartState.items.reduce((sum,item) => sum + item.qty, 0);
  const subtotal = cartState.items.reduce((sum,item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = subtotal > 0 ? subtotal * .0825 : 0;
  const total = subtotal + shipping + tax;
  document.querySelectorAll(".cart-count").forEach(count => count.textContent = totalItems);
  document.querySelectorAll("[data-cart-total-items]").forEach(count => count.textContent = totalItems);

  renderCartPage({totalItems, subtotal, shipping, tax, total});

  const drawer = document.querySelector(".cart-drawer");
  if(!drawer) return;
  drawer.innerHTML = "";
}

function renderCartPage({subtotal, shipping, tax, total}){
  const cartPage = document.querySelector("[data-cart-page]");
  if(!cartPage) return;

  if(!cartState.items.length){
    cartPage.innerHTML = `
      <div class="cart-empty-state">
        <div>
          <span class="eyebrow">Empty Bag</span>
          <h2>Your VYRO bag is ready.</h2>
          <p>Add clean energy flavors to build your daily performance stack.</p>
          <a class="continue-shopping" href="shop.html">Shop Collection <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>`;
    return;
  }

  cartPage.innerHTML = `
    <div class="cart-items-panel">
      ${cartState.items.map(item => `
        <article class="premium-cart-item">
          <div class="cart-product-media"><img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async"></div>
          <div class="cart-product-copy">
            <h3>${item.name}</h3>
            <span class="flavor">${item.flavor}</span>
            <p>${item.tag}</p>
            <div class="cart-item-bottom">
              <div class="cart-qty-control" aria-label="Quantity selector">
                <button type="button" data-cart-step="-1" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                <span>${item.qty}</span>
                <button type="button" data-cart-step="1" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <button class="cart-link-action" type="button">Save for later</button>
              <button class="cart-link-action" type="button" data-remove="${item.id}">Remove</button>
            </div>
          </div>
          <strong class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</strong>
        </article>`).join("")}
    </div>
    <aside class="order-summary">
      <h2>Order Summary</h2>
      <div class="summary-coupon"><input placeholder="Coupon code"><button type="button">Apply</button></div>
      <div class="summary-lines">
        <div class="summary-line"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
        <div class="summary-line"><span>Shipping</span><strong>${shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</strong></div>
        <div class="summary-line"><span>Tax</span><strong>$${tax.toFixed(2)}</strong></div>
        <div class="summary-line total"><span>Total</span><strong>$${total.toFixed(2)}</strong></div>
      </div>
      <a class="checkout-button" href="checkout.html">Checkout <i class="fa-solid fa-arrow-right"></i></a>
      <div class="payment-buttons">
        <button type="button"><i class="fa-brands fa-apple"></i> Pay</button>
        <button type="button">G Pay</button>
        <button type="button"><i class="fa-brands fa-paypal"></i></button>
      </div>
      <div class="trust-list">
        <span><i class="fa-solid fa-check"></i> Secure payment</span>
        <span><i class="fa-solid fa-check"></i> Fast shipping</span>
        <span><i class="fa-solid fa-check"></i> Easy returns</span>
      </div>
    </aside>`;
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const stepButton = event.target.closest("[data-cart-step]");
  if(addButton) addToCart(addButton.dataset.add);
  if(removeButton) removeCartItem(removeButton.dataset.remove);
  if(stepButton) changeQty(stepButton.dataset.id, Number(stepButton.dataset.cartStep));
});

document.addEventListener("DOMContentLoaded", renderCart);

window.getCartQty = getCartQty;
window.setCartQty = setCartQty;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeCartItem = removeCartItem;
window.renderCart = renderCart;
