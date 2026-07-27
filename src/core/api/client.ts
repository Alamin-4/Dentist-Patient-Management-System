import { IRegisterDentist, IRegisterPatient } from "../hooks/auth/auth.validation";
import { api } from "./axios.instance";
import { endpoints } from "./endpoints";
import { env } from "@/config/env";
import { ClinicDepthSubmitPayload, CreateProcedurePayload, LicenseCheckPayload, LoginPayload, PatientRegisterPayload, PersonalizeDataPayload, ProfessionalDataPayload, ResetPasswordPayload, UpdateWeightsPayload, VerifyActionPayload, VerifyOtpPayload, ClaimProfilePayload, AddUserPayload, DirectoryConsultationPayload } from "@/types/api";
import { getBookingDraft } from "@/lib/storage/bookingService";

export type { CreateProcedurePayload };

export interface PaginationMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  totalDirectory?: number;
  totalSubscribed?: number;
  total_verifications?: number;
  pending_review?: number;
}

export interface ApiResponse<T = unknown> {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
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
      const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

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
    forgotPassword: async (payload: { email: string }) => {
      const response = await api.post(endpoints.auth.forgotPassword, payload);
      return response.data;
    },
    verifyResetOtp: async (payload: { email: string; otp: string }) => {
      const response = await api.post(endpoints.auth.verifyResetOtp, payload);
      return response.data;
    },
    resetPassword: async (payload: ResetPasswordPayload) => {
      const response = await api.post(endpoints.auth.resetPassword, payload);
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
    getReferrals: async () => {
      const response = await api.get(endpoints.patients.referrals);
      return response.data;
    },
    getDocuments: async () => {
      const response = await api.get(endpoints.patients.documents);
      return response.data;
    },
    uploadDocument: async (payload: { title: string; category: string; fileUrl: string }) => {
      const response = await api.post(endpoints.patients.uploadDocument, payload);
      return response.data;
    },
    getResults: async () => {
      const response = await api.get(endpoints.patients.results);
      return response.data;
    },
    uploadResult: async (payload: { title: string; doctor: string; location: string; beforeImg: string; afterImg: string }) => {
      const response = await api.post(endpoints.patients.uploadResult, payload);
      return response.data;
    },
    getTravelChecklist: async () => {
      const response = await api.get(endpoints.patients.travelChecklist);
      return response.data;
    },
    updateTravelChecklist: async (payload: { items: Array<{ id: string; completed: boolean }> }) => {
      const response = await api.patch(endpoints.patients.updateTravelChecklist, payload);
      return response.data;
    },
  },
  dentists: {
    register: async (payload: IRegisterDentist) => {
      const formData = new FormData();
      formData.append("firstName", payload.firstName);
      formData.append("lastName", payload.lastName);
      formData.append("email", payload.email);
      formData.append("password", payload.password);
      formData.append("confirmPassword", payload.confirmPassword);
      formData.append("phoneNumber", payload.phoneNumber);
      formData.append("gender", payload.gender);
      if (payload.referralCode) formData.append("referralCode", payload.referralCode);
      if (payload.image) formData.append("image", payload.image);
      const response = await api.post(endpoints.dentists.register, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
          note: data?.step_one_note || null,
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
          note: data?.step_two_note || null,
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
          note: data?.step_three_note || null,
          data: {
            materials: [],
            clinic_address: data?.prefilled_clinic_address || ""
          }
        }
      };
    },
    updateVerificationPhase: async (payload: { verification_phase: string }) => {
      throw new Error("updateVerificationPhase endpoint not yet implemented");
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
        yearsOfExperience: payload.experience_years !== undefined 
          ? Number(payload.experience_years) 
          : payload.years_of_experience !== undefined 
            ? Number(payload.years_of_experience) 
            : payload.yearsOfExperience !== undefined 
              ? Number(payload.yearsOfExperience) 
              : undefined,
        primarySpecialty: payload.specialty || payload.primary_specialty || payload.primarySpecialty,
        country: payload.country,
        city: payload.city,
        phoneNumber: payload.phoneNumber || payload.phone_number || payload.phone,
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
    stepTwoWithFiles: async (payload: FormData) => {
      const response = await api.post(endpoints.dentists.verifyOperationsSubmit, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    stepThree: async (payload: { clinicAddress: string; latitude?: number; longitude?: number; procedureDocs: any[] }) => {
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
    getPatients: async () => {
      const response = await api.get(endpoints.dentists.patients);
      return response.data;
    },
    getPatientDetail: async (id: string | number) => {
      const response = await api.get(endpoints.dentists.patientDetail(id));
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
    getDirectoryReviews: async (slug: string) => {
      const response = await api.get(endpoints.dentists.directoryReviews(slug));
      return response.data;
    },
    createDirectoryReview: async (slug: string, payload: {
      rating: number;
      communication?: number;
      valueForMoney?: number;
      followThrough?: number;
      text: string;
    }) => {
      const response = await api.post(endpoints.dentists.directoryReviews(slug), payload);
      return response.data;
    },
    claimDirectoryProfile: async (slug: string, payload: ClaimProfilePayload) => {
      const response = await api.post(endpoints.dentists.directoryClaim(slug), payload);
      return response.data;
    },
    requestDirectoryConsultation: async (slug: string, payload: DirectoryConsultationPayload) => {
      const response = await api.post(endpoints.dentists.directoryConsultation(slug), payload);
      return response.data;
    },
    addDentistToDirectory: async (payload: {
      fullName: string;
      clinicName?: string;
      city?: string;
      country?: string;
      specialty?: string;
      phone?: string;
    }) => {
      const response = await api.post(endpoints.dentists.directoryAdd, payload);
      return response.data;
    },
    createDirectoryCheckoutSession: async (payload: {
      dentistDirectoryId: string;
      membershipPlan: string;
    }) => {
      const response = await api.post(endpoints.dentists.directoryCheckoutSession, payload);
      return response.data;
    },
    confirmDirectoryPayment: async (payload: {
      sessionId: string;
    }) => {
      const response = await api.post(endpoints.stripe.confirmPayment, payload);
      return response.data;
    },
    sendClaimOtp: async (payload: { email: string; password?: string; name?: string }) => {
      const response = await api.post(endpoints.dentists.directorySendClaimOtp, payload);
      return response.data;
    },
    getReferrals: async () => {
      const response = await api.get(endpoints.dentists.referrals);
      return response.data;
    },
    withdrawReferral: async () => {
      const response = await api.post(endpoints.dentists.withdrawReferral);
      return response.data;
    },
    getResults: async () => {
      const response = await api.get(endpoints.dentists.results);
      return response.data;
    },
    createResult: async (payload: { title: string; patientName: string; date: string; location: string; beforeImage: string; afterImage: string }) => {
      const response = await api.post(endpoints.dentists.createResult, payload);
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
    addUser: async (payload: AddUserPayload) => {
      const response = await api.post(endpoints.admin.addUser, payload);
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
    bulkDentistAction: async (ids: string[], action: "suspend" | "unsuspend" | "delete") => {
      const response = await api.post(endpoints.admin.bulkDentistAction, { ids, action });
      return response.data;
    },
    getPatientsList: async (params?: { status?: string; city?: string; search?: string; page?: number; limit?: number }) => {
      const response = await api.get(endpoints.admin.patients, { params });
      return response.data;
    },
    getPatientDetail: async (id: string | number) => {
      const response = await api.get(endpoints.admin.patientDetail(id));
      return response.data;
    },
    getOverview: async () => {
      const response = await api.get(endpoints.admin.overview);
      return response.data;
    },
    getAntiCollusionList: async () => {
      const response = await api.get(endpoints.admin.antiCollusion);
      return response.data;
    },
    updateAntiCollusion: async (id: string | number, payload: any) => {
      const response = await api.patch(endpoints.admin.updateAntiCollusion(id), payload);
      return response.data;
    },
    getSeoReviewPages: async () => {
      const response = await api.get(endpoints.admin.seoReviewPages);
      return response.data;
    },
    getSeoReviewPageDetail: async (id: string | number) => {
      const response = await api.get(endpoints.admin.seoReviewPageDetail(id));
      return response.data;
    },
    updateSeoReviewPage: async (id: string | number, payload: any) => {
      const response = await api.patch(endpoints.admin.updateSeoReviewPage(id), payload);
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
      const response = await api.patch(`${endpoints.specialties.getSpecialties}/${id}`, payload);
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
  consultations: {
    getPatientConsultations: async () => {
      const response = await api.get(endpoints.consultations.patient);
      return response.data;
    },
    getDentistConsultations: async () => {
      const response = await api.get(endpoints.consultations.dentist);
      return response.data;
    },
    respond: async (id: string | number, payload: { action: "ACCEPT" | "REJECT"; responseNote?: string }) => {
      const response = await api.post(endpoints.consultations.respond(id), payload);
      return response.data;
    },
    schedule: async (id: string | number, payload: { scheduledDate: string; scheduledTime: string; timezone: string }) => {
      const response = await api.post(endpoints.consultations.schedule(id), payload);
      return response.data;
    },
    cancel: async (id: string | number, payload: { reason?: string }) => {
      const response = await api.post(endpoints.consultations.cancel(id), payload);
      return response.data;
    },
    reschedule: async (id: string | number, payload: { newDate: string; newTime: string; timezone: string }) => {
      const response = await api.post(endpoints.consultations.reschedule(id), payload);
      return response.data;
    },
    updateStatus: async (id: string | number, payload: { requestStatus: string }) => {
      const response = await api.patch(endpoints.consultations.updateStatus(id), payload);
      return response.data;
    },
    getLiveKitToken: async (id: string | number) => {
      const response = await api.get(endpoints.consultations.token(id));
      return response.data;
    },
  },
  treatmentPlans: {
    propose: async (payload: { consultationId: string; notes?: string; procedures: Array<{ name: string; price: number; notes?: string }> }) => {
      const response = await api.post(endpoints.treatmentPlans.propose, payload);
      return response.data;
    },
    getPatient: async () => {
      const response = await api.get(endpoints.treatmentPlans.patient);
      return response.data;
    },
    getDentist: async () => {
      const response = await api.get(endpoints.treatmentPlans.dentist);
      return response.data;
    },
    getById: async (id: string | number) => {
      const response = await api.get(endpoints.treatmentPlans.byId(id));
      return response.data;
    },
    decision: async (id: string | number, payload: { action: "ACCEPT" | "REJECT" }) => {
      const response = await api.post(endpoints.treatmentPlans.decision(id), payload);
      return response.data;
    },
  },
  treatmentBookings: {
    list: async (statusFilter?: string) => {
      const response = await api.get(endpoints.treatmentBookings.base, {
        params: statusFilter ? { status: statusFilter } : undefined,
      });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(endpoints.treatmentBookings.byId(id));
      return response.data;
    },
    verifyArrival: async (id: string, arrivalCode: string) => {
      const response = await api.post(endpoints.treatmentBookings.verifyArrival(id), { arrivalCode });
      return response.data;
    },
    submitFinalPlan: async (
      id: string,
      payload: {
        procedures: Array<{ name: string; price: number; notes?: string }>;
        notes?: string;
      }
    ) => {
      const response = await api.post(endpoints.treatmentBookings.submitFinalPlan(id), payload);
      return response.data;
    },
    respondFinalPlan: async (id: string, payload: { action: "APPROVE" | "REJECT"; reason?: string }) => {
      const response = await api.post(endpoints.treatmentBookings.respondFinalPlan(id), payload);
      return response.data;
    },
    verifyPayment: async (id: string, paymentCode: string) => {
      const response = await api.post(endpoints.treatmentBookings.verifyPayment(id), { paymentCode });
      return response.data;
    },
    submitReview: async (
      id: string,
      payload: {
        ratingCommunication: number;
        ratingValueForMoney: number;
        ratingFollowThrough: number;
        comments: string;
        afterPhotoUrl?: string;
      }
    ) => {
      const response = await api.post(endpoints.treatmentBookings.submitReview(id), payload);
      return response.data;
    },
    createEscrowSession: async (bookingId: string) => {
      const response = await api.post(endpoints.treatmentBookings.createEscrowSession, { bookingId });
      return response.data;
    },
    confirmEscrowPayment: async (sessionId: string) => {
      const response = await api.post(endpoints.stripe.confirmPayment, { sessionId });
      return response.data;
    },
  },
  stripe: {
    connectOnboard: async () => {
      const response = await api.post(endpoints.stripe.connectOnboard);
      return response.data;
    },
    connectStatus: async () => {
      const response = await api.get(endpoints.stripe.connectStatus);
      return response.data;
    },
  },
  contact: {
    sendInquiry: async (payload: { name: string; email: string; subject: string; message: string }) => {
      const response = await api.post(endpoints.contact, payload);
      return response.data;
    },
  },
  settings: {
    get: async () => {
      const response = await api.get(endpoints.settings);
      return response.data;
    },
    update: async (payload: any) => {
      const response = await api.post(endpoints.settings, payload);
      return response.data;
    },
  },
  blogs: {
    getPublished: async () => {
      const response = await api.get(endpoints.blogs.base);
      return response.data;
    },
    getAdminAll: async () => {
      const response = await api.get(endpoints.blogs.admin);
      return response.data;
    },
    getBySlug: async (slug: string) => {
      const response = await api.get(endpoints.blogs.bySlug(slug));
      return response.data;
    },
    create: async (payload: any) => {
      const response = await api.post(endpoints.blogs.base, payload);
      return response.data;
    },
    update: async (id: string, payload: any) => {
      const response = await api.patch(endpoints.blogs.byId(id), payload);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(endpoints.blogs.byId(id));
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
        (sel) => String(sel.dentistId) === dentistIdStr || String(sel.backendDentistId) === dentistIdStr
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
  confirmRequest: async (payload: {
    consultation_id: string | number;
    dentistIds: string[];
  }) => {
    const response = await api.post(endpoints.consultations.confirmRequest, {
      intakeId: String(payload.consultation_id),
      dentistIds: payload.dentistIds.map(String),
    });
    return response.data;
  },
};
