export const PLATFORM_KEYS = ["youtube", "tiktok", "instagram", "facebook"] as const;

export type PlatformKey = (typeof PLATFORM_KEYS)[number];

export type Privacy = "public" | "unlisted" | "private";

export type OAuthConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface OAuthConnection {
  status: OAuthConnectionStatus;
  handle?: string;
  accessToken?: string;
  error?: string;
  connectedAt?: number;
}

export type PlatformConnectionMap = Record<PlatformKey, OAuthConnection>;

export interface PlatformConfig {
  enabled: boolean;
  overridden: boolean;
  title: string;
  description: string;
  tags: string[];
  privacy?: Privacy;
  coverTimestampSec?: number;
  reelsMode?: boolean;
}

export interface GlobalConfig {
  title: string;
  description: string;
  tags: string[];
}

export interface MediaAsset {
  name: string;
  type: string;
  size: number;
  previewUrl: string;
}

export interface UploadFormPayload {
  media?: MediaAsset;
  global: GlobalConfig;
  youtube: PlatformConfig;
  tiktok: PlatformConfig;
  instagram: PlatformConfig;
  facebook: PlatformConfig;
}

export interface LinkedPlatformAccounts {
  youtube: string;
  tiktok: string;
  instagram: string;
  facebook: string;
}
