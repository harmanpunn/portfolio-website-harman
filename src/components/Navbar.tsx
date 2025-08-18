
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
        <Link to="/" className="text-xl font-serif font-bold">
          <span className="gradient-text">Harmanpreet Singh</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {isHomePage ? (
            <>
              <a href="#home" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#skills" className="nav-link">Skills</a>
              <a href="#experience" className="nav-link">Experience</a>
              <a href="#education" className="nav-link">Education</a>
              <a href="#projects" className="nav-link">Projects</a>
              <a href="#contact" className="nav-link">Contact</a>
            </>
          ) : (
            <Link to="/" className="nav-link">Home</Link>
          )}
          <Link to="/blog" className="nav-link">Blog</Link>
          <a 
            href={`${window.location.origin}/harmanpreetresume.pdf`}
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 rounded-full border border-accent1 text-accent1 font-medium transition-all hover:shadow-sm hover:scale-105"
          >
            Resume
          </a>
          <ThemeToggle />
        </nav>
        
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md py-4 animate-fade-in">
          <nav className="flex flex-col space-y-3 px-6">
            {isHomePage ? (
              <>
                <a href="#home" className="nav-link" onClick={toggleMenu}>Home</a>
                <a href="#about" className="nav-link" onClick={toggleMenu}>About</a>
                <a href="#skills" className="nav-link" onClick={toggleMenu}>Skills</a>
                <a href="#experience" className="nav-link" onClick={toggleMenu}>Experience</a>
                <a href="#education" className="nav-link" onClick={toggleMenu}>Education</a>
                <a href="#projects" className="nav-link" onClick={toggleMenu}>Projects</a>
                <a href="#contact" className="nav-link" onClick={toggleMenu}>Contact</a>
              </>
            ) : (
              <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
            )}
            <Link to="/blog" className="nav-link" onClick={toggleMenu}>Blog</Link>
            <a 
              href={`${window.location.origin}/harmanpreetresume.pdf`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2 mt-2 rounded-full border border-accent1 text-accent1 font-medium transition-all hover:shadow-sm"
              onClick={toggleMenu}
            >
              Resume
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export { Navbar };
export default Navbar;
