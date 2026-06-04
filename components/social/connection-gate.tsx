"use client";

import { useRouter } from "next/navigation";
import { PLATFORM_KEYS } from "@/lib/types/platform";
import { useSocialAuth } from "@/lib/social/social-auth-context";
import { PlatformConnectCard } from "./platform-connect-card";

interface ConnectionGateProps {
  displayName: string;
}

export function ConnectionGate({ displayName }: ConnectionGateProps) {
  const router = useRouter();
  const { connectedPlatforms } = useSocialAuth();
  const hasAny = connectedPlatforms.length > 0;

  return (
    <main className="min-h-screen bg-[#000000] text-zinc-100">
      {/* Ambient top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/60 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#00d2ff]/5 to-transparent" />

      <div className="mx-auto max-w-2xl px-6 py-16">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#00d2ff]/30 bg-[#00d2ff]/10 shadow-neon-sm">
            <span className="text-xl text-[#00d2ff]">⚡</span>
          </div>
          <h1 className="bg-gradient-to-r from-[#00d2ff] to-blue-400 bg-clip-text text-3xl font-bold text-transparent">
            Conectar Plataformas
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Hola <span className="text-[#00d2ff]">{displayName}</span>. Conecta al menos una plataforma
            para subir y programar contenido.
          </p>
        </header>

        <div className="space-y-3">
          {PLATFORM_KEYS.map((platform) => (
            <PlatformConnectCard key={platform} platform={platform} />
          ))}
        </div>

        <div className="mt-8 text-center">
          {hasAny ? (
            <button
              type="button"
              onClick={() => router.push("/upload")}
              className="rounded-xl bg-gradient-to-r from-[#00d2ff] to-blue-600 px-8 py-3 text-sm font-bold text-black shadow-neon"
            >
              Ir al Studio →
            </button>
          ) : (
            <p className="text-xs text-zinc-500">
              Conecta al menos una plataforma para continuar.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
