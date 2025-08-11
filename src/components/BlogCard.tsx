import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/notion';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Cover image */}
      {post.coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent1/10 text-accent1 rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-serif font-bold mb-3 text-gray-800 dark:text-gray-200 group-hover:text-accent1 transition-colors">
          <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>

        {/* Excerpt */}
        <p className="text-foreground/70 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-sm text-foreground/60">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-accent1 group-hover:gap-2 transition-all">
            <span>Read more</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
};