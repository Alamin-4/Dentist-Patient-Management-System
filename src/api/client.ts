import { IRegisterDentist, IRegisterPatient } from "../hooks/auth/auth.validation";
import { api } from "./axios.instance";
import { endpoints } from "./endpoints";
import { ClinicDepthSubmitPayload, CreateProcedurePayload, LicenseCheckPayload, LoginPayload, PatientRegisterPayload, PersonalizeDataPayload, ProfessionalDataPayload, UpdateWeightsPayload, VerifyActionPayload, VerifyOtpPayload } from "@/types/api";

export type { CreateProcedurePayload };

export interface ApiResponse<T = any> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
  meta?: any;
}



export const apiClient = {
  auth: {
    registerPatient: async (payload: PatientRegisterPayload) => {
      const response = await api.post(endpoints.auth.registerPatient, payload);
      return response.data;
    },
    verifyEmail: async (payload: VerifyOtpPayload) => {
      const response = await api.post(endpoints.auth.verifyEmail, payload);
      return response.data;
    },
    login: async (payload: LoginPayload) => {
      const response = await api.post(endpoints.auth.login, payload);
      return response.data;
    },
    verify2fa: async (payload: VerifyOtpPayload) => {
      const response = await api.post(endpoints.auth.verify2fa, payload);
      return response.data;
    },
    resendOtp: async (payload: { email: string }) => {
      const response = await api.post(endpoints.auth.resendOtp, payload);
      return response.data;
    },
    loginAdmin: async (payload: LoginPayload) => {
      const response = await api.post(endpoints.auth.loginAdmin, payload);
      return response.data;
    },
    initiateGoogleLogin: () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
      }
      window.location.href = `${baseUrl}${endpoints.auth.googleLogin}`;
    },
    getSession: async () => {
      const response = await api.get(endpoints.auth.getSession);
      return response.data;
    },
    logout: async () => {
      const response = await api.post(endpoints.auth.logout);
      return response.data;
    },
  },
  patients: {
    register: async (payload: IRegisterPatient) => {
      const response = await api.post(endpoints.patients.register, payload);
      return response.data;
    },
    personalizeData: async (payload: PersonalizeDataPayload) => {
      const response = await api.post(endpoints.patients.personalizeData, payload);
      return response.data;
    },
  },
  dentists: {
    register: async (payload: IRegisterDentist) => {
      const response = await api.post(endpoints.dentists.register, payload);
      return response.data;
    },
    professionalData: async (payload: ProfessionalDataPayload) => {
      const response = await api.post(endpoints.dentists.professionalData, payload);
      return response.data;
    },
    verifyLicenseCheck: async (payload: LicenseCheckPayload) => {
      const response = await api.post(endpoints.dentists.verifyLicenseCheck, payload);
      return response.data;
    },
    verifyLicenseSubmit: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyLicenseSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    verifyOperationsSubmit: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyOperationsSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    verifyClinicDepthSubmit: async (payload: ClinicDepthSubmitPayload) => {
      const response = await api.post(endpoints.dentists.verifyClinicDepthSubmit, payload);
      return response.data;
    },
    getProgress: async () => {
      const response = await api.get(endpoints.dentists.progress);
      return response.data;
    },
    stepOneCheck: async () => {
      const response = await api.get(endpoints.dentists.progress);
      const data = response.data?.data;
      const isSubmitted =
        data?.step_one_status === "SUBMITTED" ||
        data?.step_one_status === "APPROVED";
      return {
        data: {
          submitted: isSubmitted,
          status: data?.step_one_status || "PENDING",
          data: data?.dentistLicense || {
            country: "Bangladesh",
            city: "Dhaka",
            registration_authority: 1,
            registration_no: "",
          }
        }
      };
    },
    stepTwoCheck: async () => {
      const response = await api.get(endpoints.dentists.progress);
      const data = response.data?.data;
      const isSubmitted =
        data?.step_two_status === "SUBMITTED" ||
        data?.step_two_status === "APPROVED";
      return {
        data: {
          submitted: isSubmitted,
          status: data?.step_two_status || "PENDING",
          data: {
            jci_certificate: data?.dentistOperations?.jciCertificate || null,
            walkthrough_video: data?.dentistOperations?.walkthroughVideo || null,
            procedures: data?.procedures || [],
            guarantee: data?.dentistOperations
              ? {
                signer_name: data.dentistOperations.signerName,
                typed_signature: data.dentistOperations.signature,
                accepted_terms: data.dentistOperations.agreedToGuarantee,
              }
              : {},
          }
        }
      };
    },
    stepThreeCheck: async () => {
      const response = await api.get(endpoints.dentists.progress);
      const data = response.data?.data;
      const isSubmitted =
        data?.step_three_status === "SUBMITTED" ||
        data?.step_three_status === "APPROVED";
      return {
        data: {
          submitted: isSubmitted,
          status: data?.step_three_status || "PENDING",
          data: {
            materials: [],
            clinic_address: ""
          }
        }
      };
    },
    updateVerificationPhase: async (payload: { verification_phase: string }) => {
      return { success: true, data: null };
    },
    global_procedure_list: async () => {
      const response = await api.get(endpoints.procedures.global);
      return response.data;
    },
    dentistProcedureList: async () => {
      const response = await api.get(endpoints.procedures.dentist);
      return response.data;
    },
    professionalDetails: async (payload: any) => {
      const response = await api.post(endpoints.dentists.professionalData, {
        legalName: payload.full_name || payload.legal_name || payload.legalName,
        yearsOfExperience: Number(payload.experience_years || payload.years_of_experience || payload.yearsOfExperience),
        primarySpecialty: payload.specialty || payload.primary_specialty || payload.primarySpecialty,
        country: payload.country || "Bangladesh",
        city: payload.city || "Dhaka",
      });
      return response.data;
    },
    stepOne: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyLicenseSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    stepTwo: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyOperationsSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    stepTwoWithFiles: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyOperationsSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    stepThree: async (payload: { clinicAddress: string; procedureDocs: any[] }) => {
      const response = await api.post(endpoints.dentists.verifyClinicDepthSubmit, payload);
      return response.data;
    },
    getOverviewData: async () => {
      const response = await api.get(endpoints.dentists.overview);
      return response.data;
    },
    dentistProfile: async () => {
      const response = await api.get(endpoints.dentists.profile);
      return response.data;
    },
  },
  procedures: {
    getGlobal: async (search?: string) => {
      const response = await api.get(endpoints.procedures.global, {
        params: search ? { search } : undefined,
      });
      return response.data;
    },
    getDentist: async () => {
      const response = await api.get(endpoints.procedures.dentist);
      return response.data;
    },
    createDentist: async (payload: CreateProcedurePayload) => {
      const response = await api.post(endpoints.procedures.dentist, payload);
      return response.data;
    },
    deleteDentist: async (id: string | number) => {
      const response = await api.delete(endpoints.procedures.deleteDentistProcedure(id));
      return response.data;
    },
    uploadCsv: async (payload: FormData) => {
      const response = await api.post(endpoints.procedures.dentistCsv, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  },
  admin: {
    getDentistVerificationList: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
      const response = await api.get(endpoints.admin.verifications, { params });
      return response.data;
    },
    listLicenseQueue: async <T = any>(params?: any): Promise<ApiResponse<T[]>> => {
      const response = await api.get(endpoints.admin.verifications, { params });
      return response.data;
    },
    listDentists: async <T = any>(params?: any): Promise<ApiResponse<T[]>> => {
      const response = await api.get(endpoints.admin.dentists, { params });
      return response.data;
    },
    getDentistVerificationPhases: async (id: string | number) => {
      const response = await api.get(endpoints.admin.dentistVerificationPhases(id));
      return response.data;
    },
    getDentistProfile: async <T = any>(id: string | number): Promise<ApiResponse<T>> => {
      const response = await api.get(endpoints.admin.dentistProfile(id));
      return response.data;
    },
    phaseOneApprove: async (id: string | number) => {
      const response = await api.patch(endpoints.admin.verifyLicense(id), { isApproved: true, note: "Approved by Admin" });
      return response.data;
    },
    phaseTwoApprove: async (id: string | number) => {
      const response = await api.patch(endpoints.admin.verifyOperations(id), { isApproved: true, note: "Approved by Admin" });
      return response.data;
    },
    phaseThreeApprove: async (id: string | number) => {
      const response = await api.patch(endpoints.admin.verifyClinicDepth(id), { isApproved: true, note: "Approved by Admin" });
      return response.data;
    },
    verifyLicense: async (id: string | number, payload: VerifyActionPayload) => {
      const response = await api.patch(endpoints.admin.verifyLicense(id), payload);
      return response.data;
    },
    verifyOperations: async (id: string | number, payload: VerifyActionPayload) => {
      const response = await api.patch(endpoints.admin.verifyOperations(id), payload);
      return response.data;
    },
    verifyClinicDepth: async (id: string | number, payload: VerifyActionPayload) => {
      const response = await api.patch(endpoints.admin.verifyClinicDepth(id), payload);
      return response.data;
    },
    verifyPhase: async (
      id: string | number,
      payload: {
        phase: "ph1" | "ph2" | "ph3";
        isApproved: boolean;
        note?: string;
      }
    ) => {
      const response = await api.patch(endpoints.admin.verifyPhase(id), payload);
      return response.data;
    },
    getWeights: async () => {
      const response = await api.get(endpoints.admin.verificationWeights);
      return response.data;
    },
    updateWeights: async (payload: UpdateWeightsPayload) => {
      const response = await api.post(endpoints.admin.verificationWeights, payload);
      return response.data;
    },
    addUser: async (payload: any) => {
      const response = await api.post("/admin/users", payload);
      return response.data;
    },
  },
  specialties: {
    list: async (search?: string) => {
      const response = await api.get(endpoints.specialties.list, {
        params: search ? { search } : undefined,
      });
      return response.data;
    },
    create: async (payload: { name: string; description?: string }) => {
      const response = await api.post(endpoints.specialties.list, payload);
      return response.data;
    },
    update: async (id: string | number, payload: { name?: string; description?: string }) => {
      const response = await api.patch(endpoints.specialties.byId(id), payload);
      return response.data;
    },
    delete: async (id: string | number) => {
      const response = await api.delete(endpoints.specialties.byId(id));
      return response.data;
    },
  },
  files: {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  },
};
