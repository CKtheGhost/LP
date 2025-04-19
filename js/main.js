/**
 * PROSPERA - Main JavaScript
 * Entry point for the early access landing page
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize the component system
  if (window.ComponentRegistry) {
    // Register all components
    registerComponents();
    
    // Start the application based on state
    initializeApplication();
  } else {
    // Fallback if component system isn't available
    initializeCriticalFeatures();
  }
});

// Register all components with the component system
function registerComponents() {
  // Only register if not already registered
  if (!window.ComponentRegistry) return;

  // Core components
  ComponentRegistry.register('videoIntro', initVideoIntro, []);
  ComponentRegistry.register('headerScroll', initHeaderScrollEffect, []);
  ComponentRegistry.register('mobileMenu', initMobileMenu, []);
  ComponentRegistry.register('faqAccordion', initFAQAccordion, []);
  ComponentRegistry.register('smoothScroll', initSmoothScrolling, []);
  ComponentRegistry.register('animations', initAnimations, []);
  ComponentRegistry.register('backToTop', initBackToTop, []);
  ComponentRegistry.register('formHandler', initFormSubmissions, ['formTabs']);
  ComponentRegistry.register('formTabs', initFormTabs, []);
  ComponentRegistry.register('countdownTimer', initCountdownTimer, []);
  ComponentRegistry.register('cookieConsent', initCookieConsent, []);
  ComponentRegistry.register('socialProof', initSocialProofNotifications, []);
  ComponentRegistry.register('floatingCTA', initFloatingCta, []);
  ComponentRegistry.register('audioPlayer', initAudioPlayer, []);
}

// Initialize the application based on state
function initializeApplication() {
  // Check if video intro is completed or skipped
  const introCompleted = document.body.classList.contains('content-visible');
  
  if (introCompleted) {
    // Initialize the main content when intro is completed
    initializeMainContent();
  } else {
    // Initialize only the video intro component
    ComponentRegistry.initialize('videoIntro');
  }
}

// Initialize critical features as fallback
function initializeCriticalFeatures() {
  // Check if video intro is completed or skipped
  const introCompleted = document.body.classList.contains('content-visible');
  
  if (!introCompleted) {
    initVideoIntro();
  } else {
    initializeMainContent();
  }
  
  // Always initialize these critical components
  initHeaderScrollEffect();
  initMobileMenu();
  initFAQAccordion();
}

// Initialize main content components
function initializeMainContent() {
  // Log initialization
  console.log('Initializing main content...');
  
  // Initialize all components using registry if available
  if (window.ComponentRegistry) {
    ComponentRegistry.initializeAll();
  } else {
    // Manual initialization fallback
    initHeaderScrollEffect();
    initMobileMenu();
    initFAQAccordion();
    initFormTabs();
    initFormSubmissions();
    initCountdownTimer();
    initSmoothScrolling();
    initAnimations();
    initFloatingCta();
    initBackToTop();
    initAudioPlayer();
    initCookieConsent();
    initSocialProofNotifications();
  }
  
  // Announce to screen readers that content is loaded
  const srAnnounce = document.getElementById('sr-announcements');
  if (srAnnounce) {
    srAnnounce.textContent = 'Content loaded successfully. Welcome to PROSPERA early access.';
  }
}

/**
 * Video Introduction Experience
 */
