
import { useState, useEffect } from 'react';
import { ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const roles = ['Software Engineer', 'Data Scientist'];
  
  // Ensure this only runs on client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const currentRole = roles[currentIndex];
    const shouldDelete = isDeleting;
    
    const timeout = setTimeout(() => {
      if (!shouldDelete) {
        // Typing
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, shouldDelete ? 50 : 100); // Faster deletion than typing
    
    return () => clearTimeout(timeout);
  }, [displayedText, currentIndex, isDeleting, roles, isClient]);
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent1/5 to-accent2/10 dark:from-accent1/10 dark:to-accent2/20 -z-10"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <p className="text-accent1 dark:text-accent1 font-medium mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            Hello, I'm
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            Harmanpreet Singh
          </h1>
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            <span className="gradient-text font-medium">
              {isClient ? displayedText : 'Software Engineer'}
              {isClient && <span className="animate-pulse">|</span>}
            </span>
            <span> - Specialized in Machine Learning & AI</span>
          </h2>
          <p className="text-foreground/80 max-w-xl mb-10 animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
            I am a passionate engineer with expertise in software development, machine learning, LLMs, and cloud technologies.
            Dedicated to delivering exceptional results through innovation, data-driven insights, and creative problem-solving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{ animationDelay: '1s' }}>
            <Button asChild className="bg-gradient-to-r from-accent1 to-accent2 hover:opacity-90 transition-opacity text-white">
              <a href="#projects">View My Work</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#contact">Contact Me</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-foreground/60 hover:text-accent1 transition-colors">
          <ArrowDownCircle className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
