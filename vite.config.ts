import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    // Critical CSS generation
    beastiesOptions: {
      preload: 'media',
      logLevel: 'info',
    },
    // Custom route filtering
    includedRoutes: async (paths: string[], routes: any[]) => {
      // Include all static routes plus dynamic blog posts  
      console.log('🔄 Filtering routes for SSG:', paths);
      return paths;
    },
    // Directory style - nested creates SEO-friendly URLs
    dirStyle: 'nested',
    // Script loading optimization
    script: 'async',
  }
}));
