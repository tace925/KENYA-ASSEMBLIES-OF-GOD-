import AppointmentBooking from "../components/appointments/AppointmentBooking";

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <p className="text-amber-500 tracking-widest text-sm mb-3">APPOINTMENTS</p>
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
          Meet with our Pastors
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Need prayer, counselling or spiritual guidance? Book a private appointment with one of our Pastors or the Bishop.
        </p>
      </div>

      <AppointmentBooking />
    </div>
  );
}