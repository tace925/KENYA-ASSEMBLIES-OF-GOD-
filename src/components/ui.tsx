import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image: string;
  actions?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" style={{ backgroundImage: `url('${image}')` }} />
      <div className="page-hero-shade" />
      <div className="container relative z-10">
        <motion.div {...reveal}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-2xl text-base leading-7 text-cream/70 sm:text-lg">{subtitle}</p>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  light?: boolean;
}) {
  return (
    <motion.div {...reveal} className="max-w-3xl">
      <span className={`eyebrow ${light ? "dark" : ""}`}>{eyebrow}</span>
      <h2 className={`mt-4 font-serif text-3xl leading-[1.05] sm:text-5xl ${light ? "text-ink" : "text-cream"}`}>
        {title}
      </h2>
      {text && <p className={`mt-4 text-base leading-7 ${light ? "text-stone-600" : "text-mist"}`}>{text}</p>}
    </motion.div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-white/15 px-5 py-10 text-center text-sm text-mist">
      {text}
    </div>
  );
}

export function CTABand() {
  return (
    <section className="relative overflow-hidden bg-gold py-16 text-void sm:py-20">
      <div className="container relative z-10 grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
        <div>
          <h2 className="font-serif text-4xl leading-none sm:text-6xl">Ready to make the mountain home?</h2>
          <p className="mt-4 max-w-xl text-base font-medium text-void/75">
            Plan a visit, book a room, send a prayer request — we will walk with you.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/booking" className="btn-dark">Book a Room</Link>
          <Link to="/contact" className="btn-ghost !border-void/30 !text-void hover:!border-void hover:!bg-void hover:!text-cream">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="font-serif text-4xl text-gold sm:text-5xl">{value}</div>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mist">{label}</p>
    </div>
  );
}
