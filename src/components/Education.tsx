
import { useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  Award,
  MapPin,
  Calendar,
  Badge as BadgeIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const sortedEducations = [...educations].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  );

  const MobileEducationCard = ({ edu, index }: { edu: Education, index: number }) => (
    <div 
      className="animate-on-scroll mb-8 relative" 
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="bg-accent2 text-white text-sm font-bold py-1 px-4 rounded-full mb-4 inline-block w-auto">
        {edu.year}
      </div>
      
      <Card className="overflow-hidden border-border/30 shadow-sm hover:shadow-md hover:border-accent2/30 transition-all duration-300">
        <CardHeader className="p-4 pb-3">
          <h3 className="text-lg font-medium mb-1">{edu.degree}</h3>
          <p className="font-medium">{edu.institution}</p>
          
          <div className="flex flex-wrap items-center text-foreground/70 gap-3 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent2/70" />
              <span>{edu.location}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-accent2/70" />
              <span>{edu.period}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <p className="text-foreground/80 mb-4 text-sm">
            {edu.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {edu.subjects.map((subject, i) => (
              <Badge key={i} variant="outline" className="font-normal text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DesktopTimeline = () => (
    <div className="max-w-4xl mx-auto relative">
      <div className="absolute left-[28px] top-4 bottom-4 w-1 bg-accent2/80 rounded-full"></div>
      
      <div className="space-y-16">
        {sortedEducations.map((edu, index) => (
          <div 
            key={edu.id} 
            className="group animate-on-scroll relative flex items-start"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-accent2 rounded-full flex items-center justify-center z-10 transition-all duration-300 group-hover:scale-110 group-hover:border-accent1 shadow-md">
              <span className="text-sm font-bold">{edu.year}</span>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm transition-all duration-300 ml-20 w-full overflow-hidden group-hover:shadow-md group-hover:border-accent2/30 group-hover:-translate-y-1">
              <div className="bg-background p-5 border-b border-border/10">
                <h3 className="text-xl font-medium">{edu.degree}</h3>
                <p className="font-medium">{edu.institution}</p>
                
                <div className="flex flex-wrap items-center text-foreground/70 gap-4 mt-1 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-accent2/70" />
                    <span>{edu.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent2/70" />
                    <span>{edu.period}</span>
                  </div>
                </div>
              </div>
              
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
        ))}
      </div>
    </div>
  );

  const MobileAchievements = () => (
    <div className="mt-8 px-4 animate-on-scroll">
      <Card className="overflow-hidden border-blue-100 bg-blue-50/80 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Award className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            
            <h3 className="text-center text-lg font-medium mb-4">Additional Achievements & Recognitions</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 text-sm rounded-full flex-shrink-0 mt-1.5">•</span>
                <span className="text-foreground/80 text-sm">Published a Medium article on Joi – Form validation made simple</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 text-sm rounded-full flex-shrink-0 mt-1.5">•</span>
                <span className="text-foreground/80 text-sm">Received "Rookie Award" for exceptional performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 text-sm rounded-full flex-shrink-0 mt-1.5">•</span>
                <span className="text-foreground/80 text-sm">Received "Made a difference" award for amazing client impact</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2 text-sm rounded-full flex-shrink-0 mt-1.5">•</span>
                <span className="text-foreground/80 text-sm">Research Assistant in multiple academic studies at Rutgers University</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DesktopAchievements = () => (
    <div className="mt-16 max-w-4xl mx-auto px-4">
      <div className="bg-blue-50 rounded-lg border border-blue-100 p-8 animate-on-scroll shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start">
          <Award className="h-10 w-10 text-blue-500 mr-4 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-medium mb-4">Additional Achievements & Recognitions</h3>
            <ul className="space-y-3">
              <li className="flex items-start group">
                <span className="text-blue-500 mr-2 text-lg">•</span>
                <span className="text-foreground/80">Published a Medium article on Joi – Form validation made simple</span>
              </li>
              <li className="flex items-start group">
                <span className="text-blue-500 mr-2 text-lg">•</span>
                <span className="text-foreground/80">Received "Rookie Award" for exceptional performance</span>
              </li>
              <li className="flex items-start group">
                <span className="text-blue-500 mr-2 text-lg">•</span>
                <span className="text-foreground/80">Received "Made a difference" award for amazing client impact</span>
              </li>
              <li className="flex items-start group">
                <span className="text-blue-500 mr-2 text-lg">•</span>
                <span className="text-foreground/80">Research Assistant in multiple academic studies at Rutgers University</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile === null) {
    return (
      <section id="education" className="section-padding bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">Education & Certifications</h2>
          </div>
          <div className="opacity-0">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" ref={sectionRef} className="section-padding bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Education & Certifications</h2>
          <p className="text-foreground/70">
            My academic background and professional certifications that have shaped my knowledge and expertise.
          </p>
        </div>

        {isMobile ? (
          <div className="px-4">
            {sortedEducations.map((edu, index) => (
              <MobileEducationCard key={edu.id} edu={edu} index={index} />
            ))}
            <MobileAchievements />
          </div>
        ) : (
          <>
            <DesktopTimeline />
            <DesktopAchievements />
          </>
        )}
      </div>
    </section>
  );
};

export default Education;
