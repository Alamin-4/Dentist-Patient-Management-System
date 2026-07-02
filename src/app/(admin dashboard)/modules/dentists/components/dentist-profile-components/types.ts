// types.ts
export interface DentistVerificationResponse {
    id: string;
    slug: string;
    license_verification: string;
    operations_verification: string;
    clinical_verification: string;
    face_match_score: number;
    created_at: string;
    updated_at: string;
    queue_status: string;
    dentist: {
        id: string;
        slug: string;
        full_name: string;
        specialty: string;
        rdv_score: number;
    };
    license_step: {
        registration_authority_name: string;
        city: string;
        country: string;
        registration_no: string;
        professional_headshot: string;
        file: string;
        status: string;
        is_verified: boolean;
        verified_at: string;
        reviewer_notes: string;
    };
    operation_step: {
        status: string;
        sterilization_verification: {
            has_jci_certificate: boolean;
            jci_certificate: string;
            walkthrough_video: string;
        };
        no_surprise_guarantee: {
            allowed_variation_percent: string;
            signer_name: string;
            typed_signature: string;
            accepted_terms: boolean;
            signed_at: string;
        };
        procedures_feature: {
            procedure_name: string;
            price: string;
            currency: string;
            option_notes: string;
        }[];
    };
    clinical_step: {
        status: string;
        clinic_address: string;
        materials: {
            own_procedure: string;
            ce_certificate: string;
            material_brands: string;
            invoice: string;
            protocol_pdf: string;
        }[];
    };
}