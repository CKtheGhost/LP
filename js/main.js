// PROSPERA Early Access Landing Page - Main JavaScript

/**
 * Main entry point - waits for DOM to be fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the video experience first
    const videoController = enhanceVideoExperience();
    
    // Check for intro container to determine initialization flow
    const introContainer = document.querySelector('.intro-video-container');
    if (!introContainer) {
        // No intro video, initialize directly
        document.body.classList.add('content-visible');
        initializeMainContent();
    } else {
        // Video will trigger content initialization when complete
        // This is handled in the enhanceVideoExperience function
    }
});

/**
 * Enhanced video introduction experience
 */
function enhanceVideoExperience() {
    const introVideo = document.getElementById('intro-video');
    const introContainer = document.querySelector('.intro-video-container');
    const skipIntroButton = document.getElementById('skip-intro-button');
    const videoSoundToggle = document.getElementById('video-sound-toggle');
    const videoProgressBar = document.querySelector('.video-progress-bar');
    
    // If elements don't exist, abort
    if (!introVideo || !introContainer) return { endIntro: () => {} };
    
    // Add video progress tracking
    introVideo.addEventListener('timeupdate', () => {
        if (introVideo.duration > 0) {
            const progressPercent = (introVideo.currentTime / introVideo.duration) * 100;
            videoProgressBar.style.width = `${progressPercent}%`;
        }
    });
    
    // Initialize video with volume at 50% but muted
    introVideo.volume = 0.5;
    introVideo.muted = true;
    
    // Toggle video sound button handler
    if (videoSoundToggle) {
        videoSoundToggle.addEventListener('click', () => {
            if (introVideo.muted) {
                introVideo.muted = false;
                videoSoundToggle.classList.remove('muted');
                
                // Animate volume change
                let volume = 0;
                const volumeInterval = setInterval(() => {
                    volume += 0.05;
                    if (volume >= 0.5) {
                        volume = 0.5;
                        clearInterval(volumeInterval);
                    }
                    introVideo.volume = volume;
                }, 50);
            } else {
                // Animate volume fade out
                const fadeOutInterval = setInterval(() => {
                    if (introVideo.volume > 0.05) {
                        introVideo.volume -= 0.05;
                    } else {
                        introVideo.volume = 0;
                        introVideo.muted = true;
                        videoSoundToggle.classList.add('muted');
                        clearInterval(fadeOutInterval);
                    }
                }, 50);
            }
        });
    }
    
    // Create a play button for mobile/autoplay restrictions
    function createPlayButton() {
        // Check if play button already exists
        if (document.querySelector('.video-play-button')) return;
        
        const playButton = document.createElement('button');
        playButton.className = 'video-play-button';
        playButton.innerHTML = `
            <svg width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
            </svg>
        `;
        
        // Play video when button is clicked
        playButton.addEventListener('click', () => {
            introVideo.play().then(() => {
                playButton.remove();
                // Enable audio automatically when user initiates play
                introVideo.muted = false;
                if (videoSoundToggle) videoSoundToggle.classList.remove('muted');
            }).catch(e => {
                console.log('Play failed:', e);
                // If play still fails, just skip to main content
                endIntro();
            });
        });
        
        introContainer.appendChild(playButton);
    }
    
    // Try to autoplay video
    introVideo.play().catch(error => {
        console.log('Autoplay failed:', error);
        createPlayButton();
    });
    
    // Function to end intro and transition to main content
    function endIntro() {
        // Fade out intro container
        introContainer.classList.add('hidden');
        
        // Show main content
        document.body.classList.add('content-visible');
        
        // Pause video to save resources
        introVideo.pause();
        
        // Wait for intro to fade out before removing it
        setTimeout(() => {
            introContainer.style.display = 'none';
            initializeMainContent();
        }, 1000);
    }
    
    // When video ends, show the main content
    introVideo.addEventListener('ended', endIntro);
    
    // Skip intro button
    if (skipIntroButton) {
        skipIntroButton.addEventListener('click', endIntro);
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // Pause video when tab is not visible
            if (!introVideo.paused) introVideo.pause();
        } else if (document.visibilityState === 'visible') {
            // Try to resume video when tab becomes visible again
            if (introContainer.style.display !== 'none') {
                introVideo.play().catch(err => {
                    console.log('Resume play failed:', err);
                    // If autoplay failed earlier, we might need the play button
                    if (!document.querySelector('.video-play-button')) {
                        createPlayButton();
                    }
                });
            }
        }
    });
    
    // Add click anywhere to play/unmute for better UX
    introContainer.addEventListener('click', function containerClickHandler(e) {
        // Only handle clicks on the container itself, not on buttons
        if (e.target === introContainer || e.target === introVideo) {
            if (introVideo.paused) {
                introVideo.play().catch(err => console.log('Play on click failed:', err));
            } else if (introVideo.muted) {
                introVideo.muted = false;
                if (videoSoundToggle) videoSoundToggle.classList.remove('muted');
            }
        }
    });
    
    return {
        endIntro: endIntro
    };
}

