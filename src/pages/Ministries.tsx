import { ministries } from "../data/content";
import { CTABand, PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Ministries() {
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
          <SectionHeading eyebrow="Serve with us" title="Nine ministry pathways" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((m, i) => (
              <motion.article key={m.name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.04 }} className="card p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Ministry 0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{m.name}</h3>
                <p className="mt-3 text-sm leading-7 text-mist">{m.desc}</p>
              </motion.article>
            ))}
          </div>
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
