import { AddUserPayload, adminApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useAddUser() {
  return useMutation({
    mutationFn: (data: AddUserPayload) => adminApi.addUser(data),
  });
}
