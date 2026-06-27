import axios from "axios";
import { normalizeApiError } from "./error-handler";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const apiError = normalizeApiError(error);
    if (apiError.statusCode === 401 && !error.config?.url?.includes("/auth/")) {
      if (typeof window !== "undefined") {

        // in my project root there is no login page ok, so why are you redirect it login page ?? 
        // i handle my login for patient or dentist in my /home/al-amin-islam/Projects/Dentist-Patient-Management-System/src/app/(marketing)/_components/module/signup-modal/SignIn.tsx sign in modal ok, so if you redirect user login page there is no page here so show a 404 not found page so can you please check it, and fix this issue. i am waiting for your response.
        window.location.href = "/?session_token_required=true";
      }
    }

    return Promise.reject(apiError);
  }
);


