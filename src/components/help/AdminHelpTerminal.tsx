import { useState, useRef, useEffect } from "react";
import { adminFaq, publicFaq } from "../../data/faq";
import { getAppointments } from "../../utils/appointmentsStorage";

export default function AdminHelpTerminal() {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    {
      from: "bot",
      text: "Admin Help Terminal ready. I know the full system — appointments, bookings, localStorage, pages, and more. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");

    const lower = userMsg.toLowerCase();
    let reply = "I don’t have specific information on that. Try asking about appointments storage, difference between Booking and Appointments, or how to clear data.";

    // Check admin knowledge first
    const adminMatch = adminFaq.find((item) =>
      item.keywords.some((k) => lower.includes(k))
    );
    if (adminMatch) {
      reply = adminMatch.answer;
    } else {
      // fallback to public
      const publicMatch = publicFaq.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );
      if (publicMatch) reply = publicMatch.answer;
    }

    // Live data answers
    if (lower.includes("how many appointment") || lower.includes("number of appointment")) {
      const count = getAppointments().length;
      reply = `There are currently ${count} appointment(s) stored in localStorage.`;
    }

    if (lower.includes("list appointment") || lower.includes("show appointment")) {
      const list = getAppointments();
      if (list.length === 0) {
        reply = "There are no appointments stored at the moment.";
      } else {
        reply = list
          .map(
            (a, i) =>
              `${i + 1}. ${a.fullName} → ${a.clergyName} on ${a.date} at ${a.time}`
          )
          .join("\n");
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="px-6 py-5 border-b border-zinc-800">
        <h2 className="text-xl font-serif text-amber-400">System Help Terminal</h2>
        <p className="text-sm text-zinc-400 mt-1">
          Superior knowledge of the entire Mountain of the Lord system
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.from === "user"
                  ? "bg-amber-600 text-black"
                  : "bg-zinc-800 text-zinc-200 border border-zinc-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-zinc-800 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about the system..."
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={handleSend}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black rounded-xl font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}