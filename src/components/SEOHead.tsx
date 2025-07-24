import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedDate?: string;
  tags?: string[];
}

export const SEOHead = ({ 
  title = "Harmanpreet Singh | Portfolio",
  description = "Data Scientist & ML Engineer in NYC metro area building intelligent systems. Expertise in machine learning, LLMs, MLOps, and AI applications with Python, PyTorch, and AWS.",
  image = "https://harmanpunn.me/og-image.jpg",
  url = "https://harmanpunn.me",
  type = "website",
  publishedDate,
  tags = []
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('article:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    
    // Update Twitter tags
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Add article-specific tags for blog posts
    if (type === 'article') {
      updateMetaTag('article:author', 'Harmanpreet Singh');
      
      if (publishedDate) {
        updateMetaTag('article:published_time', publishedDate);
      }
      
      // Add tags as article:tag
      tags.forEach(tag => {
        const tagElement = document.createElement('meta');
        tagElement.setAttribute('property', 'article:tag');
        tagElement.setAttribute('content', tag);
        document.head.appendChild(tagElement);
      });
    }
    
    // Add canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', url);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', url);
      document.head.appendChild(canonicalLink);
    }
    
    // Cleanup function to remove article tags when component unmounts
    return () => {
      if (type === 'article') {
        // Remove all article:tag meta tags
        const articleTags = document.querySelectorAll('meta[property="article:tag"]');
        articleTags.forEach(tag => tag.remove());
      }
    };
  }, [title, description, image, url, type, publishedDate, tags]);

  // This component doesn't render anything visible
  return null;
};