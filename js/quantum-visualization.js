/**
 * PROSPERA - Quantum Visualization Effects
 * Creates visual particle effects and animations for the quantum theme
 */

class QuantumVisualization {
  constructor(options = {}) {
    this.options = {
      particleCount: window.innerWidth < 768 ? 50 : 100,
      particleColor: '#00ff00',
      particleOpacity: 0.3,
      lineColor: '#00ff00',
      lineOpacity: 0.1,
      speedFactor: 1,
      effectIntensity: 1,
      ...options
    };
    
    this.initialized = false;
    this.particles = [];
    this.container = null;
    this.animationFrame = null;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.mouse = { x: null, y: null, radius: 100 };
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.animate = this.animate.bind(this);
    
    // Check for reduced motion preference
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Detect low-end devices
    this.isLowEndDevice = this.detectLowEndDevice();
  }
  
  detectLowEndDevice() {
    return (
      (navigator.deviceMemory && navigator.deviceMemory <= 2) || 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    );
  }
  
  initialize(containerSelector = '#quantum-particles') {
    // Don't initialize on low-end devices or if reduced motion is preferred
    if (this.reducedMotion || this.isLowEndDevice) {
      console.log('Quantum effects disabled due to device constraints or user preferences');
      return false;
    }
    
    this.container = document.querySelector(containerSelector);
    
    if (!this.container) {
      console.warn(`Container not found: ${containerSelector}`);
      return false;
    }
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Set initial dimensions
    this.resize();
    
    // Create particles
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.handleResize, { passive: true });
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    
    // Start animation
    this.animate();
    
