/**
 * PROSPERA - Component Loader
 * Manages initialization of UI components based on page state
 */

// Component Registry - stores all registered components
const ComponentRegistry = {
  components: {},
  
  // Register a component with its initialization function
  register: function(name, initFunction, dependencies = []) {
    this.components[name] = {
      init: initFunction,
      dependencies: dependencies,
      initialized: false
    };
    return this;
  },
  
  // Initialize a specific component and its dependencies
  initialize: function(name) {
    if (!this.components[name]) {
      console.warn(`Component "${name}" not found in registry`);
      return false;
    }
    
    // Don't initialize twice
    if (this.components[name].initialized) {
      return true;
    }
    
    // Initialize dependencies first
    const dependencies = this.components[name].dependencies;
    if (dependencies.length > 0) {
      for (const dep of dependencies) {
        this.initialize(dep);
      }
    }
    
    // Initialize the component
    try {
      this.components[name].init();
      this.components[name].initialized = true;
      return true;
    } catch (error) {
      console.error(`Error initializing component "${name}":`, error);
      return false;
    }
  },
  
  // Initialize all registered components
  initializeAll: function() {
    for (const name in this.components) {
      this.initialize(name);
    }
  }
};

// DOM Ready Helper
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Initialize Page Content based on state
function initializePageContent() {
  // Check if video intro is completed or skipped
  const introCompleted = document.body.classList.contains('content-visible');
  
  if (introCompleted) {
    // Initialize all UI components when content is visible
    ComponentRegistry.initializeAll();
  } else {
    // Initialize only critical components for the intro experience
    ComponentRegistry.initialize('videoIntro');
  }
}

// Utility: Detect browser features and limitations
const BrowserUtils = {
  // Check if backdrop-filter is supported
  hasBackdropFilter: function() {
    return (
      'backdropFilter' in document.documentElement.style ||
      '-webkit-backdrop-filter' in document.documentElement.style
    );
  },
  
  // Check if device is likely a low-end device
  isLowEndDevice: function() {
    return (
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    );
  },
  
  // Check if user prefers reduced motion
  prefersReducedMotion: function() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Apply appropriate classes to body based on device capabilities
  applyDeviceClasses: function() {
    const body = document.body;
    
    if (!this.hasBackdropFilter()) {
      body.classList.add('no-backdrop-filter');
    }
    
    if (this.isLowEndDevice()) {
      body.classList.add('low-end-device');
    }
    
    if (this.prefersReducedMotion()) {
      body.classList.add('reduced-motion');
    }
  }
};

// Initialize browser detection
BrowserUtils.applyDeviceClasses();

// Run page initialization when DOM is ready
onDOMReady(initializePageContent);

// Export for global access
window.ComponentRegistry = ComponentRegistry;
window.initializePageContent = initializePageContent;