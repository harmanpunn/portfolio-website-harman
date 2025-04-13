
import { useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    title: "Data Scientist",
    company: "Invidi Technologies",
    location: "Princeton, NJ",
    period: "June 2024 - Present",
    year: "2024",
    description: "Leading data science initiatives focused on forecasting, optimization, and MLOps solutions. Built MLOps pipeline using AWS Sagemaker and API Gateway to deploy ML models as scalable, serverless endpoints.",
    skills: ["Python", "Machine Learning", "Forecasting", "Analytics", "AWS", "REST APIs"]
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    company: "Visa Inc.",
    location: "San Francisco, CA",
    period: "August 2021 - August 2022",
    year: "2022",
    description: "Developed enterprise applications and ML-powered features for Visa's internal platforms. Improved retention and user experience by 40%.",
    skills: ["Java", "JavaScript", "Python", "React.js", "Machine Learning", "REST APIs"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Netcentric, A Cognizant Digital Business",
    location: "Zurich, Switzerland",
    period: "November 2019 - July 2021",
    year: "2019",
    description: "Developed backend solutions for major international clients including Kia Motors and InterContinental Hotels Group.",
    skills: ["Java", "JavaScript", "AEM", "Adobe Analytics", "Machine Learning", "Angular", "AWS"]
  },
  {
    id: 4,
    title: "Associate Technology",
    company: "Publicis Sapient",
    location: "Gurgaon, India",
    period: "December 2017 - October 2019",
    year: "2017",
    description: "Developed web solutions and ML models for clients and internal projects. Created analytics for marketing campaigns and customer profiles.",
    skills: ["Java", "JavaScript", "Python", "AEM", "Django", "Analytics", "Machine Learning"]
  },
  {
    id: 5,
    title: "Software Developer Intern",
    company: "Invidi Technologies",
    location: "Princeton, NJ",
    period: "May 2023 - May 2024",
    year: "2023",
    description: "Developed advanced inventory scheduling system for efficient ad campaign delivery. Achieved 98% utilization rate of ad inventory.",
    skills: ["Python", "AWS Redshift", "Data Analysis", "Scheduling Algorithms", "SQL"]
  }
];

const Experience = () => {
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

  // Sort experiences by year in ascending order
  const sortedExperiences = [...experiences].sort((a, b) => 
    parseInt(a.year) - parseInt(b.year)
  );

  return (
    <section id="experience" ref={sectionRef} className="section-padding">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Professional Experience</h2>
          <p className="text-foreground/70">
            A chronicle of my professional journey, showcasing my career progression and key contributions.
          </p>
        </div>

        {/* Horizontal Timeline for larger screens */}
        <div className="hidden md:block max-w-6xl mx-auto mb-16 animate-on-scroll">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent1/30 -translate-y-1/2"></div>
            
            {/* Timeline Points */}
            <div className="flex justify-between relative">
              {sortedExperiences.map((exp, index) => (
                <div key={exp.id} className="flex flex-col items-center">
                  {/* Timeline Node */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-accent1 border-4 border-background mb-2"></div>
                  
                  {/* Year */}
                  <div className="text-lg font-medium">{exp.year}</div>
                  
                  {/* Job Title (alternating top/bottom) */}
                  <div className={`absolute w-48 text-center ${index % 2 === 0 ? '-top-20' : 'top-12'}`}>
                    <div className="font-medium text-accent1">{exp.title}</div>
                    <div className="text-sm text-foreground/70 italic">{exp.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Experience Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {sortedExperiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className="animate-on-scroll bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-accent1/10 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-accent1" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{exp.title}</h3>
                  <div className="text-foreground/70 mt-1">{exp.company} • {exp.location}</div>
                  <div className="text-foreground/60 text-sm mb-3">{exp.period}</div>
                  
                  <p className="text-foreground/80 mb-4">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.slice(0, 4).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="font-normal">
                        {skill}
                      </Badge>
                    ))}
                    {exp.skills.length > 4 && (
                      <Badge variant="outline" className="font-normal">
                        +{exp.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
