
import { useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

  // Sort experiences by year in descending order (most recent first)
  const sortedExperiences = [...experiences].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
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

        {/* Horizontal Timeline */}
        <div className="hidden md:block max-w-5xl mx-auto mb-20 animate-on-scroll relative">
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 top-6 h-1 bg-gradient-to-r from-accent1 to-accent2 rounded-full"></div>
          
          {/* Timeline Points with Year Labels */}
          <div className="flex justify-between relative w-full">
            {sortedExperiences.map((exp, index) => (
              <div key={exp.id} className="flex flex-col items-center relative">
                {/* Timeline Node */}
                <div className="w-5 h-5 mt-4 rounded-full bg-gradient-to-r from-accent1 to-accent2 border-4 border-background shadow-md z-10"></div>
                
                {/* Year Label */}
                <div className="mt-3 font-medium text-sm">{exp.year}</div>
                
                {/* Position Label (alternating top/bottom) */}
                <div 
                  className={`absolute w-32 text-center ${index % 2 === 0 ? '-top-16' : 'top-16'} 
                              transition-all duration-300 hover:scale-105`}
                >
                  <div className="font-medium text-accent1 text-sm">{exp.title}</div>
                  <div className="text-xs text-foreground/70 mt-1">{exp.company.split(',')[0]}</div>
                </div>
              </div>
            ))}
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