/**
 * Initialize all main content and components
 */
function initializeMainContent() {
    console.log("Initializing main content...");
    
    // Initialize Particles.js
    initParticlesJS();
    
    // Initialize UI components
    initHeaderScrollEffect();
    initMobileMenu();
    initFAQAccordion();
    initSignupModal();
    initFormTabs();
    initFloatingCta();
    initAudio();
    
    // Initialize enhanced components
    initEnhancedTestimonials();
    initEnhancedCountdown();
    initTrustIndicators();
    initEarlyAccessCounter();
    initSmoothScrolling();
    initFormSubmissions();
    
    // Initialize animations
    initAnimationOnScroll();
    createGlowDots();
    enhanceParticleEffects();
    
    // Initialize optimization and monitoring
    initPerformanceOptimizations();
    initUserActivityMonitor();
}

/**
 * Initialize Particles.js if available
 */
function initParticlesJS() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00ff00'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.2,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ff00',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * Header scroll effect
 */
function initHeaderScrollEffect() {
    const handleScroll = () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Accessibility
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            mobileNav.setAttribute('aria-hidden', expanded);
        });
    
        // Close mobile menu when clicking a link
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }
}

/**
 * FAQ accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherQuestion = otherItem.querySelector('.faq-question');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        
                        otherQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                question.setAttribute('aria-expanded', !isActive);
            });
            
            // Allow keyboard activation
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        }
    });
}

/**
 * Modal signup functionality
 */
function initSignupModal() {
    const modalTriggers = document.querySelectorAll('[id$="-join-cta"]');
    const modal = document.getElementById('signup-modal');
    const closeButton = document.querySelector('.close-button');
    
    if (modal && closeButton) {
        // Open modal when any CTA button is clicked
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                modal.classList.add('active');
                document.body.classList.add('modal-open');
                modal.setAttribute('aria-hidden', 'false');
                
                // Focus the first input field for better accessibility
                const firstInput = modal.querySelector('input, button, select, textarea');
                if (firstInput) {
                    firstInput.focus();
                }
            });
        });
        
        // Close modal with close button
        closeButton.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            modal.setAttribute('aria-hidden', 'true');
        });
        
        // Close modal when clicking outside the content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });

        // Close modal with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
                modal.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Modal Application Form Submission
        const applicationForm = document.getElementById('early-access-application');
        if (applicationForm) {
            applicationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data (in a real scenario, this would be sent to a backend)
                const formData = new FormData(this);
                
                // Show submission animation
                const submitButton = this.querySelector('.form-button');
                submitButton.innerText = submitButton.getAttribute('data-loading-text') || 'Submitting...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                // Simulate form submission (would be an actual API call in production)
                setTimeout(function() {
                    // Hide modal
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    modal.setAttribute('aria-hidden', 'true');
                    
                    // Show success message
                    showNotification('Application submitted successfully! We will review your application and contact you soon.', 'success');
                    
                    // Reset form and button
                    applicationForm.reset();
                    submitButton.innerText = 'Submit Application';
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                    
                    // Show the spot counter decreasing by 1
                    decreaseSpotCounter();
                }, 2000);
            });
        }
    }
}