function initVideoIntro() {
  const introVideo = document.getElementById('intro-video');
  const introContainer = document.querySelector('.intro-video-container');
  const skipButton = document.getElementById('skip-intro-button');
  const videoSoundToggle = document.getElementById('video-sound-toggle');
  
  // Exit if video elements don't exist
  if (!introVideo || !introContainer) return;
  
  // Track video state
  let videoStarted = false;
  
  // Handle video ended - transition to main content
  introVideo.addEventListener('ended', function() {
    endIntroSequence();
  });
  
  // Handle skip button click
  if (skipButton) {
    skipButton.addEventListener('click', function() {
      endIntroSequence();
    });
  }
  
  // Handle sound toggle
  if (videoSoundToggle) {
    videoSoundToggle.addEventListener('click', function() {
      if (!videoStarted) return;
      
      if (introVideo.muted) {
        introVideo.muted = false;
        videoSoundToggle.classList.remove('muted');
      } else {
        introVideo.muted = true;
        videoSoundToggle.classList.add('muted');
      }
    });
  }
  
  // Try to autoplay video when loaded
  introVideo.addEventListener('canplay', function() {
    if (!videoStarted) {
      const playPromise = introVideo.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          videoStarted = true;
          introVideo.muted = true; // Ensure muted for autoplay
        }).catch(error => {
          console.log('Autoplay prevented:', error);
          showPlayButton();
        });
      }
    }
  });
  
  // Create play button for manual start
  function showPlayButton() {
    // Remove existing button if any
    const existingButton = introContainer.querySelector('.video-play-button');
    if (existingButton) existingButton.remove();
    
    // Create play button
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button pulse-animation';
    playButton.innerHTML = `
      <svg width="32" height="32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
      </svg>
      <span>Click to Play</span>
    `;
    
    // Add click event
    playButton.addEventListener('click', function() {
      introVideo.play().then(() => {
        videoStarted = true;
        playButton.remove();
      }).catch(err => {
        console.error('Play failed even after user interaction:', err);
        endIntroSequence(); // Critical fallback
      });
    });
    
    introContainer.appendChild(playButton);
  }
  
  // End intro sequence and show main content
  function endIntroSequence() {
    // Fade out video container
    introContainer.classList.add('hidden');
    
    // Show main content
    document.body.classList.add('content-visible');
    
    // Pause video to save resources
    introVideo.pause();
    
    // Complete removal after animation
    setTimeout(() => {
      introContainer.style.display = 'none';
      
      // Initialize main content
      initializeMainContent();
      
      // Force scroll to top
      window.scrollTo(0, 0);
    }, 800);
  }
  
  // Add special handling for iOS
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    showPlayButton();
  }
  
  // Monitor video progress
  const progressBar = document.querySelector('.video-progress-bar');
  if (progressBar && introVideo) {
    introVideo.addEventListener('timeupdate', function() {
      if (introVideo.duration > 0) {
        const progress = (introVideo.currentTime / introVideo.duration) * 100;
        progressBar.style.width = `${progress}%`;
      }
    });
  }
}

/**
 * Header scroll effect
 */
function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;
  
  // Throttle for performance
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Initial check
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  }
}

/**
 * Mobile Menu
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (!hamburger || !mobileNav) return;
  
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

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
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
        this.click();
      }
    });
  });
}

/**
 * Form Tab Switching
 */
function initFormTabs() {
  const emailTabButton = document.getElementById('email-tab-button');
  const walletTabButton = document.getElementById('wallet-tab-button');
  const emailTab = document.getElementById('email-tab');
  const walletTab = document.getElementById('wallet-tab');
  
  if (!emailTabButton || !walletTabButton || !emailTab || !walletTab) return;
  
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

/**
 * Form Submissions
 */
function initFormSubmissions() {
  // Handle via FormValidator if available
  if (window.FormValidator) return;
  
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get submit button
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.textContent = submitButton.getAttribute('data-loading-text') || 'Processing...';
        
        // Simulate submission
        setTimeout(() => {
          // Show success message
          if (window.showNotification) {
            showNotification('Form submitted successfully! We\'ll be in touch soon.', 'success');
          }
          
          // Reset form
          form.reset();
          
          // Reset button
          submitButton.disabled = false;
          submitButton.classList.remove('loading');
          submitButton.textContent = originalText;
          
          // Decrease counter if function exists
          if (typeof decreaseSpotCounter === 'function') {
            decreaseSpotCounter();
          }
          
          // Close modal if in modal
          const modal = form.closest('.modal');
          if (modal && modal.classList.contains('active') && window.ModalManager) {
            setTimeout(() => {
              ModalManager.closeModal(modal);
            }, 1000);
          }
        }, 1500);
      }
    });
  });
}

/**
 * Countdown Timer
 */
