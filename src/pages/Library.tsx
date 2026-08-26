import { FormEvent, useState } from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { libraryBooks } from "../data/content";
import { store, uid, type LibraryRequest } from "../lib/storage";
import { PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";

export default function Library() {
  const [sent, setSent] = useState(false);
  const [selected, setSelected] = useState(libraryBooks[0].title);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const req: LibraryRequest = {
      id: uid("lib"),
      name: String(fd.get("name")),
      phone: String(fd.get("phone")),
      bookTitle: String(fd.get("book") || selected),
      pickupDate: String(fd.get("pickup")),
      createdAt: new Date().toISOString(),
      status: "requested",
    };
    store.saveLibrary(req);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Church library"
        title={
          <>
            Grow deeper
            <span className="block italic text-gold-light">in the Word.</span>
          </>
        }
        subtitle="Guides, devotionals and teaching resources — request a copy and pick up from the church office."
        image="https://images.pexels.com/photos/10373537/pexels-photo-10373537.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Catalogue" title="Available resources" />
            <div className="mt-10 border-t border-white/10">
              {libraryBooks.map((b, i) => (
                <motion.article key={b.title} {...reveal} className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[60px_1fr_auto] sm:items-center">
                  <span className="font-serif text-2xl text-mist">0{i + 1}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{b.type}</span>
                    <h3 className="mt-1 font-serif text-2xl">{b.title}</h3>
                    <p className="mt-1 text-sm text-mist">{b.meta}</p>
                  </div>
                  <button type="button" className="btn-line" onClick={() => setSelected(b.title)}>
                    <BookOpen size={14} /> Request
                  </button>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-panel p-6 sm:p-8 h-fit">
            <h3 className="font-serif text-3xl">Pickup request</h3>
            <p className="mt-2 text-sm text-mist">Selected: <span className="text-gold">{selected}</span></p>
            {sent ? (
              <div className="mt-8 text-gold-light">
                <CheckCircle2 />
                <p className="mt-3 text-sm leading-6">Request received. We will confirm when your resource is ready for pickup.</p>
                <button type="button" className="btn-gold mt-5" onClick={() => setSent(false)}>New request</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="field">
                  Full name *
                  <input required name="name" className="field-input" />
                </label>
                <label className="field">
                  Phone *
                  <input required name="phone" className="field-input" />
                </label>
                <label className="field">
                  Resource
                  <select name="book" className="field-input" value={selected} onChange={(e) => setSelected(e.target.value)}>
                    {libraryBooks.map((b) => (
                      <option key={b.title} value={b.title}>{b.title}</option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Preferred pickup date
                  <input name="pickup" type="date" className="field-input" />
                </label>
                <button type="submit" className="btn-gold w-full">Submit request</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
