
import { useEffect, useRef } from 'react';
import { 
  Code, 
  Database, 
  Server, 
  GitBranch, 
  Cloud, 
  Cpu, 
  BarChart, 
  Bot
} from 'lucide-react';

type Skill = {
  name: string;
  percentage: number;
};

const technicalSkills: Skill[] = [
  { name: "Python", percentage: 95 },
  { name: "Machine Learning", percentage: 90 },
  { name: "LLMs & RAG", percentage: 85 },
  { name: "AWS", percentage: 85 },
  { name: "Data Analysis", percentage: 90 },
];

const softSkills: Skill[] = [
  { name: "Problem Solving", percentage: 95 },
  { name: "Communication", percentage: 90 },
  { name: "Teamwork", percentage: 85 },
  { name: "Time Management", percentage: 80 },
  { name: "Research", percentage: 90 },
];

const SkillCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) => (
  <div className="bg-background dark:bg-card rounded-lg shadow-sm border border-border p-6 transition-all duration-300 hover:shadow-md hover:border-accent1/20 dark:hover:border-accent1/30 animate-on-scroll">
    <div className="text-accent1 dark:text-accent1 mb-4">
      <Icon className="h-10 w-10" />
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-foreground/70 text-sm">{description}</p>
  </div>
);

const SkillBar = ({ skill }: { skill: Skill }) => (
  <div className="mb-4 animate-on-scroll">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium">{skill.name}</span>
      <span className="text-sm text-foreground/70">{skill.percentage}%</span>
    </div>
    <div className="skill-bar">
      <div 
        className="skill-progress" 
        style={{ width: `${skill.percentage}%` }}
      ></div>
    </div>
  </div>
);

const Skills = () => {
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
    <section id="skills" ref={sectionRef} className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">My Skills</h2>
          <p className="text-foreground/70">
            A combination of technical expertise and soft skills that enable me to deliver exceptional results in data science and machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <SkillCard 
            icon={Code} 
            title="Programming Languages" 
            description="Python, R, Java, JavaScript, HTML/CSS for building data-driven applications and interfaces."
          />
          <SkillCard 
            icon={Cpu} 
            title="Machine Learning" 
            description="Expertise in PyTorch, TensorFlow, scikit-learn for predictive modeling and AI solutions."
          />
          <SkillCard 
            icon={Bot} 
            title="LLMs & RAG" 
            description="Experience with GPT, LangChain, and building Retrieval Augmented Generation systems."
          />
          <SkillCard 
            icon={Database} 
            title="Data Engineering" 
            description="Proficient in SQL, MongoDB, Vector Databases, and data pipeline development."
          />
          <SkillCard 
            icon={Cloud} 
            title="Cloud & AWS" 
            description="AWS (S3, SageMaker, Redshift, Quicksight, EC2, Lambda) for scalable deployments."
          />
          <SkillCard 
            icon={Server} 
            title="MLOps" 
            description="Building end-to-end ML pipelines, automated deployments, and monitoring solutions."
          />
          <SkillCard 
            icon={GitBranch} 
            title="DevOps" 
            description="Docker, CI/CD, Jenkins for streamlined development and deployment processes."
          />
          <SkillCard 
            icon={BarChart} 
            title="Data Analysis" 
            description="Pandas, NumPy, and visualization tools for extracting insights from complex datasets."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <h3 className="text-xl font-medium mb-6 animate-on-scroll">Technical Skills</h3>
            {technicalSkills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
          <div>
            <h3 className="text-xl font-medium mb-6 animate-on-scroll">Soft Skills</h3>
            {softSkills.map((skill) => (
              <SkillBar key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
