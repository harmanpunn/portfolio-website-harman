
import { useEffect, useRef } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="Twitter Profile">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="mailto:harmanpunn@gmail.com" className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="Email Me">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="animate-on-scroll">
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-background to-secondary/50 p-1">
              <div className="bg-background rounded-lg p-6 md:p-8 shadow-inner flex flex-col items-center">
                <div className="w-40 h-40 mb-6 overflow-hidden rounded-full border-4 border-accent1/20">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="/placeholder.svg" alt="Harmanpreet Singh" className="object-cover" />
                    <AvatarFallback className="text-4xl font-serif bg-accent1/10 text-accent1">HS</AvatarFallback>
                  </Avatar>
                </div>
                
                <h3 className="text-xl font-medium mb-3">Let's Connect</h3>
                <p className="text-center text-foreground/70 mb-4">
                  I'm always open to discussing new projects, opportunities, or collaborations.
                </p>
                
                <a 
                  href="#contact" 
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-accent1 to-accent2 text-white font-medium transition-all hover:shadow-lg hover:scale-105"
                >
                  Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
