import { useState, useRef, useEffect } from "react";
import { publicFaq } from "../../data/faq";

export default function PublicHelpTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hello! 👋 I can help you find your way around the website. Ask me anything." },
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
    let reply = "I’m not sure about that. Try asking about appointments, room booking, or how to navigate the site.";

    const matched = publicFaq.find((item) =>
      item.keywords.some((k) => lower.includes(k))
    );

    if (matched) reply = matched.answer;
    else if (lower.includes("hello") || lower.includes("hi")) reply = "Hello! How can I help you today?";
    else if (lower.includes("thank")) reply = "You’re welcome! God bless you.";

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-500 text-black shadow-xl flex items-center justify-center text-2xl font-bold transition-transform hover:scale-110"
        title="Need help?"
      >
        ?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
              <div>
                <h3 className="font-semibold text-amber-400">Help Guide</h3>
                <p className="text-xs text-zinc-400">Mountain of the Lord</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white text-2xl">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                      msg.from === "user" ? "bg-amber-600 text-black" : "bg-zinc-800 text-zinc-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-zinc-700 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-black rounded-xl text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}