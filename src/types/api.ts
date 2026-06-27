// Auth Interfaces
export interface PatientRegisterPayload {
    email: string;
    password?: string;
    confirmPassword?: string;
}

export interface VerifyOtpPayload {
    email: string;
    otp: string;
}

export interface LoginPayload {
    email: string;
    password?: string;
}

// Patient Interfaces
export interface PersonalizeDataPayload {
    firstName: string;
    lastName: string;
    gender: string;
    country: string;
    city: string;
    insuranceProvider: string;
    preferredLanguage: string;
    treatmentGoals: string[];
    isAnxious: boolean;
}

// Dentist Interfaces
export interface ProfessionalDataPayload {
    legalName: string;
    yearsOfExperience: number;
    primarySpecialty: string;
    country: string;
    city: string;
}

export interface LicenseCheckPayload {
    country: string;
    city: string;
    registrationAuthority: string;
    registrationNumber: string;
}

export interface ClinicDepthSubmitPayload {
    clinicAddress: string;
    procedureDocs: Array<{
        dentistProcedureId: string;
        ceCertificate: string;
        materialBrands: string;
        invoice: string;
        protocolPdf: string;
    }>;
}

// Procedure Interfaces
export interface CreateProcedurePayload {
    procedureName: string;
    price: number;
    notes?: string;
}

// Admin Interfaces
export interface VerifyActionPayload {
    isApproved: boolean;
    note?: string;
}

export interface UpdateWeightsPayload {
    licenseWeight: number;
    operationsWeight: number;
    clinicDepthWeight: number;
}