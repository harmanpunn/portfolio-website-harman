
import { useState, useEffect } from 'react';
import { Menu, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-xl font-serif font-bold">
          <span className="gradient-text">Harmanpreet Singh</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#education" className="nav-link">Education</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a 
            href="/Harmanpreet Singh Resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 rounded-full border border-accent1 text-accent1 font-medium transition-all hover:shadow-sm hover:scale-105 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Resume
          </a>
        </nav>
        
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md py-4 animate-fade-in">
          <nav className="flex flex-col space-y-3 px-6">
            <a href="#home" className="nav-link" onClick={toggleMenu}>Home</a>
            <a href="#about" className="nav-link" onClick={toggleMenu}>About</a>
            <a href="#skills" className="nav-link" onClick={toggleMenu}>Skills</a>
            <a href="#experience" className="nav-link" onClick={toggleMenu}>Experience</a>
            <a href="#education" className="nav-link" onClick={toggleMenu}>Education</a>
            <a href="#projects" className="nav-link" onClick={toggleMenu}>Projects</a>
            <a href="#contact" className="nav-link" onClick={toggleMenu}>Contact</a>
            <a 
              href="/Harmanpreet Singh Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 mt-2 rounded-full border border-accent1 text-accent1 font-medium transition-all hover:shadow-sm gap-2"
              onClick={toggleMenu}
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
