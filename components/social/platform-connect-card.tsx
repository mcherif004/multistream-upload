"use client";

import { useState } from "react";
import type { PlatformKey } from "@/lib/types/platform";
import { getPlatformConfig, isConnected } from "@/lib/social/auth-bridge";
import { useSocialAuth } from "@/lib/social/social-auth-context";
import type { OAuthConnection } from "@/lib/types/platform";

const PLATFORM_ICONS: Record<PlatformKey, string> = {
  youtube: "▶",
  tiktok: "♪",
  instagram: "◈",
  facebook: "f",
};

function statusDot(status: OAuthConnection["status"]) {
  if (status === "connected") return "bg-neon-blue shadow-neon-sm";
  if (status === "connecting") return "bg-yellow-400 animate-pulse";
  if (status === "error") return "bg-rose-500";
  return "bg-zinc-600";
}

interface PlatformConnectCardProps {
  platform: PlatformKey;
}

export function PlatformConnectCard({ platform }: PlatformConnectCardProps) {
  const { connections, connect, disconnect } = useSocialAuth();
  const connection = connections[platform];
  const cfg = getPlatformConfig(platform);
  const linked = isConnected(connection);
  const isConnecting = connection.status === "connecting";
  const [accountHint, setAccountHint] = useState("");

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
        linked
          ? "border-[#00d2ff]/40 bg-[#00d2ff]/5 shadow-neon-card"
          : "border-cyber-border bg-cyber-surface hover:border-[#00d2ff]/20"
      }`}
    >
      {/* Glow top line */}
      {linked ? (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent" />
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white ${
              linked ? "bg-[#00d2ff]/20" : "bg-zinc-800"
            }`}
          >
            {PLATFORM_ICONS[platform]}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{cfg.name}</p>
            {linked && connection.handle ? (
              <p className="text-xs text-[#00d2ff]">{connection.handle}</p>
            ) : (
              <p className="text-xs text-zinc-500">Sin conectar</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${statusDot(connection.status)}`} />

          {linked ? (
            <button
              type="button"
              onClick={() => disconnect(platform)}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-rose-500/50 hover:text-rose-400"
            >
              Desconectar
            </button>
          ) : (
            <button
              type="button"
              disabled={isConnecting}
              onClick={() => connect(platform, accountHint)}
              className="rounded-md bg-gradient-to-r from-[#00d2ff] to-blue-600 px-4 py-1.5 text-xs font-semibold text-black shadow-neon-sm disabled:opacity-60"
            >
              {isConnecting ? "Conectando..." : "Conectar"}
            </button>
          )}
        </div>
      </div>

      {!linked ? (
        <div className="mt-3">
          <label className="mb-1 block text-[11px] text-zinc-500">
            Cuenta a verificar (opcional, ej. @mcherifx)
          </label>
          <input
            value={accountHint}
            onChange={(event) => setAccountHint(event.target.value)}
            placeholder="@tuCuenta"
            className="w-full rounded-md border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-[#00d2ff]/40 focus:outline-none"
          />
        </div>
      ) : null}

      {connection.error ? (
        <p className="mt-2 text-[11px] text-rose-400">{connection.error}</p>
      ) : null}

      {linked && connection.connectedAt ? (
        <p className="mt-2 text-[11px] text-zinc-500">
          Verificado: {new Date(connection.connectedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
