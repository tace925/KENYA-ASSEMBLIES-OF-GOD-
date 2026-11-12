export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const publicFaq: FAQItem[] = [
  {
    id: "1",
    question: "How do I book an appointment with a Pastor or the Bishop?",
    answer: "Go to the Appointments page from the menu, select the Pastor or Bishop, choose a date and time, fill your details and submit.",
    keywords: ["appointment", "pastor", "bishop", "meet", "book appointment", "counselling"],
  },
  {
    id: "2",
    question: "How do I book a room or the Fellowship Hall?",
    answer: "Go to the Booking page, choose the space you want (Single Room, Double Room, Family Room or Fellowship Hall), fill the form and pay via M-Pesa.",
    keywords: ["room", "booking", "hall", "guest", "accommodation", "mpesa"],
  },
  {
    id: "3",
    question: "I’m lost. How do I go back to the homepage?",
    answer: "Click the Mountain of the Lord logo at the top left, or open the menu and click Home.",
    keywords: ["lost", "home", "homepage", "back", "navigate"],
  },
  {
    id: "4",
    question: "Where can I find service times?",
    answer: "Service times are shown on the Home page and the Services page.",
    keywords: ["service", "time", "sunday", "worship", "when"],
  },
  {
    id: "5",
    question: "How do I contact the church?",
    answer: "Go to the Contact page from the menu, or book an appointment with a Pastor.",
    keywords: ["contact", "phone", "email", "reach", "office"],
  },
];

export const adminFaq: FAQItem[] = [
  {
    id: "a1",
    question: "Where are appointments with Pastors stored?",
    answer: "All pastor/bishop appointments are stored in localStorage under the key `mol_appointments`. You can view them in the Admin → Appointments section.",
    keywords: ["appointment", "storage", "localstorage", "pastor", "where stored"],
  },
  {
    id: "a2",
    question: "How do I view all room bookings?",
    answer: "Go to Admin → Bookings. That section shows all room and hall reservations.",
    keywords: ["bookings", "rooms", "view bookings", "admin bookings"],
  },
  {
    id: "a3",
    question: "How does the public Help Terminal work?",
    answer: "The floating help button on the public site only answers basic guideline questions. It uses the publicFaq data and simple keyword matching.",
    keywords: ["help", "floating", "public help", "terminal"],
  },
  {
    id: "a4",
    question: "How can I clear all appointments?",
    answer: "Open browser DevTools → Application → Local Storage → delete the key `mol_appointments`.",
    keywords: ["clear", "delete", "reset", "appointments"],
  },
  {
    id: "a5",
    question: "What is the difference between Booking and Appointments?",
    answer: "Booking page = rooms & halls (with payment). Appointments page = meetings with Pastors and Bishop (no payment).",
    keywords: ["difference", "booking vs appointment", "rooms", "pastors"],
  },
];