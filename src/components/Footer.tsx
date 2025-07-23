
import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-secondary/50 dark:bg-secondary/20 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="rounded-full hover:scale-110 transition-transform"
          >
            <ChevronUp className="h-5 w-5" />
          </Button>
          
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Harmanpreet Singh. All rights reserved.
          </p>
          
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
