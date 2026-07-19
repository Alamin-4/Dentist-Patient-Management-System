export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    name: string;
    emailVerified: boolean;
    verifiedAt: string | null;
    image: string | null;
    role: "PATIENT" | "DENTIST" | "ADMIN" | "SUPER_ADMIN";
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    twoFactorEnabled: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}