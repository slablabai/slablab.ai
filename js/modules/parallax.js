/**
 * Optimized Parallax Effect Module
 * Handles smooth parallax scrolling with performance optimizations
 */

class ParallaxController {
  constructor(options = {}) {
    this.options = {
      throttleDelay: 16, // ~60fps
      ...options
    };
    
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
    
    // Use passive listeners for better performance
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    
    // Initial call to set positions
    this.updateParallax();
  }
  
  hasParallaxElements() {
    return this.elements.layerBack || this.elements.layerMid || this.elements.layerFront;
  }
  
  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(this.updateParallax.bind(this));
      this.ticking = true;
    }
  }
  
  updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Only update if scroll position changed significantly
    if (Math.abs(scrolled - this.lastScrollY) < 1) {
      this.ticking = false;
      return;
    }
    
    // Use transform3d for hardware acceleration
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
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }
}

export default ParallaxController;