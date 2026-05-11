import { motion } from 'motion/react';
import { Github, Linkedin, Instagram, Mail, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const socials = [
  { Icon: Github, href: 'https://github.com/harmanpunn', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://linkedin.com/in/harmanpunn', label: 'LinkedIn' },
  { Icon: Instagram, href: 'https://www.instagram.com/harmanpunn/', label: 'Instagram' },
  { Icon: Mail, href: 'mailto:harmanpunn@gmail.com', label: 'Email' },
];

const About = () => {
  return (
    <section id="about" className="section-padding relative">
      <div className="container mx-auto">
        <SectionHeading
          eyebrow="About"
          title={
            <>
              How I got <span className="italic text-foreground/85">here</span>.
            </>
          }
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-5 flex justify-center md:justify-start"
          >
            <div className="rounded-3xl overflow-hidden border border-foreground/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)] h-80 w-80 md:h-96 md:w-96 transition-transform duration-500 ease-out hover:-translate-y-1">
              <img
                src="/lovable-uploads/about-nyc-square.jpg"
                alt="Harmanpreet Singh portrait"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="md:col-span-7 space-y-5 text-foreground/75 text-base md:text-lg leading-relaxed"
          >
            <p>
              I've always enjoyed building things, from scribbling logic in notebooks to
              shipping code that powers real products. Somewhere along the way, I got
              curious about the patterns behind the data. That curiosity led me into
              machine learning, and eventually into designing systems that don't just run,
              but <span className="italic text-foreground">learn</span>.
            </p>
            <p>
              These days, I work at the intersection of software engineering and
              intelligence, building backend services, search systems, and ML pipelines.
              Lately I've been deep into{' '}
              <span className="text-foreground">semantic search</span> and{' '}
              <span className="text-foreground">autonomous agents</span>, and anything
              that turns raw data into real insight.
            </p>
            <p>
              I'm based in the San Francisco Bay Area. Outside of work, you'll usually find me
              hacking on side ideas or chasing good light with my camera. If you're
              curious or want to collaborate, reach out.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium transition hover:bg-foreground/90"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </a>

              <div className="flex items-center gap-2">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    aria-label={label}
                    className="glass-pill h-9 w-9 inline-flex items-center justify-center text-foreground/65 hover:text-foreground transition"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
