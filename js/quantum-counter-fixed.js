/**
 * PROSPERA - Enhanced Quantum Counter
 * Fixed version with optimized animations and better performance
 */

// QuantumCounter Class - manages the early access spot counter
class QuantumCounter {
  constructor(options = {}) {
    this.options = {
      container: '#quantum-counter-mount',
      totalSpots: 500,
      remainingSpots: 347,
      decrementInterval: [30000, 120000], // Min and max time between decrements in ms
      minSpots: 200, // Never go below this number for marketing reasons
      ...options
    };
    
    this.container = document.querySelector(this.options.container);
    this.initialized = false;
    this.simulationInterval = null;
    
    // Bind methods
    this.decreaseCounter = this.decreaseCounter.bind(this);
    this.scheduleNextDecrement = this.scheduleNextDecrement.bind(this);
    this.manualDecrease = this.manualDecrease.bind(this);
  }
  
  initialize() {
    if (!this.container) {
      console.warn(`Container not found: ${this.options.container}`);
      return false;
    }
    
    this.render();
    this.setupEventListeners();
    this.scheduleNextDecrement();
    
    this.initialized = true;
    
    // Register as global for external access
    window.quantumCounter = this;
    
    // Register decrease function globally
    window.decreaseSpotCounter = this.manualDecrease;
    
    return true;
  }
  
  render() {
    const percentage = 100 - (this.options.remainingSpots / this.options.totalSpots * 100);
    
    this.container.innerHTML = `
      <div class="early-access-counter quantum-counter" data-quantum-effect="count">
        <div class="counter-label">Limited Spots Remaining:</div>
        <div class="counter-value"><span id="spots-remaining">${this.options.remainingSpots}</span> / ${this.options.totalSpots}</div>
        <div class="counter-progress" aria-valuemin="0" aria-valuemax="${this.options.totalSpots}" 
             aria-valuenow="${this.options.remainingSpots}" role="progressbar">
          <div class="counter-progress-bar" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
    
    // Add quantum styling
    const counter = this.container.querySelector('.quantum-counter');
    counter.classList.add('glassy-effect');
    
    // Add data attribute for quantum effects
    counter.setAttribute('data-quantum-glow', 'true');
  }
  
  setupEventListeners() {
    // Add hover effect to counter value
    const counterValue = this.container.querySelector('.counter-value');
    if (counterValue) {
      counterValue.addEventListener('mouseenter', () => {
        const spotsElement = document.getElementById('spots-remaining');
        if (spotsElement) {
          spotsElement.classList.add('pulse');
          
          setTimeout(() => {
            spotsElement.classList.remove('pulse');
          }, 500);
        }
      });
    }
    
    // Create observer to start/pause simulation when in/out of view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startSimulation();
          } else {
            this.pauseSimulation();
          }
        });
      }, {
        threshold: 0.1
      });
      
      observer.observe(this.container);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.startSimulation();
    }
  }
  
  startSimulation() {
    if (!this.simulationInterval) {
      this.scheduleNextDecrement();
    }
  }
  
  pauseSimulation() {
    if (this.simulationInterval) {
      clearTimeout(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
  
  decreaseCounter() {
    const spotsElement = document.getElementById('spots-remaining');
    if (!spotsElement) return;
    
    const currentSpots = parseInt(spotsElement.textContent);
    if (isNaN(currentSpots) || currentSpots <= this.options.minSpots) {
      return;
    }
    
    // Decrease by 1
    const newValue = currentSpots - 1;
    
    // Set the value with animation
    spotsElement.classList.add('pulse');
    spotsElement.textContent = newValue;
    
    // Update progress bar
    const percentage = 100 - (newValue / this.options.totalSpots * 100);
    const progressBar = this.container.querySelector('.counter-progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      
      // Update ARIA values
      const progressContainer = this.container.querySelector('.counter-progress');
      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', newValue);
      }
    }
    
    // Remove animation class after it completes
    setTimeout(() => {
      spotsElement.classList.remove('pulse');
    }, 500);
    
    // Schedule next decrement
    this.scheduleNextDecrement();
  }
  
  scheduleNextDecrement() {
    const [min, max] = this.options.decrementInterval;
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    
    this.simulationInterval = setTimeout(() => {
      this.decreaseCounter();
    }, delay);
  }
  
  // Public method to manually decrease the counter (e.g., when someone signs up)
  manualDecrease() {
    if (this.simulationInterval) {
      clearTimeout(this.simulationInterval);
      this.simulationInterval = null;
    }
    
    this.decreaseCounter();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit to ensure container exists
  setTimeout(() => {
    const counterContainer = document.getElementById('quantum-counter-mount');
    if (counterContainer) {
      const quantumCounter = new QuantumCounter();
      if (quantumCounter.initialize()) {
        console.log('Quantum Counter initialized successfully');
      }
    }
  }, 500);
  
  // Register with component system if available
  if (window.ComponentRegistry) {
    ComponentRegistry.register('quantumCounter', () => {
      const counterContainer = document.getElementById('quantum-counter-mount');
      if (counterContainer) {
        const quantumCounter = new QuantumCounter();
        quantumCounter.initialize();
      }
    }, []);
  }
});