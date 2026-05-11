import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { BlogPost } from '@/lib/notion';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block glass rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:ring-glow"
    >
      {post.coverImage && (
        <div className="aspect-video overflow-hidden border-b border-foreground/10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="p-6 md:p-7">
        {/* Meta line — mono date + tags */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
          <span className="text-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50">
            {formattedDate}
          </span>
          {post.tags.length > 0 && (
            <>
              <span className="text-foreground/25">·</span>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-mono text-[10px] px-2 py-0.5 rounded-full bg-foreground/[0.05] border border-foreground/10 text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="font-display text-2xl md:text-[1.7rem] leading-tight text-foreground group-hover:text-foreground transition">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="mt-4 text-foreground/65 text-[0.95rem] leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-foreground/85 group-hover:text-foreground transition">
          Read post
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:rotate-45" />
        </div>
      </div>
    </Link>
  );
};
