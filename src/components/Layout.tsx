import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { church, navMain, navMore } from "../data/content";
import { store } from "../lib/storage";

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <span className="logo-mark" aria-hidden>
        <span>MG</span>
      </span>
      <span className="hidden leading-tight min-[480px]:block">
        <strong className="block text-[13px] font-semibold tracking-[0.14em] text-cream">
          MOUNTAIN OF THE LORD
        </strong>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-gold/70">
          Prayer Center, Katoloni
        </span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [settings] = useState(() => store.getSettings());
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
    setSubscribed(true);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? "active" : ""}`;

  return (
    <div className="min-h-screen bg-void text-cream">
      <div className="border-b border-white/[0.06] bg-black/40">
        <div className="container flex h-9 items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-mist">
          <span className="text-gold-light">{settings.announcement}</span>
          <span className="hidden sm:inline">Katoloni · Machakos</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-void/90 backdrop-blur-xl">
        <nav className="container flex h-[76px] items-center justify-between gap-4" aria-label="Main">
          <Logo />

          <div className="hidden items-center gap-4 xl:flex">
            {navMain.slice(0, 8).map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            <div className="relative">
              <button
                type="button"
                className="nav-link inline-flex items-center gap-1"
                onClick={() => setMoreOpen((v) => !v)}
              >
                More <ChevronDown size={12} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full mt-3 min-w-[200px] border border-white/10 bg-ink p-2 shadow-2xl">
                  {[...navMain.slice(8), ...navMore].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className="block px-3 py-2.5 text-xs uppercase tracking-[0.14em] text-mist transition-colors hover:bg-white/5 hover:text-gold"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/booking" className="btn-gold hidden sm:inline-flex">
              Book / Visit <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center border border-white/15 xl:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink px-5 py-5 xl:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.32 }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button type="button" className="grid h-11 w-11 place-items-center border border-white/15" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="mt-10 flex flex-col">
              {[...navMain, ...navMore].map((item, i) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className="block border-b border-white/10 py-3.5 font-serif text-2xl text-cream hover:text-gold"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <Link to="/booking" onClick={() => setOpen(false)} className="btn-gold mt-8 w-full">
              Book / Visit <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-[#080807]">
        <div className="container py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.8fr_1fr]">
            <div>
              <Logo />
              <p className="mt-5 max-w-sm text-sm leading-7 text-mist">
                {church.name} — a faith community devoted to prayer, the Word and serving Katoloni with the love of Jesus Christ.
              </p>
              <a
                href={`https://wa.me/${church.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-wa mt-6"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>

            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Explore</h3>
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-mist">
                {navMain.slice(0, 10).map((n) => (
                  <Link key={n.to} to={n.to} className="hover:text-gold">
                    {n.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-cream">Stay in the Loop</h3>
              <p className="mt-3 text-sm leading-6 text-mist">Notices, prayer updates and messages from the mountain.</p>
              <form className="mt-5 flex border-b border-white/20" onSubmit={onSubscribe}>
                <input
                  required
                  type="email"
                  aria-label="Email"
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-mist/50"
                />
                <button type="submit" className="px-2 text-gold" aria-label="Subscribe">
                  <ArrowRight size={18} />
                </button>
              </form>
              {subscribed && <p className="mt-2 text-xs text-gold-light">You are on the list. Thank you.</p>}

              <div className="mt-8 space-y-3 text-sm text-mist">
                <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-gold" /> {church.location}</p>
                <a className="flex items-center gap-2 hover:text-gold" href={`tel:+254${church.phone.replace(/\s/g, "").slice(-9)}`}>
                  <Phone size={16} className="text-gold" /> {settings.bishopPhone || church.phone}
                </a>
                <a className="flex items-center gap-2 hover:text-gold" href={`mailto:${settings.bishopEmail || church.email}`}>
                  <Mail size={16} className="text-gold" /> {settings.bishopEmail || church.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-mist/60 sm:flex-row">
            <span>© {new Date().getFullYear()} {church.name}</span>
            <span>Faith. Prayer. Community.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
