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
    // Only update meta tags on client-side navigation (not initial SSG render)
    if (typeof window !== 'undefined' && (window as any).__INITIAL_LOAD_COMPLETE__) {
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
    }
  }, [title, description, image, url, type, publishedDate, tags]);

  // For SSG, we'll rely on the static HTML meta tags
  // This component handles client-side navigation updates
  return null;
};