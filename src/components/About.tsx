
import { useEffect, useRef } from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

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
    <section id="about" ref={sectionRef} className="section-padding bg-gradient-to-r from-background to-accent/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Golden Gate Bridge Image */}
          <div className="animate-on-scroll h-full">
            <div className="rounded-lg overflow-hidden shadow-lg h-full">
              <img 
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2669&q=80" 
                alt="Golden Gate Bridge" 
                className="w-full h-full object-cover aspect-[4/3]" 
              />
            </div>
          </div>
          
          {/* Right side - About Content */}
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-serif font-bold mb-6 gradient-text">About Me</h2>
            <p className="text-foreground/80 mb-4">
              I'm a Data Scientist specializing in machine learning, LLMs, and cloud technologies. With expertise in 
              building MLOps pipelines, forecasting models, and AI-driven applications, I deliver data-driven solutions 
              that create tangible business impact.
            </p>
            <p className="text-foreground/80 mb-8">
              My journey began with a passion for leveraging data to solve complex problems, and has evolved into a career 
              where I combine technical expertise with creative problem-solving to achieve outstanding outcomes.
            </p>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-accent1 to-accent2 text-white font-medium transition-all hover:shadow-lg hover:scale-105"
              >
                Get In Touch
              </a>
              
              <div className="flex space-x-4 items-center sm:ml-4">
                <a href="https://github.com/harmanpunn" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/harmanpunn/" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="Instagram Profile">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="mailto:harmanpunn@gmail.com" className="text-foreground/70 hover:text-accent1 transition-colors"
                   aria-label="Email Me">
                  <Mail className="h-5 w-5" />
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
