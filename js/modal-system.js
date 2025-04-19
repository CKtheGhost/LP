/**
 * PROSPERA - Enhanced Modal System
 * Manages modals for signup, forms, and notifications
 */

// Modal Manager - handles opening/closing and accessibility
const ModalManager = (function() {
  // Private variables
  let previouslyFocused = null;
  let activeModal = null;
  let scrollbarWidth = 0;
  
  // Calculate scrollbar width to prevent layout shift
  function calculateScrollbarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width:50px;height:50px;overflow:scroll;position:absolute;top:-9999px;';
    document.body.appendChild(scrollDiv);
    
    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarWidth + 'px');
    
    document.body.removeChild(scrollDiv);
  }
  
  // Trap focus inside modal for accessibility
  function trapFocus(e) {
    // Only handle tab key
    if (e.key !== 'Tab') return;
    
    const modal = e.currentTarget;
    const focusableElements = Array.from(modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // If shift+tab on first element, move to last
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } 
    // If tab on last element, move to first
    else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }
  
  // Announce modal to screen readers
  function announceModal(modal) {
    const announcementArea = document.getElementById('sr-announcements');
    
    if (announcementArea) {
      const modalTitle = modal.querySelector('[id$="-title"]');
      let announcement = 'Dialog opened.';
      
      if (modalTitle) {
        announcement = `${modalTitle.textContent} dialog opened.`;
      }
      
      announcementArea.textContent = announcement;
    }
  }
  
  // Public methods
  return {
    init: function() {
      // Calculate scrollbar width
      calculateScrollbarWidth();
      
      // Set up event listeners for all modal triggers
      const modalTriggers = document.querySelectorAll('[id$="-join-cta"], [data-modal-target]');
      modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Get target modal - either from data attribute or default to signup
          const targetId = trigger.getAttribute('data-modal-target') || 'signup-modal';
          const modal = document.getElementById(targetId);
          
          if (modal) {
            this.openModal(modal);
            
            // Analytics tracking
            if (typeof gtag === 'function') {
              gtag('event', 'cta_click', {
                'trigger_id': trigger.id || 'unknown-trigger',
                'modal_id': targetId
              });
            }
          }
        });
      });
      
      // Set up event listeners for all close buttons
      const closeButtons = document.querySelectorAll('.close-button, [data-modal-close]');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal');
          if (modal) {
            this.closeModal(modal);
          }
        });
      });
      
      // Close modal when clicking outside content
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
          // Only close if clicking the backdrop (not the content)
          if (e.target === modal) {
            this.closeModal(modal);
          }
        });
      });
      
      // Close modal with ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
          this.closeModal(activeModal);
        }
      });
      
      // Check URL hash for modal
      this.checkUrlForModal();
    },
    
    openModal: function(modal) {
      // Don't open if already open
      if (modal.classList.contains('active')) {
        return;
      }
      
      // Store the currently focused element to restore later
      previouslyFocused = document.activeElement;
      
      // Store active modal reference
      activeModal = modal;
      
      // Add active class
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      
      // Disable scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Set focus to the first focusable element
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        setTimeout(() => {
          focusableElements[0].focus();
        }, 100);
      }
      
      // Trap focus inside modal
      modal.addEventListener('keydown', trapFocus);
      
      // Announce to screen readers
      announceModal(modal);
      
      // Pre-fill fields if data is available
      this.prefillModalFields(modal);
      
      // Return the modal for chaining
      return modal;
    },
    
    closeModal: function(modal) {
      if (!modal) return;
      
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      modal.setAttribute('aria-hidden', 'true');
      
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      
      // Remove focus trap
      modal.removeEventListener('keydown', trapFocus);
      
      // Restore focus to previous element
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
      
      // Clear active modal reference
      activeModal = null;
    },
    
    prefillModalFields: function(modal) {
      // Check if there's any data in other forms that could be used
      const emailInputs = document.querySelectorAll('input[type="email"]');
      const walletInputs = document.querySelectorAll('input#wallet, input[placeholder*="wallet" i]');
      
      // Find the first filled email field
      let emailValue = '';
      emailInputs.forEach(input => {
        if (input.value && !emailValue) {
          emailValue = input.value;
        }
      });
      
      // Find the first filled wallet field
      let walletValue = '';
      walletInputs.forEach(input => {
        if (input.value && !walletValue) {
          walletValue = input.value;
        }
      });
      
      // Prefill the modal fields if we have values
      if (emailValue) {
        const modalEmailInput = modal.querySelector('input[type="email"]');
        if (modalEmailInput && !modalEmailInput.value) {
          modalEmailInput.value = emailValue;
          // Trigger any floating label effects
          modalEmailInput.dispatchEvent(new Event('input'));
        }
      }
      
      if (walletValue) {
        const modalWalletInput = modal.querySelector('input#wallet');
        if (modalWalletInput && !modalWalletInput.value) {
          modalWalletInput.value = walletValue;
          // Trigger any floating label effects
          modalWalletInput.dispatchEvent(new Event('input'));
        }
      }
    },
    
    checkUrlForModal: function() {
      if (window.location.hash) {
        const modalId = window.location.hash.substring(1);
        const modal = document.getElementById(modalId);
        
        if (modal && modal.classList.contains('modal')) {
          // Small delay to ensure page has loaded
          setTimeout(() => {
            this.openModal(modal);
          }, 500);
        }
      }
    }
  };
})();

