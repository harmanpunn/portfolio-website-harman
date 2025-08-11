import type { RouteRecord } from 'vite-react-ssg'
import React from 'react'
// Removed HelmetProvider for simpler SSG compatibility
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from './pages/Index'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import fs from 'fs'

// Layout component that wraps all routes
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}

// Helper function to load posts at build time
async function loadStaticPosts() {
  try {
    const postsPath = './public/static-data/posts.json';
    if (fs.existsSync(postsPath)) {
      const posts = JSON.parse(await fs.promises.readFile(postsPath, 'utf-8'));
      console.log(`📚 Loaded ${posts.length} posts for SSG`);
      return posts;
    }
  } catch (error) {
    console.warn('⚠️ Could not load posts for SSG:', (error as Error).message);
  }
  return [];
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: () => <Layout><Index /></Layout>,
    entry: 'src/pages/Index.tsx',
    // Pre-load portfolio data at build time
    loader: async () => {
      console.log('🏠 Loading homepage data for SSG');
      return { 
        portfolioData: 'static-generated',
        timestamp: new Date().toISOString()
      };
    }
  },
  {
    path: '/blog',
    Component: () => <Layout><Blog /></Layout>,
    entry: 'src/pages/Blog.tsx',
    // Pre-load all blog posts at build time
    loader: async () => {
      console.log('📚 Loading blog posts for SSG');
      const posts = await loadStaticPosts();
      return { posts };
    }
  },
  {
    path: '/blog/:slug',
    Component: () => <Layout><BlogPost /></Layout>,
    entry: 'src/pages/BlogPost.tsx',
    
    // Critical: Generate static paths for all blog posts
    getStaticPaths: async () => {
      console.log('🔍 Generating static paths for blog posts...');
      const posts = await loadStaticPosts();
      const blogPaths = posts.map((post: any) => `/blog/${post.slug}`);
      console.log(`📝 Found ${blogPaths.length} blog posts for static generation:`, blogPaths);
      return blogPaths;
    },
    
    // Pre-load individual post content
    loader: async ({ params }) => {
      console.log(`📖 Loading post data for SSG: ${params?.slug}`);
      const posts = await loadStaticPosts();
      const post = posts.find((p: any) => p.slug === params?.slug);
      
      if (!post) {
        console.warn(`⚠️ Post not found: ${params?.slug}`);
        return { post: null };
      }
      
      console.log(`✅ Loaded post: ${post.title}`);
      return { post };
    }
  },
  {
    path: '*',
    Component: () => <Layout><NotFound /></Layout>,
    entry: 'src/pages/NotFound.tsx',
  },
];
