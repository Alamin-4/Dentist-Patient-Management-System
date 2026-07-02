// components/dentist-bookings-tab.tsx
export function DentistBookingsTab({ bookings }: { bookings: any[] }) {
    if (!bookings || bookings.length === 0) {
        return <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">No bookings data available yet.</div>;
    }
    return <div>Render your bookings table here...</div>;
}

// components/dentist-consultations-tab.tsx
export function DentistConsultationsTab({ consultations }: { consultations: any[] }) {
    if (!consultations || consultations.length === 0) {
        return <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">No consultations data available yet.</div>;
    }
    return <div>Render your consultations table here...</div>;
}

// components/dentist-reviews-tab.tsx
export function DentistReviewsTab({ reviews, totalReviews }: { reviews: any[], totalReviews: number }) {
    if (!reviews || reviews.length === 0) {
        return <div className="rounded-lg border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">No reviews data available yet.</div>;
    }
    return <div>Render your reviews list here...</div>;
}