import { NextResponse } from "next/server";
import { resolveLocalUser } from "@/lib/auth/local-user";

export async function GET() {
  const user = resolveLocalUser();

  return NextResponse.json({
    ok: true,
    accounts: user.accounts,
    connections: user.socialConnections,
  });
}
