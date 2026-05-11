import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

type Experience = {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  year: string;
  description: string;
  skills: string[];
};

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Data Science & ML',
    company: 'INVIDI Technologies',
    location: 'Princeton, NJ',
    period: 'June 2024 — Present',
    year: '2024',
    description:
      "Leading data science initiatives focused on forecasting, optimization, and MLOps. Built MLOps pipeline using AWS SageMaker and API Gateway to deploy ML models as scalable, serverless endpoints. Currently building AI-powered semantic search systems for video content discovery and matching.",
    skills: ['Python', 'Machine Learning', 'Semantic Search', 'Computer Vision', 'AWS', 'MLOps', 'Terraform'],
  },
  {
    id: 5,
    title: 'Software Developer Intern',
    company: 'INVIDI Technologies',
    location: 'Princeton, NJ',
    period: 'May 2023 — May 2024',
    year: '2023',
    description:
      'Developed advanced inventory scheduling system for efficient ad campaign delivery. Achieved 98% utilization rate of ad inventory.',
    skills: ['Python', 'AWS Redshift', 'Data Analysis', 'Scheduling Algorithms', 'SQL'],
  },
  {
    id: 2,
    title: 'Senior Software Engineer',
    company: 'Visa Inc.',
    location: 'Bengaluru, India',
    period: 'August 2021 — August 2022',
    year: '2022',
    description:
      "Developed enterprise applications and ML-powered features for Visa's internal platforms. Improved retention and user experience by 40%.",
    skills: ['Java', 'JavaScript', 'Python', 'React.js', 'Machine Learning', 'REST APIs'],
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'Cognizant Netcentric',
    location: 'Pune, India',
    period: 'November 2019 — July 2021',
    year: '2019',
    description:
      'Developed backend solutions for major international clients including Kia Motors and InterContinental Hotels Group.',
    skills: ['Java', 'JavaScript', 'AEM', 'Adobe Analytics', 'Machine Learning', 'Angular', 'AWS'],
  },
  {
    id: 4,
    title: 'Associate Technology',
    company: 'Publicis Sapient',
    location: 'Gurgaon, India',
    period: 'December 2017 — October 2019',
    year: '2017',
    description:
      'Developed web solutions and ML models for clients and internal projects. Created analytics for marketing campaigns and customer profiles.',
    skills: ['Java', 'JavaScript', 'Python', 'AEM', 'Django', 'Analytics', 'Machine Learning'],
  },
];

const sortedExperiences = [...experiences].sort(
  (a, b) => parseInt(b.year) - parseInt(a.year)
);

const RoleCard = ({ exp, index }: { exp: Experience; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
    className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
  >
    {/* Year column */}
    <div className="md:col-span-3 md:sticky md:top-28 self-start">
      <div className="text-mono text-xs uppercase tracking-[0.2em] text-foreground/45">
        {exp.year}
      </div>
      <div className="mt-1 text-mono text-[11px] text-foreground/40">
        {exp.period}
      </div>
    </div>

    {/* Card */}
    <div className="md:col-span-9">
      <div className="glass rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-0.5 hover:ring-glow">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-2xl md:text-[1.7rem] leading-tight text-foreground">
            {exp.company}
          </h3>
          <div className="flex items-center gap-1.5 text-mono text-[11px] text-foreground/55">
            <MapPin className="h-3 w-3" />
            <span>{exp.location}</span>
          </div>
        </div>

        <p className="mt-1.5 text-sm text-foreground/70">{exp.title}</p>

        <p className="mt-5 text-foreground/75 leading-relaxed text-[0.95rem]">
          {exp.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {exp.skills.map((skill) => (
            <span
              key={skill}
              className="text-mono text-[11px] px-2.5 py-1 rounded-full bg-foreground/[0.05] border border-foreground/10 text-foreground/75"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.article>
);

const Experience = () => {
  return (
    <section id="experience" className="section-padding relative">
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              Where I've <span className="italic text-foreground/85">worked</span>.
            </>
          }
          lede="A chronicle of the systems, teams, and problems I've shipped against."
          align="center"
          className="mb-16"
        />

        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {sortedExperiences.map((exp, i) => (
            <RoleCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
