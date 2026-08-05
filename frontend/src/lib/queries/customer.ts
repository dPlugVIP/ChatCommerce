export const customerKeys = {
  all: ["customer"] as const,
  session: () => [...customerKeys.all, "session"] as const,
};
