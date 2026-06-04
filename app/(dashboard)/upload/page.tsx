import { MultiPlatformForm } from "@/components/upload/multi-platform-form";

export default async function UploadDashboardPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      {/* Top neon line */}
      <div className="fixed inset-x-0 top-0 z-50 h-px bg-gradient-to-r from-transparent via-[#00d2ff]/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-[#00d2ff] to-blue-400 bg-clip-text text-2xl font-bold text-transparent">
              MultiStream Studio
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Modo local · Conecta una cuenta y sube tu video
            </p>
          </div>
        </header>

        {/* Main form */}
        <MultiPlatformForm />
      </div>
    </main>
  );
}
