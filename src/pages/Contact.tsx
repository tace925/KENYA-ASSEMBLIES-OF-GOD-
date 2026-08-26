import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { church, faqs } from "../data/content";
import { store, uid, type ContactMessage } from "../lib/storage";
import { PageHero, reveal, SectionHeading } from "../components/ui";
import { motion } from "framer-motion";

export default function Contact() {
  const settings = store.getSettings();
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const msg: ContactMessage = {
      id: uid("c"),
      name: String(fd.get("name")),
      email: String(fd.get("email")),
      phone: String(fd.get("phone")),
      subject: String(fd.get("subject")),
      message: String(fd.get("message")),
      createdAt: new Date().toISOString(),
      read: false,
    };
    store.saveContact(msg);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s walk
            <span className="block italic text-gold-light">together.</span>
          </>
        }
        subtitle="Questions, visits, partnership or pastoral care — send a message and the team will respond."
        image="https://images.pexels.com/photos/13963623/pexels-photo-13963623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Reach us" title="Church office & pastoral desk" />
            <div className="mt-8 space-y-5 text-sm text-mist">
              <p className="flex items-start gap-3"><MapPin className="mt-0.5 text-gold" size={18} /> {church.location}</p>
              <a className="flex items-center gap-3 hover:text-gold" href={`tel:+254${(settings.bishopPhone || church.phone).replace(/\s/g, "").slice(-9)}`}>
                <Phone className="text-gold" size={18} /> {settings.bishopPhone || church.phone}
              </a>
              <a className="flex items-center gap-3 hover:text-gold" href={`mailto:${settings.bishopEmail || church.email}`}>
                <Mail className="text-gold" size={18} /> {settings.bishopEmail || church.email}
              </a>
              <a className="btn-wa mt-4" href={`https://wa.me/${church.whatsapp}`} target="_blank" rel="noreferrer">
                <MessageCircle size={16} /> WhatsApp the church
              </a>
            </div>

            <div className="mt-12">
              <h3 className="font-serif text-3xl">FAQ</h3>
              <div className="mt-5 space-y-3">
                {faqs.map((f, i) => (
                  <button
                    key={f.q}
                    type="button"
                    onClick={() => setOpenFaq(i)}
                    className="w-full border border-white/10 p-4 text-left"
                  >
                    <p className="font-semibold text-cream">{f.q}</p>
                    {openFaq === i && <p className="mt-2 text-sm leading-6 text-mist">{f.a}</p>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.form {...reveal} onSubmit={onSubmit} className="border border-white/10 bg-panel p-6 sm:p-8">
            <h3 className="font-serif text-3xl">Send a message</h3>
            {sent ? (
              <div className="mt-8 text-gold-light">
                <CheckCircle2 />
                <p className="mt-3 text-sm">Message received. We will get back to you soon.</p>
                <button type="button" className="btn-gold mt-5" onClick={() => setSent(false)}>Send another</button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="field">
                  Name *
                  <input required name="name" className="field-input" />
                </label>
                <label className="field">
                  Phone
                  <input name="phone" className="field-input" />
                </label>
                <label className="field sm:col-span-2">
                  Email *
                  <input required type="email" name="email" className="field-input" />
                </label>
                <label className="field sm:col-span-2">
                  Subject
                  <input name="subject" className="field-input" placeholder="Visit, partnership, counselling..." />
                </label>
                <label className="field sm:col-span-2">
                  Message *
                  <textarea required name="message" rows={5} className="field-input resize-none" />
                </label>
                <button type="submit" className="btn-gold sm:col-span-2">Send message</button>
              </div>
            )}
          </motion.form>
        </div>

        <div className="container mt-14">
          <div className="overflow-hidden border border-white/10">
            <iframe
              title="Katoloni map"
              className="h-[360px] w-full grayscale invert-[0.85]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Katoloni%20Machakos&t=&z=14&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </section>
    </>
  );
}