/**
 * Decrease spot counter after signup
 */
function decreaseSpotCounter() {
    const spotsElement = document.getElementById('spots-remaining');
    if (spotsElement) {
        let spots = parseInt(spotsElement.innerText);
        spots = Math.max(200, spots - 1); // Don't go below 200 spots
        spotsElement.innerText = spots;
        spotsElement.classList.add('pulse');
        
        // Remove pulse animation after it completes
        setTimeout(() => {
            spotsElement.classList.remove('pulse');
        }, 500);
        
        // Update progress bar
        const progressBar = document.querySelector('.counter-progress-bar');
        if (progressBar) {
            const percentage = 100 - (spots / 500 * 100);
            progressBar.style.width = percentage + '%';
            
            // Update aria values for accessibility
            const progressContainer = document.querySelector('.counter-progress');
            if (progressContainer) {
                progressContainer.setAttribute('aria-valuenow', spots);
            }
        }
    }
}

/**
 * Form tab switching
 */
function initFormTabs() {
    const emailTabButton = document.getElementById('email-tab-button');
    const walletTabButton = document.getElementById('wallet-tab-button');
    const emailTab = document.getElementById('email-tab');
    const walletTab = document.getElementById('wallet-tab');
    
    if (emailTabButton && walletTabButton && emailTab && walletTab) {
        emailTabButton.addEventListener('click', function() {
            emailTabButton.classList.add('active');
            walletTabButton.classList.remove('active');
            emailTab.classList.add('active');
            walletTab.classList.remove('active');
            
            // Accessibility
            emailTabButton.setAttribute('aria-selected', 'true');
            walletTabButton.setAttribute('aria-selected', 'false');
            walletTab.setAttribute('aria-hidden', 'true');
            emailTab.setAttribute('aria-hidden', 'false');
        });
        
        walletTabButton.addEventListener('click', function() {
            walletTabButton.classList.add('active');
            emailTabButton.classList.remove('active');
            walletTab.classList.add('active');
            emailTab.classList.remove('active');
            
            // Accessibility
            walletTabButton.setAttribute('aria-selected', 'true');
            emailTabButton.setAttribute('aria-selected', 'false');
            emailTab.setAttribute('aria-hidden', 'true');
            walletTab.setAttribute('aria-hidden', 'false');
        });
    }
}

/**
 * Form submission handlers
 */
function initFormSubmissions() {
    // Email tab form submission
    const emailForm = document.getElementById('early-access-form-email');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get email value
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                // Pre-fill the modal form with the email
                const modalEmailInput = document.getElementById('email');
                if (modalEmailInput) {
                    modalEmailInput.value = emailInput.value;
                }
                
                // Open the modal
                const modal = document.getElementById('signup-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                    modal.setAttribute('aria-hidden', 'false');
                }
            }
        });
    }
    
    // Wallet tab form submission
    const walletForm = document.getElementById('early-access-form-wallet');
    if (walletForm) {
        walletForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get wallet value
            const walletInput = this.querySelector('input[type="text"]');
            
            if (walletInput && walletInput.value) {
                // Pre-fill the modal form with the wallet
                const modalWalletInput = document.getElementById('wallet');
                if (modalWalletInput) {
                    modalWalletInput.value = walletInput.value;
                }
                
                // Open the modal
                const modal = document.getElementById('signup-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                    modal.setAttribute('aria-hidden', 'false');
                }
            }
        });
    }
}

/**
 * Floating CTA Button functionality
 */
function initFloatingCta() {
    const floatingCta = document.querySelector('.floating-cta-button');
    
    if (floatingCta) {
        floatingCta.addEventListener('click', function() {
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('modal-open');
                modal.setAttribute('aria-hidden', 'false');
            }
        });
        
        // Hide when footer is visible
        window.addEventListener('scroll', function() {
            const footer = document.querySelector('.enhanced-footer');
            if (footer) {
                const footerTop = footer.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (footerTop < windowHeight) {
                    floatingCta.parentElement.style.opacity = '0';
                    floatingCta.parentElement.style.pointerEvents = 'none';
                } else {
                    floatingCta.parentElement.style.opacity = '1';
                    floatingCta.parentElement.style.pointerEvents = 'all';
                }
            }
        });
    }
}

