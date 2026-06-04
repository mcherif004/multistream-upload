import type { PlatformConfig } from "@/lib/types/platform";

export interface YouTubeUploadInput {
  videoFile: File;
  title: string;
  description: string;
  tags: string[];
  privacy: "public" | "unlisted" | "private";
  accessToken: string;
}

export interface YouTubeUploadResult {
  ok: boolean;
  videoId?: string;
  url?: string;
  error?: string;
}

/**
 * Validates the YouTube payload before any network call.
 * Title max 100 chars, description max 5000, tags max 500 chars total.
 */
export function validateYouTubePayload(
  input: Pick<YouTubeUploadInput, "title" | "description" | "tags">,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push("title is required");
  } else if (input.title.length > 100) {
    errors.push("title exceeds YouTube 100-char limit");
  }

  if (input.description && input.description.length > 5000) {
    errors.push("description exceeds YouTube 5000-char limit");
  }

  const tagsString = input.tags.join(",");
  if (tagsString.length > 500) {
    errors.push("tags combined length exceeds YouTube 500-char limit");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Builds the YouTube Data API v3 video insert body from platform config.
 */
export function buildYouTubeInsertBody(
  config: Pick<PlatformConfig, "title" | "description" | "tags" | "privacy">,
) {
  return {
    snippet: {
      title: config.title,
      description: config.description ?? "",
      tags: config.tags ?? [],
      categoryId: "22", // People & Blogs — change per use-case
    },
    status: {
      privacyStatus: config.privacy ?? "private",
    },
  };
}

/**
 * Stub: simulates a YouTube upload call.
 * Replace the body of this function with real YouTube Data API v3 resumable upload
 * when OAuth tokens are available.
 *
 * Real flow:
 *   1. POST https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable
 *      with Authorization: Bearer <accessToken>
 *   2. Stream the file to the upload URI returned in Location header
 *   3. Poll for completion; return videoId
 */
export async function uploadToYouTube(
  input: YouTubeUploadInput,
): Promise<YouTubeUploadResult> {
  const validation = validateYouTubePayload(input);
  if (!validation.valid) {
    return { ok: false, error: validation.errors.join("; ") };
  }

  // --- STUB: remove and replace with real API call ---
  await new Promise((r) => setTimeout(r, 800)); // simulate network
  console.info("[youtube.adapter] stub upload — no real API call made");
  return {
    ok: true,
    videoId: `stub-${Date.now()}`,
    url: `https://www.youtube.com/watch?v=stub-${Date.now()}`,
  };
  // --- END STUB ---
}
