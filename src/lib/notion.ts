import { Client } from '@notionhq/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string;
  tags: string[];
  status: string;
  coverImage?: string;
}

class NotionService {
  private apiUrl: string;

  constructor() {
    // Use environment variable if available, otherwise determine based on current URL
    this.apiUrl = import.meta.env.VITE_API_URL || 
                  (window.location.hostname === 'localhost' 
                    ? 'http://localhost:3000/api/notion'
                    : '/api/notion');
  }

  async getPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(this.apiUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      
      const posts = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Return mock data as fallback for development
      if (import.meta.env.DEV) {
        console.warn('Using mock data - Set up your API endpoint to fetch from Notion');
        return this.getMockPosts();
      }
      
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.apiUrl}?slug=${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }
      
      const post = await response.json();
      return post;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      
      // Return mock data as fallback for development
      if (import.meta.env.DEV) {
        const mockPosts = this.getMockPosts();
        return mockPosts.find(post => post.slug === slug) || null;
      }
      
      return null;
    }
  }

  private getMockPosts(): BlogPost[] {
    return [
      {
        id: '1',
        title: 'Getting Started with Machine Learning',
        slug: 'getting-started-with-machine-learning',
        excerpt: 'A comprehensive guide to starting your journey in machine learning with practical examples and real-world applications.',
        content: `# Getting Started with Machine Learning

Machine learning is transforming industries and creating new possibilities every day. In this post, I'll share my journey and insights into getting started with ML.

## What is Machine Learning?

Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.

## Getting Started

1. **Learn the fundamentals** - Start with statistics and linear algebra
2. **Choose a programming language** - Python is highly recommended
3. **Practice with datasets** - Use platforms like Kaggle
4. **Build projects** - Apply your knowledge to real problems

## Resources

- **Books**: "Hands-On Machine Learning" by Aurélien Géron
- **Courses**: Andrew Ng's Machine Learning Course
- **Practice**: Kaggle competitions

Happy learning!`,
        publishedDate: '2024-01-15',
        tags: ['Machine Learning', 'Data Science', 'Python'],
        status: 'Published',
        coverImage: ''
      },
      {
        id: '2',
        title: 'Building MLOps Pipelines',
        slug: 'building-mlops-pipelines',
        excerpt: 'Learn how to build robust MLOps pipelines for production machine learning systems with CI/CD best practices.',
        content: `# Building MLOps Pipelines

MLOps combines machine learning, DevOps, and data engineering to deploy and maintain ML systems in production reliably and efficiently.

## Key Components

### 1. Version Control
- Model versioning
- Data versioning  
- Code versioning

### 2. Automated Testing
- Unit tests for ML code
- Integration tests
- Model validation tests

### 3. Deployment Strategies
- Blue-green deployments
- Canary releases
- A/B testing

## Tools and Technologies

- **ML Platforms**: MLflow, Kubeflow
- **Containerization**: Docker, Kubernetes
- **CI/CD**: GitHub Actions, Jenkins
- **Monitoring**: Prometheus, Grafana

Building robust MLOps pipelines is essential for scaling ML systems in production.`,
        publishedDate: '2024-01-08',
        tags: ['MLOps', 'DevOps', 'Production'],
        status: 'Published',
        coverImage: ''
      }
    ];
  }
}

export const notionService = new NotionService();