/**
 * Enhanced notification system
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Add to the DOM
    const container = document.querySelector('.toast-container') || document.body;
    container.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Close notification when clicking the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('active');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Enhanced Audio functionality
 */
function initAudio() {
    const backgroundAudio = document.getElementById('background-audio');
    const audioToggle = document.getElementById('audio-toggle');
    let audioInitialized = false;
    
    if (!backgroundAudio || !audioToggle) return;
    
    // Function to start playing background audio with user interaction
    function startBackgroundAudio() {
        if (!audioInitialized && backgroundAudio) {
            // First set volume to 0 to avoid autoplay restrictions
            backgroundAudio.volume = 0;
            backgroundAudio.play().then(() => {
                // Gradually increase volume for a better experience
                let currentVolume = 0;
                const targetVolume = 0.3;
                const fadeIn = setInterval(() => {
                    currentVolume += 0.05;
                    backgroundAudio.volume = Math.min(currentVolume, targetVolume);
                    if (currentVolume >= targetVolume) {
                        clearInterval(fadeIn);
                    }
                }, 100);
                
                audioInitialized = true;
                audioToggle.classList.add('active');
                document.body.classList.add('audio-playing');
            }).catch((error) => {
                console.log('Audio playback failed:', error);
                // Make audio button more prominent to encourage manual play
                audioToggle.classList.add('attention');
                addAudioNotification();
            });
        }
    }
    
    // Add a subtle notification to encourage audio play
    function addAudioNotification() {
        // Check if notification already exists
        if (document.querySelector('.audio-notification')) return;
        
        const notification = document.createElement('div');
        notification.className = 'audio-notification';
        notification.innerHTML = 'Enable sound for full experience';
        
        // Append near audio button
        document.querySelector('.audio-container').appendChild(notification);
        
        // Fade out after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 1000);
        }, 5000);
    }
    
    // Initialize audio on first user interaction with the page
    document.body.addEventListener('click', function bodyClickHandler() {
        startBackgroundAudio();
        document.body.removeEventListener('click', bodyClickHandler);
    }, { once: true });
    
    // Also try to play on scroll
    window.addEventListener('scroll', function scrollHandler() {
        startBackgroundAudio();
        window.removeEventListener('scroll', scrollHandler);
    }, { once: true });
    
    // Setup the audio toggle button
    audioToggle.addEventListener('click', function() {
        if (backgroundAudio.paused) {
            backgroundAudio.volume = 0;
            backgroundAudio.play().then(() => {
                // Fade in audio
                let currentVolume = 0;
                const targetVolume = 0.3;
                const fadeIn = setInterval(() => {
                    currentVolume += 0.05;
                    backgroundAudio.volume = Math.min(currentVolume, targetVolume);
                    if (currentVolume >= targetVolume) {
                        clearInterval(fadeIn);
                    }
                }, 100);
                
                audioToggle.classList.add('active');
                document.body.classList.add('audio-playing');
            }).catch(error => {
                console.log('Audio playback failed:', error);
            });
        } else {
            // Fade out audio
            const fadeOut = setInterval(() => {
                if (backgroundAudio.volume > 0.05) {
                    backgroundAudio.volume -= 0.05;
                } else {
                    backgroundAudio.pause();
                    clearInterval(fadeOut);
                    audioToggle.classList.remove('active');
                    document.body.classList.remove('audio-playing');
                }
            }, 100);
        }
    });
}

/**
 * Enhanced testimonial slider
 */
function initEnhancedTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval;
    
    // Function to show a specific slide
    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].setAttribute('aria-hidden', 'true');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-current', 'false');
        
        // Update current slide index
        currentSlide = index;
        
        // Ensure index is within bounds
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        // Show new slide with animation classes
        slides[currentSlide].classList.add('animate-entrance');
        
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
            slides[currentSlide].setAttribute('aria-hidden', 'false');
            dots[currentSlide].classList.add('active');
            dots[currentSlide].setAttribute('aria-current', 'true');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                slides[currentSlide].classList.remove('animate-entrance');
                isAnimating = false;
            }, 800);
        }, 300);
    }
    
    // Set up click events for navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            resetAutoplay();
            showSlide(currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            resetAutoplay();
            showSlide(currentSlide + 1);
        });
    }
    
    // Set up click events for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            resetAutoplay();
            showSlide(index);
        });
    });
    
    // Function to start autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 8000);
    }
    
    // Function to reset autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }
    
    // Add swipe gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const testimonialContainer = document.querySelector('.testimonials-slider');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        testimonialContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, show next slide
            resetAutoplay();
            showSlide(currentSlide + 1);
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, show previous slide
            resetAutoplay();
            showSlide(currentSlide - 1);
        }
    }
    
    // Add hover pause for testimonials
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            startAutoplay();
        });
    }
    
    // Initialize the first slide and start autoplay
    slides[0].classList.add('active');
    slides[0].setAttribute('aria-hidden', 'false');
    dots[0].classList.add('active');
    dots[0].setAttribute('aria-current', 'true');
    startAutoplay();
}

/**
 * Enhanced countdown timer
 */
function initEnhancedCountdown() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    
    if (!days || !hours || !minutes || !seconds) return;
    
    // Set the target date (14 days from now by default)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14);
    targetDate.setHours(targetDate.getHours() + 22);
    targetDate.setMinutes(targetDate.getMinutes() + 36);
    targetDate.setSeconds(targetDate.getSeconds() + 42);
    
    function updateCountdown() {
        const currentDate = new Date();
        const difference = targetDate - currentDate;
        
        if (difference <= 0) {
            // Timer expired
            days.innerText = '00';
            hours.innerText = '00';
            minutes.innerText = '00';
            seconds.innerText = '00';
            return;
        }
        
        // Calculate remaining time
        const daysValue = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hoursValue = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesValue = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const secondsValue = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Format values with leading zeros
        const formattedDays = String(daysValue).padStart(2, '0');
        const formattedHours = String(hoursValue).padStart(2, '0');
        const formattedMinutes = String(minutesValue).padStart(2, '0');
        const formattedSeconds = String(secondsValue).padStart(2, '0');
        
        // Create flip animation effect for seconds
        if (seconds.innerText !== formattedSeconds) {
            animateFlip(seconds, formattedSeconds);
        }
        
        // Animate other values only when they change
        if (minutes.innerText !== formattedMinutes) {
            animateFlip(minutes, formattedMinutes);
        }
        
        if (hours.innerText !== formattedHours) {
            animateFlip(hours, formattedHours);
        }
        
        if (days.innerText !== formattedDays) {
            animateFlip(days, formattedDays);
        }
    }
    
    // Function to create a flip animation effect
    function animateFlip(element, newValue) {
        element.classList.add('flip-animation');
        
        setTimeout(() => {
            element.innerText = newValue;
            
            // Update aria-label for accessibility
            const countdownItem = element.closest('.countdown-item');
            if (countdownItem) {
                const label = countdownItem.querySelector('.countdown-label');
                if (label) {
                    element.setAttribute('aria-label', `${newValue} ${label.textContent} remaining`);
                }
            }
            
            element.classList.remove('flip-animation');
        }, 300);
    }
    
    // Initialize values
    updateCountdown();
    
    // Update timer every second
    setInterval(updateCountdown, 1000);
}

/**
 * Enhanced Trust Indicators animation
 */
