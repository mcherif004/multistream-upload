"use client";

import type { PlatformKey } from "@/lib/types/platform";
import { Progress } from "@/components/ui/progress";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface PlatformProgressState {
  progress: number;
  status: UploadStatus;
  message?: string;
}

interface BatchProgressProps {
  activePlatforms: PlatformKey[];
  states: Record<PlatformKey, PlatformProgressState>;
}

const platformLabel: Record<PlatformKey, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
};

export function BatchProgress({ activePlatforms, states }: BatchProgressProps) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0f] p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/40 to-transparent" />
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#00d2ff]">
        Batch Upload
      </h3>

      {activePlatforms.length === 0 ? (
        <p className="text-xs text-zinc-500">Conecta y activa al menos una plataforma.</p>
      ) : null}

      {activePlatforms.map((platform) => {
        const state = states[platform];
        const isUploading = state.status === "uploading";
        const isSuccess = state.status === "success";
        const isError = state.status === "error";

        return (
          <div key={platform} className={`mb-3 last:mb-0 space-y-1.5 ${isUploading ? "animate-pulse" : ""}`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-200">{platformLabel[platform]}</span>
              <span
                className={
                  isSuccess
                    ? "text-[#00d2ff]"
                    : isError
                    ? "text-rose-400"
                    : isUploading
                    ? "text-yellow-400"
                    : "text-zinc-500"
                }
              >
                {isUploading && "Subiendo..."}
                {isSuccess && "✓ Completado"}
                {isError && "✕ Error"}
                {state.status === "idle" && "Pendiente"}
              </span>
            </div>
            <Progress
              value={state.progress}
              className={isSuccess ? "progress-neon" : undefined}
            />
            {state.message ? <p className="text-[11px] text-zinc-500">{state.message}</p> : null}
          </div>
        );
      })}
    </section>
  );
}
