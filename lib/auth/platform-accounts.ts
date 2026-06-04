import type { LinkedPlatformAccounts } from "@/lib/types/platform";

type PlatformKey = keyof LinkedPlatformAccounts;

export function normalizeAccountInput(platform: PlatformKey, rawValue: string) {
  const trimmed = rawValue.trim();
  if (!trimmed) return "";

  // Si pegan una URL, extraemos usuario/slug para guardarlo como cuenta lógica.
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split("/").filter(Boolean);
      if (parts.length === 0) return "";

      if (platform === "youtube") {
        const atHandle = parts.find((part) => part.startsWith("@"));
        if (atHandle) return atHandle.toLowerCase();
        const channelId = parts[parts.length - 1];
        return channelId || "";
      }

      if (platform === "tiktok") {
        const atHandle = parts.find((part) => part.startsWith("@"));
        return atHandle ? atHandle.toLowerCase() : "";
      }

      if (platform === "instagram") {
        const handle = parts[0];
        return handle.startsWith("@") ? handle.toLowerCase() : `@${handle.toLowerCase()}`;
      }

      // Facebook: page slug o id
      return parts[parts.length - 1] || "";
    } catch {
      return "";
    }
  }

  if (platform === "facebook") return trimmed;

  if (trimmed.startsWith("@")) return trimmed.toLowerCase();
  return `@${trimmed.toLowerCase()}`;
}

export function isValidPlatformAccountHandle(platform: PlatformKey, value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  if (platform === "facebook") {
    return /^[a-zA-Z0-9._\-\s]{3,80}$/.test(trimmed);
  }

  // YouTube/TikTok/Instagram: permitimos @handle o channel id.
  if (trimmed.startsWith("@")) {
    return /^@[a-zA-Z0-9._-]{2,50}$/.test(trimmed);
  }

  // Soporte channel/page IDs (sin @)
  return /^[a-zA-Z0-9._-]{3,80}$/.test(trimmed);
}
