// js/cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('.close-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-btn');
const clearCartButton = document.getElementById('clear-cart-btn');

function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(plantId) {
    // Ensure allPlantsData is available and is an array before trying to find the plant
    if (typeof allPlantsData === 'undefined' || !Array.isArray(allPlantsData)) {
        console.error("allPlantsData is not defined. Cannot add to cart.");
        alert("An error occurred. Plant data not available.");
        return;
    }

    const plant = allPlantsData.find(p => p.id === plantId);
    if (plant) {
        const existingItem = cart.find(item => item.id === plantId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...plant, quantity: 1 });
        }
        saveCart();
        alert(`${plant.name} added to cart!`);
    } else {
        console.error(`Plant with ID ${plantId} not found.`);
        alert("Selected plant not found.");
    }
}

function removeFromCart(plantId) {
    cart = cart.filter(item => item.id !== plantId);
    saveCart();
    renderCartItems();
}

function updateQuantity(plantId, change) {
    const item = cart.find(item => item.id === plantId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(plantId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-quantity">
                    <button data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Add event listeners for quantity and remove buttons
        cartItemsContainer.querySelectorAll('.cart-item-quantity button').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                const action = event.target.dataset.action;
                if (action === 'increase') {
                    updateQuantity(id, 1);
                } else if (action === 'decrease') {
                    updateQuantity(id, -1);
                }
            });
        });

        cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                removeFromCart(id);
            });
        });
    }
    cartTotalSpan.textContent = calculateCartTotal();
}

// Event Listeners for Cart Modal
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'flex'; // Use flex to center the modal content
        renderCartItems();
    });
}

if (closeButton) {
    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout! Total: ₹' + calculateCartTotal());
            cart = []; // Clear cart after checkout
            saveCart();
            renderCartItems();
            cartModal.style.display = 'none'; // Close modal
        } else {
            alert('Your cart is empty!');
        }
    });
}

if (clearCartButton) {
    clearCartButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            saveCart();
            renderCartItems();
        }
    });
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);