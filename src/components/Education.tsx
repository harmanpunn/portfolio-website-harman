
import { useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Award
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

        {/* Horizontal Timeline */}
        <div className="hidden md:block max-w-5xl mx-auto mb-20 animate-on-scroll relative">
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 top-6 h-1 bg-gradient-to-r from-accent2 to-accent1 rounded-full"></div>
          
          {/* Timeline Points with Year Labels */}
          <div className="flex justify-between relative w-full">
            {sortedEducations.map((edu, index) => (
              <div key={edu.id} className="flex flex-col items-center relative">
                {/* Timeline Node */}
                <div className="w-5 h-5 mt-4 rounded-full bg-gradient-to-r from-accent2 to-accent1 border-4 border-background shadow-md z-10"></div>
                
                {/* Year Label */}
                <div className="mt-3 font-medium text-sm">{edu.year}</div>
                
                {/* Degree Label (alternating top/bottom) */}
                <div 
                  className={`absolute w-32 text-center ${index % 2 === 0 ? '-top-16' : 'top-16'} 
                              transition-all duration-300 hover:scale-105`}
                >
                  <div className="font-medium text-accent2 text-sm">{edu.degree.split(' ').slice(0, 2).join(' ')}</div>
                  <div className="text-xs text-foreground/70 mt-1">{edu.institution.split(',')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Education Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {sortedEducations.map((edu, index) => (
            <div 
              key={edu.id} 
              className="animate-on-scroll bg-background rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-accent2/10 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-accent2" />
                </div>
                <div>
                  <h3 className="text-xl font-medium">{edu.degree}</h3>
                  <div className="text-foreground/70 mt-1">{edu.institution}</div>
                  <div className="text-foreground/60 text-sm mb-3">{edu.period}</div>
                  
                  <p className="text-foreground/80 mb-4">
                    {edu.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {edu.subjects.slice(0, 4).map((subject, i) => (
                      <Badge key={i} variant="outline" className="font-normal">
                        {subject}
                      </Badge>
                    ))}
                    {edu.subjects.length > 4 && (
                      <Badge variant="outline" className="font-normal">
                        +{edu.subjects.length - 4} more
                      </Badge>
                    )}
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
