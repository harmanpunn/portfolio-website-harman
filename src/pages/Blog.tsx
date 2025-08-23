import { useLoaderData } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { SEOHead } from '@/components/SEOHead';
import { BlogPost } from '@/lib/notion';
import { safeJsonFetch } from '@/lib/safeJsonFetch';
import { Loader2 } from 'lucide-react';

const Blog = () => {
  // Try to get pre-loaded data from SSG loader
  let loaderData: { posts?: BlogPost[] } = {};
  let hasLoaderData = false;
  
  try {
    loaderData = (useLoaderData() as { posts?: BlogPost[] }) || {};
    hasLoaderData = !!loaderData.posts && loaderData.posts.length > 0;
    console.log('Blog loader data:', loaderData, 'hasLoaderData:', hasLoaderData);
  } catch (err) {
    // Loader data not available (direct navigation)
    loaderData = {};
    hasLoaderData = false;
    console.log('No blog loader data available');
  }

  const [posts, setPosts] = useState<BlogPost[]>(hasLoaderData ? loaderData.posts || [] : []);
  const [isLoading, setIsLoading] = useState(!hasLoaderData);
  const [error, setError] = useState<Error | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const initializePosts = async () => {
      // Mark as hydrated after component mount
      setIsHydrated(true);
      
      // If we have SSG loader data, use it immediately
      if (hasLoaderData && loaderData.posts) {
        console.log('Using SSG loader data for blog posts');
        setPosts(loaderData.posts);
        setIsLoading(false);
        return;
      }

      // Fallback: Load posts client-side for direct navigation
      setIsLoading(true);
      setError(null);
      
      try {
        // Try static data first
        const staticPosts = await safeJsonFetch('/static-data/posts.json');
        setPosts(staticPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePosts();
  }, [hasLoaderData, loaderData.posts]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title="Blog | Harmanpreet Singh"
        description="Thoughts, learnings, and insights about data science, machine learning, and technology by Harmanpreet Singh"
        url="https://harmanpunn.me/blog"
      />
      <Navbar />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif font-bold mb-6 gradient-text leading-tight pb-2">
              Blog
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Thoughts, learnings, and insights about data science, machine learning, and technology
            </p>
          </div>

          {/* Blog posts grid */}
          {isLoading || !isHydrated ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 mb-4">Error loading blog posts</p>
              <p className="text-foreground/70">{error.message}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground/70">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;