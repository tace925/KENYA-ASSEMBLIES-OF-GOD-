import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock3, MapPin, Play } from "lucide-react";
import { church, galleryImages, leadership, schedule } from "../data/content";
import { store } from "../lib/storage";
import { CTABand, reveal, SectionHeading, Stat } from "../components/ui";

export default function Home() {
  const settings = store.getSettings();
  const notices = store.getNotices().slice(0, 3);
  const sermon = schedule[0];

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          style={{ backgroundImage: `url('${settings.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-void/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40" />

        <div className="container relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-28">
          <motion.span {...reveal} className="eyebrow">
            {church.tagline}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-5 max-w-4xl font-serif text-[clamp(3.2rem,8vw,6.8rem)] leading-[0.92] tracking-[-0.03em]"
          >
            Mountain of
            <span className="block text-gold-light">the Lord</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-xl text-lg leading-8 text-cream/70"
          >
            Welcome to {church.name}, Katoloni — a place to encounter God, grow in faith and find family in Christ.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link to="/booking" className="btn-gold">
              Plan Your Visit <ArrowRight size={15} />
            </Link>
            <Link to="/about" className="btn-ghost">
              Who We Are
            </Link>
            <Link to="/services" className="btn-ghost">
              Service Times
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-ink py-14">
        <div className="container grid grid-cols-2 gap-8 lg:grid-cols-4">
          <Stat value="1" label="House of Prayer" />
          <Stat value="9+" label="Active Ministries" />
          <Stat value="4" label="Home Cells" />
          <Stat value="Fri" label="Night of Prayer" />
        </div>
      </section>

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Who we are"
            title={
              <>
                Built for people who
                <span className="block italic text-gold-light">seek the Lord.</span>
              </>
            }
            text="We are a prayer-centered church in Katoloni — rooted in Scripture, warm in welcome, and serious about discipleship, family and community transformation."
          />
          <motion.div {...reveal} className="grid gap-4 sm:grid-cols-3">
            {leadership.senior.map((p) => (
              <div key={p.initials} className="card p-6">
                <div className="font-serif text-5xl text-gold">{p.initials}</div>
                <h3 className="mt-4 font-serif text-xl">{p.role}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{p.focus}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="section bg-cream text-ink">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              light
              eyebrow="Ministries preview"
              title="A place for every generation"
              text="From children and youth to worship, outreach and intercession — find your place to grow and serve."
            />
            <Link to="/ministries" className="btn-dark">
              All Ministries <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {["Worship & Creative", "Youth & Teens", "Intercessory Prayer"].map((name, i) => (
              <motion.div key={name} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }} className="card-cream p-7">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Active ministry life with room for volunteers, gifts and new believers.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Service times" title="Come worship with us" />
            <div className="mt-8 space-y-4">
              <div className="flex gap-3 text-sm text-mist">
                <CalendarDays className="text-gold" size={18} /> Sundays · Tuesday Bible Study · Friday Prayer
              </div>
              <div className="flex gap-3 text-sm text-mist">
                <MapPin className="text-gold" size={18} /> {church.location}
              </div>
              <div className="flex gap-3 text-sm text-mist">
                <Clock3 className="text-gold" size={18} /> Main gathering from {sermon.time}
              </div>
              <Link to="/services" className="btn-line mt-4">
                Full Weekly Schedule
              </Link>
            </div>
          </div>
          <motion.div {...reveal} className="overflow-x-auto border border-white/10">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Gathering</th>
                </tr>
              </thead>
              <tbody>
                {schedule.slice(0, 5).map((row) => (
                  <tr key={`${row.day}-${row.item}`}>
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                    <td>{row.item}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      <section className="section bg-void">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div {...reveal} className="relative aspect-video overflow-hidden border border-white/10">
            <img
              src="https://images.pexels.com/photos/36425621/pexels-photo-36425621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400"
              alt="Latest message"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link to="/confessions" className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-black/40 text-cream backdrop-blur">
                <Play size={22} fill="currentColor" />
              </Link>
            </div>
          </motion.div>
          <div>
            <SectionHeading
              eyebrow="Latest word"
              title="Messages that steady the soul"
              text="Catch recent confessions and teachings from the mountain. Full archive available anytime."
            />
            <Link to="/confessions" className="btn-gold mt-8">
              Watch Confessions
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-panel">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Notice board" title="Life on the mountain" />
            <Link to="/notices" className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
              All notices →
            </Link>
          </div>
          <div className="mt-10 border-t border-white/10">
            {notices.map((n) => (
              <article key={n.id} className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[140px_1fr]">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{n.category}</span>
                <div>
                  <h3 className="font-serif text-2xl">{n.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{n.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream text-ink">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading light eyebrow="Gallery" title="Glimpses of grace" />
            <Link to="/gallery" className="btn-dark">
              Open Gallery
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryImages.slice(0, 4).map((img) => (
              <div key={img.src} className="aspect-[4/3] overflow-hidden">
                <img src={img.src} alt={img.caption} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
