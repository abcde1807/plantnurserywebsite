// js/script.js

// --- Global Variables ---
let allPlants = []; // This will hold all plant data
let filteredPlants = []; // Stores plants after applying filters/search
let currentPage = 1;
const itemsPerPage = 8; // Number of plants to display per page

// --- Cart Functionality Variables & DOM Elements ---
// Ensure these variables are only declared once globally
let cart = []; // The actual cart array

// DOM Elements for the cart modal and header cart icon
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('#cartModal .close-button'); // More specific selector for modal close
const cartIconHeader = document.getElementById('cart-icon-header'); // This is the icon in your header
const cartCountElement = document.querySelector('.cart-count'); // The span displaying the count
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

// Get DOM elements for plants.html (if present on the page)
const plantListing = document.getElementById('plant-listing');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const sortFilter = document.getElementById('sort-filter');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const paginationControls = document.getElementById('pagination-controls');

// --- Helper Functions for Cart ---

// Function to update cart count in header and save to localStorage
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) { // Check if the element exists
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none'; // Show/hide based on count
    }
    // Always save to localStorage after any cart change
    localStorage.setItem('greenthumbCart', JSON.stringify(cart));
    console.log('Cart updated and saved:', cart); // For debugging
}

// Function to add item to cart
function addToCart(plantId) {
    // Find the plant from the global 'allPlants' array
    const plant = allPlants.find(p => p.id === plantId);
    if (plant) {
        const existingItem = cart.find(item => item.id === plantId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...plant, quantity: 1 });
        }
        updateCartCount();
        renderCartItems(); // Update modal immediately if open
        alert(`${plant.name} added to cart!`);
    } else {
        console.error(`Error: Plant with ID ${plantId} not found in allPlants data.`);
        alert("Could not add plant to cart. Plant data missing.");
    }
}

// Function to remove item from cart
function removeFromCart(plantId) {
    cart = cart.filter(item => item.id !== plantId);
    updateCartCount();
    renderCartItems();
}

// Function to change quantity
function changeQuantity(plantId, change) {
    const item = cart.find(item => item.id === plantId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(plantId); // Remove if quantity drops to 0 or below
        } else {
            updateCartCount();
            renderCartItems();
        }
    }
}

// Function to render cart items in the modal
function renderCartItems() {
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let total = 0;

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
                    <p>₹${item.price.toLocaleString('en-IN')}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-minus-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-plus-btn" data-id="${item.id}">+</button>
                </div>
                <button class="remove-from-cart-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        // Attach event listeners for quantity and remove buttons within the modal
        cartItemsContainer.querySelectorAll('.quantity-minus-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                changeQuantity(id, -1);
            });
        });

        cartItemsContainer.querySelectorAll('.quantity-plus-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                changeQuantity(id, 1);
            });
        });

        cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = parseInt(event.target.dataset.id);
                removeFromCart(id);
            });
        });
    }

    cartTotalSpan.textContent = total.toLocaleString('en-IN');
}

// --- Plant Data & Display Functions ---