function initTrustIndicators() {
    const trustItems = document.querySelectorAll('.trust-item');
    
    if (trustItems.length === 0) return;
    
    // Set animation delay for each trust item
    trustItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
        
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            // Subtle animations for icon and number
            const icon = this.querySelector('.trust-icon');
            const number = this.querySelector('.trust-number');
            
            if (icon) {
                icon.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                icon.style.transform = 'rotate(10deg) scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }
            
            if (number) {
                // Quick visual effect for the number
                number.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                number.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    number.style.transform = '';
                }, 300);
            }
        });
    });
    
    // Animate trust items when they come into view
    const animateTrustItems = () => {
        trustItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
            
            if (isInView && !item.classList.contains('animated')) {
                item.classList.add('animated');
            }
        });
    };
    
    // Run on scroll
    window.addEventListener('scroll', animateTrustItems);
    
    // Initial check
    animateTrustItems();
}

/**
 * Early Access Counter Simulation
 */
function initEarlyAccessCounter() {
    const spotsElement = document.getElementById('spots-remaining');
    if (!spotsElement) return;
    
    // Update aria-valuenow initially for accessibility
    const counterProgress = document.querySelector('.counter-progress');
    if (counterProgress) {
        const initialSpots = parseInt(spotsElement.innerText);
        counterProgress.setAttribute('aria-valuenow', initialSpots);
    }
    
    // Simulate spots decreasing randomly
    // Using a less frequent interval to reduce resource usage
    const spotSimulation = () => {
        // 15% chance of spot reduction
        if (Math.random() < 0.15) {
            let spots = parseInt(spotsElement.innerText);
            if (spots > 200) { // Don't go below 200 for marketing strategy
                spots--;
                spotsElement.innerText = spots;
                spotsElement.classList.add('pulse');
                
                // Remove pulse animation after it completes
                setTimeout(() => {
                    spotsElement.classList.remove('pulse');
                }, 500);
                
                // Update progress bar
                const progressBar = document.querySelector('.counter-progress-bar');
                if (progressBar) {
                    const percentage = 100 - (spots / 500 * 100);
                    progressBar.style.width = percentage + '%';
                    
                    // Update aria values
                    if (counterProgress) {
                        counterProgress.setAttribute('aria-valuenow', spots);
                    }
                }
            }
        }
        
        // Schedule the next check in 2-5 minutes
        setTimeout(spotSimulation, Math.floor(Math.random() * (300000 - 120000) + 120000));
    };
    
    // Start the simulation after a short delay
    setTimeout(spotSimulation, 30000);
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Check for prefers-reduced-motion
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
                
                // Update focus for accessibility
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }, prefersReducedMotion ? 0 : 1000);
                
                // Update URL hash for shareable links without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Animation on scroll functionality
 */
function initAnimationOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .benefit-card, .step, .faq-item, .trust-item');
    
    function checkElementsInView() {
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 50;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollThrottleTimer;
    window.addEventListener('scroll', function() {
        if (scrollThrottleTimer) return;
        
        scrollThrottleTimer = setTimeout(function() {
            checkElementsInView();
            scrollThrottleTimer = null;
        }, 100);
    });
    
    // Initial check
    checkElementsInView();
}

/**
 * Create decorative glow dots
 */
function createGlowDots() {
    // Check if dots already exist to prevent duplicates
    if (document.querySelector('.glow-dot')) return;
    
    const container = document.querySelector('body');
    const dotCount = 6;
    
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'glow-dot';
        dot.setAttribute('aria-hidden', 'true');
        
        // Random positioning
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = 3 + (Math.random() * 6);
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        
        // Random animation delay
        dot.style.animation = `pulse ${2 + Math.random() * 3}s infinite alternate ${Math.random() * 2}s`;
        
        container.appendChild(dot);
    }
}

/**
 * Add enhanced particle effects for mouse interactions
 */
