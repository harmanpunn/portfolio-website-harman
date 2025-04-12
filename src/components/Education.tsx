
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
    degree: "Master's Degree",
    institution: "University Name",
    location: "City, Country",
    period: "Sep 2015 - Jun 2017",
    description: "Completed advanced studies with a focus on specialized areas of interest, developing deeper knowledge and research skills.",
    highlights: [
      "Graduated with honors / high distinction",
      "Thesis focused on innovative solutions in the field",
      "Participated in research projects and academic conferences"
    ],
    subjects: ["Advanced Subject 1", "Advanced Subject 2", "Research Methods", "Specialized Topic"]
  },
  {
    id: 2,
    degree: "Bachelor's Degree",
    institution: "University Name",
    location: "City, Country",
    period: "Sep 2011 - Jun 2015",
    description: "Built a strong foundation in core principles and methodologies, developing fundamental skills and knowledge.",
    highlights: [
      "Dean's List for academic excellence",
      "Completed capstone project with distinction",
      "Participated in student organizations and competitions"
    ],
    subjects: ["Core Subject 1", "Core Subject 2", "Core Subject 3", "Elective Topic"]
  },
  {
    id: 3,
    degree: "Relevant Certification",
    institution: "Certification Authority",
    location: "Online / City, Country",
    period: "Jan 2018 - Mar 2018",
    description: "Earned professional certification demonstrating specialized skills and industry-recognized qualifications.",
    highlights: [
      "Achieved top score in practical assessments",
      "Completed challenging hands-on projects",
      "Applied learnings to real-world scenarios"
    ],
    subjects: ["Certification Topic 1", "Certification Topic 2", "Practical Applications"]
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
                <h3 className="text-xl font-medium mb-4">Additional Certifications & Achievements</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Professional Certification in Relevant Field (2020)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Advanced Training in Specialized Technology (2019)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Industry Recognition Award for Excellence (2018)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent1 mr-2">•</span>
                    <span className="text-foreground/80">Completed Advanced Workshop in Emerging Technology (2017)</span>
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
