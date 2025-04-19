// Create this file: js/form-handler.js
class FormHandler {
  constructor() {
    this.initForms();
    this.setupTabSwitching();
  }

  initForms() {
    // Get all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add validation to all inputs
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        // Skip checkboxes and radio buttons
        if (input.type !== 'checkbox' && input.type !== 'radio') {
          // Create floating labels
          this.createFloatingLabel(input);
        }
        
        // Add validation events
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
      
      // Handle form submission
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  }
  
  createFloatingLabel(input) {
    // Skip if already wrapped
    if (input.parentElement.classList.contains('floating-field')) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'floating-field';
    
    // Get the original placeholder or aria-label
    const labelText = input.placeholder || input.getAttribute('aria-label') || '';
    
    // Create label element
    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', input.id || `field-${Math.random().toString(36).substring(2, 9)}`);
    if (!input.id) input.id = label.getAttribute('for');
    
    // Add active class if input has value
    if (input.value) {
      label.classList.add('active');
    }
    
    // Clear placeholder to avoid conflicts
    input.placeholder = '';
    
    // Replace input in the DOM
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    
    // Add event listeners
    input.addEventListener('focus', () => {
      label.classList.add('active');
    });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        label.classList.remove('active');
      }
    });
  }
  
  validateField(input) {
    // Skip validation for some input types
    if (input.type === 'checkbox' || input.type === 'radio' || input.type === 'button' || 
        input.type === 'submit' || input.type === 'reset' || input.type === 'hidden') {
      return true;
    }
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
      this.showFieldError(input, 'This field is required');
      return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        this.showFieldError(input, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Wallet address validation
    if (input.id === 'wallet' && input.value.trim()) {
      // Basic validation for Ethereum addresses
      const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
      // Allow other simpler address formats too for other chains
      const simpleAddressRegex = /^[a-zA-Z0-9]{30,45}$/;
      
      if (!ethAddressRegex.test(input.value) && !simpleAddressRegex.test(input.value)) {
        this.showFieldError(input, 'Please enter a valid wallet address');
        return false;
      }
    }
    
    // Password validation
    if (input.type === 'password') {
      if (input.value.length < 8) {
        this.showFieldError(input, 'Password must be at least 8 characters');
        return false;
      }
    }
    
    // Mark as valid
    input.classList.remove('invalid');
    input.classList.add('valid');
    
    // Remove any existing error messages
    this.clearFieldError(input);
    
    return true;
  }
  
  showFieldError(input, message) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    
    // Create error message
    let errorElement = input.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      input.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.opacity = '1';
    
    // Add shake animation
    input.classList.add('shake');
    setTimeout(() => {
      input.classList.remove('shake');
    }, 500);
  }
  
  clearFieldError(input) {
    input.classList.remove('invalid');
    
    // Remove error message
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.opacity = '0';
    }
  }
  
  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Validate each field
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    // Validate form
    if (!this.validateForm(form)) {
      // Show general error message
      this.showNotification('Please fix the errors in the form.', 'error');
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
      
      // Simulate API call (replace with actual API call in production)
      setTimeout(() => {
        // Success handling
        this.showNotification('Your application has been submitted successfully! We\'ll be in touch soon.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset floating labels
        form.querySelectorAll('.floating-field label').forEach(label => {
          label.classList.remove('active');
        });
        
        // Reset button state
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.innerHTML = originalText;
        
        // If this is a modal form, close the modal after delay
        const modal = form.closest('.modal');
        if (modal && modal.classList.contains('active')) {
          setTimeout(() => {
            this.closeModal(modal);
          }, 1500);
        }
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submission', {
            'form_id': form.id || 'unknown-form',
            'form_type': form.id.includes('early-access') ? 'early_access' : 'contact'
          });
        }
        
        // Decrease counter to create scarcity
        this.decreaseCounter();
        
      }, 1500);
    }
  }
  
  decreaseCounter() {
    const counterElement = document.getElementById('spots-remaining');
    if (counterElement) {
      let currentValue = parseInt(counterElement.textContent);
      if (!isNaN(currentValue)) {
        // Don't go below 200 for marketing effect
        const newValue = Math.max(200, currentValue - 1);
        
        // Animate the change
        counterElement.classList.add('pulse');
        setTimeout(() => {
          counterElement.textContent = newValue;
          
          // Update progress bar
          const progressBar = document.querySelector('.counter-progress-bar');
          if (progressBar) {
            const percentage = 100 - (newValue / 500 * 100);
            progressBar.style.width = `${percentage}%`;
            
            // Update ARIA values
            const progressContainer = document.querySelector('.counter-progress');
            if (progressContainer) {
              progressContainer.setAttribute('aria-valuenow', newValue);
            }
          }
          
          setTimeout(() => {
            counterElement.classList.remove('pulse');
          }, 500);
        }, 200);
      }
    }
  }
  
  setupTabSwitching() {
    const emailTab = document.getElementById('email-tab');
    const walletTab = document.getElementById('wallet-tab');
    const emailTabButton = document.getElementById('email-tab-button');
    const walletTabButton = document.getElementById('wallet-tab-button');
    
    if (emailTab && walletTab && emailTabButton && walletTabButton) {
      emailTabButton.addEventListener('click', () => {
        emailTab.classList.add('active');
        walletTab.classList.remove('active');
        emailTabButton.classList.add('active');
        walletTabButton.classList.remove('active');
        
        // Accessibility
        emailTabButton.setAttribute('aria-selected', 'true');
        walletTabButton.setAttribute('aria-selected', 'false');
        walletTab.setAttribute('aria-hidden', 'true');
        emailTab.setAttribute('aria-hidden', 'false');
      });
      
      walletTabButton.addEventListener('click', () => {
        walletTab.classList.add('active');
        emailTab.classList.remove('active');
        walletTabButton.classList.add('active');
        emailTabButton.classList.remove('active');
        
        // Accessibility
        walletTabButton.setAttribute('aria-selected', 'true');
        emailTabButton.setAttribute('aria-selected', 'false');
        emailTab.setAttribute('aria-hidden', 'true');
        walletTab.setAttribute('aria-hidden', 'false');
      });
    }
  }
  
  showNotification(message, type = 'info', duration = 5000) {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
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
    
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close" aria-label="Close notification">&times;</button>
      </div>
      <div class="notification-progress"></div>
    `;
    
    // Add to the DOM
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
      notification.classList.remove('active');
      notification.classList.add('closing');
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
    
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
  }
  
  closeModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.formHandler = new FormHandler();
});