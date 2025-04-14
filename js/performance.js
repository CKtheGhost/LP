// Add this code to main.js or create a new file called performance.js

// Optimize image loading with lazy loading
document.addEventListener('DOMContentLoaded', function() {
    // Lazy load images
    const lazyImages = document.querySelectorAll('[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
    
    // Progressive enhancement for sections
    const enhanceSections = () => {
        const sections = document.querySelectorAll('section, .feature-card, .benefit-card, .faq-item, .step');
        
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });
            
            sections.forEach(section => {
                section.classList.add('will-animate');
                sectionObserver.observe(section);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            sections.forEach(section => {
                section.classList.add('in-view');
            });
        }
    };
    
    // Initialize section animations
    enhanceSections();
    
    // Optimize intro video loading
    const optimizeVideoLoading = () => {
        const introVideo = document.getElementById('intro-video');
        if (!introVideo) return;
        
        // Add loading state
        const videoContainer = introVideo.closest('.intro-video-container');
        if (videoContainer) {
            videoContainer.classList.add('loading');
            
            // Add loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'video-loading-indicator';
            loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading Experience...</div>
            `;
            videoContainer.appendChild(loadingIndicator);
            
            // Remove loading state when video is ready
            introVideo.addEventListener('loadeddata', () => {
                videoContainer.classList.remove('loading');
                loadingIndicator.remove();
            });
            
            // Fallback: remove loading state after 5 seconds regardless
            setTimeout(() => {
                videoContainer.classList.remove('loading');
                if (loadingIndicator.parentNode) {
                    loadingIndicator.remove();
                }
            }, 5000);
        }
    };
    
    // Initialize video loading optimization
    optimizeVideoLoading();
    
    // Debounce scroll events for better performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Optimize scroll event handlers
    const scrollHandlers = () => {
        const header = document.querySelector('header');
        const floatingCta = document.querySelector('.floating-cta');
        const progressBar = document.getElementById('scroll-progress');
        
        const handleScroll = debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Update header
            if (header) {
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                    header.style.opacity = '1'; // Ensure header remains visible
                } else {
                    header.classList.remove('scrolled');
                    header.style.opacity = '1'; // Maintain visibility at top
                }
            }
            
            // Update progress bar
            if (progressBar) {
                progressBar.style.width = scrollPercent + '%';
            }
            
            // Show/hide floating CTA
            if (floatingCta) {
                if (scrollTop > 600) {
                    floatingCta.classList.add('visible');
                } else {
                    floatingCta.classList.remove('visible');
                }
            }
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
        
        // Initial call
        handleScroll();
    };
    
    // Initialize optimized scroll handlers
    scrollHandlers();
    
    // Add preconnect for external resources
    const addPreconnect = () => {
        const head = document.head;
        const domains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ];
        
        domains.forEach(domain => {
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = 'anonymous';
            head.appendChild(preconnect);
        });
    };
    
    // Initialize preconnect
    addPreconnect();
});

// Add CSS animation classes
document.addEventListener('DOMContentLoaded', function() {
    // Add these CSS classes to your stylesheet
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Animation classes for sections */
        .will-animate {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .in-view {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Video loading styles */
        .intro-video-container.loading {
            background: var(--darkest);
        }
        
        .video-loading-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 5;
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(0, 255, 0, 0.1);
            border-top: 3px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        .loading-text {
            color: var(--primary);
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleElement);
});