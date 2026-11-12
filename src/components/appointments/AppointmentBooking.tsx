import { useState } from "react";
import { clergy } from "../../data/clergy";
import { saveAppointment } from "../../utils/appointmentsStorage";

export default function AppointmentBooking() {
  const [selectedClergy, setSelectedClergy] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedPerson = clergy.find((c) => c.id === selectedClergy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedClergy || !date || !time || !fullName || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    saveAppointment({
      clergyId: selectedClergy,
      clergyName: selectedPerson?.name || "",
      date,
      time,
      fullName,
      phone,
      email,
      reason,
    });

    setSuccess(true);
    setSelectedClergy("");
    setDate("");
    setTime("");
    setFullName("");
    setPhone("");
    setEmail("");
    setReason("");
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 text-center bg-zinc-900 rounded-2xl border border-amber-600/40">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-serif text-amber-400 mb-2">Appointment Booked!</h2>
        <p className="text-zinc-300 mb-6">
          Your request has been received. The church office will contact you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-black font-medium rounded-lg transition"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 bg-zinc-900/90 rounded-2xl border border-zinc-700">
      <h2 className="text-3xl font-serif text-amber-400 mb-1">Book an Appointment</h2>
      <p className="text-zinc-400 mb-8">
        Schedule a personal meeting with one of our Pastors or the Bishop.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-zinc-300 mb-1.5">Who would you like to meet? *</label>
          <select
            value={selectedClergy}
            onChange={(e) => setSelectedClergy(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            required
          >
            <option value="">Select Pastor or Bishop</option>
            {clergy.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">Preferred Date *</label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">Preferred Time *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-1.5">Full Name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-1.5">Reason for Appointment</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Briefly share why you would like to meet..."
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg transition"
        >
          Submit Appointment Request
        </button>
      </form>
    </div>
  );
}