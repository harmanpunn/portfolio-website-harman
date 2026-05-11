import { motion } from 'motion/react';
import { ArrowUpRight, Github, Trophy } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  hackathonPlace?: string;
  size?: 'featured' | 'wide' | 'normal';
};

const projects: Project[] = [
  {
    id: 1,
    title: 'Vygil',
    category: 'Agentic AI',
    description:
      'Autonomous AI agent platform for activity tracking — uses computer vision, LLMs, persistent memory, and adaptive real-time decision-making.',
    tags: ['LLM', 'Agentic AI', 'MCP', 'Computer Vision', 'FastAPI'],
    demoUrl: 'https://vygil-ai-production.up.railway.app/',
    repoUrl: 'https://railway.com/deploy/vygil-ai?referralCode=meIjQ1',
    hackathonPlace: '1st',
    size: 'featured',
  },
  {
    id: 9,
    title: 'Notebrew',
    category: 'Privacy-first AI · Desktop',
    description:
      'Privacy-first AI meeting assistant — local Whisper/Parakeet transcription on-device with no bots joining your calls, dual audio capture, GPU acceleration on Metal/CUDA/Vulkan, and your choice of AI provider for summaries. Tauri desktop app for macOS and Windows. Currently shipping as a SaaS.',
    tags: ['Tauri', 'Rust', 'Next.js', 'Whisper', 'Parakeet', 'Local AI'],
    demoUrl: 'https://www.notebrew.app/',
    repoUrl: 'https://github.com/harmanpunn/noted-app',
    hackathonPlace: '3rd',
    size: 'featured',
  },
  {
    id: 10,
    title: 'AI Interview Platform',
    category: 'Voice AI · B2B',
    description:
      "End-to-end voice-AI recruiting platform. Multi-state voice interview agent over web and phone, with silent mid-call extraction that compresses conversation into structured signal before the closing summary. Hardened with a layered prompt-injection defense for untrusted candidate input. Backed by hybrid semantic search (vector + BM25), LLM rubric scoring with must-have/preference classification and tech-adjacency rules, LinkedIn enrichment, and a full pipeline CRM.",
    tags: [
      'Voice AI',
      'Retell',
      'Prompt Injection Defense',
      'Hybrid Search',
      'Qdrant',
      'FastAPI',
      'Next.js',
      'Firestore',
    ],
    size: 'featured',
  },
  {
    id: 2,
    title: 'InsightWing',
    category: 'LLM · Browser',
    description:
      'Chrome extension using FalconLLM and LangChain for 60-word web content summarization, with an interactive chat layer.',
    tags: ['LangChain', 'Chrome Extension', 'JS'],
    demoUrl: 'https://devpost.com/software/insightwing-ai-page-summarizer-chrome-extension',
    repoUrl: 'https://github.com/harmanpunn/page-summarizer',
  },
  {
    id: 3,
    title: 'Video Recommendation',
    category: 'Microservices',
    description:
      'Containerized, microservice-based recommendation system on FastAPI + Redis + Docker + Kubernetes with autoscaling and caching.',
    tags: ['FastAPI', 'Redis', 'Docker', 'K8s'],
    demoUrl: 'https://github.com/harmanpunn/video-recommendation-system',
    repoUrl: 'https://github.com/harmanpunn/video-recommendation-system',
  },
  {
    id: 4,
    title: 'Document QA',
    category: 'RAG',
    description:
      'Retrieval-augmented document QA on LangChain + HuggingFace + FAISS with efficient chunking and reranking.',
    tags: ['LangChain', 'RAG', 'FAISS'],
  },
  {
    id: 6,
    title: 'StyleGAN',
    category: 'Generative · CV',
    description:
      'StyleGAN from scratch on FFHQ with Few-Shot GDA via Domain Re-modulation (DoRM) for cross-domain adaptation.',
    tags: ['GAN', 'PyTorch', 'CV'],
  },
  {
    id: 7,
    title: 'SNN · ASL',
    category: 'Neuromorphic',
    description:
      'Spiking neural network for sign-language recognition on the ASL Dynamic Vision Sensor dataset — 96.7% test accuracy.',
    tags: ['SNN', 'CV', 'Python'],
  },
  {
    id: 5,
    title: 'Suicide Trends',
    category: 'Data Analysis',
    description:
      'Global socioeconomic patterns in suicide trends — GDP correlation analysis with age/gender breakdowns in R.',
    tags: ['R', 'Stats', 'Viz'],
  },
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const isFeatured = project.size === 'featured';
  const isWide = project.size === 'wide';

  const spanClass = isFeatured || isWide ? 'md:col-span-2' : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
      className={`glass rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:ring-glow flex flex-col relative overflow-hidden ${spanClass}`}
    >
      {project.hackathonPlace && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/30 text-amber-200">
          <Trophy className="h-3 w-3" />
          {project.hackathonPlace} · Hackathon
        </div>
      )}

      <div className="eyebrow">{project.category}</div>

      <h3
        className={`font-display leading-[1.05] text-foreground mt-3 ${
          isFeatured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-[1.75rem]'
        }`}
      >
        {project.title}
        <span className="text-accent1">.</span>
      </h3>

      <p
        className={`mt-4 text-foreground/70 leading-relaxed ${
          isFeatured ? 'text-base md:text-lg max-w-xl' : 'text-[0.92rem]'
        }`}
      >
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-mono text-[11px] px-2.5 py-1 rounded-full bg-foreground/[0.05] border border-foreground/10 text-foreground/75"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {project.demoUrl && project.demoUrl !== '#' && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-sm text-foreground/85 hover:text-foreground transition"
          >
            Live demo
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover/link:rotate-45" />
          </a>
        )}
        {project.repoUrl && project.repoUrl !== '#' && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-1.5 text-sm text-foreground/65 hover:text-foreground transition"
          >
            <Github className="h-3.5 w-3.5" />
            Code
          </a>
        )}
      </div>
    </motion.article>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="section-padding relative">
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              Selected <span className="italic text-foreground/85">work</span>.
            </>
          }
          lede="Hackathons, side ideas, and a few things I built to learn how something actually works."
          align="center"
          className="mb-16"
        />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-fr [grid-auto-flow:dense]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