// Function to parse URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// HARDCODED PLANT DATA - Now this is the single source of truth
function loadPlantsDirectly() {
    allPlants = [
        // Herbs
        { "id": 1, "name": "Mint", "category": "Herb", "price": 120, "image": "images/mint.jpg" },
        { "id": 2, "name": "Tulsi", "category": "Herb", "price": 130, "image": "images/tulsi.jpg" },
        { "id": 3, "name": "Basil", "category": "Herb", "price": 140, "image": "images/basil.jpg" },
        { "id": 4, "name": "Oregano", "category": "Herb", "price": 160, "image": "images/oregano.jpg" },

        // Succulents
        { "id": 5, "name": "Aloe Vera", "category": "Succulents", "price": 150, "image": "images/aloe-vera.jpg" },
        { "id": 6, "name": "Jade Plant", "category": "Succulents", "price": 180, "image": "images/jade.jpg" },
        { "id": 7, "name": "Succulent Mix", "category": "Succulents", "price": 190, "image": "images/succulent.jpg" },
        { "id": 8, "name": "Cactus", "category": "Succulents", "price": 180, "image": "images/cactus.jpg" },

        // Flowering Plants
        { "id": 9, "name": "Rose", "category": "Flower", "price": 250, "image": "images/rose.jpg" },
        { "id": 10, "name": "Marigold", "category": "Flower", "price": 180, "image": "images/marigold.jpg" },
        { "id": 11, "name": "Hibiscus", "category": "Flower", "price": 220, "image": "images/hibiscus.jpg" },
        { "id": 12, "name": "Jasmine", "category": "Flower", "price": 200, "image": "images/jasmine.jpg" },
        { "id": 13, "name": "Zinnia", "category": "Flower", "price": 190, "image": "images/zinnia.jpg" },
        { "id": 14, "name": "Petunia", "category": "Flower", "price": 210, "image": "images/petunia.jpg" },
        { "id": 15, "name": "Dahlia", "category": "Flower", "price": 240, "image": "images/dahlia.jpg" },
        { "id": 16, "name": "Chrysanthemum", "category": "Flower", "price": 260, "image": "images/chrysanthemum.jpg" },

        // Tree Plants
        { "id": 17, "name": "Neem Tree", "category": "Tree", "price": 300, "image": "images/neem.jpg" },
        { "id": 18, "name": "Mango Tree", "category": "Tree", "price": 350, "image": "images/mango.jpg" },
        { "id": 19, "name": "Guava Tree", "category": "Tree", "price": 280, "image": "images/guava.jpg" },
        { "id": 20, "name": "Ashoka Tree", "category": "Tree", "price": 260, "image": "images/ashoka.jpg" },
        { "id": 21, "name": "Papaya Tree", "category": "Tree", "price": 270, "image": "images/papaya.jpg" },
        { "id": 22, "name": "Jamun Tree", "category": "Tree", "price": 290, "image": "images/jamun.jpg" },
        { "id": 23, "name": "Bamboo", "category": "Tree", "price": 320, "image": "images/bamboo.jpg" },
        { "id": 24, "name": "Banana Tree", "category": "Tree", "price": 310, "image": "images/banana.jpg" },

        // Indoor Plants
        { "id": 25, "name": "Peace Lily", "category": "Indoor", "price": 230, "image": "images/peace-lily.jpg" },
        { "id": 26, "name": "Snake Plant", "category": "Indoor", "price": 200, "image": "images/snake-plant.jpg" },
        { "id": 27, "name": "ZZ Plant", "category": "Indoor", "price": 210, "image": "images/zz-plant.jpg" },
        { "id": 28, "name": "Spider Plant", "category": "Indoor", "price": 230, "image": "images/spider-plant.jpg" },
        { "id": 29, "name": "Areca Palm", "category": "Indoor", "price": 220, "image": "images/areca-palm.jpg" },
        { "id": 30, "name": "Lucky Bamboo", "category": "Indoor", "price": 210, "image": "images/lucky-bamboo.jpg" },
        { "id": 31, "name": "Rubber Plant", "category": "Indoor", "price": 240, "image": "images/rubber-plant.jpg" },
        { "id": 32, "name": "Money Plant", "category": "Indoor", "price": 190, "image": "images/money-plant.jpg" },

        // Decorative Plants
        { "id": 33, "name": "Croton", "category": "Decorative", "price": 230, "image": "images/croton.jpg" },
        { "id": 34, "name": "Calathea", "category": "Decorative", "price": 210, "image": "images/calathea.jpg" },
        { "id": 35, "name": "Fittonia", "category": "Decorative", "price": 200, "image": "images/fittonia.jpg" },
        { "id": 36, "name": "Syngonium", "category": "Decorative", "price": 220, "image": "images/syngonium.jpg" },
        { "id": 37, "name": "Dieffenbachia", "category": "Decorative", "price": 240, "image": "images/dieffenbachia.jpg" },
        { "id": 38, "name": "Anthurium", "category": "Decorative", "price": 250, "image": "images/anthurium.jpg" }
    ];

    // Sort initial data by ID to maintain a consistent default order
    allPlants.sort((a,b) => a.id - b.id);

    // Only run plant-specific functions if on plants.html
    if (plantListing && categoryFilter) {
        populateFilterOptions();
        applyInitialFiltersFromURL(); // Apply filters from URL on page load
    }

    // Call displayBestSellers if on index.html and the element exists
    const bestSellersContainer = document.getElementById('best-sellers-grid');
    if (bestSellersContainer) {
        displayBestSellers(bestSellersContainer);
    }
}

