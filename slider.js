// js/slider.js

document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.querySelector('.slider-container');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');

    if (!sliderContainer || slides.length === 0 || !prevButton || !nextButton) {
        console.warn("Slider elements not found. Skipping slider initialization.");
        return; // Exit if elements are missing
    }

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
        const offset = -currentIndex * 100; // Calculate offset for transform
        sliderContainer.style.transform = `translateX(${offset}vw)`;
        // You might want to update active classes if you add indicators
    }

    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    // Event listeners for navigation buttons
    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);

    // Auto-advance slider (optional)
    const autoSlideInterval = 5000; // 5 seconds
    let slideInterval = setInterval(showNextSlide, autoSlideInterval);

    // Pause auto-slide on hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Resume auto-slide when not hovering
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(showNextSlide, autoSlideInterval);
    });

    // Initial display
    updateSlider();
});