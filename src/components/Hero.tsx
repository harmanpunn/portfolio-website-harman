import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

// --- Constellation: Big Dipper / Saptarishi --------------------------------
// Positions derived from real sky coords (RA/Dec). Bowl is a trapezoid that
// opens upward because Dubhe (top-right corner) sits noticeably higher than
// the rest. Handle curves down-and-away from Megrez through Alioth → Mizar → Alkaid.
// Dot radii reflect real magnitudes (Dubhe brightest at r=2.9).
const DIPPER_STARS = [
  { x: 90, y: 500, r: 2.4 },   // 0 — Alkaid (tail tip, lower-left)
  { x: 155, y: 470, r: 2.2 },  // 1 — Mizar
  { x: 225, y: 450, r: 2.6 },  // 2 — Alioth
  { x: 305, y: 430, r: 2.3 },  // 3 — Megrez (bowl top-left, dimmest of 7)
  { x: 335, y: 475, r: 2.5 },  // 4 — Phecda (bowl bottom-left)
  { x: 470, y: 465, r: 2.6 },  // 5 — Merak (bowl bottom-right)
  { x: 490, y: 390, r: 2.9 },  // 6 — Dubhe (bowl top-right, brightest)
];

const DIPPER_LINES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3],          // handle
  [3, 6], [6, 5], [5, 4], [4, 3],  // bowl: Megrez → Dubhe → Merak → Phecda → close
];

// Deterministic noise stars (fixed seed → same render on server + client for SSG).
const NOISE_STARS: Array<{ x: number; y: number; r: number }> = (() => {
  const stars: Array<{ x: number; y: number; r: number }> = [];
  let seed = 11;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inCentral = (x: number, y: number) => x > 280 && x < 920 && y > 130 && y < 380;
  const inDipper = (x: number, y: number) => x > 50 && x < 540 && y > 370 && y < 530;
  for (let i = 0; i < 110; i++) {
    const x = rng() * 1200;
    const y = rng() * 540;
    if (inCentral(x, y) && rng() < 0.85) continue;
    if (inDipper(x, y) && rng() < 0.85) continue;
    stars.push({ x, y, r: 0.5 + rng() * 1.2 });
  }
  return stars;
})();

const ConstellationLayer = ({ className }: { className: string }) => (
  <g className={className}>
    {NOISE_STARS.map((s, i) => (
      <circle key={`n${i}`} cx={s.x} cy={s.y} r={s.r} />
    ))}
    {DIPPER_STARS.map((s, i) => (
      <circle key={`d${i}`} cx={s.x} cy={s.y} r={s.r} />
    ))}
    {DIPPER_LINES.map(([a, b], i) => {
      const sa = DIPPER_STARS[a];
      const sb = DIPPER_STARS[b];
      return <line key={`l${i}`} x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y} />;
    })}
  </g>
);

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Cursor-aware spotlight: write mouse position to CSS vars on the section.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = sectionRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden spotlight"
    >
      <div className="aurora" aria-hidden />
      <div className="grain" aria-hidden />

      {/* Hidden constellation — Big Dipper, revealed by cursor sweep */}
      <svg
        className="constellation"
        viewBox="0 0 1200 540"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <ConstellationLayer className="c-dim" />
        <ConstellationLayer className="c-bright" />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto text-center"
        >
          <motion.p variants={item} className="eyebrow mb-6 inline-flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-foreground/40" />
            Portfolio · 2026
            <span className="inline-block h-px w-8 bg-foreground/40" />
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.95] tracking-tightest text-foreground"
          >
            Harmanpreet
            <br />
            <span className="italic text-foreground/90">Singh</span>
            <span className="text-accent1">.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-10 text-lg md:text-xl text-foreground/75 leading-relaxed mx-auto max-w-2xl"
          >
            Data Scientist <span className="text-foreground/40">&amp;</span> AI Engineer.
            <span className="block mt-1 text-foreground/55 text-base md:text-lg">
              San Francisco Bay Area · currently at INVIDI.
            </span>
          </motion.p>

          <motion.div variants={item} className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium transition hover:bg-foreground/90"
            >
              View selected work
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </a>
            <a
              href="#contact"
              className="glass-pill inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-foreground/90 hover:text-foreground transition"
            >
              Get in touch
            </a>
            <a
              href="/harmanpreetresume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mono text-xs uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground/90 ml-2 transition"
            >
              Resume ↗
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 group"
      >
        <span className="text-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50 group-hover:text-foreground/80 transition">
          Scroll
        </span>
        <span className="relative block w-px h-12 overflow-hidden">
          <span className="absolute inset-x-0 top-0 w-px h-1/2 bg-gradient-to-b from-foreground/60 to-transparent animate-[scrollcue_2s_ease-in-out_infinite]" />
        </span>
      </motion.a>

      <style>{`
        @keyframes scrollcue {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
