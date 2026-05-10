// ===========================
// STORAGE KEYS
// ===========================
var CART_KEY  = 'brand_cart';
var SAVED_KEY = 'brand_saved';

// ===========================
// CART HELPERS
// ===========================
function getCart()  { try { return JSON.parse(localStorage.getItem(CART_KEY)  || '[]'); } catch(e) { return []; } }
function getSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch(e) { return []; } }
function saveCart(c)  { localStorage.setItem(CART_KEY,  JSON.stringify(c)); }
function saveSaved(s) { localStorage.setItem(SAVED_KEY, JSON.stringify(s)); }

function isInCart(name) {
  return getCart().some(function(i){ return i.name === name; });
}

// ===========================
// ADD TO CART
// ===========================
function addToCart(imgSrc, name, price, btnEl) {
  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) { cart[i].qty = (cart[i].qty || 1) + 1; found = true; break; }
  }
  if (!found) cart.push({ img: imgSrc, name: name, price: price, qty: 1 });
  saveCart(cart);
  updateCartBadge();
  if (btnEl) setButtonAdded(btnEl);
  showToast('✓ Added to cart: ' + name, '#16a34a');
}

// ===========================
// SAVE FOR LATER (move cart → saved)
// ===========================
function saveForLater(idx) {
  var cart  = getCart();
  var saved = getSaved();
  if (!cart[idx]) return;
  var item = cart.splice(idx, 1)[0];
  // avoid duplicates in saved
  var already = false;
  for (var i = 0; i < saved.length; i++) {
    if (saved[i].name === item.name) { already = true; break; }
  }
  if (!already) saved.push(item);
  saveCart(cart);
  saveSaved(saved);
  renderCartItems();
  renderSavedItems();
  updateCartBadge();
  showToast('💾 Saved for later: ' + item.name, '#1a6ef7');
}

// Move from saved back to cart
function moveToCart(idx) {
  var saved = getSaved();
  var cart  = getCart();
  if (!saved[idx]) return;
  var item = saved.splice(idx, 1)[0];
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === item.name) { cart[i].qty = (cart[i].qty || 1) + 1; found = true; break; }
  }
  if (!found) cart.push(item);
  saveSaved(saved);
  saveCart(cart);
  renderCartItems();
  renderSavedItems();
  updateCartBadge();
  showToast('🛒 Moved to cart: ' + item.name, '#16a34a');
}

// Remove from saved
function removeSavedItem(idx) {
  var saved = getSaved();
  saved.splice(idx, 1);
  saveSaved(saved);
  renderSavedItems();
  showToast('Removed from saved items', '#606060');
}

// ===========================
// BUTTON STATES
// ===========================
function setButtonAdded(btn) {
  btn.textContent = '✓ Added to Cart';
  btn.classList.remove('btn-add-again');
  btn.classList.add('btn-added');
}
function setButtonAddAgain(btn) {
  btn.textContent = '+ Add Again';
  btn.classList.remove('btn-added');
  btn.classList.add('btn-add-again');
}
function setButtonDefault(btn) {
  btn.textContent = 'Add to cart';
  btn.classList.remove('btn-added', 'btn-add-again');
}

// ===========================
// CART BADGE
// ===========================
function updateCartBadge() {
  var total = 0;
  getCart().forEach(function(i){ total += (i.qty || 1); });
  document.querySelectorAll('a.header-action[href="cart.html"]').forEach(function(a) {
    var span = a.querySelector('span');
    if (span) span.textContent = total > 0 ? 'My cart (' + total + ')' : 'My cart';
  });
}

// ===========================
// TOAST
// ===========================
function showToast(msg, color) {
  var toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = 'position:fixed;bottom:28px;right:28px;color:#fff;padding:12px 22px;border-radius:8px;font-size:13.5px;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.18);transition:opacity 0.3s;pointer-events:none;max-width:300px;';
    document.body.appendChild(toast);
  }
  toast.style.background = color || '#16a34a';
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(function(){ toast.style.opacity = '0'; }, 2600);
}

// ===========================
// SEARCH
// ===========================
function handleSearch() {
  var q = document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '';
  sessionStorage.setItem('searchQuery', q);
  window.location.href = 'listing.html';
}

// ===========================
// NAVIGATION
// ===========================
function goToProduct(imgSrc, name, price) {
  sessionStorage.setItem('productImg', imgSrc);
  sessionStorage.setItem('productName', name);
  sessionStorage.setItem('productPrice', price);
  window.location.href = 'product.html';
}
function goToProductPage(imgSrc, name, price) {
  sessionStorage.setItem('productImg', imgSrc);
  sessionStorage.setItem('productName', name);
  sessionStorage.setItem('productPrice', price);
  window.location.href = 'product.html';
}

