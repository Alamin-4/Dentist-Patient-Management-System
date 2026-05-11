export type Dentist = {
  id: string;
  name: string;
  specialty: string;
  imageSeed: string;
  rating: number;
  reviewCount: number;
  image: string;
  location: string;
  city: string;
  country: string;
  price: number;
  rdvScore: number;
  verified: boolean;
  procedures: string[];
  tags: string[];
  languages: string[];
  coords: {
    lat: number;
    lng: number;
  };
};

export const dentists: Dentist[] = [
  {
    id: "dr-sarah-thompson",
    name: "Dr. Sarah Thompson",
    specialty: "Orthodontist",
    imageSeed: "sarah-thompson",
    image: "/images/dentist.png",
    rating: 5,
    reviewCount: 48,
    location: "Polanco, Mexico City",
    city: "Polanco",
    country: "Mexico",
    price: 1500,
    rdvScore: 100,
    verified: true,
    procedures: ["Orthodontics", "Aligners"],
    tags: ["No Surprise Guarantee", "EN - ES"],
    languages: ["English", "Spanish"],
    coords: { lat: 19.4326, lng: -99.1733 },
  },
  {
    id: "dr-emily-carter",
    name: "Dr. Emily Carter",
    specialty: "Restorative Dentist",
    imageSeed: "emily-carter",
    image: "/images/dentist.png",
    rating: 4.9,
    reviewCount: 31,
    location: "Roma Norte, Mexico City",
    city: "Roma Norte",
    country: "Mexico",
    price: 1350,
    rdvScore: 98,
    verified: true,
    procedures: ["Crowns", "Veneers"],
    tags: ["Same Day Booking", "EN - ES"],
    languages: ["English", "Spanish"],
    coords: { lat: 19.4146, lng: -99.1622 },
  },
  {
    id: "dr-julian-mora",
    name: "Dr. Julian Mora",
    specialty: "Implant Dentist",
    imageSeed: "julian-mora",
    image: "/images/dentist.png",
    rating: 4.8,
    reviewCount: 29,
    location: "Roma Norte, Mexico City",
    city: "Roma Norte",
    country: "Mexico",
    price: 1600,
    rdvScore: 96,
    verified: true,
    procedures: ["Implants", "Bone Grafting"],
    tags: ["No Surprise Guarantee", "EN"],
    languages: ["English"],
    coords: { lat: 19.4098, lng: -99.1568 },
  },
  {
    id: "dr-ana-lopez",
    name: "Dr. Ana Lopez",
    specialty: "Cosmetic Dentist",
    imageSeed: "ana-lopez",
    image: "/images/dentist.png",
    rating: 4.7,
    reviewCount: 22,
    location: "Coyoacan, Mexico City",
    city: "Coyoacan",
    country: "Mexico",
    price: 1200,
    rdvScore: 94,
    verified: true,
    procedures: ["Whitening", "Smile Design"],
    tags: ["EN - ES", "Weekend Availability"],
    languages: ["English", "Spanish"],
    coords: { lat: 19.3509, lng: -99.1611 },
  },
  {
    id: "dr-isaac-reyes",
    name: "Dr. Isaac Reyes",
    specialty: "General Dentist",
    imageSeed: "isaac-reyes",
    image: "/images/dentist.png",
    rating: 4.6,
    reviewCount: 18,
    location: "Del Valle, Mexico City",
    city: "Del Valle",
    country: "Mexico",
    price: 980,
    rdvScore: 92,
    verified: true,
    procedures: ["Cleanings", "Fillings"],
    tags: ["Family Friendly", "EN - ES"],
    languages: ["English", "Spanish"],
    coords: { lat: 19.3847, lng: -99.1629 },
  },
  {
    id: "dr-lucia-gomez",
    name: "Dr. Lucia Gomez",
    specialty: "Periodontist",
    imageSeed: "lucia-gomez",
    image: "/images/dentist.png",
    rating: 4.5,
    reviewCount: 15,
    location: "Napoles, Mexico City",
    city: "Napoles",
    country: "Mexico",
    price: 1100,
    rdvScore: 90,
    verified: true,
    procedures: ["Gum Care", "Deep Cleaning"],
    tags: ["Flexible Schedule", "EN - ES"],
    languages: ["English", "Spanish"],
    coords: { lat: 19.3929, lng: -99.1768 },
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

export const countryOptions = ["All Countries", "Mexico"];

export const cityOptions = [
  "All Cities",
  "Polanco",
  "Roma Norte",
  "Coyoacan",
  "Del Valle",
  "Napoles",
];
