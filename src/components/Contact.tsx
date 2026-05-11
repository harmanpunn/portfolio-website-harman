import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SectionHeading from '@/components/SectionHeading';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      // Defensive parse — local `vite dev` doesn't serve Vercel functions,
      // so the response may be empty / HTML / non-JSON.
      const raw = await response.text();
      let data: { message?: string; error?: string; details?: string } = {};
      if (raw) {
        try { data = JSON.parse(raw); } catch { /* not JSON */ }
      }

      if (response.ok) {
        setIsSubmitted(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
        toast({
          title: 'Message sent.',
          description: data.message || "I'll get back to you soon.",
        });
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        const msg =
          data.details ||
          data.error ||
          (response.status === 404
            ? 'Contact endpoint not available in this environment. Try emailing me directly — link is on the right.'
            : `Server error (${response.status}). Please try again or email directly.`);
        throw new Error(msg);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send',
        description:
          error instanceof Error
            ? error.message
            : 'Please try again later or email me directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendly script (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    head?.appendChild(script);
    return () => {
      if (head?.contains(script)) head.removeChild(script);
    };
  }, []);

  const inputClass =
    'w-full bg-foreground/[0.04] border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/40 outline-none focus:border-accent1/50 focus:bg-foreground/[0.06] transition';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let's <span className="italic text-foreground/85">talk</span>.
            </>
          }
          lede="Book a coffee chat or send a note — whichever's easier."
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-5xl mx-auto">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl p-4 md:p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="eyebrow">Schedule</span>
              <span className="text-mono text-[11px] text-foreground/45">
                15 — 30 min
              </span>
            </div>
            <div
              className="calendly-inline-widget rounded-xl overflow-hidden bg-foreground/[0.03] flex-grow"
              data-url="https://calendly.com/harmanpunn/coffee-chat?hide_event_type_details=1&hide_gdpr_banner=1&background_color=0c0d12&text_color=f8f4ec&primary_color=52c8f8"
              style={{ minWidth: '320px', height: '600px' }}
            />
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-7 flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="eyebrow">Message</span>
              <a
                href="mailto:harmanpunn@gmail.com"
                className="text-mono text-[11px] text-foreground/45 hover:text-foreground/80 transition"
              >
                or email →
              </a>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-12 flex-grow">
                <CheckCircle className="h-10 w-10 text-foreground/80 mb-3" />
                <h4 className="font-display text-xl text-foreground">Sent.</h4>
                <p className="mt-2 text-mono text-xs text-foreground/55 text-center max-w-xs">
                  I'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col flex-grow gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className={inputClass}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className={inputClass}
                  />
                </div>
                <input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                  className={inputClass}
                />
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Message"
                  rows={6}
                  required
                  className={`${inputClass} resize-none flex-grow min-h-[140px]`}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium transition hover:bg-foreground/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
