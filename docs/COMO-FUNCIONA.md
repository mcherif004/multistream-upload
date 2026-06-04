# Cómo funciona multistream-upload

Documentación técnica interna. Útil para entrevistas y para retomar el proyecto.

---

## Qué hace (en 2 líneas)

Un creador sube un vídeo, escribe metadatos (título, descripción, tags) una sola vez en el formulario **Global**, y la app los distribuye a todas las plataformas que tenga conectadas. Cada plataforma puede sobrescribir los metadatos de forma independiente antes del envío.

---

## Flujo completo

```
1. Login (/login)
   └── Google OAuth (NextAuth) → JWT session → redirige a /upload

2. Conectar cuentas (/accounts)
   └── Usuario escribe su handle (p.ej. @micanal)
   └── POST /api/social/connect
       ├── Zod valida el payload
       ├── verifyPlatformHandleExists() → llama oEmbed/perfil público de cada red
       └── Si OK: guarda handle + token en usersStore (in-memory)

3. Panel de subida (/upload)
   ├── MediaDropzone: drag-and-drop → File → previewUrl (blob local)
   ├── Formulario Global: título que se sincroniza automáticamente a plataformas conectadas
   ├── Tabs por plataforma: override manual de título (flag overridden)
   └── Botón activo solo si: hay archivo + título + ≥1 plataforma conectada+activa

4. Submit (handleSubmit → runBatchUpload)
   ├── Inicia animación de progreso simulado (5% → 90%) para cada plataforma
   ├── POST /api/upload con FormData (video + title + selectedPlatforms + platformTitles)
   │   ├── Guarda el vídeo en .uploads/ (local, gitignored)
   │   ├── Espera 2–3 s (simulación de latencia de red)
   │   └── Responde 200 con objeto de confirmación
   └── Progreso actualiza a 100% / success — o error si falla

5. Logout: NextAuth /api/auth/signout → redirige a /login
```

---

## Arquitectura de capas

| Capa | Archivos | Responsabilidad |
|------|----------|-----------------|
| **Rutas (pages)** | `app/(dashboard)/upload/`, `app/(auth)/login/`, `app/(dashboard)/accounts/` | Solo layout + render |
| **API Routes** | `app/api/upload/`, `app/api/social/*`, `app/api/auth/[...nextauth]` | Lógica server-side, validación Zod |
| **Upload engine** | `lib/upload-engine/batch-upload.service.ts` | Orquesta batch, expone `runBatchUpload()` |
| **Adapters** | `lib/upload-engine/adapters/youtube.adapter.ts` | Stub listo para API real de YouTube |
| **Auth** | `lib/auth/auth-options.ts`, `lib/auth/users.ts` | NextAuth config + store in-memory de usuarios |
| **Social context** | `lib/social/social-auth-context.tsx` | React Context: estado de conexiones OAuth por plataforma |
| **Validación** | `lib/validation/upload-schema.ts` | Zod schemas compartidos frontend/backend |
| **Tipos** | `lib/types/platform.ts` | Contratos TypeScript: `PlatformKey`, `OAuthConnection`, `PlatformConfig` |

---

## Limitaciones actuales (MVP)

| Limitación | Impacto | Solución futura |
|------------|---------|-----------------|
| **usersStore en memoria** | Los datos desaparecen al reiniciar el servidor | Sustituir por DB (Postgres/SQLite) |
| **Tokens OAuth no reales** | La conexión acepta cualquier token (sin verificación real con OAuth de cada red) | Implementar flujo OAuth real con `youtube.adapter.ts` |
| **Upload es un mock** | El vídeo se guarda en `.uploads/` local pero no se publica en ninguna plataforma | `youtube.adapter.ts` ya tiene el esqueleto (`uploadToYouTube()`) |
| **Sin persistencia de sesión de plataforma** | Al refrescar, las conexiones se re-hidratan desde `/api/social/status` (también in-memory) | Persistir en DB |
| **Sin cola asíncrona** | Subidas largas bloquean el request | BullMQ + Redis (arquitectura `05-social-video-hub`) |

---

## Lo que SÍ está terminado (demostrable)

- Login/logout Google OAuth funcional
- Sincronización global → plataformas con override por red
- Validación Zod en frontend y backend (mismo schema)
- Progreso de subida por plataforma en tiempo real (simulado)
- Verificación de handle de plataforma (llama oEmbed real de YouTube/TikTok)
- Adapter YouTube con validación de payload y builder de insert body
- GitHub Actions CI (lint + typecheck)

---

## Cómo explicarlo en entrevista (30 s)

> "Es un dashboard Next.js 14 con App Router donde sincronizo metadatos globales con override por plataforma usando React Context y React Hook Form. El backend son API Routes con validación Zod; el upload es un mock que ya tiene el adapter de YouTube con la estructura de la YouTube Data API v3. También tengo CI con GitHub Actions."

---

## Próximos pasos para convertirlo en producción

1. **Deploy Vercel** — ver `docs/VERCEL-DEPLOY.md`
2. **YouTube real** — implementar `uploadToYouTube()` en `youtube.adapter.ts` con OAuth real
3. **DB** — sustituir `usersStore` por Prisma + PostgreSQL
4. **Cola** — BullMQ para subidas largas (ver arquitectura `05-social-video-hub/README.md`)
