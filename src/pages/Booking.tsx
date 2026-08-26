import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { bookingCode, nightsBetween, ROOM_TYPES, store, uid, type Booking } from "../lib/storage";
import { PageHero, SectionHeading } from "../components/ui";

export default function Booking() {
  const [roomId, setRoomId] = useState(ROOM_TYPES[0].id);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [done, setDone] = useState<Booking | null>(null);
  const [lookup, setLookup] = useState("");
  const [found, setFound] = useState<Booking[] | null>(null);

  const room = ROOM_TYPES.find((r) => r.id === roomId) || ROOM_TYPES[0];
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = room.rate * nights;

  const onBook = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const booking: Booking = {
      id: uid("bk"),
      code: bookingCode(),
      name: String(fd.get("name")),
      phone: String(fd.get("phone")),
      email: String(fd.get("email") || ""),
      roomType: room.name,
      checkIn,
      checkOut,
      guests,
      mpesaCode: String(fd.get("mpesa")),
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: String(fd.get("notes") || ""),
    };
    store.saveBooking(booking);
    setDone(booking);
    e.currentTarget.reset();
  };

  const onLookup = (e: FormEvent) => {
    e.preventDefault();
    setFound(store.findBooking(lookup));
  };

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title={
          <>
            Rooms, halls &
            <span className="block italic text-gold-light">ministry stays.</span>
          </>
        }
        subtitle="Reserve a retreat room, overnight guest space or fellowship hall. Pay via M-Pesa and keep your booking code."
        image="https://images.pexels.com/photos/28896493/pexels-photo-28896493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=2000"
      />

      <section className="section bg-cream text-ink">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading light eyebrow="Room types" title="Choose your space" />
            <div className="mt-8 space-y-3">
              {ROOM_TYPES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoomId(r.id)}
                  className={`w-full border p-5 text-left transition ${roomId === r.id ? "border-ink bg-ink text-cream" : "border-stone-300 bg-white hover:border-gold-dark"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl">{r.name}</h3>
                      <p className={`mt-2 text-sm leading-6 ${roomId === r.id ? "text-cream/70" : "text-stone-600"}`}>{r.desc}</p>
                    </div>
                    <span className={`text-sm font-bold ${roomId === r.id ? "text-gold-light" : "text-gold-dark"}`}>
                      KES {r.rate.toLocaleString()}/night
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-10 border border-stone-300 bg-white p-6">
              <h3 className="font-serif text-2xl">Check my booking</h3>
              <form onSubmit={onLookup} className="mt-4 flex gap-2">
                <input
                  value={lookup}
                  onChange={(e) => setLookup(e.target.value)}
                  className="field-input !border-stone-300 !text-ink"
                  placeholder="Booking code or phone"
                />
                <button type="submit" className="btn-dark shrink-0">
                  <Search size={16} />
                </button>
              </form>
              {found && (
                <div className="mt-4 space-y-3">
                  {found.length === 0 && <p className="text-sm text-stone-500">No booking found.</p>}
                  {found.map((b) => (
                    <div key={b.id} className="border border-stone-200 p-4 text-sm">
                      <p className="font-bold">{b.code} · {b.status}</p>
                      <p className="mt-1">{b.roomType}</p>
                      <p className="text-stone-600">{b.checkIn} → {b.checkOut}</p>
                      <p className="mt-1 font-semibold">KES {b.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border border-stone-300 bg-white p-6 sm:p-8">
            <h3 className="font-serif text-3xl">Booking form</h3>
            <p className="mt-2 text-sm text-stone-600">
              Selected: <strong>{room.name}</strong> · {nights} night(s) · Total{" "}
              <strong>KES {total.toLocaleString()}</strong>
            </p>

            {done ? (
              <div className="mt-8 border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
                <CheckCircle2 className="text-emerald-600" />
                <h4 className="mt-3 font-serif text-2xl">Booking received</h4>
                <p className="mt-2 text-sm leading-6">
                  Your code is <strong>{done.code}</strong>. Status: pending confirmation. Keep your M-Pesa reference for verification.
                </p>
                <button type="button" className="btn-dark mt-5" onClick={() => setDone(null)}>
                  Make another booking
                </button>
              </div>
            ) : (
              <form onSubmit={onBook} className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="field light sm:col-span-2">
                  Full name *
                  <input required name="name" className="field-input" placeholder="Your name" />
                </label>
                <label className="field light">
                  Phone *
                  <input required name="phone" className="field-input" placeholder="07XX XXX XXX" />
                </label>
                <label className="field light">
                  Email
                  <input name="email" type="email" className="field-input" placeholder="you@email.com" />
                </label>
                <label className="field light">
                  Check-in *
                  <input required type="date" className="field-input" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </label>
                <label className="field light">
                  Check-out *
                  <input required type="date" className="field-input" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </label>
                <label className="field light">
                  Guests
                  <input type="number" min={1} max={50} className="field-input" value={guests} onChange={(e) => setGuests(Number(e.target.value) || 1)} />
                </label>
                <label className="field light">
                  M-Pesa transaction ID *
                  <input required name="mpesa" className="field-input" placeholder="e.g. QE12ABC456" />
                </label>
                <label className="field light sm:col-span-2">
                  Notes
                  <textarea name="notes" rows={3} className="field-input resize-none" placeholder="Purpose of visit, arrival time..." />
                </label>
                <div className="sm:col-span-2 rounded-none border border-stone-200 bg-stone-50 p-4 text-sm">
                  <p>Pay <strong>KES {total.toLocaleString()}</strong> via M-Pesa to the church till/paybill, then enter the transaction code above.</p>
                </div>
                <button type="submit" className="btn-dark sm:col-span-2">
                  Submit booking · KES {total.toLocaleString()}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