    // Mark as initialized
    this.initialized = true;
    return true;
  }
  
  createParticles() {
    this.particles = [];
    
    // Adjust particle count based on screen size and device capability
    let particleCount = this.options.particleCount;
    if (window.innerWidth < 768 || this.isLowEndDevice) {
      particleCount = Math.floor(particleCount / 2);
    }
    
    // Create particles with varying properties
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const directionX = (Math.random() * 2 - 1) * this.options.speedFactor;
      const directionY = (Math.random() * 2 - 1) * this.options.speedFactor;
      
      this.particles.push({
        x,
        y,
        size,
        directionX,
        directionY,
        opacity: Math.random() * this.options.particleOpacity,
        color: this.options.particleColor,
        pulsing: Math.random() > 0.5,
        pulseRate: 0.01 + Math.random() * 0.02,
        pulseDirection: 1
      });
    }
  }
  
  resize() {
    // Get container dimensions
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Set canvas dimensions
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Update particles when resizing
    this.createParticles();
  }
  
  handleResize() {
    // Debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      this.resize();
    }, 200);
  }
  
  handleMouseMove(event) {
    // Update mouse position for interactivity
    if (!this.canvas) return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }
  
  connectParticles() {
    // Skip this on low-end devices
    if (this.isLowEndDevice || window.innerWidth < 768) return;
    
    const opacity = this.options.lineOpacity;
    const maxDistance = window.innerWidth < 1200 ? 120 : 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // Create gradient for lines
          const gradientOpacity = 1 - (distance / maxDistance);
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(0, 255, 0, ${gradientOpacity * opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    // Check if canvas still exists (could be removed)
    if (!this.ctx || !this.canvas) {
      cancelAnimationFrame(this.animationFrame);
      return;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.directionX;
      p.y += p.directionY;
      
      // Boundary conditions - wrap around
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          // Repel particles from mouse
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          const moveX = Math.cos(angle) * force * 2;
          const moveY = Math.sin(angle) * force * 2;
          
          p.x += moveX;
          p.y += moveY;
        }
      }
      
      // Pulse effect
      if (p.pulsing) {
        p.opacity += p.pulseRate * p.pulseDirection;
        
        if (p.opacity >= this.options.particleOpacity || p.opacity <= 0.05) {
          p.pulseDirection *= -1;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 255, 0, ${p.opacity})`;
      this.ctx.fill();
    }
    
    // Connect particles
    this.connectParticles();
    
    // Request next frame
    this.animationFrame = requestAnimationFrame(this.animate);
  }
  
  setupAdditionalEffects() {
    this.createDataFlowEffect();
    this.createMatrixEffect();
    this.createAnalysisGrid();
    this.addDataPulseEffect();
  }
  
  createDataFlowEffect(selector = '.data-flow') {
    const dataFlow = document.querySelector(selector);
    if (!dataFlow) return;
    
    // Create data packets that flow across the element
    for (let i = 0; i < 8; i++) {
      const packet = document.createElement('div');
      packet.classList.add('data-packet');
      
      // Random properties
      const size = 3 + Math.random() * 8;
      const speed = 10 + Math.random() * 20;
      const delay = Math.random() * 5;
      const top = Math.random() * 100;
      
      // Set styling
      packet.style.width = `${size}px`;
      packet.style.height = `${size}px`;
      packet.style.top = `${top}%`;
      packet.style.animationDuration = `${speed}s`;
      packet.style.animationDelay = `${delay}s`;
      
      // Add to the DOM
      dataFlow.appendChild(packet);
    }
  }
  
  createMatrixEffect(selector = '.quantum-matrix') {
    const matrix = document.querySelector(selector);
    if (!matrix) return;
    
    // Create matrix columns
    const charSet = '01';
    const columns = Math.floor(matrix.offsetWidth / 20);
    
    for (let i = 0; i < columns; i++) {
      const column = document.createElement('div');
      column.classList.add('matrix-column');
      
      // Random properties
      const chars = 5 + Math.floor(Math.random() * 15);
      const speed = 2 + Math.random() * 5;
      const delay = Math.random() * 2;
      const fontSize = 10 + Math.random() * 4;
      
      // Set positioning
      column.style.left = `${(i / columns) * 100}%`;
      column.style.animationDuration = `${speed}s`;
      column.style.animationDelay = `${delay}s`;
      column.style.fontSize = `${fontSize}px`;
      
      // Generate characters
      for (let j = 0; j < chars; j++) {
        const char = document.createElement('span');
        char.textContent = charSet.charAt(Math.floor(Math.random() * charSet.length));
        char.style.animationDelay = `${Math.random() * 5}s`;
        column.appendChild(char);
      }
      
      matrix.appendChild(column);
    }
  }
  
  createAnalysisGrid(selector = '.ai-analysis-grid') {
    const grid = document.querySelector(selector);
    if (!grid) return;
    
    // Create grid cells
    const cellCount = window.innerWidth < 768 ? 16 : 36;
    const rows = Math.sqrt(cellCount);
    const cols = rows;
    
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      
      // Random properties
      const duration = 1 + Math.random() * 4;
      const delay = Math.random() * 5;
      
      // Set styling
      cell.style.animationDuration = `${duration}s`;
      cell.style.animationDelay = `${delay}s`;
      
      // Add to the DOM
      grid.appendChild(cell);
    }
    
    // Make grid responsive
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  }
  
  addDataPulseEffect(selector = '.data-pulse-effect') {
    const pulseEffect = document.querySelector(selector);
    if (!pulseEffect) return;
    
    // Create pulse waves
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('div');
      wave.classList.add('pulse-wave');
      
      // Staggered timing
      const delay = i * 2;
      
      // Set styling
      wave.style.animationDelay = `${delay}s`;
      
      // Add to the DOM
      pulseEffect.appendChild(wave);
    }
  }
  
  destroy() {
    if (!this.initialized) return;
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    
    // Cancel animation frame
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    // Remove canvas
    if (this.canvas && this.container) {
      this.container.removeChild(this.canvas);
    }
    
    // Reset state
    this.initialized = false;
  }
  
  initializeAllEffects() {
    // Initialize the main particle system
    this.initialize();
    
    // Add additional quantum effects
    this.setupAdditionalEffects();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not prerendering and not on low-end device
  if (document.visibilityState !== 'prerender') {
    const quantumEffects = new QuantumVisualization();
    
    // Delay initialization to prioritize critical content
    setTimeout(() => {
      quantumEffects.initializeAllEffects();
      
      // Make the object globally accessible
      window.quantumEffects = quantumEffects;
    }, 1000);
  }
  
  // Register with component system if available
  if (window.ComponentRegistry) {
    ComponentRegistry.register('quantumVisualization', () => {
      if (document.visibilityState !== 'prerender') {
        const quantumEffects = new QuantumVisualization();
        quantumEffects.initializeAllEffects();
        window.quantumEffects = quantumEffects;
      }
    }, []);
  }
});