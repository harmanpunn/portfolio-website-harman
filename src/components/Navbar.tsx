import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useLocation } from 'react-router-dom';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  // `mounted` gates client-only Motion features (layoutId) so SSR and the first
  // client render produce identical DOM — preventing React hydration mismatch
  // (#418/#423). Motion's layoutId injects extra style/data attributes that
  // aren't in SSR HTML.
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track which section is in view to highlight the corresponding nav link.
  useEffect(() => {
    if (typeof window === 'undefined' || !isHomePage) return;

    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHomePage]);

  const toggleMenu = () => setIsMenuOpen((v) => !v);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto px-4 md:px-6 pt-4 md:pt-5 flex items-center justify-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto glass-pill flex items-center gap-1 px-2 py-2 max-w-[min(100%,920px)] w-full md:w-auto"
        >
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-foreground/[0.06] transition"
            onClick={closeMenu}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background text-mono text-[10px] font-semibold">
              HS
            </span>
            <span className="hidden sm:inline text-foreground/90">Harmanpreet</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-0.5 mx-1">
            {isHomePage ? (
              sections.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`relative px-3 py-1.5 rounded-full text-sm transition ${
                    activeSection === id
                      ? 'text-foreground'
                      : 'text-foreground/65 hover:text-foreground'
                  }`}
                >
                  {activeSection === id && (
                    mounted ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-foreground/[0.08]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : (
                      // Plain span on SSR + first client render — matches DOM
                      // exactly so hydration succeeds. Swaps to motion.span on
                      // mount, animating subsequent navigation.
                      <span className="absolute inset-0 rounded-full bg-foreground/[0.08]" />
                    )
                  )}
                  <span className="relative">{label}</span>
                </a>
              ))
            ) : (
              <Link
                to="/"
                className="px-3 py-1.5 rounded-full text-sm text-foreground/70 hover:text-foreground transition"
              >
                Home
              </Link>
            )}
            <Link
              to="/blog"
              className="px-3 py-1.5 rounded-full text-sm text-foreground/65 hover:text-foreground transition"
            >
              Blog
            </Link>
          </nav>

          {/* Right cluster */}
          <div className="ml-auto md:ml-1 flex items-center gap-1">
            <a
              href="/harmanpreetresume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition"
            >
              Resume
            </a>
            <div className="hidden md:block h-5 w-px bg-foreground/10 mx-1" />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden h-9 w-9 rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pointer-events-auto mx-4 mt-2 glass rounded-2xl p-2"
          >
            <nav className="flex flex-col">
              {isHomePage ? (
                sections.map(({ id, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={closeMenu}
                    className={`px-4 py-2.5 rounded-xl text-sm transition ${
                      activeSection === id
                        ? 'bg-foreground/[0.08] text-foreground'
                        : 'text-foreground/75 hover:bg-foreground/[0.05] hover:text-foreground'
                    }`}
                  >
                    {label}
                  </a>
                ))
              ) : (
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="px-4 py-2.5 rounded-xl text-sm text-foreground/75 hover:bg-foreground/[0.05]"
                >
                  Home
                </Link>
              )}
              <Link
                to="/blog"
                onClick={closeMenu}
                className="px-4 py-2.5 rounded-xl text-sm text-foreground/75 hover:bg-foreground/[0.05]"
              >
                Blog
              </Link>
              <div className="h-px bg-foreground/10 my-1 mx-3" />
              <a
                href="/harmanpreetresume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="mx-1 mt-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium"
              >
                Resume ↗
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Navbar };
export default Navbar;
