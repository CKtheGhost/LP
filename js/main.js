// PROSPERA Early Access Landing Page - Main JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Intro Video Handling
    const introVideo = document.getElementById('intro-video');
    const introContainer = document.querySelector('.intro-video-container');
    const skipIntroButton = document.getElementById('skip-intro-button');
    
    // Function to end intro and show main content
    function endIntro() {
        // Fade out intro container
        introContainer.classList.add('hidden');
        
        // Show main content
        document.body.classList.add('content-visible');
        
        // Wait for intro to fade out before removing it
        setTimeout(() => {
            introContainer.style.display = 'none';
            
            // Start the normal page loading sequence
            startMainContentLoading();
        }, 1000);
    }
    
    // Function to start the main content loading sequence
    function startMainContentLoading() {
        // Initialize loading screen
        setTimeout(function() {
            document.querySelector('.loading').style.opacity = '0';
            setTimeout(function() {
                document.querySelector('.loading').style.display = 'none';
            }, 500);
        }, 1500);

        // Particles.js initialization (if available)
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
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
        
            // Close mobile menu when clicking a link
            const mobileLinks = document.querySelectorAll('.mobile-nav a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        // FAQ accordion functionality
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Early Access Modal functionality
        const modalTriggers = document.querySelectorAll('[id$="-join-cta"]'); // Selects all elements with IDs ending with "-join-cta"
        const modal = document.getElementById('signup-modal');
        const closeButton = document.querySelector('.close-button');
        
        if (modal && closeButton) {
            // Open modal when any CTA button is clicked
            modalTriggers.forEach(trigger => {
                trigger.addEventListener('click', function(e) {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                });
            });
            
            // Close modal with close button
            closeButton.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            });
            
            // Close modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });

            // Close modal with ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                }
            });
        }

        // Form tabs functionality
        function initFormTabs() {
            const tabs = document.querySelectorAll('.form-tab');
            const tabContents = document.querySelectorAll('.form-tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    this.classList.add('active');
                    
                    // Show corresponding content
                    const targetTab = this.getAttribute('data-form');
                    document.getElementById(targetTab).classList.add('active');
                });
            });
        }

        // Floating CTA Button functionality
        function initFloatingCta() {
            const floatingCta = document.querySelector('.floating-cta-button');
            
            if (floatingCta) {
                floatingCta.addEventListener('click', function() {
                    const modal = document.getElementById('signup-modal');
                    if (modal) {
                        modal.classList.add('active');
                        document.body.classList.add('modal-open');
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

        // Early Access form submissions
        const earlyAccessForm = document.getElementById('early-access-form');
        if (earlyAccessForm) {
            earlyAccessForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get email value
                const emailInput = this.querySelector('input[type="email"]');
                const walletInput = this.querySelector('.wallet-input input');
                
                if (emailInput && emailInput.value) {
                    // Pre-fill the modal form with the email if it exists
                    const modalEmailInput = document.getElementById('email');
                    if (modalEmailInput) {
                        modalEmailInput.value = emailInput.value;
                    }
                    
                    // Pre-fill wallet address if provided
                    if (walletInput && walletInput.value && document.getElementById('wallet')) {
                        document.getElementById('wallet').value = walletInput.value;
                    }
                    
                    // Open the modal
                    if (modal) {
                        modal.classList.add('active');
                        document.body.classList.add('modal-open');
                    }
                }
            });
        }

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
                    }
                }
            });
        }

        // Modal Application Form Submission
        const applicationForm = document.getElementById('early-access-application');
        if (applicationForm) {
            applicationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data (in a real scenario, this would be sent to a backend)
                const formData = new FormData(this);
                
                // Show submission animation
                const submitButton = this.querySelector('.form-button');
                submitButton.innerText = 'Submitting...';
                submitButton.disabled = true;
                
                // Simulate form submission (would be an actual API call in production)
                setTimeout(function() {
                    // Hide modal
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.classList.remove('modal-open');
                    }
                    
                    // Show success message
                    showNotification('Application submitted successfully! We will review your application and contact you soon.', 'success');
                    
                    // Reset form and button
                    applicationForm.reset();
                    submitButton.innerText = 'Submit Application';
                    submitButton.disabled = false;
                    
                    // Show the spot counter decreasing by 1
                    const spotsElement = document.getElementById('spots-remaining');
                    if (spotsElement) {
                        let spots = parseInt(spotsElement.innerText);
                        spots--;
                        spotsElement.innerText = spots;
                        
                        // Update progress bar
                        const progressBar = document.querySelector('.counter-progress-bar');
                        if (progressBar) {
                            const percentage = 100 - (spots / 500 * 100);
                            progressBar.style.width = percentage + '%';
                        }
                    }
                }, 2000);
            });
        }

        // Notification system
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification ' + type;
            notification.innerHTML = `
                <div class="notification-content">
                    <div class="notification-message">${message}</div>
                    <button class="notification-close">&times;</button>
                </div>
            `;
            
            // Add to the DOM
            document.body.appendChild(notification);
            
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
                notification.classList.remove('active');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 5000);
        }

        // Animation on scroll
        function animateOnScroll() {
            const elements = document.querySelectorAll('.feature-card, .benefit-card, .step, .tech-card, .faq-item, .trust-item');
            const windowHeight = window.innerHeight;
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const elementHeight = element.offsetHeight;
                const elementVisible = 50;
                
                if (elementPosition < windowHeight - elementVisible) {
                    element.classList.add('animated');
                    
                    // Add staggered animation for children
                    const children = element.querySelectorAll('.feature-icon, .benefit-icon, h3, p');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animated');
                        }, 150 * index);
                    });
                }
            });
        }
        
        // Run animation check on scroll
        window.addEventListener('scroll', animateOnScroll);
        
        // Initial animation check
        animateOnScroll();

        // Create decorative glow dots
        function createGlowDots() {
            const container = document.querySelector('body');
            const dotCount = 6;
            
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('div');
                dot.classList.add('glow-dot');
                
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
        
        // Initialize glow dots
        createGlowDots();
        
        // Initialize new components
        if (document.querySelector('.form-tabs')) {
            initFormTabs();
        }
        
        if (document.querySelector('.floating-cta')) {
            initFloatingCta();
        }
        
        // Audio initialization and controls
        initAudio();
        
        // Initialize enhanced components
        initEnhancedTestimonials();
        initEnhancedCountdown();
        initTrustIndicators();
    }
    
    // Audio initialization and controls
    function initAudio() {
        const backgroundAudio = document.getElementById('background-audio');
        const audioToggle = document.getElementById('audio-toggle');
        let audioInitialized = false;
        
        // Function to start playing audio with user interaction
        function startAudio() {
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
            const notification = document.createElement('div');
            notification.className = 'audio-notification';
            notification.innerHTML = 'Enable sound for full experience';
            
            // Append near audio button
            document.querySelector('.audio-container').appendChild(notification);
            
            // Fade out after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 1000);
            }, 5000);
        }
        
        // Initialize audio on first user interaction with the page
        document.body.addEventListener('click', function bodyClickHandler() {
            startAudio();
            document.body.removeEventListener('click', bodyClickHandler);
        }, { once: true });
        
        // Also try to play on scroll
        window.addEventListener('scroll', function scrollHandler() {
            startAudio();
            window.removeEventListener('scroll', scrollHandler);
        }, { once: true });
        
        // Setup the audio toggle button
        if (audioToggle && backgroundAudio) {
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
    }
    
    // Enhanced countdown timer with smooth animation and visual effects
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
                element.classList.remove('flip-animation');
            }, 300);
        }
        
        // Add CSS for flip animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flipNumber {
                0% {
                    transform: perspective(400px) rotateX(0);
                    opacity: 1;
                }
                50% {
                    transform: perspective(400px) rotateX(-90deg);
                    opacity: 0.5;
                }
                100% {
                    transform: perspective(400px) rotateX(0);
                    opacity: 1;
                }
            }
            
            .flip-animation {
                animation: flipNumber 0.6s ease-out;
            }
            
            .countdown-value {
                position: relative;
                perspective: 400px;
            }
        `;
        document.head.appendChild(style);
        
        // Initialize values
        updateCountdown();
        
        // Update timer every second
        setInterval(updateCountdown, 1000);
        
        // Add a pulsing glow effect to the timer
        const timerElement = document.querySelector('.early-access-timer');
        if (timerElement) {
            // Create and add a glowing effect element
            const glowEffect = document.createElement('div');
            glowEffect.className = 'timer-glow-effect';
            glowEffect.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, rgba(0, 255, 0, 0.2) 0%, transparent 70%);
                z-index: -1;
                opacity: 0;
                animation: pulse-glow 4s infinite alternate;
            `;
            
            // Add keyframes for the glow animation
            const glowKeyframes = document.createElement('style');
            glowKeyframes.textContent = `
                @keyframes pulse-glow {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 0.3;
                        transform: scale(1.2);
                    }
                }
            `;
            document.head.appendChild(glowKeyframes);
            
            // Add the glow effect to the timer
            timerElement.style.position = 'relative';
            timerElement.style.overflow = 'hidden';
            timerElement.appendChild(glowEffect);
        }
    }

    // Enhanced Trust Indicators with staggered animation
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
                    icon.style.transform = 'rotate(10deg) scale(1.1)';
                    setTimeout(() => {
                        icon.style.transform = 'rotate(0deg) scale(1)';
                    }, 300);
                }
                
                if (number) {
                    // Quick number count-up animation
                    animateNumber(number);
                }
            });
        });
        
        // Add counting animation to numbers
        function animateNumber(element) {
            const finalValue = element.innerText;
            const isPercentage = finalValue.includes('%');
            const isPlus = finalValue.includes('+');
            
            // Skip animation for non-numeric values
            if (isNaN(parseFloat(finalValue))) return;
            
            let target = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
            let suffix = '';
            
            if (isPercentage) suffix = '%';
            if (isPlus) suffix = '+';
            
            // Calculate proper increment based on number size
            const increment = Math.max(1, Math.floor(target / 20));
            let current = 0;
            
            // For very large numbers, start with a higher value
            if (target > 1000) {
                current = Math.floor(target * 0.5);
            }
            
            const interval = setInterval(() => {
                current += increment;
                
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                
                element.innerText = current.toLocaleString() + suffix;
            }, 30);
        }
        
        // Automatically animate numbers when they come into view
        const animateNumbersOnScroll = () => {
            trustItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                const isInView = rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0;
                
                if (isInView && !item.classList.contains('animated')) {
                    item.classList.add('animated');
                    
                    const number = item.querySelector('.trust-number');
                    if (number) {
                        setTimeout(() => {
                            animateNumber(number);
                        }, 300);
                    }
                }
            });
        };
        
        // Run on scroll
        window.addEventListener('scroll', animateNumbersOnScroll);
        
        // Initial check
        animateNumbersOnScroll();
    }

    // Enhanced Testimonial Slider with smooth transitions
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
            dots[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = index;
            
            // Ensure index is within bounds
            if (currentSlide >= slides.length) currentSlide = 0;
            if (currentSlide < 0) currentSlide = slides.length - 1;
            
            // Show new slide
            setTimeout(() => {
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
                isAnimating = false;
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
            }, false);
            
            testimonialContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
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
        showSlide(0);
        startAutoplay();
        
        // Add typographic quote marks
        const quotes = document.querySelectorAll('.testimonial-quote');
        quotes.forEach(quote => {
            if (!quote.getAttribute('data-enhanced')) {
                quote.setAttribute('data-enhanced', 'true');
            }
        });
    }

    // Early Access Counter Spot Simulation
    function initEarlyAccessCounter() {
        const spotsElement = document.getElementById('spots-remaining');
        if (spotsElement) {
            // Simulate spots decreasing randomly
            setInterval(function() {
                // 15% chance of spot reduction every 2-5 minutes
                if (Math.random() < 0.15) {
                    let spots = parseInt(spotsElement.innerText);
                    if (spots > 200) { // Don't go below 200 for marketing strategy
                        spots--;
                        spotsElement.innerText = spots;
                        
                        // Update progress bar
                        const progressBar = document.querySelector('.counter-progress-bar');
                        if (progressBar) {
                            const percentage = 100 - (spots / 500 * 100);
                            progressBar.style.width = percentage + '%';
                        }
                    }
                }
            }, Math.floor(Math.random() * (300000 - 120000 + 1) + 120000)); // Random interval between 2-5 minutes
        }
    }

    // Smooth scrolling for anchor links
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
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Play intro video and setup events
    if (introVideo && introContainer) {
        // Add click event for skip button
        if (skipIntroButton) {
            skipIntroButton.addEventListener('click', function() {
                introVideo.pause();
                endIntro();
            });
        }
        
        // When video ends, show the main content
        introVideo.addEventListener('ended', endIntro);
        
        // Start playing the video
        introVideo.play().catch(error => {
            console.log('Auto-play failed, likely due to browser policy:', error);
            // If autoplay fails, just show a play button or end intro
            endIntro();
        });
    } else {
        // If video elements aren't found, just show the main content
        document.body.classList.add('content-visible');
        startMainContentLoading();
        
        // Initialize all components
        initEarlyAccessCounter();
        initSmoothScrolling();
    }
});