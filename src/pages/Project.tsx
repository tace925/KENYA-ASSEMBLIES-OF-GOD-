import { Link } from "react-router-dom";
import { PageHero, reveal } from "../components/ui";
import { motion } from "framer-motion";
import { church } from "../data/content";
import { store } from "../lib/storage";

export default function Project() {
  const settings = store.getSettings();

  const phases = [
    {
      n: "01",
      title: settings.projectPhase1Title || "Foundation",
      desc: settings.projectPhase1Desc || "Site preparation, structural works and the base that carries the vision.",
    },
    {
      n: "02",
      title: settings.projectPhase2Title || "Sanctuary",
      desc: settings.projectPhase2Desc || "A worship hall designed for prayer, teaching and multi-generational gatherings.",
    },
    {
      n: "03",
      title: settings.projectPhase3Title || "Ministry spaces",
      desc: settings.projectPhase3Desc || "Rooms for counselling, children, media, guests and community service.",
    },
  ];

  // Split title so the last words can stay italic gold if desired
  const titleText = settings.projectTitle || "Building a home for generations.";

  return (
    <>
      <PageHero
        eyebrow="The sanctuary project"
        title={titleText}
        subtitle={
          settings.projectSubtitle ||
          "We are preparing a lasting place of worship, prayer and service for Katoloni. Every prayer, gift and willing hand helps build the vision."
        }
        image={
          settings.heroProject ||
          "https://images.pexels.com/photos/34123302/pexels-photo-34123302.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
        }
        actions={
          <>
            <Link to="/contact" className="btn-gold">
              Support the Project
            </Link>
            <Link to="/notices" className="btn-ghost">
              View Updates
            </Link>
          </>
        }
      />

      <section className="section bg-void">
        <div className="container grid gap-8 lg:grid-cols-3">
          {phases.map((p, i) => (
            <motion.article
              key={p.n}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              className="card p-8"
            >
              <span className="font-serif text-5xl text-gold/40">{p.n}</span>
              <h3 className="mt-4 font-serif text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{p.desc}</p>
            </motion.article>
          ))}
        </div>

        <div className="container mt-12 max-w-3xl">
          <p className="text-lg leading-8 text-mist">
            {settings.projectSupportText ||
              "To give toward the building fund or partner as a ministry, contact the church office or reach the bishop's desk"}{" "}
            on{" "}
            <a
              className="text-gold underline"
              href={`tel:+254${(settings.bishopPhone || church.phone).replace(/\s/g, "").slice(-9)}`}
            >
              {settings.bishopPhone || church.phone}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}