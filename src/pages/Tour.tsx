import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";
import { church } from "../data/content";

export default function Tour() {
  return (
    <>
      <PageHero
        eyebrow="Church tour"
        title={
          <>
            There is a place
            <span className="block italic text-gold-light">for you here.</span>
          </>
        }
        subtitle="Whether this is your first visit or you are looking for a spiritual home, you will be welcomed with warmth."
        image="https://images.pexels.com/photos/28896493/pexels-photo-28896493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="bg-cream text-ink">
        <div className="grid min-h-[640px] lg:grid-cols-2">
          <motion.div {...reveal} className="min-h-[360px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/36425621/pexels-photo-36425621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=1200')" }} />
          <div className="flex items-center px-6 py-16 sm:px-12 lg:px-16">
            <div className="max-w-xl">
              <SectionHeading light eyebrow="Visit Katoloni" title="Come as you are" />
              <p className="mt-6 text-base leading-8 text-stone-600">
                From the sanctuary to fellowship spaces, prayer rooms and outdoor gathering points — our doors are open. Let us expect you this week.
              </p>
              <div className="mt-8 grid gap-5 border-y border-stone-300 py-7 sm:grid-cols-2">
                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 text-gold-dark" size={20} />
                  <div>
                    <strong className="block text-sm">Sunday Worship</strong>
                    <span className="mt-1 block text-sm text-stone-500">Every Sunday in Katoloni</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 text-gold-dark" size={20} />
                  <div>
                    <strong className="block text-sm">Find the Mountain</strong>
                    <span className="mt-1 block text-sm text-stone-500">{church.location}</span>
                  </div>
                </div>
              </div>
              <Link to="/booking" className="btn-dark mt-8">
                Let us expect you
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
