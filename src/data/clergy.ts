export interface ClergyMember {
  id: string;
  name: string;
  title: string;
  role: "Bishop" | "Pastor";
  availableDays: string[];
}

export const clergy: ClergyMember[] = [
  {
    id: "bishop-1",
    name: "Bishop John Kamau",
    title: "Senior Bishop",
    role: "Bishop",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: "pastor-1",
    name: "Pastor Mary Wanjiku",
    title: "Senior Pastor",
    role: "Pastor",
    availableDays: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: "pastor-2",
    name: "Pastor David Ochieng",
    title: "Associate Pastor",
    role: "Pastor",
    availableDays: ["Tuesday", "Thursday", "Sunday"],
  },
];