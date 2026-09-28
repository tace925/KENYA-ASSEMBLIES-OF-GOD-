// src/lib/storage.ts

export type RoomType = {
  id: string;
  name: string;
  desc: string;
  rate: number;
};

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
  notes: string;
};

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  note: string;
  policy: string;
};

export type LibraryRequest = {
  id: string;
  code: string;
  name: string;
  phone: string;
  bookTitle: string;
  pickupDate: string;
  createdAt: string;
  status: "pending" | "confirmed" | "rejected" | "ready" | "collected";
};

export type Notice = {
  id: string;
  category: string;
  title: string;
  body: string;
  date: string;
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

export type PrayerRequest = {
  id: string;
  name: string;
  phone: string;
  request: string;
  private: boolean;
  createdAt: string;
  status: "new" | "praying" | "answered";
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

export type Testimony = {
  id: string;
  name: string;
  initials: string;
  quote: string;
  date: string;
};

export type SiteSettings = {
  announcement: string;
  heroImage: string;
  bishopPhone: string;
  bishopEmail: string;
  bookingNotice: string;
  bookingPolicy: string;
};

export type Ministry = {
  id: string;
  name: string;
  desc: string;
};

export type ScheduleItem = {
  id: string;
  day: string;
  time: string;
  item: string;
};

export type HomeCell = {
  id: string;
  area: string;
  day: string;
  leader: string;
  focus: string;
  phone?: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  caption: string;
  tall?: boolean;
};

export type Confession = {
  id: string;
  week: string;
  title: string;
  speaker: string;
  duration: string;
};

export type Leader = {
  id: string;
  initials: string;
  role: string;
  focus: string;
};

const KEYS = {
  bookings: "mol_bookings",
  notices: "mol_notices",
  contacts: "mol_contacts",
  prayers: "mol_prayers",
  library: "mol_library",
  libraryBooks: "mol_library_books",
  complaints: "mol_complaints",
  testimonies: "mol_testimonies",
  settings: "mol_settings",
  ministries: "mol_ministries",
  schedule: "mol_schedule",
  homeCells: "mol_home_cells",
  gallery: "mol_gallery",
  confessions: "mol_confessions",
  leadership: "mol_leadership",
  roomTypes: "mol_room_types",
  admin: "mol_admin_auth",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function bookingCode() {
  return "MOL" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function libraryCode() {
  return "LIB" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

const defaultRoomTypes: RoomType[] = [
  { id: "single", name: "Single Guest Room", desc: "Comfortable room for one person.", rate: 2500 },
  { id: "double", name: "Double Room", desc: "Shared or couple accommodation.", rate: 4000 },
  { id: "family", name: "Family Room", desc: "Spacious room for families.", rate: 5500 },
  { id: "hall", name: "Fellowship Hall", desc: "For meetings, seminars and gatherings.", rate: 8000 },
];

const defaultSettings: SiteSettings = {
  announcement: "Welcome to the Mountain — A House of Prayer for All People.",
  heroImage: "https://images.pexels.com/photos/36425621/pexels-photo-36425621.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000",
  bishopPhone: "0712 345 678",
  bishopEmail: "office@mountainofthelord.org",
  bookingNotice: "Please pay via M-Pesa and keep your transaction code.",
  bookingPolicy: "Bookings are confirmed after payment verification. Cancellation must be done 24 hours before check-in.",
};

export const store = {
  // Auth
  isAdmin() {
    return localStorage.getItem(KEYS.admin) === "true";
  },
  loginAdmin(pass: string) {
    if (pass === "katoloni2026") {
      localStorage.setItem(KEYS.admin, "true");
      return true;
    }
    return false;
  },
  logoutAdmin() {
    localStorage.removeItem(KEYS.admin);
  },

  // Room Types
  getRoomTypes(): RoomType[] {
    return read(KEYS.roomTypes, defaultRoomTypes);
  },
  saveRoomTypes(list: RoomType[]) {
    write(KEYS.roomTypes, list);
  },

  // Bookings
  getBookings(): Booking[] {
    return read(KEYS.bookings, []);
  },
  saveBooking(b: Booking) {
    const list = this.getBookings();
    list.unshift(b);
    write(KEYS.bookings, list);
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    const list = this.getBookings().map((b) => (b.id === id ? { ...b, ...patch } : b));
    write(KEYS.bookings, list);
  },
  findBooking(query: string) {
    const q = query.toLowerCase().trim();
    return this.getBookings().filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.name.toLowerCase().includes(q)
    );
  },

  // Library Books Catalogue
  getLibraryBooks(): LibraryBook[] {
    return read(KEYS.libraryBooks, []);
  },
  saveLibraryBooks(list: LibraryBook[]) {
    write(KEYS.libraryBooks, list);
  },

  // Library Requests
  getLibrary(): LibraryRequest[] {
    return read(KEYS.library, []);
  },
  saveLibrary(l: LibraryRequest) {
    const list = this.getLibrary();
    list.unshift(l);
    write(KEYS.library, list);
  },
  updateLibrary(id: string, patch: Partial<LibraryRequest>) {
    write(
      KEYS.library,
      this.getLibrary().map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  },
  findLibrary(query: string) {
    const q = query.toLowerCase().trim();
    return this.getLibrary().filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.name.toLowerCase().includes(q)
    );
  },

  // Notices
  getNotices(): Notice[] {
    return read(KEYS.notices, []);
  },
  saveNotice(n: Notice) {
    const list = this.getNotices();
    list.unshift(n);
    write(KEYS.notices, list);
  },
  deleteNotice(id: string) {
    write(KEYS.notices, this.getNotices().filter((n) => n.id !== id));
  },

  // Contacts
  getContacts(): ContactMessage[] {
    return read(KEYS.contacts, []);
  },
  saveContact(m: ContactMessage) {
    const list = this.getContacts();
    list.unshift(m);
    write(KEYS.contacts, list);
  },
  updateContact(id: string, patch: Partial<ContactMessage>) {
    write(
      KEYS.contacts,
      this.getContacts().map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  },
  deleteContact(id: string) {
    write(KEYS.contacts, this.getContacts().filter((m) => m.id !== id));
  },

  // Prayers
  getPrayers(): PrayerRequest[] {
    return read(KEYS.prayers, []);
  },
  savePrayer(p: PrayerRequest) {
    const list = this.getPrayers();
    list.unshift(p);
    write(KEYS.prayers, list);
  },
  updatePrayer(id: string, patch: Partial<PrayerRequest>) {
    write(
      KEYS.prayers,
      this.getPrayers().map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  },

  // Complaints
  getComplaints(): Complaint[] {
    return read(KEYS.complaints, []);
  },
  saveComplaint(c: Complaint) {
    const list = this.getComplaints();
    list.unshift(c);
    write(KEYS.complaints, list);
  },
  updateComplaint(id: string, patch: Partial<Complaint>) {
    write(
      KEYS.complaints,
      this.getComplaints().map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  },

  // Testimonies
  getTestimonies(): Testimony[] {
    return read(KEYS.testimonies, []);
  },
  saveTestimony(t: Testimony) {
    const list = this.getTestimonies();
    list.unshift(t);
    write(KEYS.testimonies, list);
  },
  deleteTestimony(id: string) {
    write(KEYS.testimonies, this.getTestimonies().filter((t) => t.id !== id));
  },

  // Settings
  getSettings(): SiteSettings {
    return read(KEYS.settings, defaultSettings);
  },
  saveSettings(s: SiteSettings) {
    write(KEYS.settings, s);
  },

  // Content
  getMinistries(): Ministry[] {
    return read(KEYS.ministries, []);
  },
  saveMinistries(list: Ministry[]) {
    write(KEYS.ministries, list);
  },

  getSchedule(): ScheduleItem[] {
    return read(KEYS.schedule, []);
  },
  saveSchedule(list: ScheduleItem[]) {
    write(KEYS.schedule, list);
  },

  getHomeCells(): HomeCell[] {
    return read(KEYS.homeCells, []);
  },
  saveHomeCells(list: HomeCell[]) {
    write(KEYS.homeCells, list);
  },

  getGallery(): GalleryImage[] {
    return read(KEYS.gallery, []);
  },
  saveGallery(list: GalleryImage[]) {
    write(KEYS.gallery, list);
  },

  getConfessions(): Confession[] {
    return read(KEYS.confessions, []);
  },
  saveConfessions(list: Confession[]) {
    write(KEYS.confessions, list);
  },

  getLeadership(): Leader[] {
    return read(KEYS.leadership, []);
  },
  saveLeadership(list: Leader[]) {
    write(KEYS.leadership, list);
  },
};