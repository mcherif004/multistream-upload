"use client";

import type { UseFormRegister } from "react-hook-form";
import type { PlatformKey } from "@/lib/types/platform";
import type { UploadFormValues } from "@/lib/validation/upload-schema";
import { useSocialAuth } from "@/lib/social/social-auth-context";

type PlatformSection = PlatformKey | "global";

interface PlatformFieldsProps {
  platform: PlatformSection;
  register: UseFormRegister<UploadFormValues>;
}

const platformTitleMap: Record<PlatformSection, string> = {
  global: "Global",
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
};

function LockedGate({ platform, onConnect }: { platform: PlatformKey; onConnect: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#00d2ff]/20 bg-[#00d2ff]/5 p-8 text-center">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#00d2ff]/30 bg-[#00d2ff]/10">
        <span className="text-lg text-[#00d2ff]">🔗</span>
      </div>
      <p className="text-sm font-semibold text-white">{platformTitleMap[platform]} no conectado</p>
      <p className="mt-1 text-xs text-zinc-500">Conecta tu cuenta para editar metadata y subir contenido.</p>
      <button
        type="button"
        onClick={onConnect}
        className="mt-4 rounded-lg bg-gradient-to-r from-[#00d2ff] to-blue-600 px-6 py-2 text-xs font-bold text-black shadow-neon-sm"
      >
        Conectar {platformTitleMap[platform]}
      </button>
    </div>
  );
}

export function PlatformFields({ platform, register }: PlatformFieldsProps) {
  const isGlobal = platform === "global";
  const { isConnected, connect } = useSocialAuth();
  const linked = isGlobal || isConnected(platform as PlatformKey);

  if (!isGlobal && !linked) {
    return <LockedGate platform={platform as PlatformKey} onConnect={() => connect(platform as PlatformKey)} />;
  }

  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-[#0a0a0f] p-5">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {platformTitleMap[platform]} <span className="text-zinc-500 font-normal">— Publicación</span>
        </h3>
      </header>

      {!isGlobal ? (
        <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            className="accent-[#00d2ff]"
            {...register(`${platform}.enabled`)}
          />
          Publicar en {platformTitleMap[platform]}
        </label>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-zinc-400">Título</span>
        <input
          className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-[#00d2ff]/50 focus:outline-none focus:ring-1 focus:ring-[#00d2ff]/30"
          {...register(`${platform}.title`)}
          placeholder={`Título de tu video en ${platformTitleMap[platform]}`}
        />
      </label>
    </section>
  );
}