function initCountdownTimer() {
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
    
    // Update values
    days.innerText = formattedDays;
    hours.innerText = formattedHours;
    minutes.innerText = formattedMinutes;
    seconds.innerText = formattedSeconds;
    
    // Update accessibility labels
    days.setAttribute('aria-label', `${formattedDays} days remaining`);
    hours.setAttribute('aria-label', `${formattedHours} hours remaining`);
    minutes.setAttribute('aria-label', `${formattedMinutes} minutes remaining`);
    seconds.setAttribute('aria-label', `${formattedSeconds} seconds remaining`);
  }
  
  // Update countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/**
 * Smooth Scrolling
 */
function initSmoothScrolling() {
  const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (!targetElement) return;
      
      e.preventDefault();
      
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      // Check for prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      
      // Update URL hash without jumping
      history.pushState(null, null, targetId);
      
      // Update focus for accessibility
      setTimeout(() => {
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
        
        // Remove tabindex after blur
        targetElement.addEventListener('blur', function onBlur() {
          targetElement.removeAttribute('tabindex');
          targetElement.removeEventListener('blur', onBlur);
        });
      }, prefersReducedMotion ? 0 : 1000);
    });
  });
}

/**
 * Animations on Scroll
 */
function initAnimations() {
  // Skip if ReducedMotion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make all elements visible without animations
    document.querySelectorAll('.quantum-transition, .feature-card, .benefit-card, .step, .faq-item, .trust-item')
      .forEach(el => {
        el.classList.add('animated');
      });
    return;
  }
  
  // Elements to animate on scroll
  const elements = document.querySelectorAll('.quantum-transition, .feature-card, .benefit-card, .step, .faq-item, .trust-item');
  
  if (!elements.length) return;
  
  // Use Intersection Observer if available
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback for older browsers
    elements.forEach(element => {
      element.classList.add('animated');
    });
  }
}

/**
 * Floating CTA
 */
function initFloatingCta() {
  const floatingCta = document.querySelector('.floating-cta');
  if (!floatingCta) return;
  
  // Only show after scrolling down
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Show floating CTA after scrolling past first section
        if (scrollY > windowHeight * 0.5) {
          floatingCta.classList.add('visible');
          
          // Hide when footer is visible
          const footer = document.querySelector('footer');
          if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            if (footerTop < windowHeight) {
              floatingCta.style.opacity = '0';
              floatingCta.style.pointerEvents = 'none';
            } else {
              floatingCta.style.opacity = '1';
              floatingCta.style.pointerEvents = 'all';
            }
          }
        } else {
          floatingCta.classList.remove('visible');
        }
        
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // Open modal on click if ModalManager exists
  const ctaButton = floatingCta.querySelector('.floating-cta-button');
  if (ctaButton) {
    ctaButton.addEventListener('click', function() {
      const modal = document.getElementById('signup-modal');
      
      if (modal && window.ModalManager) {
        ModalManager.openModal(modal);
      } else if (modal) {
        // Fallback if ModalManager doesn't exist
        modal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    });
  }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
  const backToTopButton = document.querySelector('.back-to-top');
  if (!backToTopButton) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (window.scrollY > window.innerHeight) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  backToTopButton.addEventListener('click', function() {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}

/**
 * Audio Player
 */
function initAudioPlayer() {
  const backgroundAudio = document.getElementById('background-audio');
  const audioToggle = document.getElementById('audio-toggle');
  
  if (!backgroundAudio || !audioToggle) return;
  
  let audioInitialized = false;
  
  // Setup the audio toggle button
  audioToggle.addEventListener('click', function() {
    if (backgroundAudio.paused) {
      // Start audio
      backgroundAudio.volume = 0;
      const playPromise = backgroundAudio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Fade in audio
          let volume = 0;
          const fadeIn = setInterval(() => {
            volume += 0.05;
            if (volume >= 0.3) {
              volume = 0.3;
              clearInterval(fadeIn);
            }
            backgroundAudio.volume = volume;
          }, 100);
          
          audioToggle.classList.remove('audio-off');
          audioToggle.classList.add('audio-on');
          audioInitialized = true;
        }).catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
    } else {
      // Fade out and pause
      let volume = backgroundAudio.volume;
      const fadeOut = setInterval(() => {
        volume -= 0.05;
        if (volume <= 0) {
          volume = 0;
          backgroundAudio.pause();
          clearInterval(fadeOut);
        }
        backgroundAudio.volume = volume;
      }, 100);
      
      audioToggle.classList.remove('audio-on');
      audioToggle.classList.add('audio-off');
    }
  });
}

