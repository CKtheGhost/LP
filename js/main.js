// PROSPERA Early Access Landing Page - Main JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Audio initialization and controls
    const backgroundAudio = document.getElementById('background-audio');
    const audioToggle = document.getElementById('audio-toggle');
    let audioInitialized = false;
    
    // Function to start playing audio with user interaction
    function initAudio() {
        if (!audioInitialized) {
            backgroundAudio.volume = 0.3; // Set a comfortable default volume
            backgroundAudio.play().then(() => {
                audioInitialized = true;
                audioToggle.classList.add('active');
                document.body.classList.add('audio-playing');
            }).catch((error) => {
                console.log('Audio playback failed:', error);
                audioToggle.classList.remove('active');
                document.body.classList.remove('audio-playing');
            });
        }
    }
    
    // Initialize audio on first user interaction with the page
    function setupAutoplay() {
        // Try to play audio on initial page click
        document.body.addEventListener('click', function bodyClickHandler() {
            initAudio();
            document.body.removeEventListener('click', bodyClickHandler);
        }, { once: true });
        
        // Also try to play on scroll
        window.addEventListener('scroll', function scrollHandler() {
            initAudio();
            window.removeEventListener('scroll', scrollHandler);
        }, { once: true });
    }
    
    // Setup the audio toggle button
    if (audioToggle && backgroundAudio) {
        audioToggle.addEventListener('click', function() {
            if (backgroundAudio.paused) {
                backgroundAudio.play();
                audioToggle.classList.add('active');
                document.body.classList.add('audio-playing');
            } else {
                backgroundAudio.pause();
                audioToggle.classList.remove('active');
                document.body.classList.remove('audio-playing');
            }
        });
        
        // Setup autoplay after a short delay to not interfere with page load
        setTimeout(setupAutoplay, 1000);
    }

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

    // Countdown timer functionality (if needed)
    function updateCountdown() {
        // Set the target date (adjust as needed)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 14); // 14 days from now
        targetDate.setHours(targetDate.getHours() + 22);
        targetDate.setMinutes(targetDate.getMinutes() + 36);
        targetDate.setSeconds(targetDate.getSeconds() + 42);
        
        const currentDate = new Date();
        const difference = targetDate - currentDate;
        
        if (difference <= 0) {
            // Timer expired
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.innerText = '0';
            if (hoursElement) hoursElement.innerText = '0';
            if (minutesElement) minutesElement.innerText = '0';
            if (secondsElement) secondsElement.innerText = '0';
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (daysElement) daysElement.innerText = days;
        if (hoursElement) hoursElement.innerText = hours;
        if (minutesElement) minutesElement.innerText = minutes;
        if (secondsElement) secondsElement.innerText = seconds;
    }
    
    // Run the countdown function if elements exist
    if (document.getElementById('days') || document.getElementById('hours')) {
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        
        // Initialize countdown
        updateCountdown();
    }

    // Early Access Counter Spot Simulation
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

    // Smooth scrolling for anchor links
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

    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .benefit-card, .step, .tech-card, .faq-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('animated');
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
});