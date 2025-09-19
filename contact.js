/**
 * Contact Page JavaScript
 * Optimized form handling with shared parallax functionality
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
    },
    
    formatFormData(formData) {
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    },
    
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
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

// Enhanced form validation and handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    // Add form validation
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Basic validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--color-primary-light)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Utils.formatFormData(formData);
    
    // Validate all fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            Utils.smoothScrollTo(firstError, 100);
        }
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Submit to Formspree
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // Show success message
            showSuccessMessage();

            // Reset form
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwnProperty.call(data, 'errors')) {
                    showErrorMessage(data["errors"].map(error => error["message"]).join(", "));
                } else {
                    showErrorMessage("Oops! There was a problem submitting your form");
                }
            });
        }
    }).catch(error => {
        showErrorMessage("Oops! There was a problem submitting your form");
    }).finally(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    
    // Create inner div with safe DOM methods
    const innerDiv = document.createElement('div');
    innerDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-primary);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Create text content safely
    const strongElement = document.createElement('strong');
    strongElement.textContent = 'Thank you!';
    innerDiv.appendChild(strongElement);
    innerDiv.appendChild(document.createTextNode(' We\'ll be in touch within 24 hours.'));
    
    notification.appendChild(innerDiv);
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';

    // Create inner div with safe DOM methods
    const innerDiv = document.createElement('div');
    innerDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-primary);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;

    // Create text content safely
    const strongElement = document.createElement('strong');
    strongElement.textContent = 'Error: ';
    innerDiv.appendChild(strongElement);
    innerDiv.appendChild(document.createTextNode(message));

    notification.appendChild(innerDiv);

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Initialize application
function initApp() {
    // Initialize theme controller first to prevent flash
    themeController = new ThemeController();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize parallax effect
    if (!Utils.prefersReducedMotion() && !Utils.isMobile()) {
        parallaxController = new ParallaxController();
    }
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .error {
        border-color: var(--color-primary-light) !important;
        background-color: rgba(194, 65, 12, 0.1) !important;
    }
`;
document.head.appendChild(style);