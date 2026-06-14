export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://3.99.158.129:8004/api/v1";

export const endpoints = {
  auth: {
    register: "/auth/signup/",
    login: "/auth/login",
    logout: "/auth/logout/",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    refreshToken: "/auth/token/refresh/",
    verifyToken: "/auth/token/verify/",
  },
  patient: {
    register: "/auth/signup/",
    login: "/auth/signin/",
    verifyOtp: "/auth/verify-otp/",
    resendOtp: "/auth/resend-otp/",
    profile: "/auth/profile",
  },

  // todo
  dentist: {
    register: "/auth/signup/",
    login: "/auth/signin/",
    verifyOtp: "/auth/verify-otp",
    resendOtp: "/auth/resend-otp",
    profile: "/auth/profile",
    professionalDetails: "/auth/professional-details",
  },

  // todo
  admin: {
    addUser: "/auth/add-user/",
    login: "/admin/login",
    profile: "/admin/profile",
    dentists: "/admin/dentists",
    patients: "/admin/patients",
    bookings: "/admin/bookings",
    reviews: "/admin/reviews",
    payments: "/admin/payments",
    reports: "/admin/reports",
    notifications: "/admin/notifications",
    verificationQueue: "/admin/verification-queue",
  },

  // todo
  bookings: {
    root: "/bookings",
    byId: (id: string | number) => `/bookings/${id}`,
  },
  consultations: {
    root: "/consultations",
    byId: (id: string | number) => `/consultations/${id}`,
  },
  dentists: {
    root: "/dentists",
    byId: (id: string | number) => `/dentists/${id}`,
  },
  patients: {
    root: "/patients",
    byId: (id: string | number) => `/patients/${id}`,
  },
  reviews: {
    root: "/reviews",
    byId: (id: string | number) => `/reviews/${id}`,
  },
  uploads: {
    root: "/uploads",
  },
} as const;
