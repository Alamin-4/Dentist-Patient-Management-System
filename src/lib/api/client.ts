import axios, { type AxiosRequestConfig } from "axios";

import { API_BASE_URL } from "./endpoints";
import { attachInterceptors } from "./interceptors";

export interface ApiResponse<TData> {
  data: TData;
  message?: string;
  success?: boolean;
  meta?: unknown;
}

export interface PaginatedResponse<TData> {
  data: TData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const apiClient = attachInterceptors(
  axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }),
);

const unwrap = <TData>(response: { data: TData }) => response.data;

export const api = {
  get: <TData>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<TData>(url, config).then(unwrap),

  post: <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => apiClient.post<TData>(url, body, config).then(unwrap),

  put: <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => apiClient.put<TData>(url, body, config).then(unwrap),

  patch: <TData, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ) => apiClient.patch<TData>(url, body, config).then(unwrap),

  delete: <TData>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<TData>(url, config).then(unwrap),

  upload: <TData>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ) =>
    apiClient
      .post<TData>(url, formData, {
        ...config,
        headers: {
          ...config?.headers,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(unwrap),
};
