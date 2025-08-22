// Fallback for SSG manifest loading issues
(function() {
  'use strict';
  
  // Intercept fetch requests for manifest files
  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      const url = typeof input === 'string' ? input : input.url;
      
      // Check if this is a manifest request with undefined in the name
      if (url && url.includes('static-loader-data-manifest-undefined.json')) {
        console.warn('Intercepted undefined manifest request:', url);
        
        // Try to find the correct manifest file
        const scripts = document.querySelectorAll('script[data-vite-react-ssg-manifest]');
        if (scripts.length > 0) {
          const correctUrl = scripts[0].getAttribute('data-vite-react-ssg-manifest');
          if (correctUrl && !correctUrl.includes('undefined')) {
            console.log('Redirecting to correct manifest:', correctUrl);
            return originalFetch.call(this, correctUrl, init);
          }
        }
        
        // Return empty response to prevent crash
        return Promise.resolve(new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }
      
      return originalFetch.call(this, input, init);
    };
  }
  
  // Handle script loading errors for manifest files
  window.addEventListener('error', function(event) {
    if (event.filename && event.filename.includes('static-loader-data-manifest-undefined')) {
      console.warn('Prevented manifest loading error:', event.filename);
      event.preventDefault();
      return false;
    }
  }, true);
  
})();