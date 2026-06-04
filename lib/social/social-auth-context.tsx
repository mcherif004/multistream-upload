"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { OAuthConnection, PlatformConnectionMap, PlatformKey } from "@/lib/types/platform";
import { PLATFORM_KEYS } from "@/lib/types/platform";
import { isConnected, triggerOAuthFlow } from "./auth-bridge";

const defaultConnection: OAuthConnection = { status: "idle" };

const defaultMap: PlatformConnectionMap = {
  youtube: { ...defaultConnection },
  tiktok: { ...defaultConnection },
  instagram: { ...defaultConnection },
  facebook: { ...defaultConnection },
};

interface SocialAuthContextValue {
  connections: PlatformConnectionMap;
  connect: (platform: PlatformKey, accountHint?: string) => Promise<void>;
  disconnect: (platform: PlatformKey) => Promise<void>;
  isConnected: (platform: PlatformKey) => boolean;
  connectedPlatforms: PlatformKey[];
}

const SocialAuthContext = createContext<SocialAuthContextValue | null>(null);

export function SocialAuthProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<PlatformConnectionMap>(defaultMap);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      try {
        const response = await fetch("/api/social/status");
        const payload = await response.json().catch(() => null);
        if (!mounted || !response.ok || !payload?.connections) return;
        setConnections(payload.connections as PlatformConnectionMap);
      } finally {
        if (mounted) setHydrated(true);
      }
    };
    void hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const connect = useCallback(async (platform: PlatformKey, accountHint?: string) => {
    setConnections((prev) => ({
      ...prev,
      [platform]: { status: "connecting" },
    }));

    try {
      const result = await triggerOAuthFlow(platform, accountHint);
      const response = await fetch("/api/social/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          handle: result.handle,
          accessToken: result.accessToken,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.connection) {
        throw new Error(payload?.message || "No se pudo verificar/conectar la cuenta.");
      }

      setConnections((prev) => ({ ...prev, [platform]: payload.connection as OAuthConnection }));
    } catch (error) {
      setConnections((prev) => ({
        ...prev,
        [platform]: {
          status: "error",
          error: error instanceof Error ? error.message : "Falló la conexión OAuth.",
        },
      }));
    }
  }, []);

  const disconnect = useCallback(async (platform: PlatformKey) => {
    setConnections((prev) => ({ ...prev, [platform]: { status: "connecting" } }));
    try {
      const response = await fetch("/api/social/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.connection) throw new Error("No se pudo desconectar.");
      setConnections((prev) => ({ ...prev, [platform]: payload.connection as OAuthConnection }));
    } catch {
      setConnections((prev) => ({ ...prev, [platform]: { status: "error", error: "Error al desconectar." } }));
    }
  }, []);

  const checkConnected = useCallback(
    (platform: PlatformKey) => isConnected(connections[platform]),
    [connections],
  );

  const connectedPlatforms = PLATFORM_KEYS.filter((p) => isConnected(connections[p]));

  return (
    <SocialAuthContext.Provider
      value={{
        connections,
        connect,
        disconnect,
        isConnected: checkConnected,
        connectedPlatforms: hydrated ? connectedPlatforms : [],
      }}
    >
      {children}
    </SocialAuthContext.Provider>
  );
}

export function useSocialAuth() {
  const ctx = useContext(SocialAuthContext);
  if (!ctx) throw new Error("useSocialAuth must be used inside SocialAuthProvider");
  return ctx;
}
