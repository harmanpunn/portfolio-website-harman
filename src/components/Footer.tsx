import { useEffect, useRef } from 'react';
import { ArrowUp, Github, Linkedin, Instagram, Mail } from 'lucide-react';

const socials = [
  { Icon: Github, href: 'https://github.com/harmanpunn', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://linkedin.com/in/harmanpunn', label: 'LinkedIn' },
  { Icon: Instagram, href: 'https://www.instagram.com/harmanpunn/', label: 'Instagram' },
  { Icon: Mail, href: 'mailto:harmanpunn@gmail.com', label: 'Email' },
];

const SECRET_LINE = "you found this. say hi if you're building something too.";

const Footer = () => {
  const footerRef = useRef<HTMLElement | null>(null);

  // Cursor tracking for the secret-line reveal mask
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = footerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    const onLeave = () => {
      el.style.setProperty('--mx', `-200%`);
      el.style.setProperty('--my', `-200%`);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="relative mt-10 border-t border-foreground/10">
      <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
        <p className="text-mono text-[11px] uppercase tracking-[0.18em] text-foreground/45">
          © {new Date().getFullYear()} · Harmanpreet Singh
        </p>

        <div className="flex items-center gap-2">
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={label}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full text-foreground/55 hover:text-foreground hover:bg-foreground/[0.06] transition"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          ))}

          <span className="mx-1 h-4 w-px bg-foreground/10" aria-hidden />

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group inline-flex items-center gap-1.5 text-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground transition px-2 py-1.5"
          >
            Top
            <ArrowUp className="h-3 w-3 transition group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Hidden line — only reveals where the cursor passes over it */}
      <div
        className="secret-stack container mx-auto px-6 pb-8 pt-2"
        style={{ height: '2.6rem' }}
        aria-hidden
      >
        <span className="secret-dim font-display italic text-base md:text-lg">
          {SECRET_LINE}
        </span>
        <span className="secret-bright font-display italic text-base md:text-lg">
          {SECRET_LINE}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