// Form Validation Manager
const FormValidator = (function() {
  // Validate a single field
  function validateField(field) {
    // Skip fields that don't need validation
    if (field.type === 'button' || field.type === 'submit' || field.type === 'reset' || field.type === 'hidden') {
      return true;
    }
    
    // Check required fields
    if (field.hasAttribute('required') && !field.value.trim()) {
      showFieldError(field, 'This field is required');
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Wallet address validation (basic)
    if (field.id === 'wallet' && field.value.trim()) {
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      const simpleAddressRegex = /^[a-zA-Z0-9]{30,45}$/;
      
      if (!ethAddressRegex.test(field.value) && !simpleAddressRegex.test(field.value)) {
        showFieldError(field, 'Please enter a valid wallet address');
        return false;
      }
    }
    
    // Mark as valid
    field.classList.remove('invalid');
    field.classList.add('valid');
    
    // Remove error message
    clearFieldError(field);
    
    return true;
  }
  
  // Show field error message
  function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-message';
    errorElement.textContent = message;
    
    // Add error after the field
    field.parentElement.appendChild(errorElement);
    
    // Add shake animation
    field.classList.add('shake');
    setTimeout(() => {
      field.classList.remove('shake');
    }, 500);
    
    // Focus the first invalid field
    if (document.querySelectorAll('.invalid').length === 1) {
      field.focus();
    }
  }
  
  // Clear field error message
  function clearFieldError(field) {
    const errorElement = field.parentElement.querySelector('.validation-message');
    if (errorElement) {
      errorElement.remove();
    }
    field.classList.remove('invalid');
  }
  
  // Public methods
  return {
    init: function() {
      // Add real-time validation for all inputs
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
          validateField(this);
        });
        
        // Clear error on input
        input.addEventListener('input', function() {
          this.classList.remove('invalid');
          
          const errorElement = this.parentElement.querySelector('.validation-message');
          if (errorElement) {
            errorElement.remove();
          }
        });
      });
      
      // Add form submission handlers
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          
          // Validate all fields
          let isValid = true;
          const formInputs = form.querySelectorAll('input, textarea, select');
          
          formInputs.forEach(input => {
            if (!validateField(input)) {
              isValid = false;
            }
          });
          
          if (!isValid) {
            // Show general error notification
            if (window.NotificationManager) {
              NotificationManager.show('Please fix the errors in the form.', 'error');
            }
            return false;
          }
          
          // Show loading state
          const submitButton = form.querySelector('button[type="submit"]');
          if (submitButton) {
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.innerHTML = submitButton.getAttribute('data-loading-text') || 'Processing...';
            
            // Get form data
            const formData = new FormData(form);
            const formObject = {};
            formData.forEach((value, key) => {
              formObject[key] = value;
            });
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
              // Success handling
              if (window.NotificationManager) {
                NotificationManager.show('Your application has been submitted successfully! We\'ll be in touch soon.', 'success');
              }
              
              // Reset form
              form.reset();
              
              // Reset button state
              submitButton.disabled = false;
              submitButton.classList.remove('loading');
              submitButton.innerHTML = originalText;
              
              // If this is a modal form, close the modal after delay
              const modal = form.closest('.modal');
              if (modal && modal.classList.contains('active')) {
                setTimeout(() => {
                  ModalManager.closeModal(modal);
                }, 1500);
              }
              
              // Analytics tracking
              if (typeof gtag === 'function') {
                gtag('event', 'form_submission', {
                  'form_id': form.id || 'unknown-form',
                  'form_type': form.id.includes('early-access') ? 'early_access' : 'contact'
                });
              }
              
              // Decrease counter if it exists
              if (typeof decreaseSpotCounter === 'function') {
                decreaseSpotCounter();
              }
            }, 1500);
          }
        });
      });
      
      // Initialize form tabs if they exist
      this.initFormTabs();
    },
    
    // Handle form tab switching
    initFormTabs: function() {
      const emailTabButton = document.getElementById('email-tab-button');
      const walletTabButton = document.getElementById('wallet-tab-button');
      const emailTab = document.getElementById('email-tab');
      const walletTab = document.getElementById('wallet-tab');
      
      if (!emailTabButton || !walletTabButton || !emailTab || !walletTab) {
        return;
      }
      
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
    },
    
    // Validate an entire form
    validateForm: function(form) {
      let isValid = true;
      const formInputs = form.querySelectorAll('input, textarea, select');
      
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    }
  };
})();

