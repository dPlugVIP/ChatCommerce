export const adminKeys = {
  all: ["admin"] as const,
  session: () => [...adminKeys.all, "session"] as const,
};