// Function to populate filter options (e.g., categories)
function populateFilterOptions() {
    if (!categoryFilter || !priceFilter) return; // Ensure elements exist

    // Populate Category Filter
    const categories = [...new Set(allPlants.map(plant => plant.category))].sort();
    categoryFilter.innerHTML = '<option value="All">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Populate Price Filter
    priceFilter.innerHTML = `
        <option value="All">All Prices</option>
        <option value="0-200">₹0 - ₹200</option>
        <option value="201-300">₹201 - ₹300</option>
        <option value="301-400">₹301 - ₹400</option>
        <option value="401-99999">₹401+</option>
    `;
}

// Function to render plant cards for general listings (plants.html)
function displayPlants(plantsToDisplay) {
    if (!plantListing) return; // Exit if not on plants.html

    plantListing.innerHTML = ''; // Clear previous plants
    if (plantsToDisplay.length === 0) {
        plantListing.innerHTML = '<p class="no-results">No plants found matching your criteria.</p>';
        return;
    }

    plantsToDisplay.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.classList.add('plant-card');
        plantCard.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <p>${plant.category}</p>
            <p class="price">₹${plant.price.toLocaleString('en-IN')}</p>
            <button class="add-to-cart-btn btn" data-id="${plant.id}">Add to Cart</button>
        `;
        plantListing.appendChild(plantCard);
    });

    // Attach event listeners to "Add to Cart" buttons for the main plant listing
    // This is crucial for *any* dynamically rendered plant cards
    plantListing.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const plantId = parseInt(event.target.dataset.id);
            if (!isNaN(plantId)) {
                addToCart(plantId);
            } else {
                console.error("Invalid plant ID for add to cart:", event.target.dataset.id);
            }
        });
    });
}

// Function to display best sellers on index.html
function displayBestSellers(containerElement) {
    // Select a few plants to be "best sellers" (e.g., first 4 or randomly)
    // For now, let's just pick the first 4 for simplicity.
    const bestSellers = allPlants.slice(0, 4); 

    containerElement.innerHTML = ''; // Clear existing content

    if (bestSellers.length === 0) {
        containerElement.innerHTML = '<p>No best sellers available.</p>';
        return;
    }

    bestSellers.forEach(plant => {
        const plantCard = document.createElement('div');
        plantCard.classList.add('plant-card'); // Use the same card style
        plantCard.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}">
            <h3>${plant.name}</h3>
            <p>${plant.category}</p>
            <p class="price">₹${plant.price.toLocaleString('en-IN')}</p>
            <button class="add-to-cart-btn btn" data-id="${plant.id}">Add to Cart</button>
        `;
        containerElement.appendChild(plantCard);
    });

    // Attach event listeners for best sellers' "Add to Cart" buttons
    // This is essential if best sellers are generated separately from the main listing
    containerElement.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const plantId = parseInt(event.target.dataset.id);
            if (!isNaN(plantId)) {
                addToCart(plantId);
            } else {
                console.error("Invalid plant ID for best seller add to cart:", event.target.dataset.id);
            }
        });
    });
}


// Function to apply filters and sorting
function applyFiltersAndSort() {
    let tempPlants = [...allPlants]; // Start with a fresh copy of all plants

    // 1. Apply Category Filter
    const selectedCategory = categoryFilter ? categoryFilter.value : 'All';
    if (selectedCategory !== 'All') {
        tempPlants = tempPlants.filter(plant => plant.category === selectedCategory);
    }

    // 2. Apply Price Filter
    const selectedPriceRange = priceFilter ? priceFilter.value : 'All';
    if (selectedPriceRange !== 'All') {
        const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
        tempPlants = tempPlants.filter(plant => plant.price >= minPrice && plant.price <= maxPrice);
    }

    // 3. Apply Search Query
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (searchQuery) {
        tempPlants = tempPlants.filter(plant =>
            plant.name.toLowerCase().includes(searchQuery) ||
            plant.category.toLowerCase().includes(searchQuery)
        );
    }

    // 4. Apply Sorting
    const selectedSort = sortFilter ? sortFilter.value : 'default';
    switch (selectedSort) {
        case 'price-asc':
            tempPlants.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            tempPlants.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            tempPlants.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            tempPlants.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'default':
        default:
            // Maintain original order (by ID from loadPlantsDirectly)
            tempPlants.sort((a,b) => a.id - b.id);
            break;
    }

    filteredPlants = tempPlants; // Update the global filteredPlants array
    currentPage = 1; // Reset to the first page after filters/search change
    updatePlantDisplay(); // Re-render plants and pagination
}

