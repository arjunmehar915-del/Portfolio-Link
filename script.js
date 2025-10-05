document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const cards = Array.from(carouselTrack.children); // Get initial cards

    // Clone cards to create the "infinite" effect
    // We need enough clones so that when the original set scrolls out of view,
    // the cloned set is already in place, and we can reset the position.
    // A common strategy is to clone enough cards to fill the track at least twice.
    cards.forEach(card1 => {
        const clone = card1.cloneNode(true); // Deep clone
        carouselTrack.appendChild(clone);
    });

    let scrollPosition = 0;
    const scrollSpeed = 3; // Pixels per frame (lower = slower)
    let animationFrameId;

    function animateScroll() {
        scrollPosition -= scrollSpeed;
        
        // Calculate the width of a single set of original cards
        // This is important for knowing when to "reset" the scroll
        const firstCardWidth = cards[0].offsetWidth + (parseFloat(getComputedStyle(cards[0]).marginLeft) * 2); // Card width + margin on both sides
        const totalOriginalWidth = firstCardWidth * cards.length;

        // If we've scrolled past the original set of cards, reset the position
        // This makes it look like it's looping seamlessly.
        if (Math.abs(scrollPosition) >= totalOriginalWidth) {
            scrollPosition = 0; // Reset to the beginning
        }

        carouselTrack.style.transform = `translateX(${scrollPosition}px)`;
        animationFrameId = requestAnimationFrame(animateScroll);
    }

    // Start the animation
    animateScroll();

    // Optional: Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrameId);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        animateScroll();
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('servicesTrack'); // Changed ID to 'servicesTrack'
    if (!carouselTrack) {
        console.warn("Element with ID 'servicesTrack' not found. Carousel will not initialize.");
        return;
    }

    const originalCards = Array.from(carouselTrack.querySelectorAll('.product-card'));

    if (originalCards.length === 0) {
        console.warn("No '.product-card' elements found in '#servicesTrack'. Carousel will not run.");
        return;
    }

    // Clear existing clones and re-add originals for a clean start
    carouselTrack.innerHTML = '';
    originalCards.forEach(card => carouselTrack.appendChild(card));

    // Clone enough cards to ensure a seamless wrap-around without visible gaps
    // Calculate total width of original cards + gaps to determine how many visible cards fit
    const gapValue = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
    let initialSetTotalWidth = 0;
    originalCards.forEach((card, index) => {
        initialSetTotalWidth += card.offsetWidth;
        if (index < originalCards.length - 1) {
            initialSetTotalWidth += gapValue;
        }
    });

    const viewportWidth = carouselTrack.parentElement.offsetWidth; 
    
    // Determine how many times we need to clone the original set
    // Ensure enough content to fill the viewport several times over for robustness
    let totalClonesToAppend = originalCards.length * 3; // At least 3 full sets
    
    if (initialSetTotalWidth > 0 && viewportWidth > 0 && originalCards[0].offsetWidth > 0) {
        // Calculate how many cards fit in 1.5 to 2 viewports
        const singleCardFullWidth = originalCards[0].offsetWidth + gapValue;
        const cardsNeededForTwoViewports = Math.ceil((viewportWidth * 2) / singleCardFullWidth);
        totalClonesToAppend = Math.max(totalClonesToAppend, cardsNeededForTwoViewports);
    }

    for (let i = 0; i < totalClonesToAppend; i++) {
        const originalCardIndex = i % originalCards.length;
        const clone = originalCards[originalCardIndex].cloneNode(true);
        carouselTrack.appendChild(clone);
    }
    
    let scrollPosition = 0;
    const scrollSpeed = 3; // Adjust this value for faster/slower scroll
    let animationFrameId;

    // Calculate the total width of *one complete cycle* of original cards (reset point)
    function calculateEffectiveTotalOriginalWidth() {
        let width = 0;
        const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;

        originalCards.forEach((card, index) => {
            width += card.offsetWidth;
            if (index < originalCards.length - 1) { // Only add gap between cards in the original set
                width += gap;
            }
        });
        return width;
    }

    let effectiveTotalOriginalWidth = calculateEffectiveTotalOriginalWidth();

    function animateScroll() {
        scrollPosition -= scrollSpeed;
        
        if (Math.abs(scrollPosition) >= effectiveTotalOriginalWidth) {
            scrollPosition = 0; // Reset to the beginning instantly
        }

        carouselTrack.style.transform = `translateX(${scrollPosition}px)`;
        animationFrameId = requestAnimationFrame(animateScroll);
    }

    // Start the animation
    animateScroll();

    // Pause on hover
    carouselTrack.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrameId);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        animateScroll();
    });

    // Recalculate widths and reset position on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            effectiveTotalOriginalWidth = calculateEffectiveTotalOriginalWidth();
            scrollPosition = 0; 
            carouselTrack.style.transform = `translateX(0px)`;
            animateScroll(); 
        }, 250);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('servicesTrack');
    if (!carouselTrack) {
        console.warn("Element with ID 'servicesTrack' not found. Carousel will not initialize.");
        return;
    }

    const originalCards = Array.from(carouselTrack.querySelectorAll('.product-card'));

    if (originalCards.length === 0) {
        console.warn("No '.product-card' elements found in '#servicesTrack'. Carousel will not run.");
        return;
    }

    // Clear existing clones and re-add originals for a clean start
    carouselTrack.innerHTML = ''; // Ensure this doesn't trigger extra layouts if possible
    originalCards.forEach(card => carouselTrack.appendChild(card));

    const gapValue = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
    
    // Calculate effectiveTotalOriginalWidth once, then use it for cloning logic
    function calculateEffectiveTotalOriginalWidthInternal() {
        let width = 0;
        originalCards.forEach((card, index) => {
            width += card.offsetWidth;
            if (index < originalCards.length - 1) {
                width += gapValue;
            }
        });
        return width;
    }
    let effectiveTotalOriginalWidth = calculateEffectiveTotalOriginalWidthInternal();

    // --- Optimized Cloning Logic ---
    // Ensure enough content to fill the viewport several times over for robustness
    const singleCardFullWidth = originalCards[0].offsetWidth + gapValue;
    let totalClonesToAppend = originalCards.length * 3; // Start with at least 3 full sets

    if (singleCardFullWidth > 0 && carouselTrack.parentElement.offsetWidth > 0) {
        // Calculate how many cards needed to fill 2 viewports
        const cardsNeededForTwoViewports = Math.ceil((carouselTrack.parentElement.offsetWidth * 2) / singleCardFullWidth);
        totalClonesToAppend = Math.max(totalClonesToAppend, cardsNeededForTwoViewports);
    }

    for (let i = 0; i < totalClonesToAppend; i++) {
        const originalCardIndex = i % originalCards.length;
        const clone = originalCards[originalCardIndex].cloneNode(true);
        carouselTrack.appendChild(clone);
    }
    
    let scrollPosition = 0;
    // Adjust scrollSpeed:
    // A smaller value can appear smoother by making movement less "chunky" per frame.
    // A slightly larger value might be needed if your FPS is very high and it looks too slow.
    const scrollSpeed = 2; // Try 0.5, 0.7, 1.0, 1.2 to see what's smoothest
    let animationFrameId;

    function animateScroll() {
        scrollPosition -= scrollSpeed;
        
        if (Math.abs(scrollPosition) >= effectiveTotalOriginalWidth) {
            scrollPosition = 0; 
        }

        // Use transform: translate3d for explicit hardware acceleration
        carouselTrack.style.transform = `translate3d(${scrollPosition}px, 0, 0)`; 
        animationFrameId = requestAnimationFrame(animateScroll);
    }

    animateScroll();

    carouselTrack.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationFrameId);
    });

    carouselTrack.addEventListener('mouseleave', () => {
        animateScroll();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cancelAnimationFrame(animationFrameId);
            // Recalculate based on potentially new card sizes (due to media queries)
            effectiveTotalOriginalWidth = calculateEffectiveTotalOriginalWidthInternal(); 
            scrollPosition = 0; 
            carouselTrack.style.transform = `translate3d(0, 0, 0)`; // Reset with 3D transform
            animateScroll(); 
        }, 250);
    });
});