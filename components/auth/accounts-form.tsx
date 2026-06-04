"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LinkedPlatformAccounts } from "@/lib/types/platform";

interface AccountsFormProps {
  initialAccounts: LinkedPlatformAccounts;
}

export function AccountsForm({ initialAccounts }: AccountsFormProps) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<LinkedPlatformAccounts>(initialAccounts);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasAnyConnectedAccount = Boolean(
    accounts.youtube.trim() || accounts.tiktok.trim() || accounts.instagram.trim() || accounts.facebook.trim(),
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!hasAnyConnectedAccount) {
      setError("Conecta al menos una cuenta para continuar.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accounts),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(payload?.message || "No se pudieron guardar las cuentas.");
        setSaving(false);
        return;
      }

      router.push("/upload");
      router.refresh();
    } catch {
      setError("Error de red al guardar cuentas.");
      setSaving(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">Cuenta YouTube (handle o channel ID)</span>
        <input
          value={accounts.youtube}
          onChange={(event) => setAccounts((prev) => ({ ...prev, youtube: event.target.value }))}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="@tuCanal"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">Cuenta TikTok</span>
        <input
          value={accounts.tiktok}
          onChange={(event) => setAccounts((prev) => ({ ...prev, tiktok: event.target.value }))}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="@tuCuentaTok"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">Cuenta Instagram</span>
        <input
          value={accounts.instagram}
          onChange={(event) => setAccounts((prev) => ({ ...prev, instagram: event.target.value }))}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="@tuCuentaInsta"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-xs text-zinc-400">Página Facebook (nombre o ID)</span>
        <input
          value={accounts.facebook}
          onChange={(event) => setAccounts((prev) => ({ ...prev, facebook: event.target.value }))}
          className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          placeholder="TuPaginaOficial"
        />
      </label>

      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
      <p className="text-[11px] text-zinc-500">Puedes escribir @usuario o pegar URL; se normaliza automáticamente.</p>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar y continuar"}
      </button>
    </form>
  );
}
