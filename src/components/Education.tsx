
import { useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Award,
  MapPin,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Education = {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  year: string;
  description: string;
  subjects: string[];
};

const educations: Education[] = [
  {
    id: 1,
    degree: "Masters in Computer Science",
    institution: "Rutgers, The State University of New Jersey",
    location: "New Brunswick, NJ",
    period: "2022 - 2024",
    year: "2024",
    description: "Completed advanced studies with a focus on machine learning, artificial intelligence, and data science. Research Assistant for longitudinal study of local news in New Jersey.",
    subjects: ["Machine Learning", "Artificial Intelligence", "Data Science", "Natural Language Processing", "Deep Learning"]
  },
  {
    id: 2,
    degree: "Bachelors of Technology in Electronics and Communication",
    institution: "Dr. B.R Ambedkar National Institute of Technology",
    location: "Jalandhar, India",
    period: "2013 - 2017",
    year: "2017",
    description: "Built a strong foundation in engineering principles, programming, and technology fundamentals. Developed alcohol detection and accident prevention technology.",
    subjects: ["Electronics", "Communication Systems", "Programming", "Digital Signal Processing", "Engineering Mathematics"]
  }
];

const Education = () => {
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

  // Sort educations by year in descending order (most recent first)
  const sortedEducations = [...educations].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  );

  return (
    <section id="education" ref={sectionRef} className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Education & Certifications</h2>
          <p className="text-foreground/70">
            My academic background and professional certifications that have shaped my knowledge and expertise.
          </p>
        </div>

        {/* Timeline with circles for years */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line for timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-muted"></div>
          
          <div className="space-y-12">
            {sortedEducations.map((edu, index) => (
              <div 
                key={edu.id} 
                className={`relative flex items-center animate-on-scroll ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Center circle with year */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent2 to-accent1 flex items-center justify-center shadow-md">
                    <span className="text-white font-medium">{edu.year}</span>
                  </div>
                </div>
                
                {/* Content card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className="bg-background rounded-lg border border-border/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden card-hover">
                    {/* Header with subtle gradient */}
                    <div className="bg-gradient-to-r from-accent2/5 to-accent1/5 p-5">
                      <h3 className="text-xl font-medium">{edu.degree}</h3>
                      <div className="flex flex-wrap items-center text-foreground/70 gap-2 mt-1">
                        <span className="font-medium">{edu.institution}</span>
                        
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-accent2/70" />
                          <span>{edu.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-accent2/70" />
                          <span>{edu.period}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <p className="text-foreground/80 mb-4">
                        {edu.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {edu.subjects.map((subject, i) => (
                          <Badge key={i} variant="outline" className="font-normal">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-accent1/10 to-accent2/10 rounded-lg p-8 animate-on-scroll">
            <div className="flex items-start">
              <Award className="h-10 w-10 text-accent1 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-medium mb-4">Additional Achievements & Recognitions</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Published a Medium article on Joi – Form validation made simple</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Received "Rookie Award" for exceptional performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Received "Made a difference" award for amazing client impact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Research Assistant in multiple academic studies at Rutgers University</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
