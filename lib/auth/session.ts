import { getAuthSession } from "./auth-options";
import { getUserById, upsertOAuthUser } from "./users";

export async function getCurrentUser() {
  const session = await getAuthSession();
  if (!session?.user?.email) return null;

  const userId = session.user.id;
  if (userId) {
    const existing = getUserById(userId);
    if (existing) return existing;
  }

  return upsertOAuthUser({
    id: userId || session.user.email,
    email: session.user.email,
    displayName: session.user.name,
    image: session.user.image,
  });
}
