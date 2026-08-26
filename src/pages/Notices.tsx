import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { store } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function Notices() {
  const notices = store.getNotices();
  const [filter, setFilter] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(notices.map((n) => n.category)))],
    [notices],
  );
  const filtered = filter === "All" ? notices : notices.filter((n) => n.category === filter);

  return (
    <>
      <PageHero
        eyebrow="Notice board"
        title={
          <>
            Life on the
            <span className="block italic text-gold-light">mountain.</span>
          </>
        }
        subtitle="Services, prayer nights, project updates and community announcements — all in one place."
        image="https://images.pexels.com/photos/13963623/pexels-photo-13963623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-cream text-ink">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading light eyebrow="Updates" title="What the house is saying" />
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} type="button" className={`chip light ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12 border-t border-stone-300">
            <AnimatePresence mode="popLayout">
              {filtered.map((n, i) => (
                <motion.article
                  layout
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid gap-3 border-b border-stone-300 py-7 sm:grid-cols-[140px_120px_1fr]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark">{n.category}</span>
                  <span className="text-sm text-stone-500">{n.date}</span>
                  <div>
                    <h3 className="font-serif text-2xl">{n.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-600">{n.body}</p>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && <p className="py-10 text-stone-500">No notices in this category yet.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
