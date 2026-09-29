import { FormEvent, useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Church,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareWarning,
  Mic2,
  Settings,
  Users,
  UsersRound,
  Quote,
} from "lucide-react";
import {
  store,
  uid,
  type Booking,
  type Notice,
  type SiteSettings,
  type Ministry,
  type ScheduleItem,
  type HomeCell,
  type GalleryImage,
  type Confession,
  type Leader,
  type Testimony,
} from "../lib/storage";

type Tab =
  | "overview"
  | "bookings"
  | "messages"
  | "prayers"
  | "library"
  | "complaints"
  | "notices"
  | "ministries"
  | "schedule"
  | "homecells"
  | "gallery"
  | "confessions"
  | "testimonies"
  | "leadership"
  | "settings";

const sidebarGroups = [
  {
    title: "Main",
    items: [
      { id: "overview" as Tab, label: "Dashboard", icon: LayoutDashboard },
      { id: "bookings" as Tab, label: "Bookings", icon: CalendarDays },
      { id: "messages" as Tab, label: "Messages", icon: Mail },
      { id: "prayers" as Tab, label: "Prayer Requests", icon: Users },
    ],
  },
  {
    title: "Content Management",
    items: [
      { id: "notices" as Tab, label: "Notices", icon: Bell },
      { id: "ministries" as Tab, label: "Ministries", icon: Church },
      { id: "schedule" as Tab, label: "Service Schedule", icon: CalendarDays },
      { id: "homecells" as Tab, label: "Home Cells", icon: Home },
      { id: "gallery" as Tab, label: "Gallery", icon: Image },
      { id: "confessions" as Tab, label: "Confessions", icon: Mic2 },
      { id: "testimonies" as Tab, label: "Testimonies", icon: Quote },
      { id: "leadership" as Tab, label: "Leadership", icon: UsersRound },
    ],
  },
  {
    title: "System",
    items: [
      { id: "library" as Tab, label: "Library Requests", icon: BookOpen },
      { id: "complaints" as Tab, label: "Complaints", icon: MessageSquareWarning },
      { id: "settings" as Tab, label: "Site Settings", icon: Settings },
    ],
  },
];

