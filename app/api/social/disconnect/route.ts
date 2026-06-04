import { NextResponse } from "next/server";
import { z } from "zod";
import { disconnectUserPlatform } from "@/lib/auth/users";
import { PLATFORM_KEYS } from "@/lib/types/platform";
import { resolveLocalUser } from "@/lib/auth/local-user";

const disconnectSchema = z.object({
  platform: z.enum(PLATFORM_KEYS),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = disconnectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Payload inválido." }, { status: 400 });
  }

  const user = resolveLocalUser();

  const updated = disconnectUserPlatform(user.id, parsed.data.platform);
  if (!updated) {
    return NextResponse.json({ ok: false, message: "No se pudo desconectar la plataforma." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    accounts: updated.accounts,
    connection: updated.socialConnections[parsed.data.platform],
  });
}
