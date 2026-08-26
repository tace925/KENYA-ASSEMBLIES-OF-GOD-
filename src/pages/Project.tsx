import { Link } from "react-router-dom";
import { PageHero, reveal } from "../components/ui";
import { motion } from "framer-motion";
import { church } from "../data/content";

export default function Project() {
  return (
    <>
      <PageHero
        eyebrow="The sanctuary project"
        title={
          <>
            Building a home
            <span className="block italic text-gold-light">for generations.</span>
          </>
        }
        subtitle="We are preparing a lasting place of worship, prayer and service for Katoloni. Every prayer, gift and willing hand helps build the vision."
        image="https://images.pexels.com/photos/34123302/pexels-photo-34123302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
        actions={
          <>
            <Link to="/contact" className="btn-gold">Support the Project</Link>
            <Link to="/notices" className="btn-ghost">View Updates</Link>
          </>
        }
      />

      <section className="section bg-void">
        <div className="container grid gap-8 lg:grid-cols-3">
          {[
            ["01", "Foundation", "Site preparation, structural works and the base that carries the vision."],
            ["02", "Sanctuary", "A worship hall designed for prayer, teaching and multi-generational gatherings."],
            ["03", "Ministry spaces", "Rooms for counselling, children, media, guests and community service."],
          ].map(([n, t, d], i) => (
            <motion.article key={t} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="card p-8">
              <span className="font-serif text-5xl text-gold/40">{n}</span>
              <h3 className="mt-4 font-serif text-3xl">{t}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{d}</p>
            </motion.article>
          ))}
        </div>
        <div className="container mt-12 max-w-3xl">
          <p className="text-lg leading-8 text-mist">
            To give toward the building fund or partner as a ministry, contact the church office or reach the bishop&apos;s desk on{" "}
            <a className="text-gold underline" href={`tel:+254${church.phone.replace(/\s/g, "").slice(-9)}`}>{church.phone}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
