export interface StepOneI {
  professional_headshot: File;
  city: string;
  country: string;
  registration_authority: string;
  registration_no: string;
  file: File;
}

export interface StepTwoI {
  sterilization: {
    has_jci_certificate: boolean;
    jci_certificate: File;
    certificate_number: string;
    expiry_date: string;
    issuing_authority: string;
    issue_date: string;
    walkthrough_video: File;
    autoclave_brand: string;
    sealed_pouch_visible: boolean;
    ultrasonic_cleaner_available: boolean;
  };
  procedures: {
    procedure: number;
    price: number;
    currency: string;
    option_notes: string;
  }[];
  guarantee: {
    signer_name: string;
    typed_signature: string;
    accepted_terms: boolean;
  };
}

export interface StepThreeI {
  materials: {
    own_procedure: number;
    brand_name: string;
    ce_certificate: File;
    material_brands: File;
    invoice: File;
    protocol_pdf: File;
    notes: string;
  }[];
}

/*
{
    "full_name": "Samim osman",
    "specialty": "PERIODONTIST",
    "experience_years": 5,
    "city": "Dhaka",
    "country": "Bangladesh"
}
*/

export interface ProfessionalDetailsI {
  full_name: string;
  specialty: string;
  experience_years: number;
  city: string;
  country: string;
}