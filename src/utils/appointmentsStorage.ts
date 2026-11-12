export interface Appointment {
  id: string;
  clergyId: string;
  clergyName: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  reason: string;
  createdAt: string;
}

const STORAGE_KEY = "mol_appointments";

export const getAppointments = (): Appointment[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveAppointment = (
  appointment: Omit<Appointment, "id" | "createdAt">
): Appointment => {
  const newAppointment: Appointment = {
    ...appointment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const existing = getAppointments();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newAppointment]));
  return newAppointment;
};

export const deleteAppointment = (id: string) => {
  const updated = getAppointments().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};