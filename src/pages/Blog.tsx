import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BlogCard } from '@/components/BlogCard';
import { SEOHead } from '@/components/SEOHead';
import { Loader2 } from 'lucide-react';
import { BlogPost } from '@/lib/notion';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Try to load from static data first
        const response = await fetch('/static-data/posts.json');
        if (response.ok) {
          const staticPosts = await response.json();
          setPosts(staticPosts);
        } else {
          // Fallback to API if static data not available
          const { notionService } = await import('@/lib/notion');
          const apiPosts = await notionService.getPosts();
          setPosts(apiPosts);
        }
      } catch (err) {
        console.error('Error loading posts:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

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

          {isLoading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-red-500">Failed to load blog posts. Please try again later.</p>
            </div>
          )}

          {posts && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-foreground/70">No blog posts yet. Check back soon!</p>
            </div>
          )}

          {posts && posts.length > 0 && (
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