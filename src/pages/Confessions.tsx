import { Play } from "lucide-react";
import { confessions } from "../data/content";
import { PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";

export default function Confessions() {
  return (
    <>
      <PageHero
        eyebrow="Weekly confessions"
        title={
          <>
            Archive of the
            <span className="block italic text-gold-light">spoken Word.</span>
          </>
        }
        subtitle="Manually curated weekly messages from the mountain. Add new entries from the admin portal as needed."
        image="https://images.pexels.com/photos/36425621/pexels-photo-36425621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-ink">
        <div className="container">
          <SectionHeading eyebrow="Watch" title="Recent confessions" />
          <div className="mt-12 grid gap-4">
            {confessions.map((c, i) => (
              <motion.article key={c.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{c.week}</p>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl">{c.title}</h3>
                  <p className="mt-2 text-sm text-mist">{c.speaker} · {c.duration}</p>
                </div>
                <button type="button" className="btn-line">
                  <Play size={14} fill="currentColor" /> Play message
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
