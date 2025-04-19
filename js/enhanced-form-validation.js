/**
 * PROSPERA - Enhanced Form Validation
 * Advanced form validation with real-time feedback and animations
 */

// FormEnhancer - Adds advanced validation and UX improvements to forms
const FormEnhancer = (function() {
  // Store for validated fields
  let validatedFields = new WeakMap();
  
  // Initialize form enhancement
  function init(formSelector = 'form') {
    const forms = document.querySelectorAll(formSelector);
    
    if (!forms.length) {
      console.warn(`No forms found matching selector "${formSelector}"`);
      return false;
    }
    
    forms.forEach(form => {
      enhanceForm(form);
    });
    
    return true;
  }
  
  // Enhance a single form with validation and UX improvements
  function enhanceForm(form) {
    // Skip if already enhanced
    if (form.dataset.enhanced === 'true') return;
    
    // Mark form as enhanced
    form.dataset.enhanced = 'true';
    
    // Add floating labels to inputs
    const inputs = form.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select');
    inputs.forEach(input => {
      createFloatingLabel(input);
      
      // Add validation events
      input.addEventListener('blur', () => validateField(input), { passive: true });
      input.addEventListener('input', () => clearFieldError(input), { passive: true });
    });
    
    // Add validation to checkboxes and radios
    const checkboxes = form.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => validateField(checkbox), { passive: true });
    });
    
    // Handle form submission with validation
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      let isValid = validateForm(this);
      
      if (!isValid) {
        // Show error notification
        if (window.NotificationManager) {
          NotificationManager.show('Please fix the errors in the form.', 'error');
        }
        return false;
      }
      
      // Form is valid, show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = submitButton.getAttribute('data-loading-text') || 'Processing...';
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        
        // Simulate API call (replace with actual API call in production)
        setTimeout(() => {
          // Success handling
          if (window.NotificationManager) {
            NotificationManager.show('Your application has been submitted successfully! We\'ll be in touch soon.', 'success');
          }
          
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
          if (modal && modal.classList.contains('active') && window.ModalManager) {
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
          
          // Decrease counter to create scarcity
          if (typeof decreaseSpotCounter === 'function') {
            decreaseSpotCounter();
          }
        }, 1500);
      }
    });
    
    // Show form is enhanced with animation
    form.classList.add('form-enhanced');
    setTimeout(() => {
      form.classList.add('form-ready');
    }, 50);
  }
  
  // Create floating label for input fields
  function createFloatingLabel(input) {
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
    }, { passive: true });
    
    input.addEventListener('blur', () => {
      if (!input.value) {
        label.classList.remove('active');
      }
    }, { passive: true });
  }
  
  // Validate a single field
  function validateField(input) {
    // Skip validation for some input types
    if (input.type === 'button' || input.type === 'submit' || input.type === 'reset' || 
        input.type === 'hidden' || input.disabled) {
      return true;
    }
    
    // Required field validation
    if (input.hasAttribute('required') && !getFieldValue(input)) {
      showFieldError(input, 'This field is required');
      return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        showFieldError(input, 'Please enter a valid email address');
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
        showFieldError(input, 'Please enter a valid wallet address');
        return false;
      }
    }
    
    // Password validation
    if (input.type === 'password') {
      if (input.value.length < 8) {
        showFieldError(input, 'Password must be at least 8 characters');
        return false;
      }
    }
    
    // Password confirmation validation
    if (input.id && input.id.includes('confirm-password')) {
      const password = document.getElementById('password');
      if (password && input.value !== password.value) {
        showFieldError(input, 'Passwords do not match');
        return false;
      }
    }
    
    // Custom validation from data-validate attribute
    if (input.dataset.validate) {
      try {
        const validationRule = new Function('value', `return ${input.dataset.validate}`);
        if (!validationRule(input.value)) {
          const errorMessage = input.dataset.validateMessage || 'Invalid input';
          showFieldError(input, errorMessage);
          return false;
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    }
    
    // Field is valid
    markFieldValid(input);
    return true;
  }
  
  // Get field value (handles different input types)
  function getFieldValue(input) {
    if (input.type === 'checkbox') {
      return input.checked;
    } else if (input.type === 'radio') {
      const radioGroup = document.querySelectorAll(`input[name="${input.name}"]`);
      return Array.from(radioGroup).some(radio => radio.checked);
    }
    return input.value.trim();
  }
  
  // Show field error message
  function showFieldError(input, message) {
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
    
    // Set field as invalid in tracking
    validatedFields.set(input, false);
    
    // Update form validity state
    updateFormValidity(input.form);
  }
  
  // Clear field error message
  function clearFieldError(input) {
    input.classList.remove('invalid');
    
    // Remove error message
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.style.opacity = '0';
    }
  }
  
  // Mark field as valid
  function markFieldValid(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    
    // Remove any existing error messages
    clearFieldError(input);
    
    // Set field as valid in tracking
    validatedFields.set(input, true);
    
    // Update form validity state
    updateFormValidity(input.form);
  }
  
  // Update overall form validity state
  function updateFormValidity(form) {
    if (!form) return;
    
    let isValid = true;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
      // Check all required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (validatedFields.has(field) && !validatedFields.get(field)) {
          isValid = false;
        }
      });
      
      // Update submit button state
      if (isValid) {
        submitButton.classList.add('valid');
      } else {
        submitButton.classList.remove('valid');
      }
    }
  }
  
  // Validate entire form
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Public API
  return {
    init,
    enhanceForm,
    validateField,
    validateForm
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize form enhancement
  FormEnhancer.init();
  
  // Register with component system if available
  if (window.ComponentRegistry) {
    ComponentRegistry.register('formEnhancer', function() {
      FormEnhancer.init();
    }, []);
  }
});

// Make globally accessible
window.FormEnhancer = FormEnhancer;