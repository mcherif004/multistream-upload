"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await signIn("google", {
        callbackUrl: "/upload",
        redirect: false,
      });

      if (response?.error) {
        setError("No se pudo iniciar sesión con Google. Verifica GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET.");
        return;
      }

      if (response?.url) {
        router.push(response.url);
        return;
      }

      router.push("/upload");
    } catch {
      setError("Error inesperado al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <section className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h1 className="text-xl font-semibold">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-zinc-400">Accede con tu cuenta de Google para continuar.</p>

          <button
            type="button"
            onClick={onGoogleLogin}
            disabled={loading}
            className="mt-5 w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-60"
          >
            {loading ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          {error ? <p className="mt-3 text-xs text-rose-400">{error}</p> : null}
        </section>
      </div>
    </main>
  );
}
