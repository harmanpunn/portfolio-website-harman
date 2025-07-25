import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-accent1/5 to-accent2/10 dark:from-accent1/10 dark:to-accent2/20 -z-10"></div>
        
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <div className="text-8xl md:text-9xl font-serif font-bold mb-6">
              <span className="gradient-text">404</span>
            </div>
          </div>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            <h1 className="text-2xl md:text-3xl font-serif font-semibold mb-4 text-foreground">
              Page Not Found
            </h1>
          </div>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}>
            <p className="text-muted-foreground mb-8 text-lg">
              Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="bg-gradient-to-r from-accent1 to-accent2 hover:opacity-90 transition-opacity text-white">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/blog">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Blog
                </Link>
              </Button>
              
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
          
          <div className="animate-fade-in opacity-0 mt-12" style={{ animationDelay: '1s' }}>
            <p className="text-sm text-muted-foreground">
              Looking for something specific? Try visiting the{" "}
              <Link to="/" className="text-accent1 hover:text-accent2 underline transition-colors">
                homepage
              </Link>{" "}
              or check out my{" "}
              <Link to="/blog" className="text-accent1 hover:text-accent2 underline transition-colors">
                latest blog posts
              </Link>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