function statusBadge(status: string) {
  if (["confirmed", "ready", "answered", "resolved", "collected"].includes(status))
    return "badge badge-green";
  if (["cancelled", "open"].includes(status)) return "badge badge-red";
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
  const ministries = useMemo(() => store.getMinistries(), [tick]);
  const schedule = useMemo(() => store.getSchedule(), [tick]);
  const homeCells = useMemo(() => store.getHomeCells(), [tick]);
  const gallery = useMemo(() => store.getGallery(), [tick]);
  const confessions = useMemo(() => store.getConfessions(), [tick]);
  const leadership = useMemo(() => store.getLeadership(), [tick]);
  const testimonies = useMemo(() => store.getTestimonies(), [tick]);

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
      {/* Sidebar */}
      <aside className="admin-side overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Katoloni CMS</p>
          <h1 className="mt-2 font-serif text-2xl">Dashboard</h1>
        </div>

        <div className="space-y-6">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-mist/70">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((t) => (
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
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={logout}
          className="admin-nav-btn mt-8 flex items-center gap-2 text-red-300"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen p-5 sm:p-8">
        {tab === "overview" && (
          <section>
            <h2 className="font-serif text-4xl">Overview</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Bookings", bookings.length],
                ["Unread messages", messages.filter((m) => !m.read).length],
                ["New prayer requests", prayers.filter((p) => p.status === "new").length],
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

        {tab === "bookings" && <BookingsPanel bookings={bookings} onChange={refresh} />}
        {tab === "messages" && <MessagesPanel messages={messages} onChange={refresh} />}
        {tab === "prayers" && <PrayersPanel prayers={prayers} onChange={refresh} />}
        {tab === "library" && <LibraryPanel library={library} onChange={refresh} />}
        {tab === "complaints" && <ComplaintsPanel complaints={complaints} onChange={refresh} />}
        {tab === "notices" && <NoticesPanel notices={notices} onChange={refresh} />}
        {tab === "ministries" && <MinistriesPanel items={ministries} onChange={refresh} />}
        {tab === "schedule" && <SchedulePanel items={schedule} onChange={refresh} />}
        {tab === "homecells" && <HomeCellsPanel items={homeCells} onChange={refresh} />}
        {tab === "gallery" && <GalleryPanel items={gallery} onChange={refresh} />}
        {tab === "confessions" && <ConfessionsPanel items={confessions} onChange={refresh} />}
        {tab === "testimonies" && <TestimoniesPanel items={testimonies} onChange={refresh} />}
        {tab === "leadership" && <LeadershipPanel items={leadership} onChange={refresh} />}
        {tab === "settings" && <SettingsPanel settings={settings} onChange={refresh} />}
      </div>
    </div>
  );
}

/* ===================== PANELS ===================== */

function BookingsPanel({ bookings, onChange }: { bookings: Booking[]; onChange: () => void }) {
  const [subTab, setSubTab] = useState<"requests" | "rooms" | "policy">("requests");
  const roomTypes = store.getRoomTypes();
  const settings = store.getSettings();

  return (
    <section>
      <h2 className="font-serif text-4xl">Bookings</h2>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className={`chip ${subTab === "requests" ? "active" : ""}`} onClick={() => setSubTab("requests")}>
          Requests
        </button>
        <button type="button" className={`chip ${subTab === "rooms" ? "active" : ""}`} onClick={() => setSubTab("rooms")}>
          Room Types & Prices
        </button>
        <button type="button" className={`chip ${subTab === "policy" ? "active" : ""}`} onClick={() => setSubTab("policy")}>
          Notice & Policy
        </button>
      </div>

      {subTab === "requests" && (
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
                    <div className="text-xs text-mist">
                      {b.checkIn} → {b.checkOut}
                    </div>
                  </td>
                  <td>{b.mpesaCode}</td>
                  <td>KES {b.total.toLocaleString()}</td>
                  <td>
                    <span className={statusBadge(b.status)}>{b.status}</span>
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      className="btn-gold !min-h-9 !px-3"
                      onClick={() => {
                        store.updateBooking(b.id, { status: "confirmed" });
                        onChange();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn-ghost !min-h-9 !px-3"
                      onClick={() => {
                        store.updateBooking(b.id, { status: "cancelled" });
                        onChange();
                      }}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7}>No bookings yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {subTab === "rooms" && <RoomTypesPanel onChange={onChange} />}
      {subTab === "policy" && <BookingPolicyPanel settings={settings} onChange={onChange} />}
    </section>
  );
}

function RoomTypesPanel({ onChange }: { onChange: () => void }) {
  const [items, setItems] = useState(() => store.getRoomTypes());

  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [
      ...items,
      {
        id: uid("room"),
        name: String(fd.get("name")),
        desc: String(fd.get("desc")),
        rate: Number(fd.get("rate")) || 0,
      },
    ];
    store.saveRoomTypes(list);
    setItems(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    const list = items.filter((r) => r.id !== id);
    store.saveRoomTypes(list);
    setItems(list);
    onChange();
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <form onSubmit={onAdd} className="space-y-4 border border-white/10 p-5">
        <h3 className="font-serif text-2xl">Add Room Type</h3>
        <label className="field">
          Name *
          <input required name="name" className="field-input" placeholder="Single Guest Room" />
        </label>
        <label className="field">
          Description *
          <textarea required name="desc" rows={2} className="field-input resize-none" />
        </label>
        <label className="field">
          Price per night (KES) *
          <input required name="rate" type="number" min={0} className="field-input" />
        </label>
        <button type="submit" className="btn-gold">
          Add Room Type
        </button>
      </form>

      <div className="space-y-3">
        {items.map((r) => (
          <article key={r.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl">{r.name}</h3>
                <p className="mt-1 text-sm text-mist">{r.desc}</p>
                <p className="mt-2 font-semibold text-gold">KES {r.rate.toLocaleString()} / night</p>
              </div>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(r.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No room types yet.</p>}
      </div>
    </div>
  );
}

function BookingPolicyPanel({
  settings,
  onChange,
}: {
  settings: SiteSettings;
  onChange: () => void;
}) {
  const [form, setForm] = useState(settings);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    store.saveSettings(form);
    onChange();
  };

  return (
    <form onSubmit={onSave} className="mt-8 max-w-2xl space-y-4 border border-white/10 p-6">
      <h3 className="font-serif text-2xl">Booking Notice & Policy</h3>
      <label className="field">
        Booking Notice
        <textarea
          className="field-input resize-none"
          rows={3}
          value={form.bookingNotice}
          onChange={(e) => setForm({ ...form, bookingNotice: e.target.value })}
          placeholder="Shown to guests on the booking page"
        />
      </label>
      <label className="field">
        Booking Policy
        <textarea
          className="field-input resize-none"
          rows={4}
          value={form.bookingPolicy}
          onChange={(e) => setForm({ ...form, bookingPolicy: e.target.value })}
          placeholder="Rules, cancellation policy, etc."
        />
      </label>
      <button type="submit" className="btn-gold">
        Save Notice & Policy
      </button>
    </form>
  );
}

function MessagesPanel({ messages, onChange }: { messages: ReturnType<typeof store.getContacts>; onChange: () => void }) {
  return (
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
                  <button type="button" className="btn-line" onClick={() => { store.updateContact(m.id, { read: true }); onChange(); }}>
                    Mark read
                  </button>
                )}
                <button type="button" className="btn-ghost" onClick={() => { store.deleteContact(m.id); onChange(); }}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {messages.length === 0 && <p className="text-mist">No messages yet.</p>}
      </div>
    </section>
  );
}

function PrayersPanel({ prayers, onChange }: { prayers: ReturnType<typeof store.getPrayers>; onChange: () => void }) {
  return (
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
                <button type="button" className="btn-line" onClick={() => { store.updatePrayer(p.id, { status: "praying" }); onChange(); }}>Praying</button>
                <button type="button" className="btn-gold" onClick={() => { store.updatePrayer(p.id, { status: "answered" }); onChange(); }}>Answered</button>
              </div>
            </div>
          </article>
        ))}
        {prayers.length === 0 && <p className="text-mist">No prayer requests yet.</p>}
      </div>
    </section>
  );
}

function LibraryPanel({ library, onChange }: { library: ReturnType<typeof store.getLibrary>; onChange: () => void }) {
  const [subTab, setSubTab] = useState<"requests" | "books">("requests");

  return (
    <section>
      <h2 className="font-serif text-4xl">Library</h2>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" className={`chip ${subTab === "requests" ? "active" : ""}`} onClick={() => setSubTab("requests")}>
          Requests
        </button>
        <button type="button" className={`chip ${subTab === "books" ? "active" : ""}`} onClick={() => setSubTab("books")}>
          Books Catalogue
        </button>
      </div>

      {subTab === "requests" && (
        <div className="mt-8 overflow-x-auto border border-white/10">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
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
                  <td className="font-semibold">{l.code}</td>
                  <td>
                    {l.name}
                    <div className="text-xs text-mist">{l.phone}</div>
                  </td>
                  <td>{l.bookTitle}</td>
                  <td>{l.pickupDate || "—"}</td>
                  <td>
                    <span className={statusBadge(l.status)}>{l.status}</span>
                  </td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      className="btn-gold !min-h-9 !px-3"
                      onClick={() => {
                        store.updateLibrary(l.id, { status: "confirmed" });
                        onChange();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn-ghost !min-h-9 !px-3"
                      onClick={() => {
                        store.updateLibrary(l.id, { status: "rejected" });
                        onChange();
                      }}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn-line !min-h-9 !px-3"
                      onClick={() => {
                        store.updateLibrary(l.id, { status: "ready" });
                        onChange();
                      }}
                    >
                      Ready
                    </button>
                    <button
                      type="button"
                      className="btn-line !min-h-9 !px-3"
                      onClick={() => {
                        store.updateLibrary(l.id, { status: "collected" });
                        onChange();
                      }}
                    >
                      Collected
                    </button>
                  </td>
                </tr>
              ))}
              {library.length === 0 && (
                <tr>
                  <td colSpan={6}>No library requests.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {subTab === "books" && <LibraryBooksPanel onChange={onChange} />}
    </section>
  );
}

function LibraryBooksPanel({ onChange }: { onChange: () => void }) {
  const [items, setItems] = useState(() => store.getLibraryBooks());

  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [
      ...items,
      {
        id: uid("book"),
        title: String(fd.get("title")),
        author: String(fd.get("author")),
        category: String(fd.get("category")),
        note: String(fd.get("note")),
        policy: String(fd.get("policy")),
      },
    ];
    store.saveLibraryBooks(list);
    setItems(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    const list = items.filter((b) => b.id !== id);
    store.saveLibraryBooks(list);
    setItems(list);
    onChange();
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <form onSubmit={onAdd} className="space-y-4 border border-white/10 p-5">
        <h3 className="font-serif text-2xl">Add Book</h3>
        <label className="field">
          Title *
          <input required name="title" className="field-input" />
        </label>
        <label className="field">
          Author *
          <input required name="author" className="field-input" />
        </label>
        <label className="field">
          Category *
          <input required name="category" className="field-input" placeholder="Prayer Guide, Teaching, Devotional..." />
        </label>
        <label className="field">
          Note
          <input name="note" className="field-input" placeholder="Short description" />
        </label>
        <label className="field">
          Policy
          <textarea name="policy" rows={2} className="field-input resize-none" placeholder="Return rules, etc." />
        </label>
        <button type="submit" className="btn-gold">
          Add Book
        </button>
      </form>

      <div className="space-y-3">
        {items.map((b) => (
          <article key={b.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{b.category}</p>
                <h3 className="mt-1 font-serif text-xl">{b.title}</h3>
                <p className="text-sm text-mist">{b.author}</p>
                {b.note && <p className="mt-1 text-sm text-mist">{b.note}</p>}
                {b.policy && <p className="mt-1 text-xs text-mist/70">Policy: {b.policy}</p>}
              </div>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(b.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No books in catalogue yet.</p>}
      </div>
    </div>
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

function MinistriesPanel({ items, onChange }: { items: Ministry[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [...items, { id: uid("min"), name: String(fd.get("name")), desc: String(fd.get("desc")) }];
    store.saveMinistries(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveMinistries(items.filter((m) => m.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Ministries</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Name *<input required name="name" className="field-input" /></label>
          <label className="field">Description *<textarea required name="desc" rows={3} className="field-input resize-none" /></label>
          <button type="submit" className="btn-gold">Add ministry</button>
        </form>
      </div>
      <div className="space-y-3">
        {items.map((m) => (
          <article key={m.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-2xl">{m.name}</h3>
                <p className="mt-2 text-sm text-mist">{m.desc}</p>
              </div>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(m.id)}>Delete</button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No ministries added yet. Add from the form.</p>}
      </div>
    </section>
  );
}

function SchedulePanel({ items, onChange }: { items: ScheduleItem[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [...items, {
      id: uid("sch"),
      day: String(fd.get("day")),
      time: String(fd.get("time")),
      item: String(fd.get("item")),
    }];
    store.saveSchedule(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveSchedule(items.filter((s) => s.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Service Schedule</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Day *<input required name="day" className="field-input" placeholder="Sunday" /></label>
          <label className="field">Time *<input required name="time" className="field-input" placeholder="9:00 AM" /></label>
          <label className="field">Program *<input required name="item" className="field-input" placeholder="Sunday Service" /></label>
          <button type="submit" className="btn-gold">Add schedule item</button>
        </form>
      </div>
      <div className="space-y-3">
        {items.map((s) => (
          <article key={s.id} className="card flex items-center justify-between p-5">
            <div>
              <p className="font-serif text-xl">{s.day} · {s.time}</p>
              <p className="text-sm text-mist">{s.item}</p>
            </div>
            <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(s.id)}>Delete</button>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No schedule items yet.</p>}
      </div>
    </section>
  );
}

function HomeCellsPanel({ items, onChange }: { items: HomeCell[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [
      ...items,
      {
        id: uid("cell"),
        area: String(fd.get("area")),
        day: String(fd.get("day")),
        leader: String(fd.get("leader")),
        focus: String(fd.get("focus")),
        phone: String(fd.get("phone") || ""),
      },
    ];
    store.saveHomeCells(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveHomeCells(items.filter((c) => c.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Home Cells</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">
            Area *
            <input required name="area" className="field-input" placeholder="Katoloni Estate" />
          </label>
          <label className="field">
            Day *
            <input required name="day" className="field-input" placeholder="Wednesday 6pm" />
          </label>
          <label className="field">
            Leader *
            <input required name="leader" className="field-input" />
          </label>
          <label className="field">
            Phone number
            <input name="phone" className="field-input" placeholder="07XX XXX XXX" />
          </label>
          <label className="field">
            Focus *
            <input required name="focus" className="field-input" placeholder="Prayer & Bible study" />
          </label>
          <button type="submit" className="btn-gold">
            Add home cell
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {items.map((c) => (
          <article key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-2xl">{c.area}</h3>
                <p className="text-sm text-gold">{c.day}</p>
                <p className="mt-1 text-sm text-mist">Leader: {c.leader}</p>
                {c.phone && <p className="text-sm text-mist">Phone: {c.phone}</p>}
                <p className="text-sm text-mist">Focus: {c.focus}</p>
              </div>
              <button
                type="button"
                className="btn-ghost !min-h-9 !px-3"
                onClick={() => remove(c.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No home cells yet.</p>}
      </div>
    </section>
  );
}

function GalleryPanel({ items, onChange }: { items: GalleryImage[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [...items, {
      id: uid("gal"),
      src: String(fd.get("src")),
      caption: String(fd.get("caption")),
      tall: fd.get("tall") === "on",
    }];
    store.saveGallery(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveGallery(items.filter((g) => g.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Gallery</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Image URL *<input required name="src" className="field-input" placeholder="https://..." /></label>
          <label className="field">Caption *<input required name="caption" className="field-input" /></label>
          <label className="flex items-center gap-3 text-sm text-mist">
            <input type="checkbox" name="tall" className="size-4" /> Tall image
          </label>
          <button type="submit" className="btn-gold">Add image</button>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((g) => (
          <div key={g.id} className="relative overflow-hidden border border-white/10">
            <img src={g.src} alt={g.caption} className="aspect-square w-full object-cover" />
            <button type="button" className="absolute right-2 top-2 bg-black/70 px-2 py-1 text-xs" onClick={() => remove(g.id)}>Delete</button>
            <p className="p-2 text-xs text-mist">{g.caption}</p>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-2 text-mist">No gallery images yet.</p>}
      </div>
    </section>
  );
}

function ConfessionsPanel({ items, onChange }: { items: Confession[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [...items, {
      id: uid("conf"),
      week: String(fd.get("week")),
      title: String(fd.get("title")),
      speaker: String(fd.get("speaker")),
      duration: String(fd.get("duration")),
    }];
    store.saveConfessions(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveConfessions(items.filter((c) => c.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Confessions / Sermons</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Week *<input required name="week" className="field-input" placeholder="Week 12 · 2026" /></label>
          <label className="field">Title *<input required name="title" className="field-input" /></label>
          <label className="field">Speaker *<input required name="speaker" className="field-input" /></label>
          <label className="field">Duration *<input required name="duration" className="field-input" placeholder="42 min" /></label>
          <button type="submit" className="btn-gold">Add confession</button>
        </form>
      </div>
      <div className="space-y-3">
        {items.map((c) => (
          <article key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">{c.week}</p>
                <h3 className="mt-1 font-serif text-2xl">{c.title}</h3>
                <p className="text-sm text-mist">{c.speaker} · {c.duration}</p>
              </div>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(c.id)}>Delete</button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No confessions yet.</p>}
      </div>
    </section>
  );
}

function TestimoniesPanel({ items, onChange }: { items: Testimony[]; onChange: () => void }) {
  const remove = (id: string) => {
    store.deleteTestimony(id);
    onChange();
  };

  return (
    <section>
      <h2 className="font-serif text-4xl">Testimonies (Katoloni Wall)</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((t) => (
          <article key={t.id} className="card p-5">
            <p className="font-serif text-lg leading-7 text-cream/90">“{t.quote}”</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-mist">{t.initials} / {t.name} · {t.date}</span>
              <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(t.id)}>Delete</button>
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No testimonies yet.</p>}
      </div>
    </section>
  );
}

function LeadershipPanel({ items, onChange }: { items: Leader[]; onChange: () => void }) {
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const list = [...items, {
      id: uid("lead"),
      initials: String(fd.get("initials")),
      role: String(fd.get("role")),
      focus: String(fd.get("focus")),
    }];
    store.saveLeadership(list);
    e.currentTarget.reset();
    onChange();
  };

  const remove = (id: string) => {
    store.saveLeadership(items.filter((l) => l.id !== id));
    onChange();
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="font-serif text-4xl">Leadership</h2>
        <form onSubmit={onAdd} className="mt-6 space-y-4 border border-white/10 p-5">
          <label className="field">Initials *<input required name="initials" className="field-input" placeholder="JM" /></label>
          <label className="field">Role *<input required name="role" className="field-input" placeholder="Senior Pastor" /></label>
          <label className="field">Focus *<input required name="focus" className="field-input" placeholder="Prayer & Vision" /></label>
          <button type="submit" className="btn-gold">Add leader</button>
        </form>
      </div>
      <div className="space-y-3">
        {items.map((l) => (
          <article key={l.id} className="card flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <span className="font-serif text-4xl text-gold">{l.initials}</span>
              <div>
                <h3 className="font-serif text-xl">{l.role}</h3>
                <p className="text-sm text-mist">{l.focus}</p>
              </div>
            </div>
            <button type="button" className="btn-ghost !min-h-9 !px-3" onClick={() => remove(l.id)}>Delete</button>
          </article>
        ))}
        {items.length === 0 && <p className="text-mist">No leadership entries yet.</p>}
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

  // Handle image upload → convert to base64 data URL
  const handleUpload = (field: keyof SiteSettings, file: File | null) => {
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image is too large. Please use an image under 1.5 MB for now (localStorage limit).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const HeroField = ({
    label,
    field,
  }: {
    label: string;
    field: keyof SiteSettings;
  }) => (
    <div className="space-y-2 border-b border-white/5 pb-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-mist">{label}</p>
      <input
        className="field-input"
        value={(form[field] as string) || ""}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
        placeholder="https://... or upload below"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="btn-line !min-h-9 !px-3 cursor-pointer">
          Upload from computer
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(field, e.target.files?.[0] || null)}
          />
        </label>
        {(form[field] as string) && (
          <img
            src={form[field] as string}
            alt="preview"
            className="h-16 w-28 object-cover border border-white/10"
          />
        )}
      </div>
    </div>
  );

  return (
    <section className="max-w-3xl">
      <h2 className="font-serif text-4xl">Site Settings</h2>

      <form onSubmit={onSave} className="mt-8 space-y-8">
        {/* Branding */}
        <div className="border border-white/10 p-6 space-y-4">
          <h3 className="font-serif text-2xl text-gold">Header / Logo</h3>
          <label className="field">
            Logo text (inside diamond)
            <input className="field-input" value={form.logoText || ""} onChange={(e) => setForm({ ...form, logoText: e.target.value })} />
          </label>
          <label className="field">
            Church name
            <input className="field-input" value={form.churchName || ""} onChange={(e) => setForm({ ...form, churchName: e.target.value })} />
          </label>
          <label className="field">
            Subtitle
            <input className="field-input" value={form.churchSubtitle || ""} onChange={(e) => setForm({ ...form, churchSubtitle: e.target.value })} />
          </label>
        </div>

        {/* Footer */}
        <div className="border border-white/10 p-6 space-y-4">
          <h3 className="font-serif text-2xl text-gold">Footer</h3>
          <label className="field">
            Footer description
            <textarea className="field-input resize-none" rows={3} value={form.footerDescription || ""} onChange={(e) => setForm({ ...form, footerDescription: e.target.value })} />
          </label>
        </div>

        {/* General */}
        <div className="border border-white/10 p-6 space-y-4">
          <h3 className="font-serif text-2xl text-gold">General</h3>
          <label className="field">
            Bishop / office phone
            <input className="field-input" value={form.bishopPhone || ""} onChange={(e) => setForm({ ...form, bishopPhone: e.target.value })} />
          </label>
          <label className="field">
            Public email
            <input className="field-input" value={form.bishopEmail || ""} onChange={(e) => setForm({ ...form, bishopEmail: e.target.value })} />
          </label>
          <label className="field">
            Top announcement bar
            <input className="field-input" value={form.announcement || ""} onChange={(e) => setForm({ ...form, announcement: e.target.value })} />
          </label>
        </div>

        {/* Hero Images */}
        <div className="border border-white/10 p-6 space-y-5">
          <h3 className="font-serif text-2xl text-gold">Hero Images (all pages)</h3>
          <p className="text-sm text-mist">Paste a URL or upload from your computer. Uploaded images are stored locally until you move to Supabase.</p>

          <HeroField label="Home page" field="heroImage" />
          <HeroField label="About page" field="heroAbout" />
          <HeroField label="Services page" field="heroServices" />
          <HeroField label="Ministries page" field="heroMinistries" />
          <HeroField label="Home Cells page" field="heroHomeCells" />
          <HeroField label="Gallery page" field="heroGallery" />
          <HeroField label="Confessions page" field="heroConfessions" />
          <HeroField label="Notices page" field="heroNotices" />
          <HeroField label="Project page" field="heroProject" />
          <HeroField label="Tour page" field="heroTour" />
          <HeroField label="Contact page" field="heroContact" />
          <HeroField label="Prayer page" field="heroPrayer" />
          <HeroField label="Booking page" field="heroBooking" />
          <HeroField label="Library page" field="heroLibrary" />
          <HeroField label="Katoloni Wall page" field="heroWall" />
        </div>

        {/* Project Content */}
        <div className="border border-white/10 p-6 space-y-4">
          <h3 className="font-serif text-2xl text-gold">Project Page Content</h3>

          <label className="field">
            Project title
            <input className="field-input" value={form.projectTitle || ""} onChange={(e) => setForm({ ...form, projectTitle: e.target.value })} />
          </label>
          <label className="field">
            Project subtitle
            <textarea className="field-input resize-none" rows={3} value={form.projectSubtitle || ""} onChange={(e) => setForm({ ...form, projectSubtitle: e.target.value })} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              Phase 1 title
              <input className="field-input" value={form.projectPhase1Title || ""} onChange={(e) => setForm({ ...form, projectPhase1Title: e.target.value })} />
            </label>
            <label className="field">
              Phase 1 description
              <textarea className="field-input resize-none" rows={2} value={form.projectPhase1Desc || ""} onChange={(e) => setForm({ ...form, projectPhase1Desc: e.target.value })} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              Phase 2 title
              <input className="field-input" value={form.projectPhase2Title || ""} onChange={(e) => setForm({ ...form, projectPhase2Title: e.target.value })} />
            </label>
            <label className="field">
              Phase 2 description
              <textarea className="field-input resize-none" rows={2} value={form.projectPhase2Desc || ""} onChange={(e) => setForm({ ...form, projectPhase2Desc: e.target.value })} />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field">
              Phase 3 title
              <input className="field-input" value={form.projectPhase3Title || ""} onChange={(e) => setForm({ ...form, projectPhase3Title: e.target.value })} />
            </label>
            <label className="field">
              Phase 3 description
              <textarea className="field-input resize-none" rows={2} value={form.projectPhase3Desc || ""} onChange={(e) => setForm({ ...form, projectPhase3Desc: e.target.value })} />
            </label>
          </div>

          <label className="field">
            Support text (bottom paragraph)
            <textarea className="field-input resize-none" rows={3} value={form.projectSupportText || ""} onChange={(e) => setForm({ ...form, projectSupportText: e.target.value })} />
          </label>
        </div>

        <button type="submit" className="btn-gold">
          Save all settings
        </button>
      </form>
    </section>
  );
}