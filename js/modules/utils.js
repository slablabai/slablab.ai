/**
 * Utility Functions
 * Common functionality shared across the application
 */

export const Utils = {
  
  /**
   * Throttle function execution
   */
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  },
  
  /**
   * Debounce function execution
   */
  debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },
  
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  /**
   * Smooth scroll to element
   */
  smoothScrollTo(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  },
  
  /**
   * Get element by ID safely
   */
  safeGetElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID "${id}" not found`);
    }
    return element;
  },
  
  /**
   * Get elements by selector safely
   */
  safeQuerySelectorAll(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      console.warn(`No elements found for selector "${selector}"`);
    }
    return elements;
  },
  
  /**
   * Add event listener with error handling
   */
  safeAddEventListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('Cannot add event listener: element is null');
      return;
    }
    
    try {
      element.addEventListener(event, handler, options);
    } catch (error) {
      console.error('Error adding event listener:', error);
    }
  },
  
  /**
   * Check if device is mobile
   */
  isMobile() {
    return window.innerWidth <= 768;
  },
  
  /**
   * Format form data
   */
  formatFormData(formData) {
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    return data;
  }
};