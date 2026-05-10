export type Dentist = {
  id: string;
  name: string;
  specialty: string;
  imageSeed: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  price: number;
  rdvScore: number;
  verified: boolean;
  procedures: string[];
  tags: string[];
  coords: {
    x: number;
    y: number;
  };
};

export const dentists: Dentist[] = [
  {
    id: "dr-sarah-thompson",
    name: "Dr. Sarah Thompson",
    specialty: "Orthodontist",
    imageSeed: "sarah-thompson",
    image: "/images/dentists/sarah-thompson.jpg",
    rating: 5,
    reviewCount: 48,
    location: "Mexico City, Mexico",
    price: 1500,
    rdvScore: 100,
    verified: true,
    procedures: ["Orthodontics", "Aligners"],
    tags: ["No Surprise Guarantee", "EN - ES"],
    coords: { x: 22, y: 26 },
  },
  {
    id: "dr-emily-carter",
    name: "Dr. Emily Carter",
    specialty: "Restorative Dentist",
    imageSeed: "emily-carter",
    image: "/images/dentists/emily-carter.jpg",
    rating: 4.9,
    reviewCount: 31,
    location: "Polanco, Mexico City",
    price: 1350,
    rdvScore: 98,
    verified: true,
    procedures: ["Crowns", "Veneers"],
    tags: ["Same Day Booking", "EN - ES"],
    coords: { x: 51, y: 43 },
  },
  {
    id: "dr-julian-mora",
    name: "Dr. Julian Mora",
    specialty: "Implant Dentist",
    imageSeed: "julian-mora",
    image: "/images/dentists/julian-mora.jpg",
    rating: 4.8,
    reviewCount: 29,
    location: "Roma Norte, Mexico City",
    price: 1600,
    rdvScore: 96,
    verified: true,
    procedures: ["Implants", "Bone Grafting"],
    tags: ["No Surprise Guarantee", "EN"],
    coords: { x: 70, y: 28 },
  },
  {
    id: "dr-ana-lopez",
    name: "Dr. Ana Lopez",
    specialty: "Cosmetic Dentist",
    imageSeed: "ana-lopez",
    rating: 4.7,
    reviewCount: 22,
    image: "/images/dentists/ana-lopez.jpg",
    location: "Coyoacan, Mexico City",
    price: 1200,
    rdvScore: 94,
    verified: true,
    procedures: ["Whitening", "Smile Design"],
    tags: ["EN - ES", "Weekend Availability"],
    coords: { x: 34, y: 67 },
  },
  {
    id: "dr-isaac-reyes",
    name: "Dr. Isaac Reyes",
    specialty: "General Dentist",
    imageSeed: "isaac-reyes",
    rating: 4.6,
    reviewCount: 18,
    image: "/images/dentists/isaac-reyes.jpg",
    location: "Del Valle, Mexico City",
    price: 980,
    rdvScore: 92,
    verified: true,
    procedures: ["Cleanings", "Fillings"],
    tags: ["Family Friendly", "EN - ES"],
    coords: { x: 79, y: 64 },
  },
  {
    id: "dr-lucia-gomez",
    name: "Dr. Lucia Gomez",
    specialty: "Periodontist",
    imageSeed: "lucia-gomez",
    rating: 4.5,
    reviewCount: 15,
    image: "/images/dentists/lucia-gomez.jpg",
    location: "Napoles, Mexico City",
    price: 1100,
    rdvScore: 90,
    verified: true,
    procedures: ["Gum Care", "Deep Cleaning"],
    tags: ["Flexible Schedule", "EN - ES"],
    coords: { x: 63, y: 78 },
  },
];

export const procedureOptions = [
  "All Procedures",
  "Orthodontics",
  "Aligners",
  "Crowns",
  "Veneers",
  "Implants",
  "Bone Grafting",
  "Whitening",
  "Smile Design",
  "Cleanings",
  "Fillings",
  "Gum Care",
  "Deep Cleaning",
];
