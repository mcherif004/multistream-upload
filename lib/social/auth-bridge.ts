import type { OAuthConnection, PlatformKey } from "@/lib/types/platform";
import { normalizeAccountInput } from "@/lib/auth/platform-accounts";

const PLATFORM_OAUTH_CONFIG: Record<
  PlatformKey,
  { name: string; color: string; icon: string; scopes: string[] }
> = {
  youtube: {
    name: "YouTube",
    color: "#FF0000",
    icon: "YT",
    scopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube"],
  },
  tiktok: {
    name: "TikTok",
    color: "#010101",
    icon: "TK",
    scopes: ["video.upload", "user.info.basic"],
  },
  instagram: {
    name: "Instagram",
    color: "#E1306C",
    icon: "IG",
    scopes: ["instagram_basic", "instagram_content_publish"],
  },
  facebook: {
    name: "Facebook",
    color: "#1877F2",
    icon: "FB",
    scopes: ["pages_manage_posts", "pages_read_engagement"],
  },
};

export function getPlatformConfig(platform: PlatformKey) {
  return PLATFORM_OAUTH_CONFIG[platform];
}

/**
 * Simulated OAuth flow – opens a popup window.
 * In production, replace the popup URL with your actual OAuth endpoint
 * that exchanges codes for access tokens (YouTube Data API v3, TikTok Business, Meta Graph API).
 */
export async function triggerOAuthFlow(
  platform: PlatformKey,
  accountHint?: string,
): Promise<OAuthConnection> {

  return new Promise((resolve) => {
    const DEMO_HANDLES: Record<PlatformKey, string> = {
      youtube: "@mcherifx",
      tiktok: "@mcherifx",
      instagram: "@mcherifx",
      facebook: "mcherifx",
    };
    const resolvedHandle = normalizeAccountInput(platform, accountHint ?? "") || DEMO_HANDLES[platform];

    // Simulate OAuth popup handshake (2 seconds)
    // Replace setTimeout with real window.open popup + postMessage listener for production
    const delay = 1500 + Math.random() * 1000;

    setTimeout(() => {
      resolve({
        status: "connected",
        handle: resolvedHandle,
        accessToken: `sim_token_${platform}_${Date.now()}`,
        connectedAt: Date.now(),
      });
    }, delay);
  });
}

export function isConnected(connection: OAuthConnection) {
  return connection.status === "connected" && Boolean(connection.accessToken);
}
