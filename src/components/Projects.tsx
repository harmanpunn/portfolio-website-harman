
import { useEffect, useRef, useState } from 'react';
import { 
  ExternalLink, 
  Github, 
  LayoutGrid, 
  List
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "InsightWing: AI-Driven Web Content Summarizer",
    description: "A Chrome extension utilizing FalconLLM and LangChain for efficient 60-word web content summarization with a user-friendly interface and interactive chat feature.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=InsightWing",
    tags: ["LLM", "LangChain", "Chrome Extension", "JavaScript", "HTML/CSS"],
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 2,
    title: "Document Question Answering System",
    description: "A Document QA system using LangChain, HuggingFace Transformers, and FAISS for retrieval-augmented generation with efficient document retrieval.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Document+QA",
    tags: ["LangChain", "RAG", "FAISS", "HuggingFace", "Python"],
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 3,
    title: "Global Socioeconomic Patterns in Suicide Trends",
    description: "Analysis of the impact of GDP on suicide rates globally using R, revealing key economic correlations and age/gender factors through data visualizations.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Suicide+Trends",
    tags: ["R", "Data Analysis", "Visualization", "Statistics", "Social Science"],
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 4,
    title: "StyleGAN Implementation",
    description: "Implementation of StyleGAN from scratch on the FFHQ dataset with Few-Shot GDA via Domain Re-modulation (DoRM) to adapt across diverse datasets.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=StyleGAN",
    tags: ["GAN", "PyTorch", "Deep Learning", "Computer Vision", "Python"],
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 5,
    title: "Spiking Neural Network for Sign Language Recognition",
    description: "A spiking neural network (SNN) for sign language recognition using the ASL-Dynamic Vision Sensor dataset, achieving 96.7% test accuracy.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=SNN+ASL",
    tags: ["Neural Networks", "SNN", "ASL Recognition", "Python", "Computer Vision"],
    demoUrl: "#",
    repoUrl: "#"
  },
  {
    id: 6,
    title: "Alcohol Detection and Accident Prevention Technology",
    description: "Non-invasive technology to determine driver's alcohol level based on BAC standards using logistic regression, SVM algorithms and digital image processing.",
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Alcohol+Detection",
    tags: ["Machine Learning", "SVM", "Image Processing", "Safety Technology", "Python"],
    demoUrl: "#",
    repoUrl: "#"
  }
];

// Define the grid project component outside the main component to avoid recreation on each render
const GridProject = ({ project }: { project: Project }) => (
  <div className="animate-on-scroll card-hover rounded-lg overflow-hidden border border-border bg-background shadow-sm">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={project.image} 
        alt={project.title} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-medium mb-2">{project.title}</h3>
      <p className="text-foreground/70 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="font-normal text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex space-x-3">
        {project.demoUrl && (
          <a 
            href={project.demoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-accent1 hover:text-accent2 transition-colors"
          >
            <span className="mr-1">Live Demo</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {project.repoUrl && (
          <a 
            href={project.repoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-accent1 hover:text-accent2 transition-colors"
          >
            <span className="mr-1">Code</span>
            <Github className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  </div>
);

// Define the list project component outside the main component to avoid recreation on each render
const ListProject = ({ project }: { project: Project }) => (
  <div className="animate-on-scroll card-hover rounded-lg border border-border bg-background shadow-sm p-6">
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <div className="md:w-1/4 h-32 md:h-24 rounded overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:w-3/4">
        <h3 className="text-xl font-medium mb-2">{project.title}</h3>
        <p className="text-foreground/70 text-sm mb-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="font-normal text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex space-x-3">
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-accent1 hover:text-accent2 transition-colors"
            >
              <span className="mr-1">Live Demo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {project.repoUrl && (
            <a 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-accent1 hover:text-accent2 transition-colors"
            >
              <span className="mr-1">Code</span>
              <Github className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-padding">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">My Projects</h2>
          <p className="text-foreground/70">
            A collection of my notable projects, demonstrating my technical skills and creative problem-solving.
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <div className="inline-flex p-1 bg-muted rounded-md">
            <Button
              variant={view === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('grid')}
              className="flex items-center"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              <span>Grid</span>
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
              className="flex items-center"
            >
              <List className="h-4 w-4 mr-1" />
              <span>List</span>
            </Button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <GridProject key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map(project => (
              <ListProject key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
