export type TabType = "Upcoming" | "Active" | "Treatment Estimate";

export interface Consultation {
  id: string;
  patientName: string;
  email: string;
  procedure: string;
  budget: string;
  date: string;
  timeSlot: string;
  status: TabType;
  treatmentPlanStatus?: "Not Sent" | "Awaiting response" | "Rejected";
}

export const dummyData: Consultation[] = [
  // Data for "Upcoming" Tab (image_9de405.png)
  {
    id: "1",
    patientName: "Jacob Smith",
    email: "jacob.smith@sample.com",
    procedure: "Dental Implants",
    budget: "$1254",
    date: "Wed 24 Jan, 2024",
    timeSlot: "09:00PM",
    status: "Upcoming",
  },
  {
    id: "2",
    patientName: "Jacob Smith",
    email: "jacob.smith@sample.com",
    procedure: "Dental Implants",
    budget: "$1254",
    date: "Wed 24 Jan, 2024",
    timeSlot: "09:00PM",
    status: "Upcoming",
  },
  {
    id: "3",
    patientName: "Jacob Smith",
    email: "jacob.smith@sample.com",
    procedure: "Dental Implants",
    budget: "$1254",
    date: "Wed 24 Jan, 2024",
    timeSlot: "09:00PM",
    status: "Upcoming",
  },

  // Data for "Upcoming" Tab (image_9ddd1b.png)
  {
    id: "4",
    patientName: "Jacob Smith",
    email: "jacob.smith@sample.com",
    procedure: "Dental Implants",
    budget: "$1254",
    date: "Wed 24 Jan, 2024",
    timeSlot: "09:00PM",
    status: "Upcoming", // Shows "Join Meeting" for first card in my logic
  },
  {
    id: "5",
    patientName: "Jacob Smith",
    email: "jacob.smith@sample.com",
    procedure: "Dental Implants",
    budget: "$1254",
    date: "Wed 24 Jan, 2024",
    timeSlot: "09:00PM",
    status: "Upcoming", // Shows "Mark as Complete"
  },

  // Data for "Completed" Tab (image_9dd9d5.png)
  {
    id: "6",
    patientName: "Emily Johnson",
    email: "emily.johnson@sample.com",
    procedure: "Orthodontics",
    budget: "$980",
    date: "Thu 25 Jan, 2024",
    timeSlot: "11:30AM",
    status: "Treatment Estimate",
    treatmentPlanStatus: "Not Sent",
  },
  {
    id: "7",
    patientName: "Michael Lee",
    email: "michael.lee@sample.com",
    procedure: "Periodontics",
    budget: "$1,350",
    date: "Fri 26 Jan, 2024",
    timeSlot: "2:00PM",
    status: "Treatment Estimate",
    treatmentPlanStatus: "Awaiting response",
  },
  {
    id: "8",
    patientName: "Michael Lee",
    email: "michael.lee@sample.com",
    procedure: "Periodontics",
    budget: "$1,350",
    date: "Fri 26 Jan, 2024",
    timeSlot: "2:00PM",
    status: "Treatment Estimate",
    treatmentPlanStatus: "Rejected",
  },
];
