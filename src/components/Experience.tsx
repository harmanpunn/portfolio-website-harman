
import { useEffect, useRef } from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Experience = {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements: string[];
  skills: string[];
  url?: string;
};

const experiences: Experience[] = [
  {
    id: 1,
    title: "Data Scientist",
    company: "Invidi Technologies",
    location: "Princeton, NJ",
    period: "June 2024 - Present",
    description: "Leading data science initiatives focused on forecasting, optimization, and MLOps solutions.",
    achievements: [
      "Built an MLOps pipeline using AWS Sagemaker and API Gateway to deploy ML models as scalable, serverless endpoints, integrated with CI/CD for automated deployment and real-time monitoring",
      "Achieved 60-70% accuracy in forecasting impressions at ad and inventory levels using models like ARIMA, SARIMA, RandomForest, and XGBoost",
      "Developed an ML-driven ad scheduling optimization system, improving pacing accuracy by 15% and reducing under/over-delivery by 30%",
      "Conducting research on an LLM-powered campaign log classification pipeline to extract key insights",
      "Developed and deployed multiple reporting dashboards in QuickSight, providing actionable insights on inventory utilization"
    ],
    skills: ["Python", "Machine Learning", "Forecasting", "Analytics", "QuickSight", "Time Series", "Regression", "AWS", "REST APIs"],
    url: "#"
  },
  {
    id: 2,
    title: "Senior Software Engineer",
    company: "Visa Inc.",
    location: "San Francisco, CA",
    period: "August 2021 - August 2022",
    description: "Developed enterprise applications and ML-powered features for Visa's internal platforms.",
    achievements: [
      "Collaborated with product teams to redesign entire Visa's intranet, improving retention and user experience by 40%",
      "10x improvement in jobs listing page response time by implementing targeted scheduling & caching",
      "Developed an ML-powered job recommendation engine, enhancing user engagement and increasing click-through rates",
      "Enhanced Visa's chatbot using NLP, improving response accuracy and cutting query resolution time by 30%",
      "Constructed 10+ REST APIs for Employee Dashboard, facilitating efficient data integration across various product teams"
    ],
    skills: ["Java", "JavaScript", "Python", "Adobe Experience Manager (AEM)", "React.js", "Machine Learning", "REST APIs"],
    url: "#"
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "Netcentric, A Cognizant Digital Business",
    location: "Zurich, Switzerland",
    period: "November 2019 - July 2021",
    description: "Developed backend solutions for major international clients including Kia Motors and InterContinental Hotels Group.",
    achievements: [
      "Translation of 50+ wireframes and creative designs into functional requirements, and subsequently into technical design",
      "Capitalized on Adobe Analytics to apply real-time analytics and segmentation across marketing channels",
      "60% automation of workflow by implementing CI/CD pipelines for deployment and testing",
      "Deployed Brokers (RabbitMQ), REST APIs and remote procedure call to interconnect microservices",
      "Leveraged AEM as content management system to create a consistent experience increasing traffic by 32%"
    ],
    skills: ["Java", "JavaScript", "AEM", "Adobe Analytics", "Machine Learning", "Angular", "OSGi", "AWS", "CSS/SCSS"],
    url: "#"
  },
  {
    id: 4,
    title: "Associate Technology",
    company: "Publicis Sapient",
    location: "Gurgaon, India",
    period: "December 2017 - October 2019",
    description: "Developed web solutions and ML models for clients and internal projects.",
    achievements: [
      "Analytics to gauge the effectiveness of marketing campaigns, create customer profiles to boost profitability",
      "Developed components, templates, services, and servlets to drive the entire Roche Diagnostics website",
      "15% performance improvement in search functionality by integrating with Search & Promote",
      "Built an employee attrition prediction program utilizing XGBoost with an accuracy of 91%",
      "Orchestrated data pipeline resulting in a 50% automation of workflow"
    ],
    skills: ["Java", "JavaScript", "Python", "AEM", "Django", "Analytics", "Machine Learning", "Apache Sling", "CSS/SCSS"],
    url: "#"
  },
  {
    id: 5,
    title: "Software Developer Intern",
    company: "Invidi Technologies",
    location: "Princeton, NJ",
    period: "May 2023 - May 2024",
    description: "Developed advanced inventory scheduling system for efficient ad campaign delivery.",
    achievements: [
      "Devised an efficient inventory scheduler using Python that matches media inventory with campaign data",
      "Achieved 98% utilization rate of ad inventory by designing and implementing advanced scheduling rules",
      "Analyzed 4 years of TV audience data and large AWS Redshift data sets, providing actionable viewership insights"
    ],
    skills: ["Python", "AWS Redshift", "Data Analysis", "Scheduling Algorithms", "SQL"],
    url: "#"
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
          {experiences.map((exp, index) => (
            <div 
              key={exp.id} 
              className="timeline-item animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{exp.title}</h3>
                    <div className="flex items-center text-foreground/70 mt-1">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <div className="flex items-center text-foreground/70 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center text-foreground/70">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground/80 mb-4">
                  {exp.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {exp.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="font-normal">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {exp.url && (
                  <a 
                    href={exp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-accent1 hover:text-accent2 transition-colors"
                  >
                    <span className="mr-1">View Company</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
