const VYRO_PRODUCTS = [
  {id:"citrus",name:"Citrus Volt",price:32,category:"core zero",image:"images/webp/can-card-2.webp",tag:"Lemon peel, yuzu, and clean green tea energy.",flavor:"Lemon peel, yuzu, ginger"},
  {id:"berry",name:"Electric Berry",price:34,category:"core zero",image:"images/webp/can-card-1.webp",tag:"A sparkling berry blend with a clean finish.",flavor:"Wild berry, acai, lime"},
  {id:"tropic",name:"Mango Charge",price:34,category:"limited zero",image:"images/webp/can-card-3.webp",tag:"Mango-forward lift for sunny workdays and late sessions.",flavor:"Mango, pineapple, sea salt"},
  {id:"blue",name:"Blue Rush",price:36,category:"core zero",image:"images/webp/can-card-4.webp",tag:"Blue raspberry energy with a mint-citrus edge.",flavor:"Blue raspberry, mint, citrus"},
  {id:"variety",name:"Launch Variety Pack",price:38,category:"limited",image:"images/vyro-can.svg",tag:"All four launch flavors in one premium case.",flavor:"Three cans of every VYRO flavor"},
  {id:"focus",name:"Focus Case",price:62,category:"core",image:"images/vyro-can.svg",tag:"24 cans for creators, gamers, and desk rituals.",flavor:"Citrus Volt double case"},
  {id:"creator",name:"Creator Drop",price:48,category:"limited",image:"images/vyro-can.svg",tag:"Cans, glass, tote, and launch sticker kit.",flavor:"Limited ecommerce bundle"}
];

const cartState = {
  items: JSON.parse(localStorage.getItem("vyroCart") || "[]")
};

function saveCart(){
  localStorage.setItem("vyroCart", JSON.stringify(cartState.items));
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
  if(openDrawer) document.body.classList.add("cart-open");
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
  const drawer = document.querySelector(".cart-drawer");
  if(!drawer) return;
  const totalItems = cartState.items.reduce((sum,item) => sum + item.qty, 0);
  const subtotal = cartState.items.reduce((sum,item) => sum + item.price * item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(count => count.textContent = totalItems);
  drawer.innerHTML = `
    <div class="cart-head"><h3>Your Cart</h3><button class="icon-btn cart-close" aria-label="Close cart"><i class="fa-solid fa-xmark"></i></button></div>
    <div class="cart-items">
      ${cartState.items.length ? cartState.items.map(item => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
          <div>
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
            <div class="qty-mini"><button data-cart-step="-1" data-id="${item.id}">-</button><span>${item.qty}</span><button data-cart-step="1" data-id="${item.id}">+</button></div>
          </div>
          <button data-remove="${item.id}" aria-label="Remove ${item.name}"><i class="fa-solid fa-trash"></i></button>
        </div>`).join("") : `<p>Your cart is ready for its first VYRO drop.</p>`}
    </div>
    <div class="cart-foot">
      <div class="coupon"><input placeholder="Coupon code"><button class="btn ghost">Apply</button></div>
      <div class="subtotal"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <a class="btn primary" href="checkout.html" style="width:100%">Checkout</a>
    </div>`;
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
