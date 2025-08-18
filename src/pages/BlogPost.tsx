import { useLoaderData, Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogPost as BlogPostType } from '@/lib/notion';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ClickableImage } from '@/components/ClickableImage';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Get pre-loaded data from SSG loader first
  let loaderPost: BlogPostType | null = null;
  let hasLoaderData = false;
  
  try {
    const data = useLoaderData() as { post?: BlogPostType | null };
    loaderPost = data?.post || null;
    hasLoaderData = true;
    console.log('SSG loader data available:', !!loaderPost);
  } catch (err) {
    // No loader data available - this is normal for client-side navigation
    hasLoaderData = false;
    console.log('No SSG loader data, will fetch client-side');
  }
  
  // Initialize state with loader data to prevent hydration mismatch
  const [post, setPost] = useState<BlogPostType | null>(loaderPost);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(hasLoaderData && !loaderPost ? new Error('Post not found') : null);

  useEffect(() => {
    // If we already have loader data, we're done
    if (hasLoaderData) {
      if (loaderPost) {
        console.log('Using SSG loader data:', loaderPost.title);
      } else {
        console.log('SSG data indicates post not found');
      }
      return;
    }

    // If no slug, we can't load anything
    if (!slug) {
      setError(new Error('No post slug provided'));
      return;
    }

    // Fallback: Load post data client-side for direct navigation
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try static data first - load all posts and find the specific one
        const response = await fetch(`/static-data/posts.json`);
        if (response.ok) {
          const posts = await response.json();
          const staticPost = posts.find((p: any) => p.slug === slug);
          if (staticPost) {
            setPost(staticPost);
            return;
          }
        }
        
        // Fallback to API if static data not available or post not found
        const { notionService } = await import('@/lib/notion');
        const apiPost = await notionService.getPostBySlug(slug);
        setPost(apiPost);
      } catch (err) {
        console.error('Error loading post:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug, hasLoaderData, loaderPost]);

  // Show loading state when fetching data client-side
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEOHead />
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle post not found or error
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SEOHead 
          title="Post Not Found | Harmanpreet Singh"
          description="The blog post you're looking for doesn't exist."
        />
        <Navbar />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center py-16">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-foreground/70 mb-8">The blog post you're looking for doesn't exist.</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead 
        title={`${post.title} | Harmanpreet Singh`}
        description={post.excerpt}
        type="article"
        url={`https://harmanpunn.me/blog/${post.slug}`}
        publishedDate={post.publishedDate}
        tags={post.tags}
        image={post.coverImage || "https://harmanpunn.me/og-image.jpg"}
      />
      <Navbar />
      
      <main className="pt-20">
        <article className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Back to blog link */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-accent1 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Post header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-800 dark:text-gray-200 leading-tight pb-2">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-foreground/70">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-accent1/10 text-accent1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Post content */}
          <div className="prose prose-lg max-w-none dark:prose-invert 
                         prose-headings:font-serif prose-headings:text-gray-800 dark:prose-headings:text-gray-200
                         prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                         prose-a:text-accent1 prose-a:no-underline hover:prose-a:text-accent2 hover:prose-a:underline
                         prose-code:bg-accent1/10 prose-code:text-accent1 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm
                         prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border-0 prose-pre:rounded-lg prose-pre:p-0 prose-pre:m-0 prose-pre:overflow-hidden
                         prose-pre:shadow-lg prose-pre:ring-1 prose-pre:ring-gray-200 dark:prose-pre:ring-gray-700
                         dark:prose-pre:bg-gray-900 dark:prose-pre:text-gray-100
                         prose-blockquote:border-l-accent1 prose-blockquote:bg-accent1/5 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-3 prose-blockquote:rounded-r
                         prose-ul:space-y-1 prose-ol:space-y-1
                         prose-li:marker:text-gray-600 dark:prose-li:marker:text-gray-400
                         prose-strong:text-foreground prose-strong:font-semibold
                         prose-p:leading-relaxed prose-p:mb-6 prose-p:text-justify">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ src, alt }) => (
                  <ClickableImage
                    src={src || ''}
                    alt={alt || ''}
                    className="rounded-lg"
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Post footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent1 to-accent2 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;