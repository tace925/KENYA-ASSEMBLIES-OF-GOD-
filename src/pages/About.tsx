import { leadership, values } from "../data/content";
import { CTABand, PageHero, reveal, SectionHeading, Stat } from "../components/ui";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About the house"
        title={
          <>
            Our story is still being
            <span className="block italic text-gold-light">written in prayer.</span>
          </>
        }
        subtitle="Mountain of the Lord Prayer Center, Katoloni exists to host God's presence, disciple believers and serve our community with compassion."
        image="https://images.pexels.com/photos/10373537/pexels-photo-10373537.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Mission & vision"
            title="A mountain where lives are changed"
            text="We envision a praying church that multiplies disciples, strengthens families and shines the light of Christ across Machakos and beyond."
          />
          <motion.div {...reveal} className="grid gap-4">
            <div className="card p-7">
              <h3 className="font-serif text-2xl text-gold">Mission</h3>
              <p className="mt-3 text-sm leading-7 text-mist">
                To lead people into a living relationship with Jesus through prayer, the Word, fellowship and Spirit-empowered service.
              </p>
            </div>
            <div className="card p-7">
              <h3 className="font-serif text-2xl text-gold">Vision</h3>
              <p className="mt-3 text-sm leading-7 text-mist">
                A radiant house of prayer raising mature believers who transform homes, workplaces and communities.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section bg-cream text-ink">
        <div className="container">
          <SectionHeading light eyebrow="Core values" title="What shapes us" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} className="card-cream p-6">
                <span className="font-serif text-4xl text-gold-dark/40">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink">
        <div className="container">
          <SectionHeading eyebrow="Leadership" title="Servants of the house" />
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {leadership.senior.map((p) => (
              <article key={p.initials} className="bg-void p-8">
                <div className="font-serif text-7xl text-gold">{p.initials}</div>
                <h3 className="mt-6 font-serif text-2xl">{p.role}</h3>
                <p className="mt-3 text-sm leading-6 text-mist">{p.focus}</p>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Deacons</h3>
            <div className="mt-4 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-5">
              {leadership.deacons.map((d, i) => (
                <div key={d} className="bg-void px-4 py-6 text-center">
                  <div className="font-serif text-3xl">{d}</div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-mist">Deacon 0{i + 1}</div>
                </div>
              ))}
            </div>
            <div className="mt-px grid gap-px bg-white/10 sm:grid-cols-2">
              {leadership.stewards.map((s) => (
                <div key={s.initials} className="flex items-center justify-between bg-void px-6 py-5">
                  <span className="font-serif text-3xl text-gold">{s.initials}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mist">{s.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-panel py-16">
        <div className="container grid grid-cols-2 gap-8 lg:grid-cols-4">
          <Stat value="5+" label="Years of ministry growth" />
          <Stat value="Weekly" label="Prayer gatherings" />
          <Stat value="Open" label="Doors to every soul" />
          <Stat value="One" label="Gospel · One family" />
        </div>
      </section>

      <CTABand />
    </>
  );
}
