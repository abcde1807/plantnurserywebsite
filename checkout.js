// js/checkout.js

document.addEventListener('DOMContentLoaded', () => {

    // Functions to manage cart data in localStorage
    function loadCart() {
        const cartString = localStorage.getItem('cartItems');
        return cartString ? JSON.parse(cartString) : {};
    }

    function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
    }

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

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutForm = document.getElementById('checkout-form'); // Changed from paymentForm

    function renderCheckoutItems() {
        const cart = loadCart();
        const itemIds = Object.keys(cart);
        let total = 0;

        cartItemsContainer.innerHTML = ''; // Clear previous content

        if (itemIds.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            // Optionally hide the form if cart is empty and redirect
            // If you want to redirect immediately if cart is empty on load:
            // window.location.href = 'plants.html';
            // return;
        } else {
            itemIds.forEach(id => {
                const item = cart[id];
                const itemElement = document.createElement('div');
                itemElement.classList.add('checkout-item');
                itemElement.innerHTML = `
                    <p class="item-details">${item.name} (x${item.quantity})</p>
                    <p class="item-price">₹${(item.price * item.quantity).toFixed(2)}</p>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    }

    // Function to handle form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        const cart = loadCart();
        if (Object.keys(cart).length === 0) {
            alert('Your cart is empty. Please add some items before placing an order.');
            return;
        }

        // In a real application, you would send this data to a server.
        // For now, we'll just simulate success.

        // Clear the cart after a successful order
        localStorage.removeItem('cartItems');

        // Update the cart count in the header (important for other pages)
        updateCartCount();

        // Redirect to the thank you page
        window.location.href = 'thankyou.html';
    });

    renderCheckoutItems();
    updateCartCount(); // Initial update of cart count on page load
});