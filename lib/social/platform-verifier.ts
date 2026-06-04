import type { PlatformKey } from "@/lib/types/platform";
import { normalizeAccountInput } from "@/lib/auth/platform-accounts";

interface VerificationResult {
  ok: boolean;
  normalizedHandle: string;
  profileUrl: string;
  reason?: string;
}

function buildProfileUrl(platform: PlatformKey, handle: string) {
  if (platform === "youtube") {
    return handle.startsWith("@")
      ? `https://www.youtube.com/${handle}`
      : `https://www.youtube.com/channel/${handle}`;
  }
  if (platform === "tiktok") {
    const safe = handle.startsWith("@") ? handle : `@${handle}`;
    return `https://www.tiktok.com/${safe}`;
  }
  if (platform === "instagram") {
    const safe = handle.replace(/^@/, "");
    return `https://www.instagram.com/${safe}/`;
  }
  return `https://www.facebook.com/${handle}`;
}

async function fetchWithTimeout(url: string, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; MultiStreamVerifier/1.0)",
      },
      cache: "no-store",
    });
  } finally {
    clearTimeout(timer);
  }
}

async function verifyYoutube(profileUrl: string) {
  const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(profileUrl)}&format=json`;
  const response = await fetchWithTimeout(oembed);
  if (response.ok) {
    const data = (await response.json().catch(() => null)) as { author_name?: string } | null;
    if (data?.author_name) return { ok: true };
  }

  // Fallback: validate using public profile page
  const profileResponse = await fetchWithTimeout(profileUrl);
  if (!profileResponse.ok) return { ok: false, reason: "No se pudo validar canal de YouTube." };
  const html = (await profileResponse.text().catch(() => "")).toLowerCase();
  const looksLikeChannel =
    html.includes("youtube") && (html.includes("channel") || html.includes("subscribers"));
  if (!looksLikeChannel) return { ok: false, reason: "Canal de YouTube no encontrado." };
  return { ok: true };
}

async function verifyTikTok(profileUrl: string) {
  const oembed = `https://www.tiktok.com/oembed?url=${encodeURIComponent(profileUrl)}`;
  const response = await fetchWithTimeout(oembed);
  if (!response.ok) return { ok: false, reason: "No se pudo validar cuenta de TikTok." };
  const data = (await response.json().catch(() => null)) as { author_name?: string } | null;
  if (!data?.author_name) return { ok: false, reason: "Cuenta de TikTok no encontrada." };
  return { ok: true };
}

async function verifyByProfilePage(platform: PlatformKey, profileUrl: string) {
  const response = await fetchWithTimeout(profileUrl);
  if (!response.ok) {
    return {
      ok: false,
      reason:
        platform === "instagram"
          ? "No se pudo validar cuenta de Instagram."
          : "No se pudo validar página de Facebook.",
    };
  }
  const html = await response.text().catch(() => "");
  const notFoundSignals = ["page isn't available", "content isn't available", "not found", "lo sentimos"];
  const lower = html.toLowerCase();
  if (notFoundSignals.some((signal) => lower.includes(signal))) {
    return {
      ok: false,
      reason:
        platform === "instagram"
          ? "Cuenta de Instagram no encontrada."
          : "Página de Facebook no encontrada.",
    };
  }
  return { ok: true };
}

export async function verifyPlatformHandleExists(
  platform: PlatformKey,
  rawHandle: string,
): Promise<VerificationResult> {
  const normalizedHandle = normalizeAccountInput(platform, rawHandle);
  if (!normalizedHandle) {
    return {
      ok: false,
      normalizedHandle: "",
      profileUrl: "",
      reason: "Cuenta vacía o inválida.",
    };
  }

  const profileUrl = buildProfileUrl(platform, normalizedHandle);

  try {
    if (platform === "youtube") {
      const result = await verifyYoutube(profileUrl);
      return { ...result, normalizedHandle, profileUrl };
    }
    if (platform === "tiktok") {
      const result = await verifyTikTok(profileUrl);
      return { ...result, normalizedHandle, profileUrl };
    }
    const result = await verifyByProfilePage(platform, profileUrl);
    return { ...result, normalizedHandle, profileUrl };
  } catch {
    return {
      ok: false,
      normalizedHandle,
      profileUrl,
      reason: "No se pudo completar la verificación de la cuenta.",
    };
  }
}
