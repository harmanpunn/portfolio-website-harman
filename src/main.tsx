import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

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
      // Mark that the initial load is complete for SEO component
      setTimeout(() => {
        (window as any).__INITIAL_LOAD_COMPLETE__ = true;
      }, 100);
      
      // Restore any client-side state if needed
      if (initialState && (window as any).__INITIAL_STATE__) {
        console.log('Restoring initial state...');
      }
    }
  }
);
