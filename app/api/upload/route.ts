import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const video = formData.get("video");
  const title = String(formData.get("title") ?? "").trim();

  let selectedPlatforms: string[] = [];
  let platformTitles: Record<string, string> = {};

  try {
    selectedPlatforms = JSON.parse(String(formData.get("selectedPlatforms") ?? "[]"));
    platformTitles = JSON.parse(String(formData.get("platformTitles") ?? "{}"));
  } catch {
    return NextResponse.json({ ok: false, message: "Payload inválido." }, { status: 400 });
  }

  if (!(video instanceof File)) {
    return NextResponse.json({ ok: false, message: "Archivo de video requerido." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ ok: false, message: "El título es obligatorio." }, { status: 400 });
  }
  if (!Array.isArray(selectedPlatforms) || selectedPlatforms.length === 0) {
    return NextResponse.json({ ok: false, message: "Selecciona al menos una plataforma." }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), ".uploads");
  await mkdir(uploadsDir, { recursive: true });
  const safeName = video.name.replace(/[^\w.\-]/g, "_");
  const targetName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(uploadsDir, targetName);
  const buffer = Buffer.from(await video.arrayBuffer());
  await writeFile(targetPath, buffer);

  const delayMs = 2000 + Math.floor(Math.random() * 1000);
  await sleep(delayMs);

  return NextResponse.json(
    {
      ok: true,
      message: "Batch upload local procesado correctamente.",
      selectedPlatforms,
      title,
      platformTitles,
      storedVideo: {
        originalName: video.name,
        savedAs: targetName,
        bytes: video.size,
      },
      receivedAt: new Date().toISOString(),
    },
    { status: 200 },
  );
}