// ===========================
// COUNTDOWN TIMER
// ===========================
function updateCountdown() {
  var els = document.querySelectorAll('.count-num');
  if (!els.length) return;
  var s = parseInt(els[3] && els[3].textContent) || 56;
  var m = parseInt(els[2] && els[2].textContent) || 34;
  var h = parseInt(els[1] && els[1].textContent) || 13;
  var d = parseInt(els[0] && els[0].textContent) || 4;
  setInterval(function() {
    s--;
    if (s < 0) { s = 59; m--; }
    if (m < 0) { m = 59; h--; }
    if (h < 0) { h = 23; d--; }
    if (d < 0) d = 0;
    if (els[0]) els[0].textContent = String(d).padStart(2,'0');
    if (els[1]) els[1].textContent = String(h).padStart(2,'0');
    if (els[2]) els[2].textContent = String(m).padStart(2,'0');
    if (els[3]) els[3].textContent = String(s).padStart(2,'0');
  }, 1000);
}

// ===========================
// LISTING PAGE
// ===========================
function initListingPage() {
  var q = sessionStorage.getItem('searchQuery');
  if (q) { var si = document.getElementById('searchInput'); if (si) si.value = q; }
  var gridBtn  = document.querySelector('.view-btn[data-view="grid"]');
  var listBtn  = document.querySelector('.view-btn[data-view="list"]');
  var listView = document.getElementById('productListView');
  var gridView = document.getElementById('productGridView');
  if (!gridBtn || !listBtn) return;
  if (listView) listView.style.display = 'flex';
  if (gridView) gridView.style.display = 'none';
  listBtn.classList.add('active'); gridBtn.classList.remove('active');
  gridBtn.addEventListener('click', function() {
    gridBtn.classList.add('active'); listBtn.classList.remove('active');
    if (listView) listView.style.display = 'none';
    if (gridView) gridView.style.display = 'grid';
  });
  listBtn.addEventListener('click', function() {
    listBtn.classList.add('active'); gridBtn.classList.remove('active');
    if (listView) listView.style.display = 'flex';
    if (gridView) gridView.style.display = 'none';
  });
  document.querySelectorAll('.filter-tag').forEach(function(tag) {
    tag.addEventListener('click', function() { tag.remove(); });
  });
  var clearAll = document.querySelector('.clear-all');
  if (clearAll) clearAll.addEventListener('click', function() {
    document.querySelectorAll('.filter-tag').forEach(function(t) { t.remove(); });
  });
  document.querySelectorAll('.page-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (btn.querySelector('i')) return;
      document.querySelectorAll('.page-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
}

// ===========================
// PRODUCT PAGE
// ===========================
function initProductPage() {
  var storedImg   = sessionStorage.getItem('productImg');
  var storedName  = sessionStorage.getItem('productName');
  var storedPrice = sessionStorage.getItem('productPrice');
  var mainImg      = document.getElementById('mainProductImg');
  var productTitle = document.querySelector('.product-title');
  var thumbs       = document.querySelectorAll('.product-thumb');
  if (storedImg) {
    if (mainImg) { mainImg.src = storedImg; mainImg.alt = storedName || 'Product'; }
    if (thumbs.length > 0) { thumbs[0].src = storedImg; thumbs[0].alt = storedName || 'Product'; }
  }
  thumbs.forEach(function(t) { t.classList.remove('active'); });
  if (thumbs.length > 0) thumbs[0].classList.add('active');
  if (storedName && productTitle) productTitle.textContent = storedName;
  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      if (mainImg) { mainImg.src = thumb.src; mainImg.alt = thumb.alt; }
    });
  });
  var pbtn = document.getElementById('productAddToCart');
  if (pbtn) {
    if (storedImg)   pbtn.setAttribute('data-img', storedImg);
    if (storedName)  pbtn.setAttribute('data-name', storedName);
    if (storedPrice) pbtn.setAttribute('data-price', storedPrice);
    if (storedName && isInCart(storedName)) setButtonAdded(pbtn);
  }
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var t = document.getElementById(btn.dataset.tab);
      if (t) t.classList.add('active');
    });
  });
}

// ===========================
// CART PAGE — render cart items
// ===========================
function initCartPage() {
  renderCartItems();
  renderSavedItems();
  var removeAll = document.querySelector('.btn-remove-all');
  if (removeAll) removeAll.addEventListener('click', function() {
    saveCart([]); renderCartItems(); updateCartBadge();
  });
}

