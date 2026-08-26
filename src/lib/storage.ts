export type Booking = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  mpesaCode: string;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  notes?: string;
};

export type Notice = {
  id: string;
  category: string;
  title: string;
  body: string;
  date: string;
};

export type Testimony = {
  id: string;
  name: string;
  initials: string;
  quote: string;
  date: string;
};

export type PrayerRequest = {
  id: string;
  name: string;
  phone: string;
  request: string;
  private: boolean;
  createdAt: string;
  status: "new" | "praying" | "answered";
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type LibraryRequest = {
  id: string;
  name: string;
  phone: string;
  bookTitle: string;
  pickupDate: string;
  createdAt: string;
  status: "requested" | "ready" | "collected";
};

export type Complaint = {
  id: string;
  name: string;
  phone: string;
  subject: string;
  details: string;
  createdAt: string;
  status: "open" | "resolved";
};

export type SiteSettings = {
  bishopPhone: string;
  bishopEmail: string;
  heroImage: string;
  announcement: string;
};

const KEYS = {
  bookings: "katoloni_bookings",
  notices: "katoloni_notices",
  testimonies: "katoloni_testimonies",
  prayers: "katoloni_prayers",
  contacts: "katoloni_contacts",
  library: "katoloni_library",
  complaints: "katoloni_complaints",
  settings: "katoloni_settings",
  adminSession: "katoloni_admin_session",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function bookingCode() {
  return `KTL-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-4)}`;
}

/* Defaults */
const defaultNotices: Notice[] = [
  {
    id: "n1",
    category: "Services",
    title: "Sunday Worship Gathering",
    body: "Join us every Sunday for prayer, worship, the Word and fellowship at Katoloni.",
    date: "Every Sunday",
  },
  {
    id: "n2",
    category: "Prayer",
    title: "Friday Night of Prayer",
    body: "A dedicated evening of intercession for families, the church and our nation.",
    date: "Every Friday",
  },
  {
    id: "n3",
    category: "Community",
    title: "Katoloni Community Outreach",
    body: "Serving our neighbours through prayer, practical care and the love of Christ.",
    date: "Monthly",
  },
  {
    id: "n4",
    category: "Project",
    title: "Sanctuary Building Fund Update",
    body: "Thank you for faithful giving. Phase one foundations continue — every gift builds the house.",
    date: "This month",
  },
];

const defaultTestimonies: Testimony[] = [
  {
    id: "t1",
    name: "Patricia M.",
    initials: "PM",
    quote: "I came carrying a burden and found people who stood with me in prayer. The Lord gave our family peace.",
    date: "2026",
  },
  {
    id: "t2",
    name: "Edith N.",
    initials: "EN",
    quote: "Through the teaching of the Word, my faith has become steady and my home has found new hope.",
    date: "2026",
  },
  {
    id: "t3",
    name: "James W.",
    initials: "JW",
    quote: "Katoloni is more than where we worship. It is where we have learned to serve one another.",
    date: "2025",
  },
  {
    id: "t4",
    name: "Ann M.",
    initials: "AM",
    quote: "I prayed for direction, and God met me here with clarity, community and courage for the next step.",
    date: "2025",
  },
];

const defaultSettings: SiteSettings = {
  bishopPhone: "0721 514 653",
  bishopEmail: "hello@mountainofthelord.org",
  heroImage:
    "https://images.pexels.com/photos/35266419/pexels-photo-35266419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2400",
  announcement: "Welcome to the mountain — a house of prayer for all people.",
};

function ensureSeed() {
  if (!localStorage.getItem(KEYS.notices)) write(KEYS.notices, defaultNotices);
  if (!localStorage.getItem(KEYS.testimonies)) write(KEYS.testimonies, defaultTestimonies);
  if (!localStorage.getItem(KEYS.settings)) write(KEYS.settings, defaultSettings);
  if (!localStorage.getItem(KEYS.bookings)) write(KEYS.bookings, [] as Booking[]);
  if (!localStorage.getItem(KEYS.prayers)) write(KEYS.prayers, [] as PrayerRequest[]);
  if (!localStorage.getItem(KEYS.contacts)) write(KEYS.contacts, [] as ContactMessage[]);
  if (!localStorage.getItem(KEYS.library)) write(KEYS.library, [] as LibraryRequest[]);
  if (!localStorage.getItem(KEYS.complaints)) write(KEYS.complaints, [] as Complaint[]);
}

ensureSeed();

export const store = {
  getBookings: () => read<Booking[]>(KEYS.bookings, []),
  saveBooking: (b: Booking) => {
    const all = store.getBookings();
    all.unshift(b);
    write(KEYS.bookings, all);
    return b;
  },
  updateBooking: (id: string, patch: Partial<Booking>) => {
    const all = store.getBookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
    write(KEYS.bookings, all);
  },
  findBooking: (codeOrPhone: string) => {
    const q = codeOrPhone.trim().toLowerCase();
    return store.getBookings().filter((b) => b.code.toLowerCase() === q || b.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")));
  },

  getNotices: () => read<Notice[]>(KEYS.notices, defaultNotices),
  saveNotice: (n: Notice) => {
    const all = [n, ...store.getNotices()];
    write(KEYS.notices, all);
  },
  deleteNotice: (id: string) => write(KEYS.notices, store.getNotices().filter((n) => n.id !== id)),

  getTestimonies: () => read<Testimony[]>(KEYS.testimonies, defaultTestimonies),
  saveTestimony: (t: Testimony) => write(KEYS.testimonies, [t, ...store.getTestimonies()]),
  deleteTestimony: (id: string) => write(KEYS.testimonies, store.getTestimonies().filter((t) => t.id !== id)),

  getPrayers: () => read<PrayerRequest[]>(KEYS.prayers, []),
  savePrayer: (p: PrayerRequest) => write(KEYS.prayers, [p, ...store.getPrayers()]),
  updatePrayer: (id: string, patch: Partial<PrayerRequest>) => {
    write(KEYS.prayers, store.getPrayers().map((p) => (p.id === id ? { ...p, ...patch } : p)));
  },

  getContacts: () => read<ContactMessage[]>(KEYS.contacts, []),
  saveContact: (c: ContactMessage) => write(KEYS.contacts, [c, ...store.getContacts()]),
  updateContact: (id: string, patch: Partial<ContactMessage>) => {
    write(KEYS.contacts, store.getContacts().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },
  deleteContact: (id: string) => write(KEYS.contacts, store.getContacts().filter((c) => c.id !== id)),

  getLibrary: () => read<LibraryRequest[]>(KEYS.library, []),
  saveLibrary: (l: LibraryRequest) => write(KEYS.library, [l, ...store.getLibrary()]),
  updateLibrary: (id: string, patch: Partial<LibraryRequest>) => {
    write(KEYS.library, store.getLibrary().map((l) => (l.id === id ? { ...l, ...patch } : l)));
  },

  getComplaints: () => read<Complaint[]>(KEYS.complaints, []),
  saveComplaint: (c: Complaint) => write(KEYS.complaints, [c, ...store.getComplaints()]),
  updateComplaint: (id: string, patch: Partial<Complaint>) => {
    write(KEYS.complaints, store.getComplaints().map((c) => (c.id === id ? { ...c, ...patch } : c)));
  },

  getSettings: () => read<SiteSettings>(KEYS.settings, defaultSettings),
  saveSettings: (s: SiteSettings) => write(KEYS.settings, s),

  isAdmin: () => read<boolean>(KEYS.adminSession, false),
  loginAdmin: (pass: string) => {
    // Demo credentials — change in production
    if (pass === "katoloni2026" || pass === "admin@katoloni") {
      write(KEYS.adminSession, true);
      return true;
    }
    return false;
  },
  logoutAdmin: () => write(KEYS.adminSession, false),
};

export const ROOM_TYPES = [
  { id: "day-retreat", name: "Day Retreat Room", rate: 2500, desc: "Quiet space for prayer & counselling (day use)" },
  { id: "overnight", name: "Overnight Guest Room", rate: 4500, desc: "Simple lodging for visiting ministers & guests" },
  { id: "conference", name: "Small Conference Hall", rate: 8000, desc: "Meetings, seminars & ministry trainings" },
  { id: "event", name: "Event / Fellowship Space", rate: 12000, desc: "Celebrations, showers & larger gatherings" },
];

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 1;
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  const days = Math.max(1, Math.ceil((b - a) / (1000 * 60 * 60 * 24)));
  return days;
}
