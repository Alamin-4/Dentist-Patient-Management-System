import { persistSession } from "@/hooks/shared/shared.function";
import { adminApi, LoginPayload } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useAdminLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      adminApi.login({ ...data, role: "ADMIN" }),
    onSuccess: persistSession,
  });
}
