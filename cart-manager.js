// js/cart-manager.js

document.addEventListener('DOMContentLoaded', () => {

    // Helper functions to manage cart data in localStorage
    function loadCart() {
        const cartString = localStorage.getItem('cartItems');
        return cartString ? JSON.parse(cartString) : {};
    }

    function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }

    // Function to update the cart count display in the header
    function updateCartCount() {
        const cart = loadCart();
        const cartCountElement = document.getElementById('cart-count');
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            if (totalItems > 0) {
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    // Function to render items in the cart modal
    function renderCartItems() {
        const cart = loadCart();
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-modal-total'); // Update with this ID
        const checkoutBtn = document.getElementById('checkout-btn-modal');
        let total = 0;

        cartItemsContainer.innerHTML = ''; // Clear previous content

        const itemIds = Object.keys(cart);
        if (itemIds.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            checkoutBtn.style.display = 'none';
        } else {
            checkoutBtn.style.display = 'inline-block';
            itemIds.forEach(id => {
                const item = cart[id];
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.dataset.id = id;
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>₹${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase-btn">+</button>
                    </div>
                    <button class="remove-from-cart-btn"><i class="fas fa-trash-alt"></i></button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        cartTotalElement.textContent = total.toFixed(2);
    }

    // Event listener for "Add to Cart" buttons
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            event.preventDefault();
            const card = event.target.closest('.plant-card, .tool-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseFloat(card.dataset.price);
            const image = card.querySelector('img').src;

            if (id && name && price) {
                let cart = loadCart();
                if (cart[id]) {
                    cart[id].quantity++;
                } else {
                    cart[id] = { id, name, price, image, quantity: 1 };
                }
                saveCart(cart);
                updateCartCount();
                alert(`${name} added to cart!`); // Simple confirmation
            } else {
                console.error("Missing data attributes on the card.");
            }
        }
    });

    // Event listeners for the cart modal functionality
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-button');
    const cartIconHeader = document.getElementById('cart-icon-header');
    const checkoutBtnModal = document.getElementById('checkout-btn-modal');

    if (cartIconHeader) {
        cartIconHeader.addEventListener('click', (event) => {
            event.preventDefault();
            renderCartItems();
            modal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (checkoutBtnModal) {
        checkoutBtnModal.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Event listener for quantity change and item removal in the modal
    if (document.getElementById('cart-items')) {
        document.getElementById('cart-items').addEventListener('click', (event) => {
            const target = event.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;

            const id = cartItem.dataset.id;
            let cart = loadCart();

            if (target.classList.contains('increase-btn')) {
                cart[id].quantity++;
            } else if (target.classList.contains('decrease-btn')) {
                if (cart[id].quantity > 1) {
                    cart[id].quantity--;
                }
            } else if (target.classList.contains('remove-from-cart-btn')) {
                delete cart[id];
            }

            saveCart(cart);
            renderCartItems();
            updateCartCount();
        });
    }

    // Initial call to set the cart count on page load
    updateCartCount();

});