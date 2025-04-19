/**
 * Quantum Counter Component for PROSPERA Early Access
 * Creates an animated counter for the early access spots
 */

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

// CSS Styles for Quantum Counter
const quantumCounterStyles = document.createElement('style');
quantumCounterStyles.textContent = `
    .quantum-counter {
        background: rgba(3, 5, 8, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 2rem auto;
        border: 1px solid rgba(0, 255, 0, 0.2);
        max-width: 400px;
        position: relative;
        overflow: hidden;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    }

    .quantum-counter:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 255, 0, 0.15);
        border-color: rgba(0, 255, 0, 0.3);
    }

    .quantum-counter::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0, 255, 0, 0.05) 0%, transparent 70%);
        z-index: 0;
        pointer-events: none;
    }

    .quantum-counter::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(0, 255, 0, 0.1) 0%, transparent 70%);
        animation: pulse-counter 4s infinite alternate;
        opacity: 0.3;
        pointer-events: none;
    }

    @keyframes pulse-counter {
        0% {
            opacity: 0.2;
            transform: scale(0.9);
        }
        100% {
            opacity: 0.4;
            transform: scale(1.1);
        }
    }

    .counter-label {
        color: var(--text-light);
        font-size: 1rem;
        margin-bottom: 0.5rem;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    .counter-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--primary);
        text-align: center;
        margin-bottom: 1rem;
        position: relative;
        z-index: 1;
    }

    #spots-remaining {
        position: relative;
        color: var(--success);
        font-weight: 700;
        transition: all 0.3s ease;
    }

    #spots-remaining.pulse {
        animation: number-pulse 0.5s ease;
    }

    @keyframes number-pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }

    #spots-remaining::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--gradient-green);
    }

    .counter-progress {
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    .counter-progress-bar {
        height: 100%;
        background: var(--gradient-green);
        border-radius: 8px;
        position: relative;
        transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .counter-progress-bar::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
        );
        animation: progress-shine 2s infinite linear;
    }

    @keyframes progress-shine {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .counter-progress-bar::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 15px;
        height: 100%;
        background: white;
        opacity: 0.3;
        filter: blur(5px);
        animation: pulse-light 1.5s infinite;
    }

    @keyframes pulse-light {
        0%, 100% {
            opacity: 0.1;
        }
        50% {
            opacity: 0.3;
        }
    }

    .glassy-effect {
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .glassy-effect::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 100%
        );
        transform: skewX(-15deg);
        animation: glass-shine 8s infinite;
        z-index: -1;
    }

    @keyframes glass-shine {
        0% { transform: translateX(-100%) skewX(-15deg); }
        30%, 100% { transform: translateX(100%) skewX(-15deg); }
    }
`;
document.head.appendChild(quantumCounterStyles);

// Export as global for access from other scripts
window.QuantumCounter = QuantumCounter;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure container exists
    setTimeout(() => {
        const counterContainer = document.getElementById('quantum-counter-mount');
        if (counterContainer) {
            const quantumCounter = new QuantumCounter();
            quantumCounter.initialize();
            
            // Make it globally accessible
            window.quantumCounter = quantumCounter;
        }
    }, 500);
});