// Notification Manager
const NotificationManager = (function() {
  // Create notification element
  function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.setAttribute('role', 'alert');
    
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
    
    // Create notification content
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
      <div class="notification-progress"></div>
    `;
    
    return notification;
  }
  
  // Public methods
  return {
    init: function() {
      // Create notification container if it doesn't exist
      if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
      }
    },
    
    show: function(message, type = 'info', duration = 5000) {
      // Create notification container if it doesn't exist
      if (!document.querySelector('.notification-container')) {
        this.init();
      }
      
      const container = document.querySelector('.notification-container');
      const notification = createNotification(message, type);
      
      // Add to the DOM
      container.appendChild(notification);
      
      // Add active class after a small delay (for animation)
      setTimeout(() => {
        notification.classList.add('active');
      }, 10);
      
      // Close notification when clicking the close button
      const closeButton = notification.querySelector('.notification-close');
      closeButton.addEventListener('click', () => {
        notification.classList.remove('active');
        notification.classList.add('closing');
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
      
      // Animate progress bar
      const progress = notification.querySelector('.notification-progress');
      if (progress) {
        progress.style.animationDuration = `${duration}ms`;
        progress.classList.add('active');
      }
      
      // Auto-close after duration
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.classList.remove('active');
          notification.classList.add('closing');
          
          setTimeout(() => {
            if (document.body.contains(notification)) {
              notification.parentNode.removeChild(notification);
            }
          }, 300);
        }
      }, duration);
      
      return notification;
    }
  };
})();

// Initialize modal system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  ModalManager.init();
  FormValidator.init();
  NotificationManager.init();
  
  // Register with component system if available
  if (window.ComponentRegistry) {
    ComponentRegistry.register('modalSystem', () => {}, []);
    ComponentRegistry.register('formValidator', () => {}, []);
    ComponentRegistry.register('notificationManager', () => {}, []);
  }
});

// Export for global access
window.ModalManager = ModalManager;
window.FormValidator = FormValidator;
window.NotificationManager = NotificationManager;
window.showNotification = NotificationManager.show.bind(NotificationManager);