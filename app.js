// Sample Products Database
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: 1999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    name: "Smart Watch Fitness Tracker",
    category: "Electronics",
    price: 2499,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
  },
  {
    id: 3,
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 3499,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    id: 4,
    name: "Classic Denim Jacket",
    category: "Fashion",
    price: 1899,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80"
  },
  {
    id: 5,
    name: "Unisex Running Sneakers",
    category: "Fashion",
    price: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"
  },
  {
    id: 6,
    name: "Polarized Sunglasses",
    category: "Accessories",
    price: 899,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80"
  },
  {
    id: 7,
    name: "Leather Travel Backpack",
    category: "Accessories",
    price: 2199,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  },
  {
    id: 8,
    name: "Portable Power Bank 20000mAh",
    category: "Electronics",
    price: 1299,
    image: "images/powerbank.jpg"
  }
];

// State Management
let cart = [];
let currentCategory = "All";

// Render Products
function renderProducts(productList) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  if (productList.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #718096;">No products found.</p>`;
    return;
  }

  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h4>${product.name}</h4>
        <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
      </div>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Category Filter
function selectCategory(category, element) {
  currentCategory = category;
  document.querySelectorAll(".category-list li").forEach(li => li.classList.remove("active"));
  element.classList.add("active");

  document.getElementById("section-title").innerText = `${category} Products`;
  filterProducts();
}

// Search & Combined Filter
function filterProducts() {
  const searchQuery = document.getElementById("search-input").value.toLowerCase();
  
  const filtered = products.filter(product => {
    const matchesCategory = currentCategory === "All" || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filtered);
}

// Add Item to Cart
function addToCart(productId) {
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  
  // Auto-open cart sidebar when item added
  const drawer = document.getElementById("cart-drawer");
  if (!drawer.classList.contains("open")) {
    toggleCart();
  }
}

// Update Cart Display & Calculations
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartBadge = document.getElementById("cart-badge");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total-amount");
  const deliveryFeeEl = document.getElementById("delivery-fee");

  cartItemsContainer.innerHTML = "";

  let subtotal = 0;
  let totalItemsCount = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    totalItemsCount += item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <p>₹${item.price} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
        <div class="qty-controls">
          <button onclick="changeQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${index}, 1)">+</button>
        </div>
      </div>
      <button style="background:none; border:none; color:#e53e3e; cursor:pointer;" onclick="removeItem(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    cartItemsContainer.appendChild(div);
  });

  const deliveryFee = cart.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  cartBadge.innerText = totalItemsCount;
  subtotalEl.innerText = subtotal.toLocaleString('en-IN');
  deliveryFeeEl.innerText = `₹${deliveryFee.toFixed(2)}`;
  totalEl.innerText = total.toLocaleString('en-IN');
}

// Change Item Quantity
function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

// Remove Item Entirely
function removeItem(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// Toggle Cart Sidebar
function toggleCart() {
  document.getElementById("cart-drawer").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("active");
}

// Checkout Modal Functions
function showCheckoutModal() {
  if (cart.length === 0) {
    alert("Your cart is empty! Please add products before checking out.");
    return;
  }
  toggleCart();
  document.getElementById("checkout-modal").classList.add("active");
}

function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.remove("active");
}

// Process Final Order
function processOrder(event) {
  event.preventDefault();
  alert("Order Placed Successfully! Thank you for shopping with ShopCentral.");
  
  cart = [];
  updateCartUI();
  closeCheckoutModal();
}

// Initial Load
renderProducts(products);