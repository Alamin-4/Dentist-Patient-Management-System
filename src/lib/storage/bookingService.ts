// Booking Form Data Types and Services
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  country: string;
}

export interface BookingFormData {
  personalInfo: PersonalInfo;
  procedure: string;
  budget: string;
  travelFrom: string;
  travelTo: string;
  dentalHistory: {
    lastVisit: string;
    conditions: string[];
    additionalInfo: string;
  };
  photos: {
    required: File[];
    recommended: File[];
  };
  xray: File | null;
}

const BOOKING_STORAGE_KEY = "booking_form_data";
const SELECTED_DENTIST_KEY = "selected_dentist";

const INITIAL_BOOKING_DATA: BookingFormData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
  },
  procedure: "Porcelain Veneers",
  budget: "",
  travelFrom: "",
  travelTo: "",
  dentalHistory: {
    lastVisit: "",
    conditions: [],
    additionalInfo: "",
  },
  photos: {
    required: [],
    recommended: [],
  },
  xray: null,
};

export function initializeBookingData() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(BOOKING_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(INITIAL_BOOKING_DATA));
    }
  }
}

export function getBookingData(): BookingFormData {
  if (typeof window === "undefined") return INITIAL_BOOKING_DATA;
  try {
    const data = localStorage.getItem(BOOKING_STORAGE_KEY);
    return data ? { ...INITIAL_BOOKING_DATA, ...JSON.parse(data) } : INITIAL_BOOKING_DATA;
  } catch {
    return INITIAL_BOOKING_DATA;
  }
}

export function updateBookingData(updates: Partial<BookingFormData>): BookingFormData {
  if (typeof window === "undefined") return INITIAL_BOOKING_DATA;
  try {
    const current = getBookingData();
    const updated = { ...current, ...updates };
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_BOOKING_DATA;
  }
}

export function updatePersonalInfo(info: Partial<PersonalInfo>) {
  const current = getBookingData();
  const updated = { ...current, personalInfo: { ...current.personalInfo, ...info } };
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateDentalHistory(history: Partial<BookingFormData["dentalHistory"]>) {
  const current = getBookingData();
  const updated = { ...current, dentalHistory: { ...current.dentalHistory, ...history } };
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateTreatmentDetails(
  details: Partial<Pick<BookingFormData, "procedure" | "budget" | "travelFrom" | "travelTo">>,
) {
  const current = getBookingData();
  const updated = { ...current, ...details };
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearBookingData() {
  if (typeof window !== "undefined") {
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(INITIAL_BOOKING_DATA));
  }
}

// Selected Dentist Management
export function setSelectedDentist(dentistId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(SELECTED_DENTIST_KEY, dentistId);
  }
}

export function getSelectedDentist(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SELECTED_DENTIST_KEY);
  } catch {
    return null;
  }
}

export function clearSelectedDentist() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SELECTED_DENTIST_KEY);
  }
}

// Booking Submissions
const BOOKINGS_KEY = "submitted_bookings";

export interface SubmittedBooking extends BookingFormData {
  id: string;
  dentistId: string;
  submittedAt: string;
}

export function submitBooking(dentistId: string): SubmittedBooking {
  if (typeof window === "undefined") {
    throw new Error("Cannot submit booking outside of browser");
  }

  const bookingData = getBookingData();
  const booking: SubmittedBooking = {
    ...bookingData,
    id: `booking_${Date.now()}`,
    dentistId,
    submittedAt: new Date().toISOString(),
  };

  try {
    const existing = localStorage.getItem(BOOKINGS_KEY);
    const bookings: SubmittedBooking[] = existing ? JSON.parse(existing) : [];
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    clearBookingData();
    clearSelectedDentist();
    return booking;
  } catch {
    throw new Error("Failed to submit booking");
  }
}

export function getSubmittedBookings(): SubmittedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(BOOKINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
