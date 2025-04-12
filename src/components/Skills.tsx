
import { useEffect, useRef } from 'react';
import { 
  Code, 
  PenTool, 
  Terminal, 
  GitBranch, 
  Database, 
  Users, 
  BarChart, 
  Compass 
} from 'lucide-react';

type Skill = {
  name: string;
  percentage: number;
};

const technicalSkills: Skill[] = [
  { name: "JavaScript / TypeScript", percentage: 90 },
  { name: "React / Next.js", percentage: 85 },
  { name: "HTML / CSS", percentage: 95 },
  { name: "Node.js", percentage: 80 },
  { name: "SQL / NoSQL", percentage: 75 },
];

const softSkills: Skill[] = [
  { name: "Communication", percentage: 90 },
  { name: "Problem Solving", percentage: 95 },
  { name: "Teamwork", percentage: 85 },
  { name: "Time Management", percentage: 80 },
  { name: "Leadership", percentage: 75 },
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
  <div className="bg-background rounded-lg shadow-sm border border-border p-6 transition-all duration-300 hover:shadow-md hover:border-accent1/20 animate-on-scroll">
    <div className="text-accent1 mb-4">
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
            A combination of technical expertise and soft skills that enable me to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <SkillCard 
            icon={Code} 
            title="Frontend Development" 
            description="Creating responsive, accessible and performant user interfaces with modern frameworks."
          />
          <SkillCard 
            icon={Terminal} 
            title="Backend Development" 
            description="Building robust server-side applications and APIs to power digital experiences."
          />
          <SkillCard 
            icon={Database} 
            title="Database Design" 
            description="Designing efficient database schemas and optimizing query performance."
          />
          <SkillCard 
            icon={PenTool} 
            title="UI/UX Design" 
            description="Crafting intuitive and visually appealing interfaces focused on user experience."
          />
          <SkillCard 
            icon={GitBranch} 
            title="Version Control" 
            description="Maintaining code quality and collaboration through efficient version control."
          />
          <SkillCard 
            icon={Compass} 
            title="Project Architecture" 
            description="Designing scalable and maintainable software architectures."
          />
          <SkillCard 
            icon={Users} 
            title="Team Collaboration" 
            description="Working effectively with cross-functional teams to achieve project goals."
          />
          <SkillCard 
            icon={BarChart} 
            title="Performance Optimization" 
            description="Optimizing applications for speed, efficiency and resource utilization."
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
