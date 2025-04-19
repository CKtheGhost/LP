// Create this file: js/video-preloader.js
class VideoPreloader {
  constructor(videoElement, containerElement) {
    this.video = videoElement;
    this.container = containerElement;
    this.createPreloader();
    this.setupEventListeners();
  }

  createPreloader() {
    this.preloader = document.createElement('div');
    this.preloader.className = 'video-preloader';
    this.preloader.innerHTML = `
      <div class="preloader-spinner"></div>
      <div class="preloader-text">
        <span class="loading-text">Initializing PROSPERA</span>
        <span class="loading-dots">...</span>
      </div>
    `;
    this.container.appendChild(this.preloader);
    
    // Add animation for dots
    const loadingDots = this.preloader.querySelector('.loading-dots');
    if (loadingDots) {
      this.animateDots(loadingDots);
    }
  }
  
  animateDots(element) {
    let dots = 0;
    setInterval(() => {
      dots = (dots + 1) % 4;
      element.textContent = '.'.repeat(dots);
    }, 300);
  }

  setupEventListeners() {
    // Track loading progress
    let loadingProgress = 0;
    let progressInterval = setInterval(() => {
      loadingProgress += Math.random() * 15;
      if (loadingProgress > 100) loadingProgress = 100;
      
      const spinner = this.preloader.querySelector('.preloader-spinner');
      if (spinner) {
        spinner.style.background = `conic-gradient(var(--primary) ${loadingProgress}%, transparent ${loadingProgress}%)`;
      }
      
      if (loadingProgress >= 100) clearInterval(progressInterval);
    }, 400);

    // Hide preloader when video can play
    this.video.addEventListener('canplay', () => {
      setTimeout(() => {
        this.preloader.classList.add('fade-out');
        setTimeout(() => {
          if (this.preloader.parentNode) {
            this.preloader.parentNode.removeChild(this.preloader);
          }
        }, 500);
      }, 800); // Extra delay for better UX
    });
    
    // Error handling
    this.video.addEventListener('error', () => {
      this.preloader.innerHTML = `
        <div class="preloader-error">
          <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>Video could not be loaded. <button id="skip-to-content">Skip to Content</button></p>
        </div>
      `;
      
      const skipButton = this.preloader.querySelector('#skip-to-content');
      if (skipButton) {
        skipButton.addEventListener('click', () => {
          document.body.classList.add('content-visible');
          this.preloader.classList.add('fade-out');
          setTimeout(() => {
            if (this.preloader.parentNode) {
              this.preloader.parentNode.removeChild(this.preloader);
            }
            if (typeof initializeMainContent === 'function') {
              initializeMainContent();
            }
          }, 500);
        });
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('intro-video');
  const containerElement = document.querySelector('.intro-video-container');
  
  if (videoElement && containerElement) {
    new VideoPreloader(videoElement, containerElement);
  }
});