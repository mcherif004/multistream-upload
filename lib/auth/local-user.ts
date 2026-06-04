import { getUserById, upsertOAuthUser } from "@/lib/auth/users";

const LOCAL_USER_ID = "local-dev-user";
const LOCAL_USER_EMAIL = "local@multistream.dev";

export function resolveLocalUser() {
  const existing = getUserById(LOCAL_USER_ID);
  if (existing) return existing;

  return upsertOAuthUser({
    id: LOCAL_USER_ID,
    email: LOCAL_USER_EMAIL,
    displayName: "Local Creator",
    image: null,
  });
}
