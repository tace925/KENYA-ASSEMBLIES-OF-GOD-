import { Link } from "react-router-dom";
import { homeCells, schedule } from "../data/content";
import { CTABand, PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Services & schedule"
        title={
          <>
            When the house
            <span className="block italic text-gold-light">gathers.</span>
          </>
        }
        subtitle="Sunday worship, midweek discipleship, home cells and nights of prayer — there is room for you in the rhythm of this house."
        image="https://images.pexels.com/photos/36425622/pexels-photo-36425622.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
        actions={<Link to="/booking" className="btn-gold">Plan a Visit</Link>}
      />

      <section className="section bg-cream text-ink">
        <div className="container">
          <SectionHeading light eyebrow="Weekly timetable" title="Service times at a glance" />
          <motion.div {...reveal} className="mt-10 overflow-x-auto border border-stone-200 bg-white">
            <table className="data-table light">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Program</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={`${row.day}-${row.time}-${row.item}`}>
                    <td className="font-semibold">{row.day}</td>
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
        <div className="container grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Special programs"
            title="More than a Sunday stop"
            text="Throughout the year we host prayer summits, leadership trainings, marriage forums, youth camps and community outreach days."
          />
          <div className="grid gap-4">
            {["Prayer Summits", "Leadership Training", "Family & Marriage Forums", "Youth Camps", "Community Outreach"].map((item, i) => (
              <motion.div key={item} {...reveal} transition={{ ...reveal.transition, delay: i * 0.04 }} className="card flex items-center justify-between px-5 py-4">
                <span className="font-serif text-xl">{item}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Seasonal</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink">
        <div className="container">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Home cells" title="Church that fits around a table" />
            <Link to="/home-cells" className="btn-line">
              View all cells
            </Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {homeCells.map((cell) => (
              <article key={cell.area} className="card p-6">
                <h3 className="font-serif text-2xl">{cell.area}</h3>
                <p className="mt-2 text-sm text-gold">{cell.day}</p>
                <p className="mt-3 text-sm leading-6 text-mist">Leader: {cell.leader}</p>
                <p className="mt-1 text-sm text-mist">Focus: {cell.focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
