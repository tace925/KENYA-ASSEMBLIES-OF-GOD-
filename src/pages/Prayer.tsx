import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { store, uid, type PrayerRequest } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function Prayer() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p: PrayerRequest = {
      id: uid("pr"),
      name: String(fd.get("name") || "Anonymous"),
      phone: String(fd.get("phone") || ""),
      request: String(fd.get("request")),
      private: fd.get("private") === "on",
      createdAt: new Date().toISOString(),
      status: "new",
    };
    store.savePrayer(p);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Prayer center"
        title={
          <>
            Cast your cares
            <span className="block italic text-gold-light">on the Lord.</span>
          </>
        }
        subtitle="Share a prayer request with the pastoral team. Mark it private if it should only be seen by leadership."
        image="https://images.pexels.com/photos/35266419/pexels-photo-35266419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-cream text-ink">
        <div className="container grid gap-12 lg:grid-cols-2">
          <SectionHeading
            light
            eyebrow="We will pray with you"
            title="Your request matters"
            text="Our intercessors and pastoral team stand with you. For urgent needs, call or WhatsApp the church line as well."
          />

          <div className="border border-stone-300 bg-white p-6 sm:p-8">
            {sent ? (
              <div className="text-emerald-800">
                <CheckCircle2 />
                <h3 className="mt-3 font-serif text-3xl">Received</h3>
                <p className="mt-2 text-sm leading-6">Your prayer request has been submitted. The team will stand with you.</p>
                <button type="button" className="btn-dark mt-6" onClick={() => setSent(false)}>Submit another</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="field light">
                  Name
                  <input name="name" className="field-input" placeholder="Optional" />
                </label>
                <label className="field light">
                  Phone
                  <input name="phone" className="field-input" placeholder="Optional" />
                </label>
                <label className="field light">
                  Prayer request *
                  <textarea required name="request" rows={5} className="field-input resize-none" placeholder="How can we pray?" />
                </label>
                <label className="flex items-center gap-3 text-sm normal-case tracking-normal text-stone-600">
                  <input type="checkbox" name="private" className="size-4" /> Keep this request private (pastoral team only)
                </label>
                <button type="submit" className="btn-dark w-full">Submit prayer request</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
