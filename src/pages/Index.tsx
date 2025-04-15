
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Education from '@/components/Education';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  useEffect(() => {
    // Mark elements for animation on initial load only
    if (!animationsInitialized) {
      const animatedElements = document.querySelectorAll('.animate-on-scroll');
      animatedElements.forEach((el) => el.classList.add('needs-animation'));
      setAnimationsInitialized(true);
    }

    // Initialize animation observer with better threshold and rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add small delay to make animations more sequential
            setTimeout(() => {
              entry.target.classList.add('animated');
              entry.target.classList.remove('needs-animation');
            }, 100);
          }
        });
      },
      { 
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px' // Trigger slightly earlier
      }
    );

    // Observe all elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    // Clean up observer
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [animationsInitialized]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
