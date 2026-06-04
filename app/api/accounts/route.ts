import { NextResponse } from "next/server";
import { z } from "zod";
import { updateUserAccounts } from "@/lib/auth/users";
import { isValidPlatformAccountHandle, normalizeAccountInput } from "@/lib/auth/platform-accounts";
import { resolveLocalUser } from "@/lib/auth/local-user";

const accountsSchema = z.object({
  youtube: z.string().trim().max(200).default(""),
  tiktok: z.string().trim().max(200).default(""),
  instagram: z.string().trim().max(200).default(""),
  facebook: z.string().trim().max(200).default(""),
}).transform((values) => ({
  youtube: normalizeAccountInput("youtube", values.youtube),
  tiktok: normalizeAccountInput("tiktok", values.tiktok),
  instagram: normalizeAccountInput("instagram", values.instagram),
  facebook: normalizeAccountInput("facebook", values.facebook),
})).superRefine((values, ctx) => {
  const hasAny =
    Boolean(values.youtube) || Boolean(values.tiktok) || Boolean(values.instagram) || Boolean(values.facebook);

  if (!hasAny) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Conecta al menos una cuenta válida.",
      path: ["youtube"],
    });
    return;
  }

  const checks: Array<{ key: keyof typeof values; label: string }> = [
    { key: "youtube", label: "YouTube" },
    { key: "tiktok", label: "TikTok" },
    { key: "instagram", label: "Instagram" },
    { key: "facebook", label: "Facebook" },
  ];

  for (const check of checks) {
    const value = values[check.key];
    if (!value) continue;
    if (!isValidPlatformAccountHandle(check.key, value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cuenta inválida para ${check.label}. Usa usuario/handle correcto (ej: @tuCuenta).`,
        path: [check.key],
      });
    }
  }
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = accountsSchema.safeParse(body);
  if (!parsed.success) {
    const issueMessage = parsed.error.issues[0]?.message ?? "Formato de cuentas inválido.";
    return NextResponse.json({ ok: false, message: issueMessage }, { status: 400 });
  }

  const resolvedUser = resolveLocalUser();

  const updated = updateUserAccounts(resolvedUser.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ ok: false, message: "Usuario no encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    accounts: updated.accounts,
  });
}
