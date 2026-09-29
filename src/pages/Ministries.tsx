import { ministries as defaultMinistries } from "../data/content";
import { store } from "../lib/storage";
import { CTABand, PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Ministries() {
  // Prefer data from Admin. Fall back to original content if none exist yet.
  const stored = store.getMinistries();
  const list = stored.length > 0 ? stored : defaultMinistries;

  return (
    <>
      <PageHero
        eyebrow="Ministries"
        title={
          <>
            Find your place
            <span className="block italic text-gold-light">in the house.</span>
          </>
        }
        subtitle="Every believer has a gift. Every gift has a place. Explore the ministries that keep Katoloni alive and fruitful."
        image="https://images.pexels.com/photos/13908967/pexels-photo-13908967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container">
          <SectionHeading
            eyebrow="Serve with us"
            title={list.length === 1 ? "1 ministry pathway" : `${list.length} ministry pathways`}
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((m, i) => (
              <motion.article
                key={m.id || m.name + i}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.04 }}
                className="card p-7"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Ministry 0{i + 1}
                </span>
                <h3 className="mt-4 font-serif text-2xl">{m.name}</h3>
                <p className="mt-3 text-sm leading-7 text-mist">{m.desc}</p>
              </motion.article>
            ))}
          </div>

          {list.length === 0 && (
            <p className="mt-10 text-mist">No ministries listed yet. Please check back soon.</p>
          )}

          <div className="mt-12">
            <Link to="/contact" className="btn-gold">
              Join a ministry
            </Link>
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}