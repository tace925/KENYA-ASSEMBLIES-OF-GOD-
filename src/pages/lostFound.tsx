import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { store, uid, type LostFoundItem, type LostFoundClaim } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function LostFound() {
  const [items, setItems] = useState(() =>
    store.getLostFound().filter((i) => i.status === "open")
  );
  const [claimFor, setClaimFor] = useState<LostFoundItem | null>(null);
  const [sent, setSent] = useState(false);

  const refresh = () => setItems(store.getLostFound().filter((i) => i.status === "open"));

  const onClaim = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!claimFor) return;
    const fd = new FormData(e.currentTarget);
    const claim: LostFoundClaim = {
      id: uid("lfc"),
      itemId: claimFor.id,
      itemTitle: claimFor.title,
      name: String(fd.get("name")),
      phone: String(fd.get("phone")),
      email: String(fd.get("email") || ""),
      whereFrom: String(fd.get("whereFrom")),
      createdAt: new Date().toISOString(),
      status: "new",
    };
    store.saveLostFoundClaim(claim);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <PageHero
        eyebrow="Lost & Found"
        title={
          <>
            Found something?
            <span className="block italic text-gold-light">Claim with care.</span>
          </>
        }
        subtitle="Items reported by the church team. If something is yours, submit a claim and the office will contact you."
        image={
          store.getSettings().heroNotices ||
          "https://images.pexels.com/photos/13963623/pexels-photo-13963623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
        }
      />

      <section className="section bg-cream text-ink">
        <div className="container">
          <SectionHeading light eyebrow="Notice board" title="Items with the church office" />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="overflow-hidden border border-stone-300 bg-white">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-stone-100 text-stone-400">No photo</div>
                )}
                <div className="p-5">
                  <h3 className="font-serif text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-stone-600">{item.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-stone-500">
                    {item.location} · {item.dateFound}
                  </p>
                  <button type="button" className="btn-dark mt-4 w-full" onClick={() => { setClaimFor(item); setSent(false); }}>
                    This is mine — Claim
                  </button>
                </div>
              </article>
            ))}
          </div>

          {items.length === 0 && (
            <p className="mt-10 text-stone-500">No open items right now. Check back soon.</p>
          )}
        </div>
      </section>

      {/* Claim modal */}
      {claimFor && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4" onClick={() => setClaimFor(null)}>
          <div
            className="w-full max-w-md border border-white/10 bg-panel p-6 text-cream"
            onClick={(e) => e.stopPropagation()}
          >
            {sent ? (
              <div>
                <CheckCircle2 className="text-gold" />
                <h3 className="mt-3 font-serif text-2xl">Claim submitted</h3>
                <p className="mt-2 text-sm text-mist">
                  The office will review your details for <strong>{claimFor.title}</strong>.
                </p>
                <button type="button" className="btn-gold mt-5" onClick={() => setClaimFor(null)}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onClaim} className="space-y-4">
                <h3 className="font-serif text-2xl">Claim: {claimFor.title}</h3>
                <label className="field">
                  Full name *
                  <input required name="name" className="field-input" />
                </label>
                <label className="field">
                  Phone *
                  <input required name="phone" className="field-input" />
                </label>
                <label className="field">
                  Email
                  <input type="email" name="email" className="field-input" />
                </label>
                <label className="field">
                  Where are you from? *
                  <input required name="whereFrom" className="field-input" placeholder="Area / fellowship" />
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="btn-gold flex-1">Submit claim</button>
                  <button type="button" className="btn-ghost" onClick={() => setClaimFor(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}