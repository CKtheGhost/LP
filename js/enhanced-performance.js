/**
 * Performance Optimizations for PROSPERA
 * 
 * This file contains critical performance enhancements:
 * 1. Resource hints & preloading
 * 2. Lazy loading
 * 3. Critical rendering path optimization
 * 4. Deferred script loading
 * 5. Runtime performance optimizations
 */

// Add this code to a new file called enhanced-performance.js

// SECTION 1: Resource Hints & Preloading
function setupResourceHints() {
    const head = document.head;
    
    // Add preconnect for external domains
    const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net'
    ];
    
    domains.forEach(domain => {
        // Check if preconnect already exists
        if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = 'anonymous';
            head.appendChild(preconnect);
        }
    });
    
    // Preload critical assets
    const criticalAssets = [
        { href: 'css/styles.css', as: 'style' },
        { href: 'css/enhanced-styles.css', as: 'style' },
        { href: 'js/main.js', as: 'script' }
    ];
    
    criticalAssets.forEach(asset => {
        // Only add if not already present
        if (!document.querySelector(`link[rel="preload"][href="${asset.href}"]`)) {
            const preload = document.createElement('link');
            preload.rel = 'preload';
            preload.href = asset.href;
            preload.as = asset.as;
            head.appendChild(preload);
        }
    });
    
    // Preload hero image if exists
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const computedStyle = window.getComputedStyle(heroSection);
        const bgImage = computedStyle.backgroundImage;
        
        if (bgImage && bgImage !== 'none') {
            // Extract URL from background-image: url("...")
            const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
            if (match && match[1]) {
                const preloadImage = document.createElement('link');
                preloadImage.rel = 'preload';
                preloadImage.href = match[1];
                preloadImage.as = 'image';
                head.appendChild(preloadImage);
            }
        }
    }
}

// SECTION 2: Enhanced Lazy Loading
function setupLazyLoading() {
    // Setup for images
    const lazyImages = document.querySelectorAll('img[data-src], [data-background]');
    
    if (lazyImages.length > 0) {
        // Use Intersection Observer if available
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        // If it's an image with data-src
                        if (element.tagName === 'IMG' && element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                        }
                        
                        // If it has a data-background attribute
                        if (element.dataset.background) {
                            element.style.backgroundImage = `url('${element.dataset.background}')`;
                            element.removeAttribute('data-background');
                        }
                        
                        // Remove placeholder classes if any
                        element.classList.remove('lazy-placeholder');
                        
                        // Stop observing after loading
                        imageObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '100px 0px', // Load when within 100px of viewport
                threshold: 0.01
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            function lazyLoad() {
                lazyImages.forEach(element => {
                    if (element.getBoundingClientRect().top <= window.innerHeight + 100 &&
                        element.getBoundingClientRect().bottom >= 0) {
                        
                        // If it's an image with data-src
                        if (element.tagName === 'IMG' && element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                        }
                        
                        // If it has a data-background attribute
                        if (element.dataset.background) {
                            element.style.backgroundImage = `url('${element.dataset.background}')`;
                            element.removeAttribute('data-background');
                        }
                        
                        // Remove placeholder classes
                        element.classList.remove('lazy-placeholder');
                    }
                });
                
                // Stop checking if all images are loaded
                if (lazyImages.length === 0) {
                    document.removeEventListener('scroll', lazyLoad);
                    window.removeEventListener('resize', lazyLoad);
                    window.removeEventListener('orientationchange', lazyLoad);
                }
            }
            
            // Add scroll and other events
            document.addEventListener('scroll', throttle(lazyLoad, 200));
            window.addEventListener('resize', throttle(lazyLoad, 200));
            window.addEventListener('orientationchange', throttle(lazyLoad, 200));
            
            // Initial check
            lazyLoad();
        }
    }
    
    // Setup for lazy sections (elements that animate in when visible)
    const lazySections = document.querySelectorAll('.feature-card, .benefit-card, .step, .faq-item, .trust-item');
    
    if (lazySections.length > 0) {
        // Use Intersection Observer if available
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view', 'animated');
                        
                        // Add staggered animation to children if desired
                        const animatedChildren = entry.target.querySelectorAll('[data-stagger]');
                        animatedChildren.forEach((child, index) => {
                            child.style.transitionDelay = `${index * 0.1}s`;
                            child.classList.add('animated');
                        });
                        
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15, // Trigger when 15% visible
                rootMargin: '0px 0px -50px 0px' // Triggers slightly before scrolling into view
            });
            
            lazySections.forEach(section => {
                section.classList.add('will-animate');
                sectionObserver.observe(section);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazySections.forEach(section => {
                section.classList.add('in-view', 'animated');
            });
        }
    }
}

