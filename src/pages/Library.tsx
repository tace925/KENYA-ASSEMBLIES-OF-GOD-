import { FormEvent, useState } from "react";
import { BookOpen, CheckCircle2, Copy, Search } from "lucide-react";
import { libraryCode, store, uid, type LibraryRequest } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function Library() {
  const books = store.getLibraryBooks();
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState<LibraryRequest | null>(null);
  const [showCode, setShowCode] = useState(true);
  const [selected, setSelected] = useState(books[0]?.title || "");
  const [copied, setCopied] = useState(false);
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<LibraryRequest[] | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const req: LibraryRequest = {
      id: uid("lib"),
      code: libraryCode(),
      name: String(fd.get("name")),
      phone: String(fd.get("phone")),
      bookTitle: String(fd.get("book") || selected),
      pickupDate: String(fd.get("pickup")),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    store.saveLibrary(req);
    setDone(req);
    setSent(true);
    setShowCode(true);
    e.currentTarget.reset();
  };

  const copyCode = () => {
    if (done) {
      navigator.clipboard.writeText(done.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const onLookup = (e: FormEvent) => {
    e.preventDefault();
    setFound(store.findLibrary(lookup));
  };

  return (
    <>
      <PageHero
        eyebrow="Church library"
        title={
          <>
            Grow deeper
            <span className="block italic text-gold-light">in the Word.</span>
          </>
        }
        subtitle="Guides, devotionals and teaching resources — request a copy and pick up from the church office."
        image="https://images.pexels.com/photos/10373537/pexels-photo-10373537.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-void">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Catalogue" title="Available resources" />
            <div className="mt-10 border-t border-white/10">
              {books.length === 0 && (
                <p className="py-10 text-mist">No books in the catalogue yet. Admin can add them.</p>
              )}
              {books.map((b, i) => (
                <article
                  key={b.id}
                  className="grid gap-3 border-b border-white/10 py-6 sm:grid-cols-[60px_1fr_auto] sm:items-center"
                >
                  <span className="font-serif text-2xl text-mist">0{i + 1}</span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{b.category}</span>
                    <h3 className="mt-1 font-serif text-2xl">{b.title}</h3>
                    <p className="mt-1 text-sm text-mist">
                      {b.author} {b.note && `· ${b.note}`}
                    </p>
                    {b.policy && <p className="mt-1 text-xs text-mist/70">Policy: {b.policy}</p>}
                  </div>
                  <button type="button" className="btn-line" onClick={() => setSelected(b.title)}>
                    <BookOpen size={14} /> Request
                  </button>
                </article>
              ))}
            </div>

            {/* Status checker */}
            <div className="mt-12 border border-white/10 bg-panel p-6">
              <h3 className="font-serif text-2xl">Check my request</h3>
              <form onSubmit={onLookup} className="mt-4 flex gap-2">
                <input
                  value={lookup}
                  onChange={(e) => setLookup(e.target.value)}
                  className="field-input"
                  placeholder="Request code or phone"
                />
                <button type="submit" className="btn-gold shrink-0">
                  <Search size={16} />
                </button>
              </form>
              {found && (
                <div className="mt-4 space-y-3">
                  {found.length === 0 && <p className="text-sm text-mist">No request found.</p>}
                  {found.map((r) => (
                    <div key={r.id} className="border border-white/10 p-4 text-sm">
                      <p className="font-bold">
                        {r.code} · <span className="uppercase text-gold">{r.status}</span>
                      </p>
                      <p className="mt-1">{r.bookTitle}</p>
                      <p className="text-mist">{r.name} · {r.phone}</p>
                      {r.pickupDate && <p className="text-mist">Pickup: {r.pickupDate}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border border-white/10 bg-panel p-6 sm:p-8 h-fit">
            <h3 className="font-serif text-3xl">Pickup request</h3>
            <p className="mt-2 text-sm text-mist">
              Selected: <span className="text-gold">{selected || "None"}</span>
            </p>

            {sent && done ? (
              <div className="mt-8 text-gold-light">
                <CheckCircle2 />
                <p className="mt-3 text-sm leading-6">Request received.</p>

                {showCode && (
                  <div className="mt-5 rounded border border-gold/30 bg-void p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-mist">Your Request Code</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <span className="font-serif text-2xl font-bold tracking-wider text-cream">{done.code}</span>
                      <button type="button" onClick={copyCode} className="btn-line !min-h-10 !px-4">
                        <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-mist">
                      Copy and save this code. You will use it to check the status of your request.
                    </p>
                    <button
                      type="button"
                      className="mt-4 text-xs font-semibold uppercase tracking-wider text-mist underline"
                      onClick={() => setShowCode(false)}
                    >
                      I have copied the code — hide it
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  className="btn-gold mt-5"
                  onClick={() => {
                    setSent(false);
                    setDone(null);
                  }}
                >
                  New request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <label className="field">
                  Full name *
                  <input required name="name" className="field-input" />
                </label>
                <label className="field">
                  Phone *
                  <input required name="phone" className="field-input" />
                </label>
                <label className="field">
                  Resource
                  <select
                    name="book"
                    className="field-input"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.title}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  Preferred pickup date
                  <input name="pickup" type="date" className="field-input" />
                </label>
                <button type="submit" className="btn-gold w-full" disabled={books.length === 0}>
                  Submit request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}