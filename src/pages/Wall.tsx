import { FormEvent, useState } from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { store, uid, type Testimony } from "../lib/storage";
import { PageHero, reveal, SectionHeading } from "../components/ui";

export default function Wall() {
  const [items, setItems] = useState(() => store.getTestimonies());
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "Anonymous");
    const quote = String(fd.get("quote") || "");
    const initials = name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const t: Testimony = {
      id: uid("t"),
      name,
      initials: initials || "KM",
      quote,
      date: new Date().getFullYear().toString(),
    };
    store.saveTestimony(t);
    setItems(store.getTestimonies());
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Katoloni Wall"
        title={
          <>
            Stories of grace,
            <span className="block italic text-gold-light">written together.</span>
          </>
        }
        subtitle="A living record of prayers answered, lives restored and faith strengthened in our community."
        image="https://images.pexels.com/photos/35266419/pexels-photo-35266419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Testimonies" title="What God is doing" />
            <form onSubmit={onSubmit} className="mt-8 space-y-4 border border-white/10 p-6">
              <label className="field">
                Your name
                <input name="name" className="field-input" placeholder="Optional" />
              </label>
              <label className="field">
                Your testimony *
                <textarea required name="quote" rows={4} className="field-input resize-none" placeholder="Share briefly what the Lord has done..." />
              </label>
              <button type="submit" className="btn-gold">Share on the Wall</button>
              {sent && <p className="text-sm text-gold-light">Thank you — your testimony is on the wall.</p>}
            </form>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {items.map((t, i) => (
              <motion.blockquote key={t.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="bg-void p-7">
                <Quote size={22} className="text-gold" />
                <p className="mt-6 font-serif text-xl leading-8 text-cream/90">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-mist">
                  {t.initials} / {t.name} · {t.date}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
