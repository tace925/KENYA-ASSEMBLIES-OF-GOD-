import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, Sun, Moon } from "lucide-react";
import { church, navMain, navMore } from "../data/content";
import { store, type SiteSettings } from "../lib/storage";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  try {
    return localStorage.getItem("mol-theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export default function Layout() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [settings, setSettings] = useState<SiteSettings>(() => store.getSettings());
  const menuRef = useRef<HTMLDivElement>(null);

  // The 7 links shown in the header bar (desktop)
  const mainLinks = navMain.slice(0, 7);
  // Everything else goes in the dropdown
  const dropdownLinks = [...navMain.slice(7), ...navMore];

  useEffect(() => {
    const sync = () => setSettings(store.getSettings());
    window.addEventListener("mol-settings-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("mol-settings-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Close menu when the page changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Apply + remember theme (adds class "light" or "dark" and data-theme on <html>)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("mol-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const logoText = settings.logoText || "MG";
  const churchName = settings.churchName || church.name;
  const churchSubtitle = settings.churchSubtitle || "Prayer Center, Katoloni";
  const announcement =
    settings.announcement || "Welcome to the Mountain — A House of Prayer for All People.";
  const footerDescription =
    settings.footerDescription ||
    "a faith community devoted to prayer, the Word and serving Katoloni with the love of Jesus Christ.";
  const phone = settings.bishopPhone || church.phone;
  const email = settings.bishopEmail || church.email;
  const whatsapp = church.whatsapp || "254721514653";

  const isAdmin = location.pathname.includes("admin");

  const dropdownLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] transition hover:bg-white/5 ${
      isActive ? "text-gold" : "text-cream/80"
    }`;

  return (
    <div className="min-h-screen bg-void text-cream">
      {announcement && (
        <div className="border-b border-white/10 bg-ink px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
          {announcement}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-void/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center border border-gold/50 font-serif text-sm text-gold">
              {logoText}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate font-serif text-sm tracking-wide sm:text-base">
                {churchName}
              </div>
              <div className="truncate text-[10px] uppercase tracking-[0.16em] text-mist">
                {churchSubtitle}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {mainLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    isActive ? "text-gold" : "text-cream/70 hover:text-cream"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: ☰ menu → dark mode → Book / Visit */}
          <div className="flex items-center gap-2">
            <div ref={menuRef} className="sm:relative">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center border border-white/15 transition hover:border-gold/50"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              {menuOpen && (
                <div className="absolute left-0 right-0 top-full max-h-[70vh] overflow-y-auto border-y border-white/10 bg-panel shadow-xl sm:left-auto sm:right-0 sm:w-64 sm:border">
                  {/* On small screens the 7 main links aren't in the header, so show them here */}
                  <div className="xl:hidden">
                    {mainLinks.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        className={dropdownLinkClass}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    <div className="my-1 border-t border-white/10" />
                  </div>

                  {dropdownLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={dropdownLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center border border-white/15 transition hover:border-gold/50"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link to="/booking" className="btn-gold !min-h-10 !px-4 text-[11px]">
              Book / Visit →
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {!isAdmin && (
        <footer className="border-t border-white/10 bg-ink">
          <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center border border-gold/50 font-serif text-sm text-gold">
                  {logoText}
                </div>
                <div>
                  <div className="font-serif text-lg">{churchName}</div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-mist">
                    {churchSubtitle}
                  </div>
                </div>
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-mist">
                {churchName} — {footerDescription}
              </p>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-line mt-6 inline-flex items-center gap-2"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Explore</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-cream/80">
                {navMain.map((item) => (
                  <Link key={item.to} to={item.to} className="hover:text-gold">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Contact</p>
              <div className="mt-4 space-y-2 text-sm text-mist">
                <p>{phone}</p>
                <p>{email}</p>
                <p>{church.location}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 py-4 text-center text-[11px] text-mist">
            © {new Date().getFullYear()} {churchName}. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
}