
import { useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Experience = {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
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
    description: "Leading data science initiatives focused on forecasting, optimization, and MLOps solutions. Built MLOps pipeline using AWS Sagemaker and API Gateway to deploy ML models as scalable, serverless endpoints, integrated with CI/CD for automated deployment and real-time monitoring.",
    skills: ["Python", "Machine Learning", "Forecasting", "Analytics", "AWS", "REST APIs"]
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    company: "Visa Inc.",
    location: "San Francisco, CA",
    period: "August 2021 - August 2022",
    description: "Developed enterprise applications and ML-powered features for Visa's internal platforms. Collaborated with product teams to redesign entire Visa's intranet, improving retention and user experience by 40%. 10x improvement in jobs listing page response time by implementing targeted scheduling & caching.",
    skills: ["Java", "JavaScript", "Python", "React.js", "Machine Learning", "REST APIs"]
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Netcentric, A Cognizant Digital Business",
    location: "Zurich, Switzerland",
    period: "November 2019 - July 2021",
    description: "Developed backend solutions for major international clients including Kia Motors and InterContinental Hotels Group. Translation of 50+ wireframes and creative designs into functional requirements, and subsequently into technical design.",
    skills: ["Java", "JavaScript", "AEM", "Adobe Analytics", "Machine Learning", "Angular", "AWS"]
  },
  {
    id: 4,
    title: "Associate Technology",
    company: "Publicis Sapient",
    location: "Gurgaon, India",
    period: "December 2017 - October 2019",
    description: "Developed web solutions and ML models for clients and internal projects. Analytics to gauge the effectiveness of marketing campaigns, create customer profiles to boost profitability. Developed components, templates, services, and servlets to drive the entire Roche Diagnostics website.",
    skills: ["Java", "JavaScript", "Python", "AEM", "Django", "Analytics", "Machine Learning"]
  },
  {
    id: 5,
    title: "Software Developer Intern",
    company: "Invidi Technologies",
    location: "Princeton, NJ",
    period: "May 2023 - May 2024",
    description: "Developed advanced inventory scheduling system for efficient ad campaign delivery. Devised an efficient inventory scheduler using Python that matches media inventory with campaign data. Achieved 98% utilization rate of ad inventory by designing and implementing advanced scheduling rules.",
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

  return (
    <section id="experience" ref={sectionRef} className="section-padding">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Professional Experience</h2>
          <p className="text-foreground/70">
            A chronicle of my professional journey, showcasing my career progression and key contributions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative border-l-2 border-accent1/30 pl-8 ml-8 md:ml-[30%] pb-8">
            {experiences.map((exp, index) => (
              <div 
                key={exp.id} 
                className="animate-on-scroll mb-12 relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute -left-10 top-0 w-6 h-6 bg-accent1 rounded-full border-4 border-background z-10"></div>
                <div className="bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col md:flex-row justify-between mb-3">
                    <h3 className="text-xl font-medium">{exp.title}</h3>
                    <div className="flex items-center text-foreground/70">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{exp.period}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-foreground/70 mb-3">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="mr-3">{exp.company}</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{exp.location}</span>
                  </div>

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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
