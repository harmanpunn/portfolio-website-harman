import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

export const createRoot = ViteReactSSG(
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // App setup that runs on both server and client
    console.log('ViteReactSSG setup:', { isClient, routesCount: routes.length });
  }
);
