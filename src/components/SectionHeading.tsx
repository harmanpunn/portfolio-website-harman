import { motion } from 'motion/react';

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
};

const SectionHeading = ({
  eyebrow,
  title,
  lede,
  align = 'center',
  className = '',
}: Props) => {
  const alignClass = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-3xl ${alignClass} ${className}`}
    >
      <p
        className={`eyebrow inline-flex items-center gap-3 mb-5 ${
          align === 'center' ? '' : ''
        }`}
      >
        <span className="inline-block h-px w-8 bg-foreground/40" />
        {eyebrow}
        {align === 'center' && (
          <span className="inline-block h-px w-8 bg-foreground/40" />
        )}
      </p>
      <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-tightest text-foreground">
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-5 text-base md:text-lg text-foreground/65 leading-relaxed ${
            align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {lede}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