/**
 * Cookie Consent
 */
function initCookieConsent() {
  const cookieConsent = document.getElementById('cookie-consent');
  if (!cookieConsent) return;
  
  // Check if user has already consented
  const hasConsented = localStorage.getItem('cookie-consent');
  
  if (hasConsented) {
    cookieConsent.style.display = 'none';
    return;
  }
  
  // Show the consent banner
  setTimeout(() => {
    cookieConsent.classList.add('active');
  }, 2000);
  
  // Handle accept button
  const acceptButton = cookieConsent.querySelector('.cookie-accept');
  if (acceptButton) {
    acceptButton.addEventListener('click', function() {
      localStorage.setItem('cookie-consent', 'true');
      cookieConsent.classList.remove('active');
    });
  }
  
  // Handle settings button
  const settingsButton = cookieConsent.querySelector('.cookie-settings');
  if (settingsButton) {
    settingsButton.addEventListener('click', function() {
      // Could open a more detailed cookie settings modal here
      console.log('Cookie settings clicked');
    });
  }
}

/**
 * Social Proof Notifications
 */
function initSocialProofNotifications() {
  const container = document.querySelector('.social-proof-container');
  if (!container) return;
  
  // Sample data - in production this would come from an API
  const proofData = [
    { name: 'Alex', location: 'New York', action: 'just signed up for early access' },
    { name: 'Sarah', location: 'London', action: 'joined the waitlist' },
    { name: 'Michael', location: 'Tokyo', action: 'reserved their spot' },
    { name: 'Emma', location: 'Berlin', action: 'secured early access' },
    { name: 'Daniel', location: 'Sydney', action: 'registered for early access' }
  ];
  
  // Show notifications randomly
  function showRandomProof() {
    const randomDelay = 5000 + Math.random() * 15000; // Random delay between 5-20 seconds
    
    setTimeout(() => {
      // Select random data
      const randomIndex = Math.floor(Math.random() * proofData.length);
      const data = proofData[randomIndex];
      
      // Create notification
      const notification = document.createElement('div');
      notification.className = 'social-proof';
      notification.innerHTML = `
        <div class="social-proof-avatar">${data.name.charAt(0)}</div>
        <div class="social-proof-content">
          <strong>${data.name}</strong> from ${data.location}<br>
          ${data.action} ${Math.floor(Math.random() * 10) + 1} minutes ago
        </div>
      `;
      
      // Add to container
      container.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.classList.add('active');
      }, 10);
      
      // Remove after display
      setTimeout(() => {
        notification.classList.remove('active');
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, 5000);
      
      // Schedule next notification
      showRandomProof();
    }, randomDelay);
  }
  
  // Start the first notification after a delay
  setTimeout(showRandomProof, 10000);
}

// Utility function to decrease spot counter
function decreaseSpotCounter() {
  // Use quantumCounter if available
  if (window.quantumCounter && typeof window.quantumCounter.manualDecrease === 'function') {
    window.quantumCounter.manualDecrease();
    return;
  }
  
  // Fallback implementation
  const spotsElement = document.getElementById('spots-remaining');
  if (!spotsElement) return;
  
  const currentSpots = parseInt(spotsElement.textContent);
  if (isNaN(currentSpots) || currentSpots <= 200) return; // Don't go below 200
  
  const newValue = currentSpots - 1;
  
  // Add animation class
  spotsElement.classList.add('pulse');
  spotsElement.textContent = newValue;
  
  // Update progress bar
  const percentage = 100 - (newValue / 500 * 100);
  const progressBar = document.querySelector('.counter-progress-bar');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    
    // Update ARIA values
    const progressContainer = document.querySelector('.counter-progress');
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', newValue);
    }
  }
  
  // Remove animation class after it completes
  setTimeout(() => {
    spotsElement.classList.remove('pulse');
  }, 500);
}

// Make functions available globally
window.initializeMainContent = initializeMainContent;
window.decreaseSpotCounter = decreaseSpotCounter;