import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

// Prevent SSG manifest loading issues by setting up error handling early
if (typeof window !== 'undefined') {
  // Handle failed manifest loads gracefully
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('static-loader-data-manifest')) {
      console.warn('SSG manifest load failed, continuing with client-side rendering');
      event.preventDefault();
    }
  }, true);
}

export const createRoot = ViteReactSSG(
  { routes },
  ({ routes, isClient, initialState }) => {
    // App setup that runs on both server and client
    console.log('ViteReactSSG setup:', { 
      isClient, 
      routesCount: routes.length,
      initialState: !!initialState 
    });
    
    // Client-side hydration setup
    if (isClient) {
      // Prevent SSG manifest loading issues by ensuring proper timing
      // Wait for DOM to be fully ready before marking initial load complete
      const markInitialLoadComplete = () => {
        (window as any).__INITIAL_LOAD_COMPLETE__ = true;
        console.log('Initial load marked complete');
      };
      
      // Use multiple timing strategies to ensure proper hydration
      if (document.readyState === 'complete') {
        setTimeout(markInitialLoadComplete, 200);
      } else {
        window.addEventListener('load', () => {
          setTimeout(markInitialLoadComplete, 100);
        }, { once: true });
      }
      
      // Also use requestAnimationFrame as fallback
      requestAnimationFrame(() => {
        setTimeout(markInitialLoadComplete, 150);
      });
      
      // Restore any client-side state if needed
      if (initialState && (window as any).__INITIAL_STATE__) {
        console.log('Restoring initial state...');
      }
    }
  }
);