// Function to read URL parameters and apply initial filters on plants.html
function applyInitialFiltersFromURL() {
    const urlCategory = getUrlParameter('category');
    const urlSearch = getUrlParameter('search');

    if (urlCategory && categoryFilter) {
        // Find if the category exists in options and select it
        const categoryOption = Array.from(categoryFilter.options).find(option => option.value.toLowerCase() === urlCategory.toLowerCase());
        if (categoryOption) {
            categoryFilter.value = categoryOption.value;
        }
    }

    if (urlSearch && searchInput) {
        searchInput.value = urlSearch;
    }

    applyFiltersAndSort(); // Call the main filter/sort function to display
}

// --- Pagination Logic ---

function setupPagination() {
    if (!paginationControls) return; // Exit if not on plants.html

    paginationControls.innerHTML = ''; // Clear previous pagination buttons

    const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);

    if (totalPages <= 1) {
        return; // No pagination needed for 1 or fewer pages
    }

    // Previous Button
    const prevButton = document.createElement('button');
    prevButton.classList.add('pagination-btn', 'prev-btn');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePlantDisplay();
            if (plantListing) window.scrollTo({ top: plantListing.offsetTop - 100, behavior: 'smooth' });
        }
    });
    paginationControls.appendChild(prevButton);

    // Page number buttons (show a limited range around current page for many pages)
    const maxPageButtons = 5; // Max number of page number buttons to show
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Adjust start/end if we hit totalPages limit
    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('pagination-btn', 'page-num-btn');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            updatePlantDisplay();
            if (plantListing) window.scrollTo({ top: plantListing.offsetTop - 100, behavior: 'smooth' });
        });
        paginationControls.appendChild(pageButton);
    }

    // Next Button
    const nextButton = document.createElement('button');
    nextButton.classList.add('pagination-btn', 'next-btn');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePlantDisplay();
            if (plantListing) window.scrollTo({ top: plantListing.offsetTop - 100, behavior: 'smooth' });
        }
    });
    paginationControls.appendChild(nextButton);
}

// Master function to update plant display and pagination
function updatePlantDisplay() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const plantsForCurrentPage = filteredPlants.slice(startIndex, endIndex);

    displayPlants(plantsForCurrentPage); // Use displayPlants for rendering
    setupPagination(); // Regenerate pagination controls
}


// --- Hero Slider functionality (for index.html) ---
function setupHeroSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer) return; // Exit if slider doesn't exist

    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoSlideInterval;

    const nextButton = document.querySelector('.next-slide');
    const prevButton = document.querySelector('.prev-slide');

    function updateSlider() {
        const offset = -currentSlide * 100;
        sliderContainer.style.transform = `translateX(${offset}vw)`;
    }

    function startAutoSlide() {
        clearInterval(autoSlideInterval); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000); // Change slide every 5 seconds
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            startAutoSlide(); // Restart auto-slide on manual interaction
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
            startAutoSlide(); // Restart auto-slide on manual interaction
        });
    }

    // Initial slider position and start auto-play
    updateSlider();
    startAutoSlide();
}


// --- Event Listeners and Initial Load (DOMContentLoaded) ---
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage using the correct key
    const savedCart = localStorage.getItem('greenthumbCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    updateCartCount(); // Initialize cart count on page load

    // Add event listeners for cart modal (header icon)
    if (cartIconHeader) {
        cartIconHeader.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            cartModal.style.display = 'flex'; // Use flex to center
            renderCartItems(); // Render items when modal opens
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Close modal if clicking outside content
    if (cartModal) {
        window.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                updateCartCount();
                renderCartItems();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`Proceeding to checkout! Total: ₹${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-IN')} (This is a placeholder action)`);
                // In a real app, you would navigate to a checkout page
                // For demonstration, let's clear the cart after "checkout"
                cart = [];
                updateCartCount();
                renderCartItems();
                cartModal.style.display = 'none';
            } else {
                alert('Your cart is empty. Add some plants before checking out!');
            }
        });
    }

    loadPlantsDirectly(); // Load plants data at the very beginning

    // Add event listeners for filters and search ONLY if on plants.html
    if (plantListing && categoryFilter) {
        categoryFilter.addEventListener('change', applyFiltersAndSort);
        priceFilter.addEventListener('change', applyFiltersAndSort);
        sortFilter.addEventListener('change', applyFiltersAndSort);
        searchButton.addEventListener('click', applyFiltersAndSort);
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                applyFiltersAndSort();
            }
        });
    }

    // Initialize Hero Slider if present on the page (index.html)
    setupHeroSlider();
});