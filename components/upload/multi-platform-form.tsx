"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { PLATFORM_KEYS, type PlatformKey } from "@/lib/types/platform";
import { runBatchUpload } from "@/lib/upload-engine/batch-upload.service";
import { defaultUploadValues, type UploadFormValues, uploadSchema } from "@/lib/validation/upload-schema";
import { useSocialAuth } from "@/lib/social/social-auth-context";
import { BatchProgress, type PlatformProgressState } from "./batch-progress";
import { MediaDropzone } from "./media-dropzone";
import { PlatformFields } from "./platform-fields";

type TabKey = "global" | PlatformKey;

export function MultiPlatformForm() {
  const { isConnected, connectedPlatforms } = useSocialAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("global");
  const [uploading, setUploading] = useState(false);
  const [progressState, setProgressState] = useState<Record<PlatformKey, PlatformProgressState>>({
    youtube: { progress: 0, status: "idle" },
    tiktok: { progress: 0, status: "idle" },
    instagram: { progress: 0, status: "idle" },
    facebook: { progress: 0, status: "idle" },
  });

  const methods = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: defaultUploadValues,
    mode: "onChange",
  });

  const { control, getValues, handleSubmit, setValue, register } = methods;

  const globalTitle = useWatch({ control, name: "global.title" });
  const mediaPreview = useWatch({ control, name: "media.previewUrl" });
  const youtubeEnabled = useWatch({ control, name: "youtube.enabled" });
  const tiktokEnabled = useWatch({ control, name: "tiktok.enabled" });
  const instagramEnabled = useWatch({ control, name: "instagram.enabled" });
  const facebookEnabled = useWatch({ control, name: "facebook.enabled" });

  // Active platforms = connected + enabled
  const activePlatforms = useMemo(() => {
    const enabledMap: Record<PlatformKey, boolean> = {
      youtube: Boolean(youtubeEnabled),
      tiktok: Boolean(tiktokEnabled),
      instagram: Boolean(instagramEnabled),
      facebook: Boolean(facebookEnabled),
    };
    return PLATFORM_KEYS.filter((p) => isConnected(p) && enabledMap[p]);
  }, [facebookEnabled, instagramEnabled, isConnected, tiktokEnabled, youtubeEnabled]);

  // Sync título global hacia plataformas conectadas sin título propio.
  useEffect(() => {
    for (const platform of PLATFORM_KEYS) {
      const current = getValues(platform);
      if (!isConnected(platform)) continue;
      const hasCustomTitle = current.title.trim().length > 0 && current.title !== globalTitle;
      if (!hasCustomTitle && current.title !== globalTitle) {
        setValue(`${platform}.title`, globalTitle ?? "", { shouldDirty: true });
      }
    }
  }, [getValues, globalTitle, isConnected, setValue]);

  const hasMedia = Boolean(mediaPreview);
  const canUpload = hasMedia && Boolean(globalTitle?.trim()) && activePlatforms.length > 0 && !uploading;

  const onSubmit = async (values: UploadFormValues) => {
    if (!canUpload) return;

    setUploading(true);
    setProgressState((prev) => {
      const next = { ...prev };
      for (const platform of PLATFORM_KEYS) {
        next[platform] = activePlatforms.includes(platform)
          ? { progress: 5, status: "uploading" }
          : { progress: 0, status: "idle" };
      }
      return next;
    });

    const result = await runBatchUpload({
      values,
      selectedPlatforms: activePlatforms,
      onProgress: ({ platform, progress, status, message }) => {
        setProgressState((prev) => ({
          ...prev,
          [platform]: { progress, status, message },
        }));
      },
    });

    if (!result.ok) {
      setProgressState((prev) => {
        const next = { ...prev };
        for (const platform of activePlatforms) {
          const current = prev[platform];
          if (current.status !== "success") {
            next[platform] = {
              progress: Math.max(current.progress, 20),
              status: "error",
              message: result.error ?? "Falló la subida",
            };
          }
        }
        return next;
      });
    }

    setUploading(false);
  };

  const tabs = useMemo<TabKey[]>(() => ["global", ...PLATFORM_KEYS], []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-12">
        {/* Left column – sticky */}
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-6 lg:self-start">
          <MediaDropzone previewUrl={mediaPreview} setValue={setValue} />
          <BatchProgress activePlatforms={activePlatforms} states={progressState} />

          {/* Upload button */}
          <button
            type="submit"
            disabled={!canUpload}
            className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
              canUpload
                ? "bg-gradient-to-r from-[#00d2ff] to-blue-600 text-black shadow-neon"
                : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            }`}
          >
            {uploading
              ? "Distribuyendo..."
              : !hasMedia
              ? "⬆ Sube un video primero"
              : !globalTitle?.trim()
              ? "Escribe un título"
              : activePlatforms.length === 0
              ? "Conecta e inicia una plataforma"
              : `⚡ Upload a ${activePlatforms.length} plataforma${activePlatforms.length > 1 ? "s" : ""}`}
          </button>

          {connectedPlatforms.length === 0 && (
            <p className="text-center text-[11px] text-zinc-500">
              Sin plataformas conectadas.{" "}
              <a href="/accounts" className="text-[#00d2ff] underline">
                Ir a Conectar →
              </a>
            </p>
          )}
        </aside>

        {/* Right column – tabs + fields */}
        <section className="space-y-4 lg:col-span-7">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              const tabLinked = tab === "global" || isConnected(tab as PlatformKey);
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative rounded-lg px-4 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#00d2ff]/10 text-[#00d2ff] shadow-neon-sm ring-1 ring-[#00d2ff]/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab === "global" ? "Global" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {!tabLinked && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-zinc-600" />
                  )}
                  {tabLinked && tab !== "global" && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#00d2ff] shadow-neon-sm" />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "global" && (
            <PlatformFields platform="global" register={register} />
          )}
          {activeTab === "youtube" && (
            <PlatformFields platform="youtube" register={register} />
          )}
          {activeTab === "tiktok" && (
            <PlatformFields platform="tiktok" register={register} />
          )}
          {activeTab === "instagram" && (
            <PlatformFields platform="instagram" register={register} />
          )}
          {activeTab === "facebook" && (
            <PlatformFields platform="facebook" register={register} />
          )}
        </section>
      </form>
    </FormProvider>
  );
}
