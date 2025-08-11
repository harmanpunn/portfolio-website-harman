import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notionService } from '@/lib/notion';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => notionService.getPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
                  <div className="flex gap-2">
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
                         prose-pre:bg-gray-900 prose-pre:text-gray-100 dark:prose-pre:bg-gray-800
                         prose-blockquote:border-l-accent1 prose-blockquote:bg-accent1/5 prose-blockquote:pl-6 prose-blockquote:py-3 prose-blockquote:rounded-r
                         prose-ul:space-y-1 prose-ol:space-y-1
                         prose-li:marker:text-accent1
                         prose-strong:text-foreground prose-strong:font-semibold
                         prose-p:leading-relaxed prose-p:mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
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