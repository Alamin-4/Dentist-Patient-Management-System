import { IRegisterDentist, IRegisterPatient } from "../hooks/auth/auth.validation";
import { api } from "./axios.instance";
import { endpoints } from "./endpoints";
import { ClinicDepthSubmitPayload, CreateProcedurePayload, LicenseCheckPayload, LoginPayload, PatientRegisterPayload, PersonalizeDataPayload, ProfessionalDataPayload, UpdateWeightsPayload, VerifyActionPayload, VerifyOtpPayload } from "@/types/api";
import { getBookingDraft } from "@/lib/storage/bookingService";

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
    initiateGoogleLogin: (returnTo?: string, hasCompare?: boolean) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
      }

      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const landingPath = returnTo || (typeof window !== "undefined" ? window.location.pathname : "/");

      const landingUrl = new URL(landingPath, origin);
      if (hasCompare) {
        landingUrl.searchParams.set("restore_compare", "1");
      }

      const backendUrl = `${baseUrl}${endpoints.auth.googleLogin}?callbackURL=${encodeURIComponent(landingUrl.toString())}`;
      window.location.href = backendUrl;
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
    getBySlug: async (slug: string) => {
      const response = await api.get(`/patients/${slug}`);
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
            clinic_address: data?.prefilled_clinic_address || ""
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
    getDirectoryList: async (params?: Record<string, any>) => {
      const response = await api.get(endpoints.dentists.directoryList, { params });
      return response.data;
    },
    getDirectoryDetail: async (slug: string) => {
      const response = await api.get(endpoints.dentists.directoryDetail(slug));
      return response.data;
    },
    claimDirectoryProfile: async (slug: string, payload: any) => {
      const response = await api.post(endpoints.dentists.directoryClaim(slug), payload);
      return response.data;
    },
    requestDirectoryConsultation: async (slug: string, payload: any) => {
      const response = await api.post(endpoints.dentists.directoryConsultation(slug), payload);
      return response.data;
    },
    simulateStripeWebhook: async (payload: any) => {
      const response = await api.post("/stripe/webhook", payload);
      return response.data;
    },
    sendClaimOtp: async (payload: { email: string; password?: string; name?: string }) => {
      const response = await api.post(endpoints.dentists.directorySendClaimOtp, payload);
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
    getGlobalBySlug: async (slug: string) => {
      const response = await api.get(`${endpoints.procedures.global}/${slug}`);
      return response.data;
    },
    createGlobal: async (payload: { name: string; specialtyId?: string | null }) => {
      const response = await api.post(endpoints.procedures.global, payload);
      return response.data;
    },
    deleteGlobal: async (ids: Array<string | number>) => {
      const response = await api.delete(endpoints.procedures.global, {
        data: { ids },
      });
      return response.data;
    },
    uploadGlobalCsv: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(endpoints.procedures.globalCsv, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    uploadDentistDirectory: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(endpoints.admin.uploadDentistDirectory, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  },
  specialties: {
    getSpecialties: async (search?: string) => {
      const response = await api.get(endpoints.specialties.getSpecialties, {
        params: search ? { search } : undefined,
      });
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await api.get(`${endpoints.specialties.getSpecialties}/${slug}`);
      return response.data;
    },
    create: async (payload: { name: string; description?: string }) => {
      const response = await api.post(endpoints.specialties.getSpecialties, payload);
      return response.data;
    },
    update: async (id: string | number, payload: { name?: string; description?: string }) => {
      const response = await api.patch(endpoints.specialties.getSpecialties, payload);
      return response.data;
    },
    delete: async (ids: Array<string | number>) => {
      const response = await api.delete(endpoints.specialties.getSpecialties, {
        data: { ids },
      });
      return response.data;
    },
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(endpoints.specialties.uploadSpecialties, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  users: {
    getMe: async () => {
      const response = await api.get(endpoints.users.me);
      return response.data;
    },
    updatePatientProfile: async (payload: any) => {
      const response = await api.patch(endpoints.users.updatePatientProfile, payload);
      return response.data;
    },
    updateDentistProfile: async (payload: any) => {
      const response = await api.patch(endpoints.users.updateDentistProfile, payload);
      return response.data;
    },
    updateAdminProfile: async (payload: any) => {
      const response = await api.patch(endpoints.users.updateAdminProfile, payload);
      return response.data;
    },
    changePassword: async (payload: any) => {
      const response = await api.post(endpoints.users.changePassword, payload);
      return response.data;
    },
  },
};

export const consultationBookingApi = {
  stepOne: async (payload: {
    first_name: string;
    last_name: string;
    country: string;
    date_of_birth: string;
    email?: string;
  }) => {
    const response = await api.post(endpoints.consultations.intake, {
      firstName: payload.first_name,
      lastName: payload.last_name,
      country: payload.country,
      dateOfBirth: payload.date_of_birth,
      email: payload.email || getBookingDraft().personalInfo.email || "",
    });
    return response.data;
  },

  stepTwo: async (payload: {
    procedures: string[];
  }) => {
    const intakeId = getBookingDraft().consultationId;
    if (!intakeId) throw new Error("Intake ID not found in draft");

    const draft = getBookingDraft();
    const procedureName = draft.procedure || "Dental Procedure";

    const response = await api.patch(endpoints.consultations.updateIntake(intakeId), {
      procedureIds: payload.procedures,
      procedureNames: [procedureName],
    });
    return response.data;
  },

  stepThree: async (payload: {
    consultation_id: string | number;
    approximate_budget: number;
    travel_start_date?: string;
    travel_end_date?: string;
  }) => {
    const response = await api.patch(
      endpoints.consultations.updateIntake(payload.consultation_id),
      {
        budget: String(payload.approximate_budget),
        travelFrom: payload.travel_start_date || null,
        travelTo: payload.travel_end_date || null,
      }
    );
    return response.data;
  },

  stepFour: async (payload: {
    consultation_id: string | number;
    last_dentist_visit: string;
    conditions: string[];
    notes?: string;
  }) => {
    const response = await api.patch(
      endpoints.consultations.updateIntake(payload.consultation_id),
      {
        lastVisit: payload.last_dentist_visit,
        conditions: payload.conditions,
        additionalInfo: payload.notes || null,
      }
    );
    return response.data;
  },

  stepFive: async (payload: {
    consultation_id: string | number;
    front_smile: File;
  }) => {
    const uploadRes = await apiClient.files.upload(payload.front_smile);
    const secureUrl = uploadRes.data?.secure_url;
    if (!secureUrl) throw new Error("Failed to upload front smile photo to Cloudinary");

    const response = await api.patch(
      endpoints.consultations.updateIntake(payload.consultation_id),
      {
        photos: [secureUrl],
      }
    );
    return response.data;
  },

  stepSix: async (payload: {
    consultation_id: string | number;
    file: File;
    notes?: string;
  }) => {
    const uploadRes = await apiClient.files.upload(payload.file);
    const secureUrl = uploadRes.data?.secure_url;
    if (!secureUrl) throw new Error("Failed to upload X-ray to Cloudinary");

    const response = await api.patch(
      endpoints.consultations.updateIntake(payload.consultation_id),
      {
        xrayUrl: secureUrl,
        xrayNotes: payload.notes || null,
      }
    );
    return response.data;
  },

  stepSeven: async (payload: {
    consultation_id: string | number;
    dentists: Array<{
      dentist: string | number | null;
      scheduled_date: string;
      scheduled_time: string;
    }>;
  }) => {
    const draft = getBookingDraft();
    const scheduleSelections = payload.dentists.map((item) => {
      const dentistIdStr = String(item.dentist);
      const matchingSelection = draft.scheduleSelections.find(
        (sel) => String(sel.dentistId) === dentistIdStr
      );
      const timezone = matchingSelection?.timezone || "UTC";

      return {
        dentistId: dentistIdStr,
        date: item.scheduled_date,
        timeSlot: item.scheduled_time,
        timezone,
      };
    });

    const response = await api.post(endpoints.consultations.confirm, {
      intakeId: String(payload.consultation_id),
      scheduleSelections,
    });
    return response.data;
  },
};
