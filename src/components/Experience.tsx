
import { useEffect, useRef } from 'react';
import { Briefcase, Clock, MapPin, Calendar } from 'lucide-react';
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
    location: "Bengaluru, India",
    period: "August 2021 - August 2022",
    year: "2022",
    description: "Developed enterprise applications and ML-powered features for Visa's internal platforms. Improved retention and user experience by 40%.",
    skills: ["Java", "JavaScript", "Python", "React.js", "Machine Learning", "REST APIs"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Netcentric, A Cognizant Digital Business",
    location: "Pune, India",
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

        {/* Modern Vertical Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline Line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent1 to-accent2 ml-6 md:ml-9 rounded-full"></div>
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {sortedExperiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className="relative animate-on-scroll"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Year marker */}
                <div className="absolute left-0 md:left-1 w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center bg-background border-4 border-accent1 z-10 shadow-lg">
                  <span className="font-bold text-accent1">{exp.year}</span>
                </div>
                
                {/* Content Card */}
                <div className="ml-20 md:ml-28 bg-background rounded-lg border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-accent1/10 to-accent2/10 p-5">
                    <h3 className="text-xl font-medium">{exp.title}</h3>
                    <div className="flex flex-wrap items-center text-foreground/70 gap-2 mt-1">
                      <span className="font-medium">{exp.company}</span>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-accent1" />
                        <span>{exp.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-accent1" />
                        <span>{exp.period}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <p className="text-foreground/80 mb-4">
                      {exp.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
