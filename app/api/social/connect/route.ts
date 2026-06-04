import { NextResponse } from "next/server";
import { z } from "zod";
import { connectUserPlatform } from "@/lib/auth/users";
import { PLATFORM_KEYS } from "@/lib/types/platform";
import { verifyPlatformHandleExists } from "@/lib/social/platform-verifier";
import { resolveLocalUser } from "@/lib/auth/local-user";

const connectSchema = z.object({
  platform: z.enum(PLATFORM_KEYS),
  handle: z.string().trim().min(2).max(80),
  accessToken: z.string().trim().min(10),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = connectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Payload de conexión inválido." }, { status: 400 });
  }

  const user = resolveLocalUser();

  const verification = await verifyPlatformHandleExists(parsed.data.platform, parsed.data.handle);
  if (!verification.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: verification.reason ?? "No se pudo verificar la cuenta en la plataforma.",
      },
      { status: 400 },
    );
  }

  const updated = connectUserPlatform(user.id, parsed.data.platform, {
    handle: verification.normalizedHandle,
    accessToken: parsed.data.accessToken,
  });

  if (!updated) {
    return NextResponse.json({ ok: false, message: "No se pudo conectar la plataforma." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    accounts: updated.accounts,
    verifiedProfileUrl: verification.profileUrl,
    connection: updated.socialConnections[parsed.data.platform],
  });
}
