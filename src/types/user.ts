// {
//     "id": "cmqxn5m7p007wlfb16xcdyy87",
//     "name": "Norma Lidia Olvera Zambrano",
//     "specialty": "Orthodontist",
//     "city": "Monterrey",
//     "clinicName": "Clinica Especialidades Fresnos",
//     "phone": "81 1411 6818",
//     "doctoraliaRating": 5,
//     "doctoraliaReviewCount": 153,
//     "googleRating": null,
//     "googleReviewCount": null,
//     "profileUrl": "https://www.doctoralia.com.mx/norma-lidia-olvera-zambrano/dentista-odontologo/nuevo-leon",
//     "googleMapsUrl": "https://www.google.com/maps?cid=4491070267049068888",
//     "fullAddress": "C. Guernica 216, 66636 Cdad. Apodaca, N.L.",
//     "slug": "norma-lidia-olvera-zambrano-monterrey",
//     "status": "CLAIMED",
//     "isClaimable": true,
//     "claimedByUserId": "wprFokiZs6mmbsfRzjgQO8Xf53Al9JR2",
//     "claimedAt": "2026-06-28T11:57:02.784Z",
//     "claimFormData": {
//         "motivation": "Verify your identity, select a premium plan, and start getting international patient leads.\n\n",
//         "procedures": [
//             "Orthodontist"
//         ],
//         "hasGuarantees": true,
//         "hasMaterialsDocs": true,
//         "yearsOfExperience": 5,
//         "hasBeforeAfterPhotos": true,
//         "hasSterilizationDocs": true,
//         "internationalPatients": 10,
//         "hasEducationCertificates": true
//     },
//     "membershipPlan": "1_YEAR",
//     "membershipPaidAt": "2026-06-28T11:57:02.802Z",
//     "createdAt": "2026-06-28T10:23:47.893Z",
//     "updatedAt": "2026-06-28T11:57:02.803Z"
// }

export interface DentistDirectoryItem {
    id: string;
    name: string;
    specialty: string;
    city: string;
    clinicName: string;
    phone: string;
    doctoraliaRating: number;
    doctoraliaReviewCount: number;
    googleRating: number | null;
    googleReviewCount: number | null;
    profileUrl: string;
    googleMapsUrl: string;
    fullAddress: string;
    slug: string;
    status: string;
    isClaimable: boolean;
    claimedByUserId: string | null;
    claimedAt: string | null;
    claimFormData: {
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
    membershipPlan: string | null;
    membershipPaidAt: string | null;
    createdAt: string;
    updatedAt: string;
}