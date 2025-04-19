/**
 * PROSPERA - Enhanced Particle System
 * Extends the base particle system with advanced visual effects
 */

// EnhancedParticleSystem - extends the base ParticleSystem with advanced effects
const EnhancedParticleSystem = (function() {
  // Check if base system exists
  if (!window.ParticleSystem) {
    console.error('Base ParticleSystem not found. Enhanced system cannot initialize.');
    return { init: () => false, destroy: () => {}, setOptions: () => {} };
  }
  
  // Private variables
  let isInitialized = false;
  let glowEffects = [];
  let backgroundEffects = [];
  let resizeTimeout;
  
  // Configuration for enhanced effects
  const config = {
    enableGlowEffects: true,
    enableBackgroundEffects: true,
    glowIntensity: 1,
    glowColor: '#00ff00',
    backgroundPattern: 'grid', // 'grid', 'dots', 'circuit'
    enhancedInteractivity: true,
    pulseFrequency: 3, // seconds
    hoverEffects: true
  };
  
  // Initialize enhanced particle system
  function init(selector = '#particles-js', options = {}) {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('Reduced motion preference detected, disabling enhanced particle effects');
      // Still initialize base system with reduced options
      return window.ParticleSystem.init(selector, {
        particleCount: 40,
        interactive: false,
        lineOpacity: 0.05
      });
    }
    
    // Check for low-end device
    if ((navigator.deviceMemory && navigator.deviceMemory <= 2) || 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) {
      console.log('Low-end device detected, disabling enhanced particle effects');
      // Still initialize base system with reduced options
      return window.ParticleSystem.init(selector, {
        particleCount: 30,
        interactive: false,
        lineOpacity: 0.05
      });
    }
    
    // Merge options with default config
    Object.assign(config, options);
    
    // Initialize base system
    const initialized = window.ParticleSystem.init(selector, {
      particleCount: 100,
      lineOpacity: 0.15,
      lineThreshold: 180
    });
    
    if (!initialized) return false;
    
    // Add enhanced effects
    if (config.enableGlowEffects) {
      addGlowEffects();
    }
    
    if (config.enableBackgroundEffects) {
      addBackgroundEffects();
    }
    
    // Add enhanced interactivity
    if (config.enhancedInteractivity) {
      addEnhancedInteractivity();
    }
    
    // Add event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    
    isInitialized = true;
    return true;
  }
  
  // Add glow effects to various elements
  function addGlowEffects() {
    // Target elements that should have glow effects
    const glowTargets = document.querySelectorAll(
      '.quantum-counter, .cta-button, [data-quantum-glow="true"]'
    );
    
    glowTargets.forEach(element => {
      // Add glow container if not already present
      if (!element.querySelector('.glow-container')) {
        const glowContainer = document.createElement('div');
        glowContainer.className = 'glow-container';
        
        // Create the glow effect
        const glow = document.createElement('div');
        glow.className = 'element-glow';
        
        // Set the glow color with configurable intensity
        glow.style.boxShadow = `0 0 20px ${config.glowIntensity * 10}px rgba(0, 255, 0, ${config.glowIntensity * 0.3})`;
        
        // Add to the DOM
        glowContainer.appendChild(glow);
        
        // Make sure element has position relative
        if (getComputedStyle(element).position === 'static') {
          element.style.position = 'relative';
        }
        
        element.appendChild(glowContainer);
        
        // Store for potential cleanup
        glowEffects.push({ element, glow });
        
        // Add pulse animation if enabled
        if (config.pulseFrequency > 0) {
          // Random delay for each element
          const delay = Math.random() * config.pulseFrequency;
          glow.style.animation = `pulse-glow ${config.pulseFrequency}s infinite alternate ${delay}s`;
        }
        
        // Add hover effect if enabled
        if (config.hoverEffects) {
          element.addEventListener('mouseenter', () => {
            glow.style.opacity = '0.8';
            glow.style.transform = 'scale(1.1)';
          });
          
          element.addEventListener('mouseleave', () => {
            glow.style.opacity = '0.3';
            glow.style.transform = 'scale(1)';
          });
        }
      }
    });
  }
  
  // Add background pattern effects
  function addBackgroundEffects() {
    const particlesContainer = document.querySelector('#particles-js');
    if (!particlesContainer) return;
    
    // Create a background pattern container
    const patternContainer = document.createElement('div');
    patternContainer.className = 'background-pattern';
    patternContainer.setAttribute('aria-hidden', 'true');
    
    // Set pattern type based on configuration
    patternContainer.dataset.patternType = config.backgroundPattern;
    
    // Add to DOM before the canvas
    particlesContainer.insertBefore(patternContainer, particlesContainer.firstChild);
    
    // Store for potential cleanup
    backgroundEffects.push(patternContainer);
    
    // Generate pattern elements
    generatePatternElements(patternContainer);
  }
  
  // Generate pattern elements based on selected pattern
  function generatePatternElements(container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    switch (container.dataset.patternType) {
      case 'grid':
        // Create grid lines
        for (let i = 0; i < 10; i++) {
          // Horizontal line
          const hLine = document.createElement('div');
          hLine.className = 'grid-line horizontal';
          hLine.style.top = `${i * 10}%`;
          
          // Vertical line
          const vLine = document.createElement('div');
          vLine.className = 'grid-line vertical';
          vLine.style.left = `${i * 10}%`;
          
          container.appendChild(hLine);
          container.appendChild(vLine);
        }
        break;
        
      case 'dots':
        // Create dot pattern
        const dotCount = window.innerWidth < 768 ? 50 : 100;
        for (let i = 0; i < dotCount; i++) {
          const dot = document.createElement('div');
          dot.className = 'pattern-dot';
          dot.style.left = `${Math.random() * 100}%`;
          dot.style.top = `${Math.random() * 100}%`;
          dot.style.opacity = Math.random() * 0.3 + 0.05;
          
          container.appendChild(dot);
        }
        break;
        
      case 'circuit':
        // Create circuit board pattern
        const lineCount = window.innerWidth < 768 ? 15 : 30;
        for (let i = 0; i < lineCount; i++) {
          const circuit = document.createElement('div');
          circuit.className = 'circuit-line';
          
          // Random direction and position
          const horizontal = Math.random() > 0.5;
          if (horizontal) {
            circuit.style.width = `${20 + Math.random() * 60}%`;
            circuit.style.height = '1px';
            circuit.style.top = `${Math.random() * 100}%`;
            circuit.style.left = `${Math.random() * 80}%`;
          } else {
            circuit.style.height = `${20 + Math.random() * 60}%`;
            circuit.style.width = '1px';
            circuit.style.left = `${Math.random() * 100}%`;
            circuit.style.top = `${Math.random() * 80}%`;
          }
          
          // Random opacity
          circuit.style.opacity = Math.random() * 0.2 + 0.05;
          
          container.appendChild(circuit);
          
          // Add circuit nodes
          const nodeCount = Math.floor(Math.random() * 3) + 1;
          for (let j = 0; j < nodeCount; j++) {
            const node = document.createElement('div');
            node.className = 'circuit-node';
            
            // Position along the line
            const position = Math.random() * 100;
            if (horizontal) {
              node.style.left = `${position}%`;
              node.style.top = '50%';
            } else {
              node.style.top = `${position}%`;
              node.style.left = '50%';
            }
            
            circuit.appendChild(node);
          }
        }
        break;
    }
  }
  
  // Add enhanced interactivity
  function addEnhancedInteractivity() {
    // Add click effect
    document.addEventListener('click', createClickEffect, { passive: true });
    
    // Add mouse trail effect
    if (window.innerWidth >= 768) { // Only on desktop
      let throttled = false;
      
      document.addEventListener('mousemove', (e) => {
        if (!throttled) {
          throttled = true;
          setTimeout(() => { throttled = false; }, 50); // Throttle to 20fps
          
          createMouseTrailEffect(e);
        }
      }, { passive: true });
    }
  }
  
  // Create click effect
  function createClickEffect(e) {
    // Don't create effects when clicking form elements or buttons
    if (e.target.closest('input, button, a, select, textarea, label')) return;
    
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Create ripple effect element
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${clickX}px`;
    ripple.style.top = `${clickY}px`;
    
    document.body.appendChild(ripple);
    
    // Remove after animation completes
    setTimeout(() => {
      if (document.body.contains(ripple)) {
        ripple.remove();
      }
    }, 1000);
  }
  
  // Create mouse trail effect
  function createMouseTrailEffect(e) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    
    document.body.appendChild(trail);
    
    // Remove after animation completes
    setTimeout(() => {
      if (document.body.contains(trail)) {
        trail.remove();
      }
    }, 500);
  }
  
  // Handle resize
  function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
      // Recreate background effects on resize
      if (config.enableBackgroundEffects && backgroundEffects.length) {
        backgroundEffects.forEach(container => {
          generatePatternElements(container);
        });
      }
    }, 200);
  }
  
  // Clean up resources
  function destroy() {
    if (!isInitialized) return;
    
    // Destroy base system
    window.ParticleSystem.destroy();
    
    // Remove enhanced elements
    glowEffects.forEach(({ element, glow }) => {
      const container = glow.parentElement;
      if (container && element.contains(container)) {
        element.removeChild(container);
      }
    });
    
    backgroundEffects.forEach(element => {
      if (element.parentElement) {
        element.parentElement.removeChild(element);
      }
    });
    
    // Remove event listeners
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', createClickEffect);
    
    // Reset arrays
    glowEffects = [];
    backgroundEffects = [];
    
    isInitialized = false;
  }
  
  // Update configuration
  function setOptions(options = {}) {
    Object.assign(config, options);
    
    // Update base system
    window.ParticleSystem.setOptions({
      particleCount: window.innerWidth < 768 ? 50 : 100,
      lineOpacity: config.enhancedInteractivity ? 0.15 : 0.1
    });
    
    // Refresh effects
    if (isInitialized) {
      if (config.enableGlowEffects) {
        addGlowEffects();
      }
      
      if (config.enableBackgroundEffects) {
        backgroundEffects.forEach(container => {
          container.dataset.patternType = config.backgroundPattern;
          generatePatternElements(container);
        });
      }
    }
  }
  
  // Add CSS for enhanced effects
  function injectStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Enhanced Particle System Styles */
      .glow-container {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
        border-radius: inherit;
        z-index: -1;
      }
      
      .element-glow {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        opacity: 0.3;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .background-pattern {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      
      /* Grid pattern */
      .grid-line {
        position: absolute;
        background: rgba(0, 255, 0, 0.05);
      }
      
      .grid-line.horizontal {
        width: 100%;
        height: 1px;
      }
      
      .grid-line.vertical {
        height: 100%;
        width: 1px;
      }
      
      /* Dots pattern */
      .pattern-dot {
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(0, 255, 0, 0.3);
        border-radius: 50%;
      }
      
      /* Circuit pattern */
      .circuit-line {
        position: absolute;
        background: rgba(0, 255, 0, 0.1);
      }
      
      .circuit-node {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(0, 255, 0, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      
      /* Click effect */
      .click-ripple {
        position: fixed;
        width: 10px;
        height: 10px;
        background: transparent;
        border-radius: 50%;
        border: 2px solid rgba(0, 255, 0, 0.5);
        transform: translate(-50%, -50%);
        z-index: 9999;
        pointer-events: none;
        animation: ripple-expand 1s forwards cubic-bezier(0, 0.5, 0.5, 1);
      }
      
      @keyframes ripple-expand {
        0% {
          width: 10px;
          height: 10px;
          opacity: 1;
        }
        100% {
          width: 100px;
          height: 100px;
          opacity: 0;
        }
      }
      
      /* Mouse trail */
      .mouse-trail {
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(0, 255, 0, 0.5);
        transform: translate(-50%, -50%);
        z-index: 9998;
        pointer-events: none;
        animation: trail-fade 0.5s forwards ease-out;
      }
      
      @keyframes trail-fade {
        0% {
          opacity: 0.5;
          width: 6px;
          height: 6px;
        }
        100% {
          opacity: 0;
          width: 2px;
          height: 2px;
        }
      }
      
      /* Glow pulse animation */
      @keyframes pulse-glow {
        0% {
          opacity: 0.2;
          transform: scale(0.9);
        }
        100% {
          opacity: 0.4;
          transform: scale(1.05);
        }
      }
      
      /* Media queries for reduced effects on mobile */
      @media (max-width: 768px) {
        .circuit-line, .grid-line, .pattern-dot {
          opacity: 0.05 !important;
        }
      }
      
      /* Handle reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .click-ripple, .mouse-trail, .element-glow {
          display: none !important;
        }
      }
    `;
    
    document.head.appendChild(styleElement);
  }
  
  // Inject styles immediately
  injectStyles();
  
  // Public API
  return {
    init,
    destroy,
    setOptions
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if particles-js element exists and base system exists
  if (document.getElementById('particles-js') && window.ParticleSystem) {
    // Wait a moment for the base system to initialize first
    setTimeout(() => {
      EnhancedParticleSystem.init('#particles-js');
    }, 500);
  }
  
  // Register with component system if available
  if (window.ComponentRegistry) {
    ComponentRegistry.register('enhancedParticleSystem', () => {
      if (document.getElementById('particles-js') && window.ParticleSystem) {
        setTimeout(() => {
          EnhancedParticleSystem.init('#particles-js');
        }, 500);
      }
    }, ['particleSystem']);
  }
});

// Make available globally
window.EnhancedParticleSystem = EnhancedParticleSystem;