import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { notionService } from '@/lib/notion';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
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
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 gradient-text leading-tight pb-2">
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
          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:gradient-text prose-a:text-accent1 hover:prose-a:text-accent2 prose-code:bg-accent1/10 prose-code:text-accent1 prose-code:px-1 prose-code:rounded">
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