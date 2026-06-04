# BASE — MultiStream Upload

Documento de referencia del proyecto. README = carta de presentación; este archivo = cómo trabajar aquí.

## Qué es

Panel Next.js para preparar **metadatos de vídeo** en varias redes y lanzar un **envío batch**.  
**MVP actual:** auth Google, formularios, verificación de handles, upload a `.uploads/` local. **No publica aún** en YouTube/TikTok/Meta.

## Setup (5 min)

```bash
git clone https://github.com/mcherif004/multistream-upload.git
cd multistream-upload
npm install
cp .env.example .env.local
```

Rellenar `.env.local` (ver tabla abajo). Luego:

```bash
npm run dev
```

→ http://localhost:3000

## Variables de entorno

| Variable | Obligatorio | Uso |
|----------|-------------|-----|
| `AUTH_SECRET` | Sí | Secreto sesión (`openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Sí | Google Cloud → OAuth |
| `GOOGLE_CLIENT_SECRET` | Sí | OAuth |
| `NEXTAUTH_URL` | Prod | `http://localhost:3000` en dev; URL Vercel en prod |
| `NEXTAUTH_SECRET` | Prod | Igual que `AUTH_SECRET` o dedicado |

## Estructura del código

```text
app/
  (auth)/login/          → Google OAuth
  (dashboard)/upload/    → Formulario principal
  (dashboard)/accounts/  → Conectar handles
  api/upload/            → Batch (mock → disco)
  api/social/            → Connect / verify
lib/
  upload-engine/         → Zod, batch, adapters/
  auth/                  → Sesión (evolucionar a user real)
```

## Comandos

| Comando | Cuándo |
|---------|--------|
| `npm run dev` | Desarrollo |
| `npm run lint` | Antes de commit |
| `npm run typecheck` | Antes de commit |
| `npm run build` | Probar build prod |

CI en GitHub ejecuta lint + typecheck en cada push a `main`.

## Roadmap (orden)

1. [ ] Sesión real en APIs (sustituir usuario local fijo)
2. [ ] Proteger rutas dashboard con sesión
3. [ ] Adapter YouTube upload real
4. [ ] Vercel + URL en README/CV
5. [ ] Persistencia DB (Prisma) en lugar de memoria
6. [ ] Tests (schemas + API upload)

Detalle técnico: [docs/COMO-FUNCIONA.md](docs/COMO-FUNCIONA.md)  
Deploy: [docs/VERCEL-DEPLOY.md](docs/VERCEL-DEPLOY.md)  
Tareas largas: [TODO-RUTA.md](TODO-RUTA.md)

## Qué no commitear

`.env.local`, `.uploads/`, `node_modules/`, `.vercel`

## Contributing (solo tú)

- Commits: `feat:`, `fix:`, `docs:`, `chore:`
- Un cambio por commit
- Actualizar este BASE si cambia el MVP