function enhanceParticleEffects() {
    // Add debouncing for performance
    let mouseMoveThrottle;
    
    document.addEventListener('mousemove', function(e) {
        if (mouseMoveThrottle) return;
        mouseMoveThrottle = true;
        setTimeout(() => { mouseMoveThrottle = false; }, 50);
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Only create effects occasionally to prevent overwhelming the DOM
        if (Math.random() < 0.1) {
            // Create a pulse effect on mouse move
            const pulse = document.createElement('div');
            pulse.className = 'mouse-pulse';
            pulse.setAttribute('aria-hidden', 'true');
            pulse.style.left = `${mouseX}px`;
            pulse.style.top = `${mouseY}px`;
            document.body.appendChild(pulse);
            
            // Remove after animation completes
            setTimeout(() => {
                if (document.body.contains(pulse)) {
                    pulse.remove();
                }
            }, 1000);
        }
    }, { passive: true });
    
    // Add custom click particle burst
    document.addEventListener('click', function(e) {
        // Don't create particles if clicking inside form elements
        if (e.target.closest('input, button, a, select, textarea')) return;
        
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // Create multiple particles for burst effect
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.setAttribute('aria-hidden', 'true');
            
            // Random angle for particle direction
            const angle = Math.random() * Math.PI * 2;
            
            particle.style.left = `${clickX}px`;
            particle.style.top = `${clickY}px`;
            particle.style.setProperty('--angle', angle);
            
            document.body.appendChild(particle);
            
            // Remove after animation completes
            setTimeout(() => {
                if (document.body.contains(particle)) {
                    particle.remove();
                }
            }, 1000);
        }
    }, { passive: true });
}

/**
 * Performance optimizations
 */
function initPerformanceOptimizations() {
    // Lazy load images outside viewport
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Debounce resize handler
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Debounced window resize handler
    const debouncedResize = debounce(() => {
        // Recalculate any layout elements that depend on window size
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Adjust hero layout for responsive design
            const headerHeight = document.querySelector('header')?.offsetHeight || 0;
            const screenHeight = window.innerHeight - headerHeight;
            heroContent.style.minHeight = `${Math.min(screenHeight * 0.7, 600)}px`;
        }
    }, 150);
    
    window.addEventListener('resize', debouncedResize);
    
    // Initial call
    debouncedResize();
}

/**
 * User activity monitoring for re-engagement
 */
function initUserActivityMonitor() {
    let inactivityTimer;
    const inactivityThreshold = 180000; // 3 minutes
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(showReengagementPrompt, inactivityThreshold);
    }
    
    function showReengagementPrompt() {
        // Don't show if user is already in modal view
        if (document.body.classList.contains('modal-open') || document.querySelector('.engagement-prompt')) return;
        
        // Create engagement prompt
        const promptContainer = document.createElement('div');
        promptContainer.className = 'engagement-prompt';
        promptContainer.setAttribute('role', 'dialog');
        promptContainer.setAttribute('aria-labelledby', 'engagement-title');
        promptContainer.innerHTML = `
            <div class="engagement-content">
                <h3 id="engagement-title">Still interested in early access?</h3>
                <p>Don't miss your opportunity to join PROSPERA's exclusive program.</p>
                <div class="engagement-actions">
                    <button class="engagement-join">Apply Now</button>
                    <button class="engagement-dismiss">Maybe Later</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(promptContainer);
        
        // Animate in
        setTimeout(() => {
            promptContainer.classList.add('active');
        }, 10);
        
        // Set up event listeners
        const joinButton = promptContainer.querySelector('.engagement-join');
        const dismissButton = promptContainer.querySelector('.engagement-dismiss');
        
        if (joinButton) {
            joinButton.addEventListener('click', () => {
                // Remove prompt
                promptContainer.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(promptContainer)) {
                        promptContainer.remove();
                    }
                }, 300);
                
                // Open signup modal
                const modal = document.getElementById('signup-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                }
                
                // Reset the timer
                resetInactivityTimer();
            });
        }
        
        if (dismissButton) {
            dismissButton.addEventListener('click', () => {
                promptContainer.classList.remove('active');
                setTimeout(() => {
                    if (document.body.contains(promptContainer)) {
                        promptContainer.remove();
                    }
                }, 300);
                
                // Reset the timer with double the threshold to avoid annoying the user
                clearTimeout(inactivityTimer);
                inactivityTimer = setTimeout(showReengagementPrompt, inactivityThreshold * 2);
            });
        }
    }
    
    // Monitor user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, { passive: true });
    });
    
    // Start the timer after user has been on page for a minute
    setTimeout(() => {
        resetInactivityTimer();
    }, 60000);
}