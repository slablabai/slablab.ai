/**
 * Main JavaScript Entry Point
 * Consolidated and optimized functionality
 */

// Utility functions (inline for compatibility)
const Utils = {
    safeGetElementById(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID "${id}" not found`);
        }
        return element;
    },
    
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    
    isMobile() {
        return window.innerWidth <= 768;
    }
};

// Optimized Parallax Controller (inline)
class ParallaxController {
    constructor() {
        this.elements = {
            layerBack: document.querySelector('.layer-back'),
            layerMid: document.querySelector('.layer-mid'),
            layerFront: document.querySelector('.layer-front')
        };
        
        this.ticking = false;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.hasParallaxElements()) {
            return;
        }
        
        this.handleScroll = this.handleScroll.bind(this);
        this.updateParallax = this.updateParallax.bind(this);
        
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this.updateParallax();
    }
    
    hasParallaxElements() {
        return this.elements.layerBack || this.elements.layerMid || this.elements.layerFront;
    }
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(this.updateParallax);
            this.ticking = true;
        }
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        
        if (Math.abs(scrolled - this.lastScrollY) < 1) {
            this.ticking = false;
            return;
        }
        
        if (this.elements.layerBack) {
            this.elements.layerBack.style.transform = `translate3d(0, ${scrolled * -0.2}px, 0)`;
        }
        
        if (this.elements.layerMid) {
            this.elements.layerMid.style.transform = `translate3d(0, ${scrolled * -0.5}px, 0)`;
        }
        
        if (this.elements.layerFront) {
            this.elements.layerFront.style.transform = `translate3d(0, ${scrolled * -0.8}px, 0)`;
        }
        
        this.lastScrollY = scrolled;
        this.ticking = false;
    }
    
    destroy() {
        window.removeEventListener('scroll', this.handleScroll);
    }
}


// Theme Controller (inline)
class ThemeController {
    constructor() {
        this.button = document.getElementById('theme-toggle');
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = this.getStoredTheme() || (this.prefersDark ? 'dark' : 'light');
        
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Apply stored theme immediately to prevent flash
        this.applyTheme(this.currentTheme);
        
        // Set up click handler
        this.button.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(this.currentTheme);
            }
        });
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // Storage not available, continue without persistence
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.storeTheme(theme);
    }
    
    toggleTheme() {
        // Add toggling class for animation
        this.button.classList.add('toggling');
        
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Remove toggling class after animation
        setTimeout(() => {
            this.button.classList.remove('toggling');
        }, 600);
    }
    
    destroy() {
        if (this.button) {
            this.button.removeEventListener('click', this.toggleTheme);
        }
    }
}

// Global instances
let parallaxController = null;
let themeController = null;

// FAQ toggle functionality
function toggleFAQ(index) {
    const answer = Utils.safeGetElementById('faq-answer-' + index);
    const icon = Utils.safeGetElementById('faq-icon-' + index);
    const button = document.querySelector(`button[aria-controls="faq-answer-${index}"]`);
    
    if (!answer || !icon || !button) return;
    
    const isOpen = answer.classList.contains('open');
    
    if (isOpen) {
        answer.classList.remove('open');
        icon.classList.remove('open');
        icon.textContent = '+';
        button.setAttribute('aria-expanded', 'false');
    } else {
        // Close all other FAQs
        document.querySelectorAll('.faq-answer').forEach((item, i) => {
            if (i !== index) {
                item.classList.remove('open');
                const otherIcon = Utils.safeGetElementById('faq-icon-' + i);
                const otherButton = document.querySelector(`button[aria-controls="faq-answer-${i}"]`);
                if (otherIcon) {
                    otherIcon.classList.remove('open');
                    otherIcon.textContent = '+';
                }
                if (otherButton) {
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        answer.classList.add('open');
        icon.classList.add('open');
        icon.textContent = '−';
        button.setAttribute('aria-expanded', 'true');
    }
}

// Team bio toggle functionality
function toggleBio(memberName) {
    const preview = Utils.safeGetElementById('bio-preview-' + memberName);
    const full = Utils.safeGetElementById('bio-full-' + memberName);
    const previewButton = preview?.querySelector('.read-more-link');
    const fullButton = full?.querySelector('.read-more-link');
    
    if (!preview || !full) return;
    
    if (preview.classList.contains('hide')) {
        // Show preview, hide full
        preview.classList.remove('hide');
        full.classList.remove('show');
        if (previewButton) previewButton.setAttribute('aria-expanded', 'false');
        if (fullButton) fullButton.setAttribute('aria-expanded', 'true');
    } else {
        // Hide preview, show full
        preview.classList.add('hide');
        full.classList.add('show');
        if (previewButton) previewButton.setAttribute('aria-expanded', 'true');
        if (fullButton) fullButton.setAttribute('aria-expanded', 'false');
    }
}

// Event delegation handler for interactive elements
function handleDocumentClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    
    // Handle FAQ questions
    if (target.classList.contains('faq-question')) {
        const faqIndex = parseInt(target.dataset.faqIndex);
        if (!isNaN(faqIndex)) {
            toggleFAQ(faqIndex);
        }
    }
    
    // Handle bio toggles
    if (target.classList.contains('read-more-link')) {
        const memberId = target.dataset.memberId;
        if (memberId) {
            toggleBio(memberId);
        }
    }
}

// Initialize application
function initApp() {
    // Initialize theme controller first to prevent flash
    themeController = new ThemeController();
    
    
    // Initialize parallax effect
    if (!Utils.prefersReducedMotion() && !Utils.isMobile()) {
        parallaxController = new ParallaxController();
    }
    
    // Set up event delegation for interactive elements
    document.addEventListener('click', handleDocumentClick);
}

// Cleanup function
function cleanup() {
    if (parallaxController) {
        parallaxController.destroy();
        parallaxController = null;
    }
    
    
    if (themeController) {
        themeController.destroy();
        themeController = null;
    }
    
    // Remove event listeners
    document.removeEventListener('click', handleDocumentClick);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

