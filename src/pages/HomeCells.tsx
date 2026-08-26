import { Link } from "react-router-dom";
import { homeCells } from "../data/content";
import { CTABand, PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";

export default function HomeCells() {
  return (
    <>
      <PageHero
        eyebrow="Home cells"
        title={
          <>
            Fellowship close
            <span className="block italic text-gold-light">to home.</span>
          </>
        }
        subtitle="Small groups across Katoloni where believers pray, study Scripture and care for one another."
        image="https://images.pexels.com/photos/13908967/pexels-photo-13908967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container">
          <SectionHeading eyebrow="Find a cell" title="Gatherings near you" />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {homeCells.map((cell, i) => (
              <motion.article key={cell.area} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Cell 0{i + 1}</span>
                <h3 className="mt-3 font-serif text-3xl">{cell.area}</h3>
                <p className="mt-3 text-sm text-gold-light">{cell.day}</p>
                <p className="mt-4 text-sm leading-6 text-mist">Leader: {cell.leader}</p>
                <p className="mt-1 text-sm text-mist">Focus: {cell.focus}</p>
              </motion.article>
            ))}
          </div>
          <Link to="/contact" className="btn-gold mt-10 inline-flex">
            Join a home cell
          </Link>
        </div>
      </section>

      <CTABand />
    </>
  );
}
