
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
                I'm a dedicated professional with a passion for excellence and innovation. With a strong foundation in my field,
                I strive to deliver quality results on every project I undertake.
              </p>
              <p className="text-foreground/80 mb-4">
                My journey began with a curiosity about how things work and evolved into a career where
                I combine technical expertise with creative problem-solving to achieve outstanding outcomes.
              </p>
              <p className="text-foreground/80 mb-8">
                Outside of work, I enjoy staying current with industry trends, contributing to open-source projects,
                and continuous learning to expand my skill set.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-foreground/70 hover:text-accent1 transition-colors">
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
                    <div className="col-span-2 font-medium">Your Name</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Email:</div>
                    <div className="col-span-2 font-medium">your.email@example.com</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Location:</div>
                    <div className="col-span-2 font-medium">City, Country</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Languages:</div>
                    <div className="col-span-2 font-medium">English, [Other Languages]</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-foreground/70">Availability:</div>
                    <div className="col-span-2 font-medium">Full-time / Freelance</div>
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
