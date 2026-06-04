# MultiStream Upload

![Status](https://img.shields.io/badge/status-MVP-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Elevator pitch:** Panel web para creadores que suben un mismo vídeo a varias redes. Un formulario global sincroniza título, descripción y tags; cada plataforma puede hacer override manual antes de un envío batch único.

## Demo visual

> Añade capturas tú mismo (~15 min): ver [../docs/screenshots/GUIA-IMAGENES-README.md](../docs/screenshots/GUIA-IMAGENES-README.md)

Crea `docs/screenshots/upload-flow.png` y descomenta:

```markdown
<!-- ![Upload flow](docs/screenshots/upload-flow.png) -->
```

## Architecture overview

```text
Browser (React)
    → App Router pages (/upload, /accounts, /login)
    → NextAuth (Google OAuth) + session middleware
    → API Routes (/api/upload, /api/social/*)
    → upload-engine (Zod validation + batch service)
    → [MVP] mock adapter  |  [roadmap] YouTube / TikTok / Meta adapters
```

| Capa | Responsabilidad |
|------|-----------------|
| `app/(dashboard)/upload` | UI de metadatos multi-plataforma y estado de envío |
| `lib/upload-engine/` | Validación, sync global → plataformas, batch submit |
| `lib/auth/` | Sesión, cuentas vinculadas |
| `app/api/upload` | Endpoint mock con latencia simulada (listo para adapters reales) |

## Tech stack

- **Frontend:** React 18, Next.js 14 (App Router), Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth (Google OAuth)
- **Runtime:** Node.js 20+

## Setup

```bash
git clone https://github.com/mcherif004/multistream-upload.git
cd multistream-upload
npm install
cp .env.example .env.local
# Editar AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
npm run dev
```

Abre `http://localhost:3000` → redirige a `/upload` o `/login`.

## Environment variables

Ver [`.env.example`](.env.example):

| Variable | Descripción |
|----------|-------------|
| `AUTH_SECRET` | Secreto de sesión (openssl rand -base64 32) |
| `GOOGLE_CLIENT_ID` | OAuth Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth Google Cloud Console |

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Build producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin emit |

## Roadmap (CV / producción)

- [ ] Adapters reales en `lib/upload-engine/adapters/`
- [ ] Progreso por plataforma y reintentos
- [ ] Cola asíncrona (worker + Redis) para publicación larga

## Author

**Mostafa Cherif** — [GitHub](https://github.com/mcherif004) · [Portfolio](https://mcherif004.github.io/Portfolio/) · [LinkedIn](https://www.linkedin.com/in/mostafach/)
