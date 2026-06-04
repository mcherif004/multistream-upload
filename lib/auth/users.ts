import type { LinkedPlatformAccounts } from "@/lib/types/platform";
import type { PlatformConnectionMap, PlatformKey } from "@/lib/types/platform";

export interface AppUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  image?: string;
  accounts: LinkedPlatformAccounts;
  socialConnections: PlatformConnectionMap;
  emailVerified: boolean;
  marketingOptIn: boolean;
}

const APP_USERS: AppUser[] = [];

const usersStore = new Map<string, AppUser>(APP_USERS.map((user) => [user.id, user]));
const emailToId = new Map<string, string>(APP_USERS.map((user) => [user.email.toLowerCase(), user.id]));

function toUsernameFromEmail(email: string) {
  const localPart = email.split("@")[0] ?? "creator";
  return localPart.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase() || "creator";
}

interface UpsertOAuthUserInput {
  id: string;
  email: string;
  displayName?: string | null;
  image?: string | null;
}

function createEmptyConnections(): PlatformConnectionMap {
  return {
    youtube: { status: "idle" },
    tiktok: { status: "idle" },
    instagram: { status: "idle" },
    facebook: { status: "idle" },
  };
}

export function upsertOAuthUser(input: UpsertOAuthUserInput) {
  const normalizedEmail = input.email.toLowerCase();
  const existingId = emailToId.get(normalizedEmail);
  const resolvedId = existingId ?? input.id;

  const existing = usersStore.get(resolvedId);
  const nextUser: AppUser = {
    id: resolvedId,
    email: normalizedEmail,
    username: existing?.username ?? toUsernameFromEmail(normalizedEmail),
    displayName: input.displayName?.trim() || existing?.displayName || "Creator",
    image: input.image ?? existing?.image,
    accounts: existing?.accounts ?? {
      youtube: "",
      tiktok: "",
      instagram: "",
      facebook: "",
    },
    socialConnections: existing?.socialConnections ?? createEmptyConnections(),
    emailVerified: true,
    marketingOptIn: existing?.marketingOptIn ?? true,
  };

  usersStore.set(nextUser.id, nextUser);
  emailToId.set(normalizedEmail, nextUser.id);
  return nextUser;
}

export function getUserById(id: string) {
  return usersStore.get(id) ?? null;
}

export function getUserByEmail(email: string) {
  const userId = emailToId.get(email.toLowerCase());
  if (!userId) return null;
  return usersStore.get(userId) ?? null;
}

export function hasAtLeastOneLinkedAccount(accounts: LinkedPlatformAccounts) {
  return Boolean(accounts.youtube || accounts.tiktok || accounts.instagram || accounts.facebook);
}

export function updateUserAccounts(userId: string, accounts: LinkedPlatformAccounts) {
  const user = usersStore.get(userId);
  if (!user) return null;

  const updated: AppUser = {
    ...user,
    accounts: {
      youtube: accounts.youtube.trim(),
      tiktok: accounts.tiktok.trim(),
      instagram: accounts.instagram.trim(),
      facebook: accounts.facebook.trim(),
    },
  };

  usersStore.set(userId, updated);
  return updated;
}

export function getUserSocialConnections(userId: string) {
  const user = usersStore.get(userId);
  if (!user) return null;
  return user.socialConnections;
}

export function connectUserPlatform(
  userId: string,
  platform: PlatformKey,
  connection: { handle: string; accessToken: string },
) {
  const user = usersStore.get(userId);
  if (!user) return null;

  const updated: AppUser = {
    ...user,
    accounts: {
      ...user.accounts,
      [platform]: connection.handle,
    },
    socialConnections: {
      ...user.socialConnections,
      [platform]: {
        status: "connected",
        handle: connection.handle,
        accessToken: connection.accessToken,
        connectedAt: Date.now(),
      },
    },
  };

  usersStore.set(userId, updated);
  return updated;
}

export function disconnectUserPlatform(userId: string, platform: PlatformKey) {
  const user = usersStore.get(userId);
  if (!user) return null;

  const updated: AppUser = {
    ...user,
    accounts: {
      ...user.accounts,
      [platform]: "",
    },
    socialConnections: {
      ...user.socialConnections,
      [platform]: { status: "idle" },
    },
  };

  usersStore.set(userId, updated);
  return updated;
}
