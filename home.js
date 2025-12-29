// js/home.js

document.addEventListener('DOMContentLoaded', () => {
    // Ensure allPlantsData is loaded from data/plantsData.js
    if (typeof allPlantsData === 'undefined' || !Array.isArray(allPlantsData)) {
        console.error("Error: allPlantsData is not defined or not an array. Make sure data/plantsData.js is loaded correctly and before home.js");
        document.getElementById('best-sellers-grid').innerHTML = '<p class="error-message">Error loading plant data. Please check console.</p>';
        return; // Stop execution if data is not available
    }

    const bestSellersGrid = document.getElementById('best-sellers-grid');

    function displayBestSellers() {
        if (!bestSellersGrid) {
            console.warn("Best sellers grid element not found.");
            return;
        }

        bestSellersGrid.innerHTML = ''; // Clear existing content

        // Simple logic for best sellers: pick 4 random plants for display
        const bestSellers = [];
        const numBestSellers = 4;
        const availablePlants = [...allPlantsData]; // Create a mutable copy

        while (bestSellers.length < numBestSellers && availablePlants.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePlants.length);
            bestSellers.push(availablePlants.splice(randomIndex, 1)[0]);
        }

        if (bestSellers.length === 0) {
            bestSellersGrid.innerHTML = '<p class="no-results">No best sellers available at the moment.</p>';
            return;
        }

        bestSellers.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.classList.add('plant-card');
            plantCard.innerHTML = `
                <img src="${plant.image}" alt="${plant.name}">
                <h3>${plant.name}</h3>
                <p>${plant.description}</p>
                <p class="price">₹${plant.price}</p>
                <button class="add-to-cart-btn" data-plant-id="${plant.id}">Add to Cart</button>
            `;
            bestSellersGrid.appendChild(plantCard);
        });

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const plantId = parseInt(event.target.dataset.plantId);
                addToCart(plantId);
            });
        });
    }

    // Call the function to display best sellers on load
    displayBestSellers();
});