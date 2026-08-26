import { FormEvent, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareWarning,
  Settings,
  Users,
} from "lucide-react";
import {
  store,
  uid,
  type Booking,
  type Notice,
  type SiteSettings,
} from "../lib/storage";

type Tab =
  | "overview"
  | "bookings"
  | "notices"
  | "messages"
  | "prayers"
  | "library"
  | "complaints"
  | "settings";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "notices", label: "Notices", icon: Bell },
  { id: "messages", label: "Messages", icon: Mail },
  { id: "prayers", label: "Prayer requests", icon: Users },
  { id: "library", label: "Library", icon: BookOpen },
  { id: "complaints", label: "Complaints", icon: MessageSquareWarning },
  { id: "settings", label: "Settings", icon: Settings },
];

function statusBadge(status: string) {
  if (status === "confirmed" || status === "ready" || status === "answered" || status === "resolved" || status === "collected")
    return "badge badge-green";
  if (status === "cancelled" || status === "open") return "badge badge-red";
  if (status === "praying") return "badge badge-blue";
  return "badge badge-gold";
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => store.isAdmin());
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const bookings = useMemo(() => store.getBookings(), [tick]);
  const notices = useMemo(() => store.getNotices(), [tick]);
  const messages = useMemo(() => store.getContacts(), [tick]);
  const prayers = useMemo(() => store.getPrayers(), [tick]);
  const library = useMemo(() => store.getLibrary(), [tick]);
  const complaints = useMemo(() => store.getComplaints(), [tick]);
  const settings = useMemo(() => store.getSettings(), [tick]);

  const onLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pass = String(new FormData(e.currentTarget).get("pass"));
    if (store.loginAdmin(pass)) {
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid passcode. Try katoloni2026");
    }
  };

  const logout = () => {
    store.logoutAdmin();
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-void px-5 py-20">
        <form onSubmit={onLogin} className="w-full max-w-md border border-white/10 bg-panel p-8">
          <div className="mb-6 flex items-center gap-3">
            <Building2 className="text-gold" />
            <div>
              <h1 className="font-serif text-3xl">Admin portal</h1>
              <p className="text-sm text-mist">Owner / church office access</p>
            </div>
          </div>
          <label className="field">
            Passcode
            <input required name="pass" type="password" className="field-input" placeholder="Enter admin passcode" />
          </label>
          <button type="submit" className="btn-gold mt-5 w-full">Sign in</button>
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <p className="mt-6 text-xs leading-5 text-mist">
            Demo passcode: <strong className="text-gold">katoloni2026</strong>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-shell bg-void">
      <aside className="admin-side">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Katoloni CMS</p>
          <h1 className="mt-2 font-serif text-2xl">Dashboard</h1>
        </div>
        <div className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`admin-nav-btn flex items-center gap-2 ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={logout} className="admin-nav-btn mt-8 flex items-center gap-2 text-red-300">
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      <div className="min-h-screen p-5 sm:p-8">
        {tab === "overview" && (
          <section>
            <h2 className="font-serif text-4xl">Overview</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Bookings", bookings.length],
                ["Unread messages", messages.filter((m) => !m.read).length],
                ["Prayer requests", prayers.filter((p) => p.status === "new").length],
                ["Library requests", library.filter((l) => l.status === "requested").length],
              ].map(([label, value]) => (
                <div key={label as string} className="card p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">{label}</p>
                  <p className="mt-3 font-serif text-4xl text-gold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 card p-5">
              <h3 className="font-serif text-2xl">Recent bookings</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id}>
                        <td>{b.code}</td>
                        <td>{b.name}</td>
                        <td>{b.roomType}</td>
                        <td>KES {b.total.toLocaleString()}</td>
                        <td><span className={statusBadge(b.status)}>{b.status}</span></td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan={5}>No bookings yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {tab === "bookings" && (
          <BookingsPanel bookings={bookings} onChange={refresh} />
        )}

        {tab === "notices" && (
          <NoticesPanel notices={notices} onChange={refresh} />
        )}

        {tab === "messages" && (
          <section>
            <h2 className="font-serif text-4xl">Contact messages</h2>
            <div className="mt-8 space-y-3">
              {messages.map((m) => (
                <article key={m.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl">{m.name}</h3>
                      <p className="text-sm text-mist">{m.email} · {m.phone}</p>
                      <p className="mt-2 text-sm text-gold">{m.subject || "General"}</p>
                      <p className="mt-2 text-sm leading-6 text-cream/80">{m.message}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!m.read && (
                        <button type="button" className="btn-line" onClick={() => { store.updateContact(m.id, { read: true }); refresh(); }}>
                          Mark read
                        </button>
                      )}
                      <button type="button" className="btn-ghost" onClick={() => { store.deleteContact(m.id); refresh(); }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {messages.length === 0 && <p className="text-mist">No messages yet.</p>}
            </div>
          </section>
        )}

        {tab === "prayers" && (
          <section>
            <h2 className="font-serif text-4xl">Prayer requests</h2>
            <div className="mt-8 space-y-3">
              {prayers.map((p) => (
                <article key={p.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-2xl">{p.name}</h3>
                        {p.private && <span className="badge badge-red">Private</span>}
                        <span className={statusBadge(p.status)}>{p.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-mist">{p.phone || "No phone"}</p>
                      <p className="mt-3 text-sm leading-6 text-cream/85">{p.request}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn-line" onClick={() => { store.updatePrayer(p.id, { status: "praying" }); refresh(); }}>Praying</button>
                      <button type="button" className="btn-gold" onClick={() => { store.updatePrayer(p.id, { status: "answered" }); refresh(); }}>Answered</button>
                    </div>
                  </div>
                </article>
              ))}
              {prayers.length === 0 && <p className="text-mist">No prayer requests yet.</p>}
            </div>
          </section>
        )}

        {tab === "library" && (
          <section>
            <h2 className="font-serif text-4xl">Library requests</h2>
            <div className="mt-8 overflow-x-auto border border-white/10">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Book</th>
                    <th>Pickup</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {library.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}<div className="text-xs text-mist">{l.phone}</div></td>
                      <td>{l.bookTitle}</td>
                      <td>{l.pickupDate || "—"}</td>
                      <td><span className={statusBadge(l.status)}>{l.status}</span></td>
                      <td className="space-x-2">
                        <button type="button" className="btn-line !min-h-9 !px-3" onClick={() => { store.updateLibrary(l.id, { status: "ready" }); refresh(); }}>Ready</button>
                        <button type="button" className="btn-gold !min-h-9 !px-3" onClick={() => { store.updateLibrary(l.id, { status: "collected" }); refresh(); }}>Collected</button>
                      </td>
                    </tr>
                  ))}
                  {library.length === 0 && <tr><td colSpan={5}>No library requests.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "complaints" && (
          <ComplaintsPanel complaints={complaints} onChange={refresh} />
        )}

        {tab === "settings" && (
          <SettingsPanel settings={settings} onChange={refresh} />
        )}
      </div>
    </div>
  );
}

function BookingsPanel({ bookings, onChange }: { bookings: Booking[]; onChange: () => void }) {
  return (
    <section>
      <h2 className="font-serif text-4xl">Bookings & charges</h2>
      <div className="mt-8 overflow-x-auto border border-white/10">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Guest</th>
              <th>Room / dates</th>
              <th>M-Pesa</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="font-semibold">{b.code}</td>
                <td>
                  {b.name}
                  <div className="text-xs text-mist">{b.phone}</div>
                </td>
                <td>
                  {b.roomType}
                  <div className="text-xs text-mist">{b.checkIn} → {b.checkOut}</div>
                </td>
                <td>{b.mpesaCode}</td>
                <td>KES {b.total.toLocaleString()}</td>
                <td><span className={statusBadge(b.status)}>{b.status}</span></td>
                <td className="space-x-2 whitespace-nowrap">
                  <button type="button" className="btn-gold !min-h-9 !px-3" onClick={() => { store.updateBooking(b.id, { status: "confirmed" }); onChange(); }}>Confirm</button>
                  <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => { store.updateBooking(b.id, { status: "cancelled" }); onChange(); }}>Cancel</button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={7}>No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NoticesPanel({ notices, onChange }: { notices: Notice[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    store.saveNotice({
      id: uid("n"),
      category: String(fd.get("category") || "General"),
      title: String(fd.get("title")),
      body: String(fd.get("body")),
      date: String(fd.get("date") || "This week"),
    });
    e.currentTarget.reset();
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <h2 className="font-serif text-4xl">Notices</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Category<input name="category" className="field-input" placeholder="Services / Prayer / Project" /></label>
          <label className="field">Title *<input required name="title" className="field-input" /></label>
          <label className="field">Date label<input name="date" className="field-input" placeholder="Every Sunday" /></label>
          <label className="field">Body *<textarea required name="body" rows={4} className="field-input resize-none" /></label>
          <button type="submit" className="btn-gold">Publish notice</button>
        </form>
      </div>
      <div className="space-y-3">
        {notices.map((n) => (
          <article key={n.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{n.category} · {n.date}</p>
                <h3 className="mt-2 font-serif text-2xl">{n.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mist">{n.body}</p>
              </div>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => { store.deleteNotice(n.id); onChange(); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComplaintsPanel({
  complaints,
  onChange,
}: {
  complaints: ReturnType<typeof store.getComplaints>;
  onChange: () => void;
}) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    store.saveComplaint({
      id: uid("cp"),
      name: String(fd.get("name")),
      phone: String(fd.get("phone")),
      subject: String(fd.get("subject")),
      details: String(fd.get("details")),
      createdAt: new Date().toISOString(),
      status: "open",
    });
    e.currentTarget.reset();
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Complaints / leads</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Name<input required name="name" className="field-input" /></label>
          <label className="field">Phone<input name="phone" className="field-input" /></label>
          <label className="field">Subject<input required name="subject" className="field-input" /></label>
          <label className="field">Details<textarea required name="details" rows={4} className="field-input resize-none" /></label>
          <button type="submit" className="btn-gold">Log item</button>
        </form>
      </div>
      <div className="space-y-3">
        {complaints.map((c) => (
          <article key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={statusBadge(c.status)}>{c.status}</span>
                <h3 className="mt-2 font-serif text-2xl">{c.subject}</h3>
                <p className="text-sm text-mist">{c.name} · {c.phone}</p>
                <p className="mt-2 text-sm leading-6 text-cream/80">{c.details}</p>
              </div>
              <button type="button" className="btn-line !min-h-9 !px-3" onClick={() => { store.updateComplaint(c.id, { status: "resolved" }); onChange(); }}>
                Resolve
              </button>
            </div>
          </article>
        ))}
        {complaints.length === 0 && <p className="text-mist">No complaints logged.</p>}
      </div>
    </section>
  );
}

function SettingsPanel({ settings, onChange }: { settings: SiteSettings; onChange: () => void }) {
  const [form, setForm] = useState(settings);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    store.saveSettings(form);
    onChange();
  };

  return (
    <section className="max-w-2xl">
      <h2 className="font-serif text-4xl">Site settings</h2>
      <form onSubmit={onSave} className="mt-8 space-y-4 border border-white/10 p-6">
        <label className="field">
          Bishop / office phone
          <input className="field-input" value={form.bishopPhone} onChange={(e) => setForm({ ...form, bishopPhone: e.target.value })} />
        </label>
        <label className="field">
          Public email
          <input className="field-input" value={form.bishopEmail} onChange={(e) => setForm({ ...form, bishopEmail: e.target.value })} />
        </label>
        <label className="field">
          Top announcement bar
          <input className="field-input" value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} />
        </label>
        <label className="field">
          Hero background image URL
          <input className="field-input" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} />
        </label>
        {form.heroImage && (
          <img src={form.heroImage} alt="Hero preview" className="mt-2 h-40 w-full object-cover opacity-80" />
        )}
        <button type="submit" className="btn-gold">Save settings</button>
      </form>
    </section>
  );
}
