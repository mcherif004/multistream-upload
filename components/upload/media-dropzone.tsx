"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import type { UseFormSetValue } from "react-hook-form";
import type { UploadFormValues } from "@/lib/validation/upload-schema";

interface MediaDropzoneProps {
  previewUrl?: string;
  setValue: UseFormSetValue<UploadFormValues>;
}

export function MediaDropzone({ previewUrl, setValue }: MediaDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const nextPreview = URL.createObjectURL(file);
      setValue(
        "media",
        { name: file.name, type: file.type, size: file.size, previewUrl: nextPreview, file },
        { shouldDirty: true, shouldTouch: true },
      );
    },
    [setValue],
  );

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".mkv", ".webm"] },
    maxFiles: 1,
  });

  return (
    <section className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#0a0a0f]">
      {previewUrl && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/50 to-transparent" />
      )}

      <div
        {...getRootProps()}
        className={`cursor-pointer p-4 text-center text-sm transition-all ${
          isDragActive
            ? "border-[#00d2ff] bg-[#00d2ff]/10 text-[#00d2ff]"
            : "border-b border-zinc-800 text-zinc-500 hover:text-zinc-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-xs">
          {isDragActive ? "Suelta el video aquí..." : "⬆ Arrastra o haz click para seleccionar video"}
        </p>
      </div>

      {previewUrl ? (
        <video
          src={previewUrl}
          controls
          className="aspect-video w-full bg-black object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full items-center justify-center text-xs text-zinc-600">
          Vista previa del video
        </div>
      )}
    </section>
  );
}
