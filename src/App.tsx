import type { RouteRecord } from 'vite-react-ssg'
import React from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component that wraps all routes
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout><Index /></Layout>,
    entry: 'src/pages/Index.tsx',
  },
  {
    path: '/blog',
    element: <Layout><Blog /></Layout>,
    entry: 'src/pages/Blog.tsx',
  },
  {
    path: '/blog/:slug',
    element: <Layout><BlogPost /></Layout>,
    entry: 'src/pages/BlogPost.tsx',
    // We'll add dynamic path generation here
    getStaticPaths: async () => {
      try {
        // Import the notion client to fetch blog slugs at build time
        const { Client } = await import('@notionhq/client');
        
        const notionToken = process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN;
        const databaseId = process.env.NOTION_DATABASE_ID || process.env.VITE_NOTION_DATABASE_ID;
        
        if (!notionToken || !databaseId) {
          console.warn('Notion credentials not found, using fallback blog paths');
          return ['blog/sample-post', 'blog/getting-started'];
        }

        const notion = new Client({ auth: notionToken });

        const response = await notion.databases.query({
          database_id: databaseId,
          filter: {
            and: [
              {
                property: 'Status',
                select: {
                  equals: 'Published'
                }
              },
              {
                property: 'Public',
                checkbox: {
                  equals: true
                }
              }
            ]
          }
        });

        const blogPaths = response.results
          .filter((page: any) => 'properties' in page)
          .map((page: any) => {
            const title = page.properties.Title?.title[0]?.plain_text || 'untitled';
            const slug = title.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .trim();
            return `blog/${slug}`;
          });

        console.log(`📝 Found ${blogPaths.length} blog posts for static generation`);
        return blogPaths;
      } catch (error) {
        console.warn('Failed to fetch blog paths, using fallback:', (error as Error).message);
        return ['blog/sample-post', 'blog/getting-started'];
      }
    }
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
    entry: 'src/pages/NotFound.tsx',
  },
];
