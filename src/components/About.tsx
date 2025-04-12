
import { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
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
    <section id="about" ref={sectionRef} className="section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="animate-on-scroll">
              <h2 className="text-3xl font-serif font-bold mb-6">About Me</h2>
              <p className="text-foreground/80 mb-4">
                I'm a Data Scientist specializing in machine learning, LLMs, and cloud technologies. With expertise in 
                building MLOps pipelines, forecasting models, and AI-driven applications, I deliver data-driven solutions 
                that create tangible business impact.
              </p>
              <p className="text-foreground/80 mb-4">
                My journey began with a passion for leveraging data to solve complex problems, and has evolved into a career 
                where I combine technical expertise with creative problem-solving to achieve outstanding outcomes.
              </p>
              <p className="text-foreground/80 mb-8">
                Outside of work, I enjoy staying current with machine learning advancements, contributing to open-source projects,
                and continuous learning to expand my skill set.
              </p>
              
              <div className="flex space-x-4">
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="mailto:harmanpunn@gmail.com" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="animate-on-scroll">
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-background to-secondary/50 p-1">
              <div className="bg-background rounded-lg p-6 md:p-8 shadow-inner">
                <h3 className="text-xl font-medium mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Name:</div>
                    <div className="col-span-2 font-medium">Harmanpreet Singh</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Email:</div>
                    <div className="col-span-2 font-medium">harmanpunn@gmail.com</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Phone:</div>
                    <div className="col-span-2 font-medium">+1 (848)-313-6708</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Location:</div>
                    <div className="col-span-2 font-medium">New Brunswick, NJ</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Languages:</div>
                    <div className="col-span-2 font-medium">English, Hindi, Punjabi</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Availability:</div>
                    <div className="col-span-2 font-medium">Full-time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
