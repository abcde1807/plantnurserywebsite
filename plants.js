// js/plants.js

document.addEventListener('DOMContentLoaded', () => {
    // Ensure allPlantsData is loaded from data/plantsData.js
    if (typeof allPlantsData === 'undefined' || !Array.isArray(allPlantsData)) {
        console.error("Error: allPlantsData is not defined or not an array. Make sure data/plantsData.js is loaded correctly and before plants.js");
        document.getElementById('plant-listing').innerHTML = '<p class="error-message">Error loading plant data. Please check console.</p>';
        return; // Stop execution if data is not available
    }

    let currentPage = 1;
    const plantsPerPage = 9; // Display 9 plants per page

    const categoryFilter = document.getElementById('categoryFilter');
    const priceRangeFilter = document.getElementById('priceRangeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const plantListing = document.getElementById('plant-listing');
    const paginationControls = document.getElementById('pagination-controls');

    let currentFilteredPlants = [...allPlantsData]; // Start with all data

    // Function to populate filters
    function populateFilters() {
        // Populate Categories
        const categories = [...new Set(allPlantsData.map(plant => plant.category))].sort(); // Sort categories alphabetically
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });

        // Price Ranges (Fixed ranges for simplicity)
        const priceRanges = [
            { label: 'All Prices', min: 0, max: Infinity },
            { label: 'Under ₹150', min: 0, max: 150 },
            { label: '₹150 - ₹300', min: 150, max: 300 },
            { label: '₹300 - ₹500', min: 300, max: 500 },
            { label: 'Over ₹500', min: 500, max: Infinity }
        ];

        priceRanges.forEach(range => {
            const option = document.createElement('option');
            option.value = `${range.min}-${range.max}`;
            option.textContent = range.label;
            priceRangeFilter.appendChild(option);
        });
    }

    // Function to apply filters and sort
    function applyFiltersAndSort() {
        let filteredPlants = [...allPlantsData];

        // 1. Apply Category Filter
        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            filteredPlants = filteredPlants.filter(plant => plant.category === selectedCategory);
        }

        // 2. Apply Price Range Filter
        const selectedPriceRange = priceRangeFilter.value;
        if (selectedPriceRange !== '0-Infinity') {
            const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
            filteredPlants = filteredPlants.filter(plant => plant.price >= minPrice && plant.price <= maxPrice);
        }

        // 3. Apply Search Filter
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredPlants = filteredPlants.filter(plant =>
                plant.name.toLowerCase().includes(searchTerm) ||
                plant.description.toLowerCase().includes(searchTerm) ||
                plant.category.toLowerCase().includes(searchTerm)
            );
        }

        // 4. Apply Sort Filter
        const selectedSort = sortFilter.value;
        if (selectedSort === 'name-asc') {
            filteredPlants.sort((a, b) => a.name.localeCompare(b.name));
        } else if (selectedSort === 'name-desc') {
            filteredPlants.sort((a, b) => b.name.localeCompare(a.name));
        } else if (selectedSort === 'price-asc') {
            filteredPlants.sort((a, b) => a.price - b.price);
        } else if (selectedSort === 'price-desc') {
            filteredPlants.sort((a, b) => b.price - a.price);
        }

        currentFilteredPlants = filteredPlants;
        currentPage = 1; // Reset to first page after filtering/sorting
        renderPlants();
        renderPagination();
    }

    // Function to render plants for the current page
    function renderPlants() {
        plantListing.innerHTML = ''; // Clear previous plants
        const startIndex = (currentPage - 1) * plantsPerPage;
        const endIndex = startIndex + plantsPerPage;
        const plantsToDisplay = currentFilteredPlants.slice(startIndex, endIndex);

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
                <p>${plant.description}</p>
                <p class="price">₹${plant.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-plant-id="${plant.id}">Add to Cart</button>
            `;
            plantListing.appendChild(plantCard);
        });

        // Re-attach event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const plantId = parseInt(event.target.dataset.plantId);
                addToCart(plantId);
            });
        });
    }

    // Function to render pagination controls
    function renderPagination() {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(currentFilteredPlants.length / plantsPerPage);

        if (totalPages <= 1) {
            paginationControls.style.display = 'none'; // Hide pagination if only one page
            return;
        } else {
            paginationControls.style.display = 'flex'; // Show if more than one page
        }

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.classList.add('pagination-btn');
        if (currentPage === 1) {
            prevButton.disabled = true;
        }
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPlants();
                renderPagination();
                window.scrollTo({ top: plantListing.offsetTop - 50, behavior: 'smooth' }); // Scroll to top of plants
            }
        });
        paginationControls.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-btn');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderPlants();
                renderPagination();
                window.scrollTo({ top: plantListing.offsetTop - 50, behavior: 'smooth' }); // Scroll to top of plants
            });
            paginationControls.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.classList.add('pagination-btn');
        if (currentPage === totalPages) {
            nextButton.disabled = true;
        }
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderPlants();
                renderPagination();
                window.scrollTo({ top: plantListing.offsetTop - 50, behavior: 'smooth' }); // Scroll to top of plants
            }
        });
        paginationControls.appendChild(nextButton);
    }

    // Function to handle initial category filter from URL
    function applyInitialCategoryFilter() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get('category');
        if (categoryFromUrl) {
            // Find the option and set it
            const optionExists = Array.from(categoryFilter.options).some(option => option.value === categoryFromUrl);
            if (optionExists) {
                categoryFilter.value = categoryFromUrl;
            }
        }
    }


    // Event Listeners for Filters
    categoryFilter.addEventListener('change', applyFiltersAndSort);
    priceRangeFilter.addEventListener('change', applyFiltersAndSort);
    sortFilter.addEventListener('change', applyFiltersAndSort);
    searchInput.addEventListener('input', applyFiltersAndSort); // Real-time search
    searchButton.addEventListener('click', applyFiltersAndSort); // Button click for search

    // Initial load sequence
    populateFilters();
    applyInitialCategoryFilter(); // Apply category from URL before full filter/sort
    applyFiltersAndSort(); // This will also trigger initial renderPlants and renderPagination
});