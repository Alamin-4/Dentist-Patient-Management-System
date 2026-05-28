export type PatientKol = {
  id: string;
  name: string;
  firstName: string;
  credentials: string;
  specialty: string;
  country: string;
  yearsExperience: number;
  languages: string[];
  bio: string;
  initials: string;
  avatarColor: string;
  headshot?: string | null;
};

const patientKolData: PatientKol[] = [
  {
    id: "kol-1",
    name: "Dr. Elena Marquez",
    firstName: "Elena",
    credentials: "DDS, MSc Implantology",
    specialty: "Full Arch Implantology",
    country: "Spain",
    yearsExperience: 22,
    languages: ["EN", "ES"],
    bio: "Pioneer in zygomatic implant techniques with publications in the IJOMS. Advises RatedDocs on clinical verification standards.",
    initials: "EM",
    avatarColor: "#1D4ED8",
    headshot: null,
  },
  {
    id: "kol-2",
    name: "Dr. Mehmet Aydin",
    firstName: "Mehmet",
    credentials: "DDS, PhD",
    specialty: "Aesthetic Dentistry & Veneers",
    country: "Turkey",
    yearsExperience: 18,
    languages: ["EN", "TR"],
    bio: "Course director for several international veneer training programmes. Endorses RatedDocs as a transparency-first platform.",
    initials: "MA",
    avatarColor: "#059669",
    headshot: null,
  },
  {
    id: "kol-3",
    name: "Dr. Priya Shah",
    firstName: "Priya",
    credentials: "BDS, MFDS RCS(Eng)",
    specialty: "Orthodontics",
    country: "United Kingdom",
    yearsExperience: 14,
    languages: ["EN"],
    bio: "Speaker at the British Orthodontic Conference. Works with RatedDocs on patient-safety guidance.",
    initials: "PS",
    avatarColor: "#7C3AED",
    headshot: null,
  },
  {
    id: "kol-4",
    name: "Prof. Carlos Mendez",
    firstName: "Carlos",
    credentials: "DDS, PhD, ITI Fellow",
    specialty: "Implants & Oral Surgery",
    country: "Spain",
    yearsExperience: 24,
    languages: ["EN", "ES", "PT"],
    bio: "Leads the implantology department at the University of Barcelona. Has placed over 8,000 implants and lectures extensively across Europe.",
    initials: "CM",
    avatarColor: "#DC2626",
    headshot: null,
  },
  {
    id: "kol-5",
    name: "Dr. Sarah Kim",
    firstName: "Sarah",
    credentials: "DDS, MSD",
    specialty: "Orthodontics",
    country: "United States",
    yearsExperience: 18,
    languages: ["EN", "KO"],
    bio: "Board-certified orthodontist specialising in clear aligner therapy. Has published over 30 peer-reviewed articles on digital orthodontics.",
    initials: "SK",
    avatarColor: "#0891B2",
    headshot: null,
  },
  {
    id: "kol-6",
    name: "Dr. Amira Haddad",
    firstName: "Amira",
    credentials: "DDS, MSc Periodontics",
    specialty: "Periodontics & Gum Health",
    country: "France",
    yearsExperience: 16,
    languages: ["EN", "FR", "AR"],
    bio: "Specialist in minimally invasive periodontal therapy. Collaborates with RatedDocs to ensure periodontal standards are upheld in verification reviews.",
    initials: "AH",
    avatarColor: "#B45309",
    headshot: null,
  },
];

export default patientKolData;
