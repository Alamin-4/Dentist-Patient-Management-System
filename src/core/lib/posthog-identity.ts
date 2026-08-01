import posthog from "posthog-js";

export const identifyUser = (user: { id: string; email: string; name?: string; role: string }) => {
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
};

export const resetUserSession = () => {
  posthog.reset();
};