// SECTION 3: Enhanced Animations with requestAnimationFrame
function enhanceAnimations() {
    // Optimize counter animations with requestAnimationFrame
    const counterElements = document.querySelectorAll('.stat-value, .trust-number, #spots-remaining');
    
    function animateCounters() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for older browsers - simple display
            counterElements.forEach(el => {
                el.classList.add('visible');
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const targetValue = parseFloat(el.textContent.replace(/,/g, '').replace(/[^0-9.]/g, ''));
                    const suffix = el.textContent.replace(/[0-9.,]/g, '');
                    
                    // Don't animate if it's not a number
                    if (isNaN(targetValue)) {
                        observer.unobserve(el);
                        return;
                    }
                    
                    let startValue = 0;
                    // For large numbers, start higher for better effect
                    if (targetValue > 1000) {
                        startValue = Math.floor(targetValue * 0.5);
                    } else if (targetValue > 100) {
                        startValue = Math.floor(targetValue * 0.3);
                    }
                    
                    // Store original for later
                    el.dataset.targetValue = targetValue;
                    el.dataset.suffix = suffix;
                    
                    // Duration in milliseconds
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    // Animation function using requestAnimationFrame
                    function updateCount(timestamp) {
                        // How much time has passed
                        const elapsed = timestamp - startTime;
                        
                        // Calculate progress (0 to 1)
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Use easing function for smoother effect
                        const easedProgress = easeOutQuart(progress);
                        
                        // Calculate current value
                        const currentValue = startValue + (targetValue - startValue) * easedProgress;
                        
                        // Update the display
                        if (Number.isInteger(targetValue)) {
                            el.textContent = Math.floor(currentValue).toLocaleString() + suffix;
                        } else {
                            const precision = (targetValue.toString().split('.')[1] || '').length;
                            el.textContent = currentValue.toFixed(precision).toLocaleString() + suffix;
                        }
                        
                        // Continue animation if not finished
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            // Animation complete
                            el.classList.add('counted');
                        }
                    }
                    
                    // Start animation
                    requestAnimationFrame(updateCount);
                    
                    // Stop observing
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.5, // Trigger when 50% visible
        });
        
        // Start observing
        counterElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Easing function for smoother animations
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
    
    // Schedule the animation setup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateCounters);
    } else {
        animateCounters();
    }
}

