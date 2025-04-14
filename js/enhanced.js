// Enhanced animations and transitions
function enhanceAnimations() {
    // Add intersection observer for step animations
    const steps = document.querySelectorAll('.step');
    const stepsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add delay to children for staggered effect
                const children = entry.target.querySelectorAll('.step-number, h3, p');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 0.15}s`;
                    child.classList.add('animated');
                });
                
                // Unobserve after animation
                stepsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    steps.forEach(step => {
        stepsObserver.observe(step);
    });
    
    // Enhanced parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const opacity = Math.max(0, 1 - scrollY / 500);
            const scale = Math.max(0.95, 1 - scrollY / 5000);
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent) {
                heroContent.style.opacity = opacity;
                heroContent.style.transform = `translateY(${scrollY * 0.2}px) scale(${scale})`;
            }
        });
    }
    
    // Add 3D tilt effect to feature and benefit cards
    const cards = document.querySelectorAll('.feature-card, .benefit-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate rotation based on mouse position relative to card center
            const rotateY = (mouseX - cardCenterX) / 20;
            const rotateX = (cardCenterY - mouseY) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Add highlight effect based on mouse position
            const highlight = card.querySelector('.card-highlight') || document.createElement('div');
            if (!highlight.classList.contains('card-highlight')) {
                highlight.classList.add('card-highlight');
                highlight.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at ${mouseX - cardRect.left}px ${mouseY - cardRect.top}px, rgba(0, 255, 0, 0.15) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                card.appendChild(highlight);
                card.style.position = 'relative';
                card.style.overflow = 'hidden';
            }
            
            highlight.style.opacity = '1';
            highlight.style.background = `radial-gradient(circle at ${mouseX - cardRect.left}px ${mouseY - cardRect.top}px, rgba(0, 255, 0, 0.15) 0%, transparent 50%)`;
        });
        
        // Reset card transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            const highlight = card.querySelector('.card-highlight');
            if (highlight) {
                highlight.style.opacity = '0';
            }
        });
    });
    
    // Add cursor glow effect
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });
    
    // Enhanced buttons with hover state
    const buttons = document.querySelectorAll('.cta-button, .form-button, .form-submit');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const btnRect = button.getBoundingClientRect();
            const x = e.clientX - btnRect.left;
            const y = e.clientY - btnRect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });
}

// Enhanced form validation for better UX
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add floating label animation
            if (input.type !== 'checkbox' && input.type !== 'radio') {
                const wrapper = document.createElement('div');
                wrapper.classList.add('input-wrapper');
                
                const label = document.createElement('label');
                label.textContent = input.placeholder || input.getAttribute('aria-label') || '';
                label.classList.add('floating-label');
                
                // Replace input in the DOM
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                
                // Remove placeholder to avoid conflict with label
                input.placeholder = '';
                
                // Add active class if input has value
                if (input.value) {
                    label.classList.add('active');
                }
                
                // Add event listeners for label animation
                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.classList.remove('active');
                    }
                });
            }
            
            // Add real-time validation with visual feedback
            input.addEventListener('input', () => {
                validateInput(input);
            });
            
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });
        
        // Enhance form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check all inputs for validation
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show submit animation
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    
                    // Simulate form submission (would be replaced with actual API call)
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        
                        // Show success message
                        showNotification('Form submitted successfully!', 'success');
                        
                        // Reset form
                        form.reset();
                        
                        // Reset floating labels
                        const labels = form.querySelectorAll('.floating-label');
                        labels.forEach(label => {
                            label.classList.remove('active');
                        });
                        
                        // If modal form, close modal
                        const modal = document.getElementById('signup-modal');
                        if (modal && modal.classList.contains('active')) {
                            modal.classList.remove('active');
                        }
                    }, 1500);
                }
            }
        });
    });
    
    // Input validation function
    function validateInput(input) {
        if (input.type === 'checkbox' || input.type === 'radio') {
            return true;
        }
        
        if (input.hasAttribute('required') && !input.value) {
            setInputError(input, 'This field is required');
            return false;
        }
        
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                setInputError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        clearInputError(input);
        return true;
    }
    
    // Set input error state
    function setInputError(input, message) {
        input.classList.add('error');
        input.classList.remove('valid');
        
        // Create or update error message
        let errorElement = input.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.classList.add('error-message');
            input.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.opacity = '1';
    }
    
    // Clear input error state
    function clearInputError(input) {
        input.classList.remove('error');
        input.classList.add('valid');
        
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.opacity = '0';
        }
    }
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 5000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on notification type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            break;
        case 'error':
            icon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
            break;
        case 'info':
            icon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
            break;
        case 'warning':
            icon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>';
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Add to the DOM
    const container = document.querySelector('.notification-container') || document.createElement('div');
    if (!container.classList.contains('notification-container')) {
        container.classList.add('notification-container');
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Animate progress bar
    const progress = notification.querySelector('.notification-progress');
    progress.style.animationDuration = `${duration}ms`;
    progress.classList.add('active');
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Close notification when clicking the close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-close after duration
    setTimeout(() => {
        closeNotification(notification);
    }, duration);
    
    function closeNotification(notif) {
        notif.classList.remove('active');
        notif.classList.add('closing');
        
        setTimeout(() => {
            notif.remove();
            
            // Remove container if empty
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }
}

// Call enhanced functions on page load
document.addEventListener('DOMContentLoaded', function() {
    // First check if intro video exists and handle accordingly
    const introVideo = document.getElementById('intro-video');
    const introContainer = document.querySelector('.intro-video-container');
    
    if (introContainer && introVideo) {
        // Video exists, initialize only after it ends or is skipped
        const videoEndHandler = function() {
            document.body.classList.add('content-visible');
            
            // Initialize enhancements
            enhanceAnimations();
            enhanceFormValidation();
            
            // Initialize existing functions
            initializeMainContent();
        };
        
        // Check if video has already ended
        if (introVideo.ended || introContainer.classList.contains('hidden')) {
            videoEndHandler();
        } else {
            // Set up event listeners for video end or skip
            introVideo.addEventListener('ended', videoEndHandler);
            
            const skipButton = document.getElementById('skip-intro-button');
            if (skipButton) {
                skipButton.addEventListener('click', videoEndHandler);
            }
        }
    } else {
        // No intro video, initialize directly
        document.body.classList.add('content-visible');
        
        // Initialize enhancements
        enhanceAnimations();
        enhanceFormValidation();
        
        // Initialize existing functions
        initializeMainContent();
    }
});