// types.ts
export type Patient = {
    id: string;
    name: string;
    image: string | null;
    email: string;
    phone: string;
    city: string;
    status: "Active" | "Inactive";
    total_bookings: number;
    last_booking: string;
    joined: string;
    initials: string;
    avatar_color: string;
};

export type StatusFilter = "all" | "Active" | "Inactive";