function renderCartItems() {
  var cart = getCart();
  var container = document.getElementById('cartItemsContainer');
  var titleEl   = document.getElementById('cartTitle');
  var total = 0;
  cart.forEach(function(i){ total += (i.qty || 1); });
  if (titleEl) titleEl.textContent = 'My cart (' + total + ')';
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div style="background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:40px;text-align:center;color:#8b96a5;font-size:15px;">Your cart is empty. <a href="index.html" style="color:#1a6ef7;font-weight:600;">Continue shopping</a></div>';
    updateSummary(0);
    return;
  }

  var html = '';
  cart.forEach(function(item, i) {
    html += '<div class="cart-item">' +
      '<img src="' + item.img + '" alt="' + escHtml(item.name) + '" class="cart-item-img" />' +
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + escHtml(item.name) + '</div>' +
        '<div class="cart-item-meta">Size: medium, Color: blue, Material: Plastic</div>' +
        '<div class="cart-item-seller">Seller: Artel Market</div>' +
        '<div class="cart-item-actions">' +
          '<button class="btn-remove" onclick="removeCartItem(' + i + ')">Remove</button>' +
          '<button class="btn-save-for-later" onclick="saveForLater(' + i + ')">Save for later</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-right">' +
        '<span class="cart-item-price">' + escHtml(item.price) + '</span>' +
        '<select class="cart-qty-select" onchange="updateCartQty(' + i + ', this.value)">' + buildQtyOptions(item.qty) + '</select>' +
      '</div>' +
    '</div>';
  });
  container.innerHTML = html;

  var subtotal = 0;
  cart.forEach(function(item) {
    var p = parseFloat((item.price || '$0').replace(/[^0-9.]/g,'')) || 0;
    subtotal += p * (item.qty || 1);
  });
  updateSummary(subtotal);
}

// ===========================
// SAVED FOR LATER — render
// ===========================
function renderSavedItems() {
  var saved = getSaved();
  var section  = document.getElementById('savedSection');
  var grid     = document.getElementById('savedGridContainer');
  if (!section || !grid) return;

  if (saved.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';

  var html = '';
  saved.forEach(function(item, i) {
    html += '<div class="saved-item">' +
      '<img src="' + item.img + '" alt="' + escHtml(item.name) + '" />' +
      '<div class="saved-item-info">' +
        '<p class="saved-price">' + escHtml(item.price) + '</p>' +
        '<p class="saved-name">' + escHtml(item.name) + '</p>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' +
          '<button class="btn-move-cart" onclick="moveToCart(' + i + ')"><i class="fas fa-shopping-cart"></i> Move to cart</button>' +
          '<button class="btn-remove-saved" onclick="removeSavedItem(' + i + ')">Remove</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  });
  grid.innerHTML = html;
}

function buildQtyOptions(current) {
  var html = '';
  for (var q = 1; q <= 10; q++) {
    html += '<option value="' + q + '"' + (q === (current || 1) ? ' selected' : '') + '>Qty: ' + q + '</option>';
  }
  return html;
}

function updateCartQty(idx, qty) {
  var cart = getCart();
  if (cart[idx]) cart[idx].qty = parseInt(qty) || 1;
  saveCart(cart); renderCartItems(); updateCartBadge();
}

function removeCartItem(idx) {
  var cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart); renderCartItems(); updateCartBadge();
}

function updateSummary(subtotal) {
  var discount = 60, tax = 14;
  var total = Math.max(0, subtotal - discount + tax);
  var subEl   = document.getElementById('summarySubtotal');
  var totalEl = document.getElementById('summaryTotal');
  if (subEl)   subEl.textContent   = '$' + subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
}

function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===========================
// INIT
// ===========================
document.addEventListener('DOMContentLoaded', function() {
  updateCountdown();
  updateCartBadge();

  var si = document.getElementById('searchInput');
  if (si) si.addEventListener('keydown', function(e) { if (e.key === 'Enter') handleSearch(); });

  // Wire up Add to Cart buttons with smart 3-state logic
  document.querySelectorAll('.btn-add-to-cart').forEach(function(btn) {
    var name = btn.getAttribute('data-name');
    if (name && isInCart(name)) setButtonAdded(btn);
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var img   = btn.getAttribute('data-img')   || '';
      var n     = btn.getAttribute('data-name')  || '';
      var price = btn.getAttribute('data-price') || '$0.00';
      if (btn.classList.contains('btn-added')) return; // already in cart
      addToCart(img, n, price, btn);
    });
  });

  if (document.querySelector('.listing-page'))       initListingPage();
  if (document.querySelector('.product-detail-page')) initProductPage();
  if (document.querySelector('.cart-page'))           initCartPage();
});
