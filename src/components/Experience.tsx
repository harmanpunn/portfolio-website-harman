import { useEffect, useRef } from 'react';
import { Briefcase, MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
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

  // Mobile Experience Card Component
  const MobileExperienceCard = ({ exp, index }: { exp: Experience, index: number }) => (
    <div 
      className="animate-on-scroll mb-8 relative" 
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Year badge */}
      <div className="bg-accent1 text-white text-sm font-bold py-1 px-4 rounded-full mb-4 inline-block w-auto">
        {exp.year}
      </div>
      
      <Card className="overflow-hidden border-border/30 shadow-sm hover:shadow-md hover:border-accent1/30 transition-all duration-300">
        <CardHeader className="p-4 pb-3">
          <h3 className="text-lg font-medium mb-1">{exp.title}</h3>
          <p className="font-medium">{exp.company}</p>
          
          <div className="flex flex-wrap items-center text-foreground/70 gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent1/70" />
              <span>{exp.location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-accent1/70" />
              <span>{exp.period}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <p className="text-foreground/80 mb-4 text-sm">
            {exp.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {exp.skills.map((skill, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Desktop Timeline Component
  const DesktopTimeline = () => (
    <div className="max-w-4xl mx-auto relative">
      {/* Vertical line for timeline */}
      <div className="absolute left-[28px] top-4 bottom-4 w-1 bg-accent1/80 rounded-full"></div>
      
      <div className="space-y-16">
        {sortedExperiences.map((exp, index) => (
          <div 
            key={exp.id} 
            className="group animate-on-scroll relative flex items-start"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Circle marker with year */}
            <div className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-accent1 rounded-full flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-accent2 shadow-md">
              <span className="text-sm font-bold">{exp.year}</span>
            </div>
            
            {/* Content card */}
            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm transition-all duration-300 ml-20 w-full overflow-hidden group-hover:shadow-md group-hover:border-accent1/30 group-hover:-translate-y-1">
              {/* Header */}
              <div className="bg-background p-5 border-b border-border/10">
                <h3 className="text-xl font-medium">{exp.title}</h3>
                <p className="font-medium">{exp.company}</p>
                
                <div className="flex flex-wrap items-center text-foreground/70 gap-4 mt-1 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-accent1/70" />
                    <span>{exp.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent1/70" />
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
  );

  // Show loading placeholder while we determine if it's mobile or not
  if (isMobile === null) {
    return (
      <section id="experience" className="section-padding">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Professional Experience</h2>
          </div>
          {/* Loading placeholder */}
          <div className="opacity-0">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" ref={sectionRef} className="section-padding">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Professional Experience</h2>
          <p className="text-foreground/70">
            A chronicle of my professional journey, showcasing my career progression and key contributions.
          </p>
        </div>

        {isMobile ? (
          <div className="px-4">
            {sortedExperiences.map((exp, index) => (
              <MobileExperienceCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        ) : (
          <DesktopTimeline />
        )}
      </div>
    </section>
  );
};

export default Experience;
