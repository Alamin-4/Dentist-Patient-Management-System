"use client";
// Debug utility to view and manage stored data
// This is only for development purposes

interface StorageViewer {
  dentists: any[];
  bookingData: any;
  submittedBookings: any[];
}

export function viewAllStorageData(): StorageViewer {
  if (typeof window === "undefined") {
    return { dentists: [], bookingData: null, submittedBookings: [] };
  }

  try {
    const dentists = localStorage.getItem("dentists_data")
      ? JSON.parse(localStorage.getItem("dentists_data") || "[]")
      : [];
    const bookingData = localStorage.getItem("booking_form_data")
      ? JSON.parse(localStorage.getItem("booking_form_data") || "{}")
      : {};
    const submittedBookings = localStorage.getItem("submitted_bookings")
      ? JSON.parse(localStorage.getItem("submitted_bookings") || "[]")
      : [];

    return {
      dentists,
      bookingData,
      submittedBookings,
    };
  } catch (error) {
    console.error("Error reading storage:", error);
    return { dentists: [], bookingData: null, submittedBookings: [] };
  }
}

export function clearAllStorageData() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("dentists_data");
    localStorage.removeItem("booking_form_data");
    localStorage.removeItem("submitted_bookings");
    localStorage.removeItem("selected_dentist");
    console.log("All storage data cleared");
  }
}

export function exportStorageData() {
  const data = viewAllStorageData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `storage-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function logStorageData() {
  const data = viewAllStorageData();
  console.group("📦 localStorage Data");
  console.log("Dentists:", data.dentists);
  console.log("Current Booking:", data.bookingData);
  console.log("Submitted Bookings:", data.submittedBookings);
  console.groupEnd();
}
