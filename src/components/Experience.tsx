
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
    title: "Senior Position",
    company: "Company Name",
    location: "City, Country",
    period: "Jan 2022 - Present",
    description: "Led the development of key initiatives and projects, collaborating with cross-functional teams to deliver high-quality solutions.",
    achievements: [
      "Spearheaded the implementation of new technologies that improved system performance by 40%",
      "Managed a team of 5 developers, mentoring junior staff and improving team productivity",
      "Reduced application load time by 30% through code optimization and performance enhancements"
    ],
    skills: ["Leadership", "React", "TypeScript", "Node.js", "Team Management"],
    url: "#"
  },
  {
    id: 2,
    title: "Mid-level Position",
    company: "Previous Company",
    location: "City, Country",
    period: "Jun 2019 - Dec 2021",
    description: "Developed and maintained applications, focusing on code quality, performance and user experience.",
    achievements: [
      "Designed and implemented key features that increased user engagement by 25%",
      "Collaborated with UX designers to improve application usability and accessibility",
      "Participated in code reviews and technical planning sessions"
    ],
    skills: ["JavaScript", "React", "CSS", "API Integration", "Testing"],
    url: "#"
  },
  {
    id: 3,
    title: "Junior Position",
    company: "First Company",
    location: "City, Country",
    period: "Feb 2017 - May 2019",
    description: "Started my professional journey developing applications and learning industry best practices.",
    achievements: [
      "Contributed to multiple projects, learning various technologies and frameworks",
      "Assisted in troubleshooting and resolving issues in production environments",
      "Participated in agile development processes and daily stand-ups"
    ],
    skills: ["JavaScript", "HTML", "CSS", "Git", "Teamwork"],
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
