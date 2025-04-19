/**
 * PROSPERA - Base Particle System
 * Basic particle animation system for hero and background effects
 */

// ParticleSystem - creates and manages particle animations
const ParticleSystem = (function() {
  // Default settings
  const defaults = {
    selector: '#particles-js',
    particleCount: 80,
    particleColor: '#00ff00',
    particleOpacity: 0.5,
    particleSize: 3,
    linkColor: '#00ff00',
    linkOpacity: 0.2,
    linkDistance: 150,
    moveSpeed: 2,
    responsive: [
      {
        breakpoint: 768,
        options: {
          particleCount: 40
        }
      }
    ]
  };
  
  // State variables
  let canvas = null;
  let ctx = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let animationFrame = null;
  let particles = [];
  let options = {};
  let mousePosition = {
    x: null,
    y: null,
    radius: 100
  };
  
  // Initialize particle system
  function init(customOptions = {}) {
    // Merge custom options with defaults
    options = {...defaults, ...customOptions};
    
    // Check if container exists
    const container = document.querySelector(options.selector);
    if (!container) {
      console.warn(`Particle container ${options.selector} not found`);
      return false;
    }
    
    // Check for low-end devices
    if (isLowEndDevice()) {
      options.particleCount = Math.floor(options.particleCount / 2);
      options.linkDistance = 100;
    }
    
    // Apply responsive options
    applyResponsiveOptions();
    
    // Create canvas element
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    
    // Set canvas size
    resizeCanvas();
    
    // Create particles
    createParticles();
    
    // Add event listeners
    window.addEventListener('resize', debounce(function() {
      applyResponsiveOptions();
      resizeCanvas();
      createParticles();
    }, 200), { passive: true });
    
    window.addEventListener('mousemove', function(e) {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    }, { passive: true });
    
    // Start animation loop
    animate();
    
    // Register for visibility API if available
    if ('hidden' in document) {
      document.addEventListener('visibilitychange', handleVisibilityChange, false);
    }
    
    return true;
  }
  
  // Handle page visibility changes to save resources
  function handleVisibilityChange() {
    if (document.hidden) {
      pauseAnimation();
    } else {
      resumeAnimation();
    }
  }
  
  // Pause animation when page is not visible
  function pauseAnimation() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }
  
  // Resume animation when page becomes visible again
  function resumeAnimation() {
    if (!animationFrame) {
      animate();
    }
  }
  
  // Apply responsive settings based on viewport width
  function applyResponsiveOptions() {
    if (!options.responsive || !options.responsive.length) return;
    
    const viewportWidth = window.innerWidth;
    
    // Start with default options
    let currentOptions = {...defaults};
    delete currentOptions.responsive;
    
    // Apply responsive overrides for matching breakpoints
    options.responsive.forEach(item => {
      if (viewportWidth <= item.breakpoint) {
        currentOptions = {...currentOptions, ...item.options};
      }
    });
    
    // Update current options
    Object.keys(currentOptions).forEach(key => {
      if (key !== 'responsive') {
        options[key] = currentOptions[key];
      }
    });
  }
  
  // Resize canvas to fill container
  function resizeCanvas() {
    if (!canvas) return;
    
    const container = canvas.parentElement;
    canvasWidth = container.offsetWidth;
    canvasHeight = container.offsetHeight;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }
  
  // Create particles with random properties
  function createParticles() {
    particles = [];
    
    for (let i = 0; i < options.particleCount; i++) {
      const size = Math.random() * options.particleSize + 1;
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const directionX = (Math.random() - 0.5) * options.moveSpeed;
      const directionY = (Math.random() - 0.5) * options.moveSpeed;
      const opacity = Math.random() * options.particleOpacity;
      
      particles.push({
        x,
        y,
        size,
        directionX,
        directionY,
        opacity
      });
    }
  }
  
  // Main animation loop
  function animate() {
    if (!canvas || !ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Update position
      p.x += p.directionX;
      p.y += p.directionY;
      
      // Handle boundary conditions (wrap around)
      if (p.x < 0) p.x = canvasWidth;
      if (p.x > canvasWidth) p.x = 0;
      if (p.y < 0) p.y = canvasHeight;
      if (p.y > canvasHeight) p.y = 0;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = options.particleColor.replace('rgb', 'rgba').replace(')', `,${p.opacity})`);
      ctx.fill();
      
      // Connect particles with lines if close enough
      connectParticles(p, i);
    }
    
    // Request next frame
    animationFrame = requestAnimationFrame(animate);
  }
  
  // Connect particles with lines
  function connectParticles(particle, index) {
    // Skip on low-end devices
    if (isLowEndDevice() && Math.random() > 0.3) return;
    
    for (let j = index + 1; j < particles.length; j++) {
      const p2 = particles[j];
      
      // Calculate distance between particles
      const dx = particle.x - p2.x;
      const dy = particle.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Connect with line if within max distance
      if (distance < options.linkDistance) {
        const opacity = (1 - distance / options.linkDistance) * options.linkOpacity;
        
        ctx.beginPath();
        ctx.strokeStyle = options.linkColor.replace('rgb', 'rgba').replace(')', `,${opacity})`);
        ctx.lineWidth = 1;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }
  
  // Utility: Check if device is low-end
  function isLowEndDevice() {
    return (
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    );
  }
  
  // Utility: Debounce function for resize handling
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Public API
  return {
    init,
    pauseAnimation,
    resumeAnimation
  };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if particles container exists
  if (document.querySelector('#particles-js')) {
    // Initialize with default settings
    ParticleSystem.init();
    
    // Register with component system if available
    if (window.ComponentRegistry) {
      ComponentRegistry.register('particleSystem', function() {
        ParticleSystem.init();
      }, []);
    }
  }
});

// Make globally accessible
window.ParticleSystem = ParticleSystem;