import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

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
    // Pre-render all static routes + dynamic blog posts
    includedRoutes: async () => {
      console.log('🔄 Generating routes for SSG...');
      
      // Static routes
      const staticRoutes = ['/', '/blog'];
      
      // Dynamic blog routes from static data
      try {
        const postsPath = './public/static-data/posts.json';
        if (fs.existsSync(postsPath)) {
          const posts = JSON.parse(
            await fs.promises.readFile(postsPath, 'utf-8')
          );
          const blogRoutes = posts.map((post: any) => `/blog/${post.slug}`);
          console.log(`📝 Found ${blogRoutes.length} blog posts for SSG`);
          return [...staticRoutes, ...blogRoutes];
        }
      } catch (error) {
        console.warn('⚠️ Could not load blog posts for SSG:', (error as Error).message);
      }
      
      console.log('📄 Using static routes only');
      return staticRoutes;
    },
    
    // Build-time optimizations
    dirStyle: 'nested', // Creates SEO-friendly URLs like /blog/post-title/
    script: 'async',
    
    // Critical CSS generation for faster loading
    beastiesOptions: {
      preload: 'media',
      logLevel: 'info',
    },
    
    // Custom route filtering
    onRouteRendered(route: string) {
      console.log(`✅ Generated: ${route}`);
    }
  }
}));
