
import { useEffect, useRef, useState } from 'react';
import { 
  Send, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
      });
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
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
    <section id="contact" ref={sectionRef} className="section-padding bg-muted/50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl font-serif font-bold mb-4">Get In Touch</h2>
          <p className="text-foreground/70">
            Have a question or want to work together? Feel free to reach out. I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="animate-on-scroll">
            <h3 className="text-xl font-medium mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-background rounded-full p-3 shadow-sm mr-4">
                  <MapPin className="h-6 w-6 text-accent1" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Location</h4>
                  <p className="text-foreground/70">City, Country</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-background rounded-full p-3 shadow-sm mr-4">
                  <Mail className="h-6 w-6 text-accent1" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Email</h4>
                  <p className="text-foreground/70">your.email@example.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-background rounded-full p-3 shadow-sm mr-4">
                  <Phone className="h-6 w-6 text-accent1" />
                </div>
                <div>
                  <h4 className="text-base font-medium mb-1">Phone</h4>
                  <p className="text-foreground/70">+1 (123) 456-7890</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <h3 className="text-xl font-medium mb-4">Follow Me</h3>
              <div className="flex space-x-4">
                <a href="https://linkedin.com/in/harmanpunn" target="_blank" rel="noopener noreferrer" className="bg-background rounded-full p-3 shadow-sm text-foreground/70 hover:text-accent1 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="https://github.com/harmanpunn" target="_blank" rel="noopener noreferrer" className="bg-background rounded-full p-3 shadow-sm text-foreground/70 hover:text-accent1 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.instagram.com/harmanpunn/" target="_blank" rel="noopener noreferrer" className="bg-background rounded-full p-3 shadow-sm text-foreground/70 hover:text-accent1 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="mailto:harmanpunn@gmail.com" className="bg-background rounded-full p-3 shadow-sm text-foreground/70 hover:text-accent1 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="animate-on-scroll">
            <div className="bg-background rounded-lg shadow-sm p-8 border border-border">
              <h3 className="text-xl font-medium mb-6">Send Me a Message</h3>
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
                  <p className="text-foreground/70 text-center">
                    Thank you for reaching out. I'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name
                      </label>
                      <Input 
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-1">
                        Subject
                      </label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        placeholder="Subject of your message"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <Textarea 
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        placeholder="Your message"
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-accent1 to-accent2 hover:opacity-90 transition-opacity"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
