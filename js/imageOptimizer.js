/**
 * Image optimization and lazy loading functionality
 */

// Options for the IntersectionObserver
const observerOptions = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.1 // Trigger when at least 10% of the element is visible
};

// Store references to all observers for cleanup
const observers = new Map();

/**
 * Initialize lazy loading for images
 * @param {string} selector - CSS selector for images to lazy load
 */
function initLazyLoading(selector = '.lazy-image') {
  // Abort if Intersection Observer is not supported
  if (!('IntersectionObserver' in window)) {
    // Fallback to eager loading for all images
    document.querySelectorAll(selector).forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return;
  }

  const observer = new IntersectionObserver(onIntersection, observerOptions);
  
  // Observe all images with the specified selector
  document.querySelectorAll(selector).forEach(img => {
    observer.observe(img);
    observers.set(img, observer);
  });
}

/**
 * Intersection Observer callback
 * @param {IntersectionObserverEntry[]} entries
 */
function onIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      
      // Load the actual image
      if (img.dataset.src) {
        img.src = img.dataset.src;
        
        // Add error handling
        img.onerror = () => {
          console.warn(`Failed to load image: ${img.src}`);
          img.src = 'images/placeholder.jpg'; // Fallback image
          img.classList.add('image-error');
        };
        
        img.onload = () => {
          img.classList.add('loaded');
        };
      }
      
      // Load srcset if available
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.sizes = img.dataset.sizes || '';
      }
      
      // Stop observing this element
      const observer = observers.get(img);
      if (observer) {
        observer.unobserve(img);
        observers.delete(img);
      }
    }
  });
}

/**
 * Apply correct image dimensions for cards
 * @param {HTMLElement} container - Container element with images
 */
function optimizeCardImages(container) {
  const images = container.querySelectorAll('.weapon-card img');
  images.forEach(img => {
    // Set width and height attributes based on CSS
    img.setAttribute('width', '250');
    img.setAttribute('height', '200');
    img.setAttribute('loading', 'lazy');
    
    // Convert to lazy loading format
    if (!img.classList.contains('lazy-image')) {
      const src = img.src;
      img.classList.add('lazy-image');
      
      // Check if WebP version exists
      if (src.match(/\.(jpeg|jpg|png)$/i)) {
        const webpSrc = src.replace(/\.(jpeg|jpg|png)$/i, '.webp');
        img.dataset.src = `<picture>
          <source srcset="${webpSrc}" type="image/webp">
          <source srcset="${src}" type="image/${src.split('.').pop()}">
          <img src="${src}" width="250" height="200">
        </picture>`;
      } else {
        img.dataset.src = src;
      }
      
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 200"%3E%3C/svg%3E';
    }
  });
}

/**
 * Clean up all observers when changing pages or unmounting
 */
function cleanupImageObservers() {
  observers.forEach((observer, element) => {
    observer.unobserve(element);
  });
  observers.clear();
}

/**
 * Apply image optimization for detail view
 * @param {HTMLElement} detailContainer - Detail view container
 */
function optimizeDetailImage(detailContainer) {
  const img = detailContainer.querySelector('img');
  if (img) {
    img.setAttribute('width', '500');
    img.setAttribute('height', '350');
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  }
}

/**
 * Generate responsive images with srcset
 * @param {HTMLImageElement} img - Image element to make responsive
 */
function makeImageResponsive(img) {
  if (!img.dataset.src || img.dataset.responsive) return;
  
  const src = img.dataset.src;
  const ext = src.split('.').pop();
  const basePath = src.substring(0, src.lastIndexOf('.'));
  
  // Create srcset for different sizes
  const srcset = `
    ${basePath}-small.${ext} 400w,
    ${basePath}-medium.${ext} 800w,
    ${src} 1200w
  `;
  
  img.dataset.srcset = srcset;
  img.dataset.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
  img.dataset.responsive = 'true';
}
