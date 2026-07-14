export interface DentistDirectoryItem {
    id: string;
    name: string;
    image?: string | null;
    specialty: string | null;
    city: string | null;
    clinicName: string | null;
    phone: string | null;
    doctoraliaRating: number | null;
    doctoraliaReviewCount: number | null;
    googleRating: number | null;
    googleReviewCount: number | null;
    profileUrl: string | null;
    googleMapsUrl: string | null;
    fullAddress: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    slug: string;
    status: string;
    isClaimable?: boolean;
    claimedByUserId?: string | null;
    claimedAt?: string | null;
    claimFormData?: {
        motivation: string;
        procedures: string[];
        hasGuarantees: boolean;
        hasMaterialsDocs: boolean;
        yearsOfExperience: number;
        hasBeforeAfterPhotos: boolean;
        hasSterilizationDocs: boolean;
        internationalPatients: number;
        hasEducationCertificates: boolean;
    } | null;
    membershipPlan?: string | null;
    membershipPaidAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
}