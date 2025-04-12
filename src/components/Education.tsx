
import { useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  MapPin, 
  Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Education = {
  id: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
  highlights: string[];
  subjects: string[];
};

const educations: Education[] = [
  {
    id: 1,
    degree: "Masters in Computer Science",
    institution: "Rutgers, The State University of New Jersey",
    location: "New Brunswick, NJ",
    period: "2022 - 2024",
    description: "Completed advanced studies with a focus on machine learning, artificial intelligence, and data science.",
    highlights: [
      "Research Assistant for longitudinal study of local news in New Jersey",
      "Research assistant analyzing CS enrollment and performance trends",
      "Full Stack Developer and Machine Learning Engineer for GRID project",
      "Developed multiple AI and ML projects showcasing practical applications"
    ],
    subjects: ["Machine Learning", "Artificial Intelligence", "Data Science", "Natural Language Processing", "Deep Learning"]
  },
  {
    id: 2,
    degree: "Bachelors of Technology in Electronics and Communication",
    institution: "Dr. B.R Ambedkar National Institute of Technology",
    location: "Jalandhar, India",
    period: "2013 - 2017",
    description: "Built a strong foundation in engineering principles, programming, and technology fundamentals.",
    highlights: [
      "Developed alcohol detection and accident prevention technology",
      "Worked on various electronic and programming projects",
      "Participated in technical competitions and hackathons",
      "Learned fundamentals of programming and engineering design"
    ],
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

  return (
    <section id="education" ref={sectionRef} className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Education & Certifications</h2>
          <p className="text-foreground/70">
            My academic background and professional certifications that have shaped my knowledge and expertise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {educations.map((edu, index) => (
            <div 
              key={edu.id} 
              className="timeline-item animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-medium">{edu.degree}</h3>
                    <div className="flex items-center text-foreground/70 mt-1">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      <span>{edu.institution}</span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <div className="flex items-center text-foreground/70 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{edu.period}</span>
                    </div>
                    <div className="flex items-center text-foreground/70">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                </div>

                <p className="text-foreground/80 mb-4">
                  {edu.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80">
                    {edu.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm">{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Subjects:</h4>
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
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
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
