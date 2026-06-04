import type { PlatformKey } from "@/lib/types/platform";
import type { UploadFormValues } from "@/lib/validation/upload-schema";

export type BatchUploadState = "idle" | "uploading" | "success" | "error";

export interface BatchProgressUpdate {
  platform: PlatformKey;
  progress: number;
  status: BatchUploadState;
  message?: string;
}

interface RunBatchUploadInput {
  values: UploadFormValues;
  selectedPlatforms: PlatformKey[];
  onProgress?: (update: BatchProgressUpdate) => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function simulatePlatformProgress(
  platform: PlatformKey,
  onProgress?: (update: BatchProgressUpdate) => void,
) {
  let progress = 5;
  onProgress?.({ platform, progress, status: "uploading" });

  while (progress < 90) {
    await wait(220 + Math.floor(Math.random() * 220));
    progress = Math.min(progress + Math.floor(Math.random() * 12) + 5, 90);
    onProgress?.({ platform, progress, status: "uploading" });
  }
}

export async function runBatchUpload({ values, selectedPlatforms, onProgress }: RunBatchUploadInput) {
  if (selectedPlatforms.length === 0) return { ok: false, error: "No hay plataformas seleccionadas." };
  if (!values.media?.file) {
    return { ok: false, error: "Debes seleccionar un video antes de subir." };
  }

  const simulators = selectedPlatforms.map((platform) => simulatePlatformProgress(platform, onProgress));

  const formData = new FormData();
  formData.append("video", values.media.file);
  formData.append("title", values.global.title);
  formData.append("selectedPlatforms", JSON.stringify(selectedPlatforms));
  formData.append(
    "platformTitles",
    JSON.stringify(
      selectedPlatforms.reduce<Record<string, string>>((acc, platform) => {
        acc[platform] = values[platform].title;
        return acc;
      }, {}),
    ),
  );

  const request = fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  await Promise.all(simulators);
  const response = await request;

  if (!response.ok) {
    selectedPlatforms.forEach((platform) =>
      onProgress?.({
        platform,
        progress: 20,
        status: "error",
        message: "Error de red durante la subida.",
      }),
    );
    return { ok: false, error: "Upload fallido." };
  }

  selectedPlatforms.forEach((platform) =>
    onProgress?.({
      platform,
      progress: 100,
      status: "success",
    }),
  );

  return { ok: true };
}
