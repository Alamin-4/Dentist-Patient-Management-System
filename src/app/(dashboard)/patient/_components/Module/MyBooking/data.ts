export interface TreatmentPlan {
  id: string;
  slug: string;
  estimate_status: "pending" | "accepted" | "rejected";
  payment_status: "pending" | "paid" | "refunded";
  doctor: {
    name: string;
    specialty: string;
    image: string;
    rating: number;
    reviewCount: number;
  };
  procedure: {
    name: string;
    breakdown: Array<{ label: string; price: number | string }>;
    totalEstimate: number;
    maxLeeway: number;
  };
  timeline: {
    days: string;
    dates: string;
    remainingTime: string;
  };
}

export const treatmentPlansData: TreatmentPlan[] = [
  {
    id: "TP-001",
    slug: "all-on-4-full-arch",

    estimate_status: "pending",
    payment_status: "pending",
    doctor: {
      name: "Dr. Alex Hemsworth",
      specialty: "Orthodontist",
      image: "/doctors/alex.png",
      rating: 5,
      reviewCount: 8,
    },
    procedure: {
      name: "All-on-4 Full Arch",
      breakdown: [
        { label: "Initial examination", price: "Included" },
        { label: "CBCT scan (if needed)", price: 693 },
        { label: "Temporary prosthesis", price: 1039 },
        { label: "Final fitting & adjustments", price: 346 },
      ],
      totalEstimate: 1075,
      maxLeeway: 1236,
    },
    timeline: {
      days: "4-5 days",
      dates: "June 15-20 2026",
      remainingTime: "12:59:20",
    },
  },
  {
    id: "TP-002",

    slug: "invisalign-full-course",

    estimate_status: "accepted",
    payment_status: "paid",
    doctor: {
      name: "Dr. Eliza Mick",
      specialty: "Orthodontist",
      image: "/doctors/eliza.png",
      rating: 5,
      reviewCount: 12,
    },
    procedure: {
      name: "Invisalign Full Course",
      breakdown: [
        { label: "Consultation", price: "Included" },
        { label: "3D Digital Scan", price: 450 },
        { label: "Aligner Set (Upper/Lower)", price: 3200 },
      ],
      totalEstimate: 3650,
      maxLeeway: 4197,
    },
    timeline: {
      days: "12-18 months",
      dates: "July 01 2026 - Jan 2028",
      remainingTime: "00:00:00",
    },
  },
  {
    id: "TP-003",

    slug: "gum-grafting-procedure",
    estimate_status: "pending",
    payment_status: "pending",
    doctor: {
      name: "Dr. Sarah Jenkins",
      specialty: "Periodontist",
      image: "/doctors/sarah.png",
      rating: 4.8,
      reviewCount: 24,
    },
    procedure: {
      name: "Gum Grafting",
      breakdown: [
        { label: "Deep Cleaning", price: 200 },
        { label: "Tissue Graft Surgery", price: 1500 },
        { label: "Post-op Follow-up", price: "Included" },
      ],
      totalEstimate: 1700,
      maxLeeway: 1955,
    },
    timeline: {
      days: "1-2 days",
      dates: "August 10-12 2026",
      remainingTime: "23:15:05",
    },
  },
  {
    id: "TP-004",

    slug: "single-tooth-implant",
    estimate_status: "accepted",
    payment_status: "paid",
    doctor: {
      name: "Dr. Michael Chen",
      specialty: "Implantologist",
      image: "/doctors/michael.png",
      rating: 4.9,
      reviewCount: 45,
    },
    procedure: {
      name: "Single Tooth Implant",
      breakdown: [
        { label: "Titanium Post", price: 1200 },
        { label: "Abutment", price: 400 },
        { label: "Porcelain Crown", price: 900 },
      ],
      totalEstimate: 2500,
      maxLeeway: 2875,
    },
    timeline: {
      days: "3-6 months",
      dates: "Sept 15 2026 - March 2027",
      remainingTime: "00:00:00",
    },
  },
  {
    id: "TP-005",
    slug: "porcelain-veneers-6-teeth",
    estimate_status: "accepted",
    payment_status: "pending",
    doctor: {
      name: "Dr. Julianna Rossi",
      specialty: "Cosmetic Dentist",
      image: "/doctors/julianna.png",
      rating: 5,
      reviewCount: 19,
    },
    procedure: {
      name: "Porcelain Veneers (6 teeth)",
      breakdown: [
        { label: "Prep & Shaping", price: 600 },
        { label: "Custom Veneers", price: 5400 },
        { label: "Bonding Session", price: 800 },
      ],
      totalEstimate: 6800,
      maxLeeway: 7820,
    },
    timeline: {
      days: "7-10 days",
      dates: "Oct 05-15 2026",
      remainingTime: "47:59:59",
    },
  },
];
