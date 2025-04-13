
import { ArrowUp, Github, Linkedin, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <a href="#" className="text-xl font-serif font-bold">
              <span className="gradient-text">Harmanpreet Singh</span>
            </a>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <nav className="flex space-x-4">
              <a href="#home" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Home</a>
              <a href="#about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">About</a>
              <a href="#projects" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Projects</a>
              <a href="#contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">Contact</a>
            </nav>
            
            <button 
              onClick={scrollToTop}
              className="inline-flex items-center justify-center p-2 bg-primary-foreground/10 rounded-full text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-primary-foreground/70 text-sm mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Harmanpreet Singh. All rights reserved.
          </p>
          
          <div className="flex space-x-4 items-center">
            <a href="https://github.com/harmanpunn" target="_blank" rel="noopener noreferrer" 
               className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
               aria-label="GitHub Profile">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" 
               className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
               aria-label="LinkedIn Profile">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/harmanpunn/" target="_blank" rel="noopener noreferrer" 
               className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
               aria-label="Instagram Profile">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="mailto:harmanpunn@gmail.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
               aria-label="Email Me">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