// SECTION 4: Runtime performance optimizations
function optimizeRuntime() {
    // Throttle scroll and resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Optimize scroll events
    const scrollHandlers = throttle(() => {
        // Handle header visibility
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update scroll progress bar
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }
        
        // Handle floating CTA visibility
        const floatingCta = document.querySelector('.floating-cta');
        if (floatingCta) {
            const heroSection = document.querySelector('.hero');
            const footer = document.querySelector('footer');
            
            // Show floating CTA when scrolled past hero section
            if (heroSection && window.scrollY > heroSection.offsetHeight) {
                floatingCta.classList.add('visible');
            } else {
                floatingCta.classList.remove('visible');
            }
            
            // Hide when footer is visible
            if (footer) {
                const footerTop = footer.getBoundingClientRect().top;
                if (footerTop < window.innerHeight) {
                    floatingCta.style.opacity = '0';
                    floatingCta.style.pointerEvents = 'none';
                } else {
                    floatingCta.style.opacity = '1';
                    floatingCta.style.pointerEvents = 'all';
                }
            }
        }
    }, 10);
    
    // Optimize resize events
    const resizeHandler = debounce(() => {
        // Adjust particles density if enabled
        if (typeof particlesJS !== 'undefined' && particlesJS.pJS) {
            const width = window.innerWidth;
            let particleDensity = 80; // Default
            
            if (width < 768) {
                particleDensity = 40; // Less particles on mobile
            }
            
            // Update particles if possible
            if (particlesJS.pJS.particles && particlesJS.pJS.particles.number) {
                particlesJS.pJS.particles.number.value = particleDensity;
                particlesJS.pJS.fn.particlesRefresh();
            }
        }
        
        // Adjust hero height on mobile
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            if (window.innerWidth < 768) {
                // Adjust hero content height based on available space
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const windowHeight = window.innerHeight;
                heroContent.style.minHeight = `${Math.min(windowHeight * 0.7, 600)}px`;
            } else {
                // Reset for desktop
                heroContent.style.minHeight = '';
            }
        }
    }, 200);
    
    // Add optimized event listeners
    window.addEventListener('scroll', scrollHandlers, { passive: true });
    window.addEventListener('resize', resizeHandler, { passive: true });
    
    // Run once on initialization
    scrollHandlers();
    resizeHandler();
    
    // Detect and handle low-end devices
    if ('deviceMemory' in navigator || 'hardwareConcurrency' in navigator) {
        const isLowEndDevice = (
            (navigator.deviceMemory && navigator.deviceMemory <= 2) || 
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
        );
        
        if (isLowEndDevice) {
            // Apply low-end optimizations
            document.documentElement.classList.add('low-end-device');
            
            // Disable particle effects
            const particles = document.getElementById('particles-js');
            if (particles) particles.style.display = 'none';
            
            // Simplify animations
            document.body.classList.add('reduced-motion');
            
            // Reduce background effects
            const bgEffects = document.querySelectorAll('.glow-effect, .quantum-data-visualization');
            bgEffects.forEach(effect => {
                effect.style.display = 'none';
            });
        }
    }
}

// SECTION 5: Helper functions

// Check if the page is being prerendered
function isPagePrerendered() {
    return document.visibilityState === 'prerender';
}

// Initialize these optimizations at appropriate times
function initializeOptimizations() {
    // Resource hints can be set up immediately
    setupResourceHints();
    
    // Set up lazy loading after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupLazyLoading();
            enhanceAnimations();
        });
    } else {
        setupLazyLoading();
        enhanceAnimations();
    }
    
    // Runtime optimizations should wait for page load
    window.addEventListener('load', () => {
        // Small delay to avoid competing with critical rendering
        setTimeout(optimizeRuntime, 100);
    });
}

// Actually initialize all optimizations
initializeOptimizations();

// Add CSS helper styles for performance optimizations
const perfStyles = document.createElement('style');
perfStyles.textContent = `
    /* Prevent content shifts during lazy loading */
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img[data-src].loaded {
        opacity: 1;
    }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
        }
    }
    
    /* Low-end device optimizations */
    .low-end-device .hero::before,
    .low-end-device .features::before,
    .low-end-device .benefits::before,
    .low-end-device .glow-effect,
    .low-end-device .quantum-data-visualization {
        display: none !important;
    }
    
    .low-end-device .will-animate,
    .reduced-motion .will-animate {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
    }
    
    /* Flash of unstyled content prevention */
    .feature-card, .benefit-card, .step, .faq-item, .trust-item {
        opacity: 1;
    }
    
    .will-animate {
        opacity: 0;
        transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    
    .in-view {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(perfStyles);