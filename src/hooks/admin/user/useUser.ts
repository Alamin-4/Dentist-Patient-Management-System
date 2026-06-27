import { apiClient as adminApi } from "@/api/client";
import { useMutation } from "@tanstack/react-query";

export interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  name: string;
  password: string;
  role: "ADMIN";
}

export function useAddUser() {
  return useMutation({
    mutationFn: (data: AddUserPayload) => adminApi.admin.addUser(data),
  });
}
