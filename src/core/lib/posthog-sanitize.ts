const SENSITIVE_PARAMS = ["token", "email", "otp", "code", "reset_token"];

export function stripSensitiveData(event: any) {
  if (event?.properties?.$current_url) {
    try {
      const url = new URL(event.properties.$current_url);
      SENSITIVE_PARAMS.forEach((p) => url.searchParams.delete(p));
      event.properties.$current_url = url.toString();
    } catch {
      /* parse error — leave intact */
    }
  }
  return event;
}
