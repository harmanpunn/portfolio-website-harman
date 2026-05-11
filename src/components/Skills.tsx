import { motion } from 'motion/react';
import SectionHeading from '@/components/SectionHeading';

type Capability = {
  title: string;
  description: string;
};

const capabilities: Capability[] = [
  {
    title: 'Agentic systems',
    description:
      'Designing agents that use tools, hold memory, and act in loops without falling over past the demo.',
  },
  {
    title: 'Retrieval & semantic search',
    description:
      'Embedding pipelines, hybrid search, and the eval loops that keep retrieval honest.',
  },
  {
    title: 'Production ML',
    description:
      "Taking models from notebook to deployed APIs with infra that doesn't rot under traffic.",
  },
];

// Single flat tool cluster — grouped only by line break, no labels.
// Each inner array becomes a visual row; the grouping is implicit.
const toolRows: string[][] = [
  ['Python', 'TypeScript', 'Rust', 'Java', 'SQL', 'JavaScript'],
  ['PyTorch', 'HuggingFace', 'scikit-learn', 'TensorFlow', 'Whisper', 'NumPy', 'Pandas'],
  ['LangGraph', 'Langflow', 'MCP', 'n8n', 'LangChain', 'Ollama'],
  ['Qdrant', 'OpenSearch', 'pgvector', 'PostgreSQL', 'Firestore', 'Supabase', 'MongoDB', 'Redis'],
  ['AWS SageMaker', 'Bedrock', 'Lambda', 'API Gateway', 'GCP', 'Cloud Run', 'Terraform', 'Docker', 'Kubernetes'],
  ['FastAPI', 'Tauri', 'Streamlit', 'React', 'Git', 'GitHub Actions', 'CI/CD', 'Linux', 'Claude Code'],
];

const Skills = () => {
  return (
    <section id="skills" className="section-padding relative">
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="Skills"
          title={
            <>
              What I <span className="italic text-foreground/85">work on</span>.
            </>
          }
          align="center"
          className="mb-16"
        />

        {/* Capability prose — 3 verb-led lines, no proper nouns */}
        <div className="max-w-3xl mx-auto space-y-10 md:space-y-12">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline"
            >
              <div className="md:col-span-1 text-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
                0{i + 1}
              </div>
              <div className="md:col-span-11">
                <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-foreground">
                  {cap.title}
                  <span className="text-accent1">.</span>
                </h3>
                <p className="mt-2 text-foreground/70 text-base md:text-lg leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="max-w-3xl mx-auto my-16 md:my-20">
          <div className="h-px bg-foreground/10" />
        </div>

        {/* Tool cluster — flat chips, grouped by line break only, no labels */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto"
        >
          <div className="eyebrow mb-5 text-center">Tools I reach for</div>
          <div className="space-y-3">
            {toolRows.map((row, i) => (
              <div key={i} className="flex flex-wrap justify-center gap-1.5">
                {row.map((tool) => (
                  <span
                    key={tool}
                    className="text-mono text-[11px] px-2.5 py-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-foreground/75"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
