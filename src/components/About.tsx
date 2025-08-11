
import { useEffect, useRef } from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    <section id="about" ref={sectionRef} className="section-padding bg-gradient-to-r from-background to-accent/5 dark:from-background dark:to-accent/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Profile Image with round frame */}
          <div className="animate-on-scroll flex justify-center items-center">
            <div className="rounded-full overflow-hidden border-4 border-accent1/30 dark:border-accent1/40 shadow-lg h-72 w-72 md:h-80 md:w-80">
              <img 
                src="/lovable-uploads/f83a212b-f5e0-4b48-8a12-55e39d05ce12.png" 
                alt="Profile Photo" 
                className="w-full h-full object-cover object-top scale-125" 
              />
            </div>
          </div>
          
          {/* Right side - About Content */}
          <div className="animate-on-scroll">
            <h2 className="text-4xl font-serif font-bold mb-6 gradient-text">About Me</h2>
            <p className="text-foreground/80 mb-4 text-justify">
              I've always enjoyed building things — from scribbling logic in notebooks to shipping code that powers real products. Somewhere along the way, I got curious about the patterns behind the data. That curiosity led me into machine learning, and eventually into designing systems that don't just run, but learn.
            </p>
            <p className="text-foreground/80 mb-4 text-justify">
              These days, I work at the intersection of software engineering and intelligence. I build backend services, train models, and wire them together into thoughtful ML-powered applications. I'm especially into LLMs, cloud-native workflows, and anything that turns raw data into real insights.
            </p>
            <p className="text-foreground/80 mb-8 text-justify">
              I'm currently based in the NYC metro area, working on projects that blend practical engineering with a bit of AI magic. Outside of work, you'll usually find me hacking on side ideas or chasing good light with my camera. If you're curious or want to collaborate, feel free to reach out.
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
                   className="text-foreground/70 hover:text-accent1 dark:hover:text-accent1 transition-colors"
                   aria-label="GitHub Profile">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 dark:hover:text-accent1 transition-colors"
                   aria-label="LinkedIn Profile">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/harmanpunn/" target="_blank" rel="noopener noreferrer" 
                   className="text-foreground/70 hover:text-accent1 dark:hover:text-accent1 transition-colors"
                   aria-label="Instagram Profile">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="mailto:harmanpunn@gmail.com" className="text-foreground/70 hover:text-accent1 dark:hover:text-accent1 transition-colors"
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
