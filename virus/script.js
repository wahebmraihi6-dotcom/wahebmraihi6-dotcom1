// Product Data
const products = [
    {
        id: 1,
        title: "Grandmaster Ebony Set",
        category: "chess",
        price: 249.99,
        description: "Triple-weighted, handcrafted ebony and boxwood pieces. Tournament size.",
        image: "https://placehold.co/600x400/1e293b/d97706?text=Grandmaster+Ebony+Set"
    },
    {
        id: 2,
        title: "Checkmate Vinyl Pack",
        category: "sticker",
        price: 12.50,
        description: "Set of 10 waterproof vinyl stickers featuring classic chess motifs and memes.",
        image: "https://placehold.co/600x400/1e293b/d97706?text=Checkmate+Stickers"
    },
    {
        id: 3,
        title: "Minimalist Stone Set",
        category: "chess",
        price: 185.00,
        description: "Sleek, modern design carved from polished marble and obsidian.",
        image: "https://placehold.co/600x400/1e293b/d97706?text=Minimalist+Stone+Set"
    },
    {
        id: 4,
        title: "Retro 8-Bit Sticker",
        category: "sticker",
        price: 3.99,
        description: "Single high-quality pixel art knight sticker. UV protected.",
        image: "https://placehold.co/600x400/1e293b/d97706?text=8-Bit+Knight+Sticker"
    },
    {
        id: 5,
        title: "Magnetic Travel Board",
        category: "chess",
        price: 45.00,
        description: "Compact walnut folding board with magnetic pieces for play on the go.",
        image: "https://placehold.co/600x400/1e293b/d97706?text=Magnetic+Travel+Board"
    },
    {
        id: 6,
        title: "Chess Theory Collection",
        category: "sticker",
        price: 15.00,
        description: "Diagram stickers of famous historic matches (Fisher, Kasparov, etc.)",
        image: "https://placehold.co/600x400/1e293b/d97706?text=Chess+Theory+Stickers"
    }
];

// State
let cart = [];
let currentFilter = 'all';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    productGrid.innerHTML = '';

    const filteredProducts = currentFilter === 'all'
        ? products
        : products.filter(p => p.category === currentFilter);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.onerror=null; this.src='https://placehold.co/600x400/1e293b/d97706?text=Image+Not+Found';">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn secondary-btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCartDrawer();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateQuantity(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update list
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-secondary); margin-top:2rem;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" onerror="this.onerror=null; this.src='https://placehold.co/600x400/1e293b/d97706?text=Image+Not+Found';">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
    }

    cartTotalPrice.innerText = `$${total.toFixed(2)}`;
}

// UI Controls
function openCartDrawer() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Event Listeners
function setupEventListeners() {
    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderProducts();
        });
    });

    // Cart Open/Close
    cartBtn.addEventListener('click', openCartDrawer);
    closeCart.addEventListener('click', closeCartDrawer);
    cartOverlay.addEventListener('click', closeCartDrawer);

    // Add to Cart Delegation
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Thank you for your order! This is a demo checkout.");
        cart = [];
        updateCartUI();
        closeCartDrawer();
    });
}

// Start
init();
