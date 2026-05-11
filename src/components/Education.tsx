import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type Education = {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  year: string;
  description: string;
  subjects: string[];
};

const educations: Education[] = [
  {
    id: 1,
    degree: 'Masters in Computer Science',
    institution: 'Rutgers University',
    location: 'New Brunswick, NJ',
    period: '2022 — 2024',
    year: '2024',
    description:
      'Advanced studies focused on machine learning, AI, and data science. Research Assistant on a longitudinal study of local news in New Jersey.',
    subjects: [
      'Machine Learning',
      'Artificial Intelligence',
      'Data Science',
      'Natural Language Processing',
      'Deep Learning',
    ],
  },
  {
    id: 2,
    degree: 'B.Tech, Electronics & Communication',
    institution: 'Dr. B.R. Ambedkar NIT Jalandhar',
    location: 'Jalandhar, India',
    period: '2013 — 2017',
    year: '2017',
    description:
      'Built a strong foundation in engineering principles, programming, and signal systems. Developed alcohol-detection-based accident prevention technology as final-year project.',
    subjects: [
      'Electronics',
      'Communication Systems',
      'Programming',
      'Digital Signal Processing',
      'Engineering Mathematics',
    ],
  },
];

const sortedEducations = [...educations].sort(
  (a, b) => parseInt(b.year) - parseInt(a.year)
);

const EducationCard = ({ edu, index }: { edu: Education; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
  >
    <div className="md:col-span-3 md:sticky md:top-28 self-start">
      <div className="text-mono text-xs uppercase tracking-[0.2em] text-foreground/45">
        {edu.year}
      </div>
      <div className="mt-1 text-mono text-[11px] text-foreground/40">
        {edu.period}
      </div>
    </div>

    <div className="md:col-span-9">
      <div className="glass rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:ring-glow">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-foreground">
            {edu.institution}
          </h3>
          <div className="flex items-center gap-1.5 text-mono text-[11px] text-foreground/55">
            <MapPin className="h-3 w-3" />
            <span>{edu.location}</span>
          </div>
        </div>

        <p className="mt-1.5 text-sm text-foreground/70">{edu.degree}</p>

        <p className="mt-5 text-foreground/75 leading-relaxed text-[0.95rem]">
          {edu.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {edu.subjects.map((subject) => (
            <span
              key={subject}
              className="text-mono text-[11px] px-2.5 py-1 rounded-full bg-foreground/[0.05] border border-foreground/10 text-foreground/75"
            >
              {subject}
            </span>
          ))}
        </div>

      </div>
    </div>
  </motion.article>
);

const Education = () => {
  return (
    <section id="education" className="section-padding relative">
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="Education"
          title={
            <>
              Where I <span className="italic text-foreground/85">learned</span>.
            </>
          }
          align="center"
          className="mb-16"
        />

        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {sortedEducations.map((edu, i) => (
            <EducationCard key={edu.id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
