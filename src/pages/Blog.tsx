import { useLoaderData } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { SEOHead } from '@/components/SEOHead';
import { BlogPost } from '@/lib/notion';
import { safeJsonFetch } from '@/lib/safeJsonFetch';
import { Loader2 } from 'lucide-react';

const Blog = () => {
  // Try to get pre-loaded data from SSG loader
  let initialPosts: BlogPost[] = [];

  try {
    const loaderData = useLoaderData() as { posts?: BlogPost[] } | undefined;
    if (loaderData?.posts && loaderData.posts.length > 0) {
      initialPosts = loaderData.posts;
    }
  } catch {
    // No loader data available (direct navigation) - will fetch client-side
  }

  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip if we already have posts from SSG or already fetched
    if (posts.length > 0 || hasFetched.current) {
      setIsLoading(false);
      return;
    }

    // Prevent duplicate fetches
    hasFetched.current = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const staticPosts = await safeJsonFetch('/static-data/posts.json');
        setPosts(staticPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [posts.length]);

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
          {isLoading ? (
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