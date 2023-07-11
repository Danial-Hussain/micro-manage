export interface Appointment {
  id: string;
  userId: string;
  apptName: string;
  apptType: AppointmentType;
  description: string;
  startTime: string;
  endTime: string;
  metadata: string;
  userName: string;
}

export type AppointmentType =
  | "Business"
  | "Engineering"
  | "Legal"
  | "Operations"
  | "Strategic"
  | "Operations"
  | "Sales"
  | "Medical"
  | string;

export const appointmentTypes = [
  "Business",
  "Engineering",
  "Legal",
  "Strategic",
  "Operations",
  "Sales",
  "Medical",
];

export const getColor = (apptType: AppointmentType) => {
  switch (apptType) {
    case "Business":
      return ["text-emerald-400", "bg-emerald-50"];
    case "Engineering":
      return ["text-indigo-400", "bg-indigo-50"];
    case "Legal":
      return ["text-red-400", "bg-red-50"];
    case "Operations":
      return ["text-sky-400", "bg-sky-50"];
    case "Strategic":
      return ["text-orange-400", "bg-orange-50"];
    case "Sales":
      return ["text-pink-400", "bg-pink-50"];
    case "Medical":
      return ["text-blue-400", "bg-blue-50"];
    default:
      return ["text-neutral-600", "bg-neutral-50"];
  }
};
