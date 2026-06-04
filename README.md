# MultiStream Upload

![CI](https://github.com/mcherif004/multistream-upload/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-MVP-yellow)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Panel web para creadores que preparan un mismo vídeo para varias redes. Un formulario global sincroniza título, descripción y tags; cada plataforma puede hacer override manual antes de un envío batch.

> **MVP:** login (Google), cuentas verificadas (oEmbed), metadatos y batch API operativos. El vídeo se guarda en `.uploads/` local — los adaptadores de publicación en redes están en desarrollo.

<!-- Cuando tengas captura: ![Upload flow](docs/screenshots/upload-flow.png) -->

## Documentación

| Doc | Contenido |
|-----|-----------|
| **[BASE.md](BASE.md)** | **Inicio del proyecto — leer primero** |
| [COMO-FUNCIONA.md](docs/COMO-FUNCIONA.md) | Flujo técnico, límites MVP, entrevistas |
| [VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md) | Despliegue en Vercel |
| [docs/screenshots/](docs/screenshots/README.md) | Cómo añadir capturas al README |

## Arquitectura

```text
Browser (React)
  → App Router (/upload, /accounts, /login)
  → NextAuth (Google OAuth)
  → API Routes (/api/upload, /api/social/*)
  → upload-engine (Zod + batch)
  → [MVP] almacenamiento local  |  [roadmap] adapters YouTube / TikTok / Meta
```

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind · React Hook Form · Zod · NextAuth

## Setup

```bash
git clone https://github.com/mcherif004/multistream-upload.git
cd multistream-upload
npm install
cp .env.example .env.local
# AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
npm run dev
```

http://localhost:3000

## Variables de entorno

Ver [`.env.example`](.env.example): `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Scripts

| Comando | Uso |
|---------|-----|
| `npm run dev` | Desarrollo |
| `npm run build` | Producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |

## Roadmap

- [ ] Adapters reales en `lib/upload-engine/adapters/`
- [ ] Demo Vercel + badge en README
- [ ] Cola asíncrona para publicaciones largas

## Author

**Mostafa Cherif** — [GitHub](https://github.com/mcherif004) · [Portfolio](https://mcherif004.github.io/Portfolio/) · [LinkedIn](https://www.linkedin.com/in/mostafach/)
