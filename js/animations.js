// Add this code to main.js or create a new file called animations.js

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Typing Effect for Hero Heading
    function initTypingEffect() {
        const headings = document.querySelectorAll('.hero h1');
        if (headings.length === 0) return;
        
        const heading = headings[0];
        const text = heading.textContent;
        heading.innerHTML = ''; // Clear the heading
        heading.classList.add('typing-effect');
        
        // Create a wrapper for the typing effect
        const typingWrapper = document.createElement('span');
        typingWrapper.className = 'typing-wrapper';
        heading.appendChild(typingWrapper);
        
        let i = 0;
        const typingSpeed = 50; // ms per character
        
        function typeWriter() {
            if (i < text.length) {
                typingWrapper.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, typingSpeed);
            } else {
                // Add blinking cursor after typing is complete
                const cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                cursor.innerHTML = '|';
                heading.appendChild(cursor);
                
                // Remove cursor after 3 seconds
                setTimeout(() => {
                    if (cursor.parentNode) {
                        cursor.parentNode.removeChild(cursor);
                    }
                    heading.classList.remove('typing-effect');
                }, 3000);
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
    
    // Enhanced Scroll Animations for Features and Benefits
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .benefit-card, .step, .faq-item, .trust-item');
        
        if (animatedElements.length === 0) return;
        
        // Set custom animation delay for each element
        animatedElements.forEach((el, index) => {
            el.style.setProperty('--anim-delay', `${index * 0.1}s`);
        });
        
        // Animate elements when they enter viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Enhanced counter animation for statistics
    function initCounterAnimations() {
        const countElements = document.querySelectorAll('.stat-value, .trust-number, #spots-remaining');
        
        if (countElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.textContent.replace(/,/g, '').replace(/[^0-9.]/g, ''));
                    const suffix = el.textContent.replace(/[0-9.,]/g, '');
                    let start = 0;
                    const duration = 2000; // ms
                    const increment = target / (duration / 16); // 60fps
                    
                    // For very large numbers, start higher
                    if (target > 1000) {
                        start = Math.floor(target * 0.5);
                    } else if (target > 100) {
                        start = Math.floor(target * 0.3);
                    }
                    
                    let current = start;
                    const startTime = performance.now();
                    
                    function updateCount(timestamp) {
                        const elapsed = timestamp - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Use easeOutExpo for smooth animation
                        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                        current = start + (target - start) * easeProgress;
                        
                        // Format output based on number type
                        if (Number.isInteger(target)) {
                            el.textContent = Math.floor(current).toLocaleString() + suffix;
                        } else {
                            // Format with same decimal precision as target
                            const precision = (target.toString().split('.')[1] || '').length;
                            el.textContent = current.toFixed(precision).toLocaleString() + suffix;
                        }
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            // Add pulse effect on completion
                            el.classList.add('pulse');
                            setTimeout(() => {
                                el.classList.remove('pulse');
                            }, 1000);
                        }
                    }
                    
                    requestAnimationFrame(updateCount);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.5
        });
        
        countElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Parallax effect for hero and section backgrounds
    function initParallaxEffects() {
        const parallaxContainers = document.querySelectorAll('.hero, .features, .benefits, .how-it-works');
        
        if (parallaxContainers.length === 0) return;
        
        // Create parallax layers for each container
        parallaxContainers.forEach(container => {
            // Add parallax class
            container.classList.add('parallax-container');
            
            // Get background and create a layer for it
            const computedStyle = window.getComputedStyle(container);
            const bgColor = computedStyle.backgroundColor;
            const bgImage = computedStyle.backgroundImage;
            
            // Create background layer
            if (bgImage !== 'none') {
                const bgLayer = document.createElement('div');
                bgLayer.className = 'parallax-bg';
                bgLayer.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${bgColor};
                    background-image: ${bgImage};
                    background-size: cover;
                    background-position: center;
                    transform: translateZ(0);
                    z-index: -1;
                `;
                container.appendChild(bgLayer);
            }
        });
        
        // Add parallax movement on scroll
        window.addEventListener('scroll', () => {
            parallaxContainers.forEach(container => {
                const bgLayer = container.querySelector('.parallax-bg');
                if (!bgLayer) return;
                
                const rect = container.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Only apply parallax if container is in viewport
                if (rect.bottom > 0 && rect.top < viewportHeight) {
                    const scrollPosition = rect.top / viewportHeight;
                    const translateY = scrollPosition * 50; // Adjust this value for parallax intensity
                    
                    bgLayer.style.transform = `translateY(${translateY}px) translateZ(0)`;
                }
            });
        });
    }
    
    // Enhanced hover effects for interactive elements
    function initHoverEffects() {
        const hoverElements = document.querySelectorAll('.cta-button, .secondary-button, .feature-card, .benefit-card');
        
        if (hoverElements.length === 0) return;
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                // Store mouse position as CSS variables for hover effects
                this.style.setProperty('--mouse-x', `${mouseX}px`);
                this.style.setProperty('--mouse-y', `${mouseY}px`);
                
                // Add pulse glow effect
                const glow = document.createElement('div');
                glow.className = 'hover-glow';
                glow.style.cssText = `
                    position: absolute;
                    top: ${mouseY}px;
                    left: ${mouseX}px;
                    transform: translate(-50%, -50%);
                    width: 5px;
                    height: 5px;
                    background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.8;
                    animation: hover-pulse 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                `;
                
                this.appendChild(glow);
                
                // Remove glow after animation completes
                setTimeout(() => {
                    if (glow.parentNode) {
                        glow.parentNode.removeChild(glow);
                    }
                }, 1000);
            });
        });
        
        // Add keyframes for the hover pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes hover-pulse {
                0% {
                    width: 5px;
                    height: 5px;
                    opacity: 0.8;
                }
                100% {
                    width: 150px;
                    height: 150px;
                    opacity: 0;
                }
            }
            
            .cta-button, .secondary-button, .feature-card, .benefit-card {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize all animations
    initTypingEffect();
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initHoverEffects();
});