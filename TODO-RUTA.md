# MultiStream Upload - TODO / Ruta de Trabajo

Documento unico para ejecutar, registrar errores, mejoras y decisiones.

---

## Reglas de seguimiento

- Actualizar este archivo en cada iteracion.
- Orden cronologico descendente en tablas (lo mas nuevo arriba).
- Estados permitidos: `pendiente`, `en_progreso`, `bloqueado`, `resuelto`.
- Prioridad: `alta`, `media`, `baja`.

---

## Plan operativo (1 hora al dia)

### Estructura fija por sesion (60 min)

- `00:00-00:10` - Arranque rapido
  - Levantar app
  - Revisar ultimo estado en este archivo
  - Elegir 1 objetivo del dia
- `00:10-00:40` - Ejecucion tecnica
  - Implementar solo una pieza concreta
  - No abrir frentes paralelos
- `00:40-00:50` - Verificacion
  - Probar flujo afectado
  - Ejecutar `typecheck` y `lint`
- `00:50-01:00` - Cierre
  - Actualizar este `TODO-RUTA.md`
  - Registrar error/mejora del dia
  - Definir siguiente paso exacto

### Regla anti-caos

- Maximo 1 tarea principal por dia.
- Si algo se bloquea >15 minutos:
  - marcar `bloqueado`,
  - registrar causa,
  - pasar a tarea de menor riesgo.

### Ruta separada de aprendizaje (React + TypeScript + Proyecto)

#### Track A - Aprender React (practico)
- [ ] A1. Componentes y props (en este proyecto: cards/tabs/buttons).
- [ ] A2. Estado con `useState` (formularios y toggles).
- [ ] A3. Efectos con `useEffect` (hidratacion de estado social).
- [ ] A4. Context API (SocialAuthProvider).
- [ ] A5. Patrones de formularios complejos (RHF + validaciones).

#### Track B - Aprender TypeScript (aplicado)
- [ ] B1. Tipos base e interfaces (`PlatformConfig`, `OAuthConnection`).
- [ ] B2. Uniones y literales (`PlatformKey`, estados `idle/connected/error`).
- [ ] B3. Tipado de funciones async y payloads API.
- [ ] B4. Narrowing y control de errores en frontend/backend.
- [ ] B5. Tipado de estado global y hooks custom.

#### Track C - Proyecto real (features)
- [ ] C1. Auth Google estable.
- [ ] C2. Conexion/verificacion de plataformas.
- [ ] C3. Metadata por plataforma + gate de conexion.
- [ ] C4. Batch upload y progreso.
- [ ] C5. Scheduling/calendario.
- [ ] C6. Hardening (seguridad + QA + despliegue).

### Plan diario (una parte importante por dia)

> Regla: cada dia completas **una sola parte importante**. No pasas al siguiente dia sin cerrar el actual.

#### Semana 1 - Upload funcional (objetivo obligatorio)
- [ ] **Dia 1 - Base estable**
  - Auth Google funcionando
  - Rutas privadas protegidas (`/upload`, `/accounts`)
  - Login/logout sin regresiones
- [ ] **Dia 2 - Conexion real verificable**
  - Conexion por plataforma con verificacion real de cuenta
  - Errores claros cuando la cuenta no existe
- [ ] **Dia 3 - Gate por plataforma**
  - Si no hay conexion: campos bloqueados
  - Si hay conexion: campos habilitados
- [ ] **Dia 4 - Metadata robusta**
  - Global Sync + Override por plataforma
  - Sin pisar datos entre tabs
- [ ] **Dia 5 - Batch upload utilizable**
  - Upload solo en `enabled && linked`
  - Progress por plataforma correcto
- [ ] **Dia 6 - Prueba E2E completa**
  - `/login -> /accounts -> /upload -> batch`
  - Manejo correcto de fallos esperados
- [ ] **Dia 7 - Correcciones y congelado de core**
  - Arreglo de bugs criticos
  - Typecheck/lint/build en verde

#### Semana 2 - Cierre del proyecto (hasta dia 15)
- [ ] **Dia 8 - Scheduling modelo**
  - Definir `publishAt`, timezone, estructura por plataforma
- [ ] **Dia 9 - UI calendario**
  - Selector fecha/hora integrado en flujo
- [ ] **Dia 10 - Validaciones scheduling**
  - Fecha futura obligatoria + payload coherente
- [ ] **Dia 11 - Seguridad minima**
  - Rate limiting basico + mensajes de error seguros
- [ ] **Dia 12 - Tokens y reconexion**
  - Manejo de expiracion/reconexion (base)
- [ ] **Dia 13 - QA tecnica**
  - Casos limite + regresiones + smoke tests
- [ ] **Dia 14 - Correcciones finales**
  - Resolver bloqueantes pendientes
- [ ] **Dia 15 - Cierre**
  - Build final + checklist completo + documentacion operativa

### Estimacion objetivo

- **Upload funcional:** `7 dias` (Semana 1)
- **Proyecto completo v1:** `15 dias` maximo

---

## Estado global por procesos

- [ ] Proceso 0: Preparacion y entorno
- [ ] Proceso 1: Autenticacion base (Google)
- [ ] Proceso 2: Conexion y verificacion de plataformas
- [ ] Proceso 3: Metadata y puertas de conexion
- [ ] Proceso 4: Upload batch y progreso
- [ ] Proceso 5: Programacion (calendario)
- [ ] Proceso 6: Seguridad y robustez
- [ ] Proceso 7: QA final y salida a pruebas

---

## Proceso 0 - Preparacion y entorno

### Objetivo
Dejar entorno reproducible para pruebas.

### Tareas
- [ ] Verificar `.env.local`:
  - [ ] `AUTH_SECRET`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
- [ ] Confirmar redirect URI:
  - [ ] `http://localhost:3001/api/auth/callback/google`
- [ ] Levantar local:
  - [ ] `npm run dev`

### Verificaciones
- [ ] `GET /login` -> 200
- [ ] Boton Google visible
- [ ] Sin errores criticos de consola al cargar login

---

## Proceso 1 - Autenticacion base (Google)

### Objetivo
Sesion estable y rutas privadas protegidas.

### Tareas
- [ ] Login con Google
- [ ] Verificar redireccion a `/accounts` o `/upload`
- [ ] Probar logout

### Verificaciones
- [ ] Sin sesion, `/upload` redirige a `/login`
- [ ] Con sesion, `/login` redirige a `/upload`
- [ ] Logout invalida sesion

---

## Proceso 2 - Conexion y verificacion de plataformas

### Objetivo
Conectar solo si la cuenta existe realmente en plataforma.

### Tareas
- [ ] Probar conexion en `/accounts`:
  - [ ] YouTube
  - [ ] TikTok
  - [ ] Instagram
  - [ ] Facebook
- [ ] Probar cuenta valida
- [ ] Probar cuenta invalida
- [ ] Probar desconexion

### Verificaciones
- [ ] Cuenta valida -> `connected`
- [ ] Cuenta invalida -> error especifico
- [ ] Persistencia tras refresh
- [ ] Desconexion limpia estado

---

## Proceso 3 - Metadata y puertas de conexion

### Objetivo
No permitir metadata de plataformas no conectadas.

### Tareas
- [ ] Ir a `/upload`
- [ ] Revisar tabs por plataforma
- [ ] Validar gate de conexion cuando `linked=false`
- [ ] Conectar y verificar desbloqueo de campos

### Verificaciones
- [ ] `linked=false` -> campos bloqueados + boton conectar
- [ ] `linked=true` -> campos habilitados
- [ ] Sync global funciona con `overridden=false`
- [ ] Override manual aislado por plataforma

---

## Proceso 4 - Upload batch y progreso

### Objetivo
Subir solo a plataformas `enabled && linked`.

### Tareas
- [ ] Cargar video
- [ ] Habilitar/deshabilitar plataformas
- [ ] Conectar subset de plataformas
- [ ] Ejecutar batch

### Verificaciones
- [ ] Boton Upload bloqueado sin video
- [ ] Boton Upload bloqueado sin plataformas activas
- [ ] `BatchProgress` solo muestra `enabled && linked`
- [ ] Estados por plataforma: `uploading -> success/error`

---

## Proceso 5 - Programacion (calendario)

### Objetivo
Scheduling real por plataforma.

### Tareas
- [ ] Modelo:
  - [ ] `publishAt`
  - [ ] timezone
  - [ ] repeat opcional
- [ ] UI calendario interactivo
- [ ] Asociar schedule por plataforma

### Verificaciones
- [ ] Seleccion fecha/hora por plataforma
- [ ] Fecha futura obligatoria
- [ ] Payload incluye schedule por plataforma

---

## Proceso 6 - Seguridad y robustez

### Objetivo
Reducir riesgos y errores de produccion.

### Tareas
- [ ] Rate limiting en endpoints de conexion/subida
- [ ] Sanitizar logs y errores
- [ ] Manejo de expiracion/refresh de tokens
- [ ] Reconexion automatica cuando token expira

### Verificaciones
- [ ] No exponer tokens en cliente/logs
- [ ] Errores accionables sin filtrar secretos
- [ ] Reconexion funcional

---

## Proceso 7 - QA final y salida a pruebas

### Objetivo
Validar E2E completo sin regresiones.

### Checklist E2E
- [ ] Login Google
- [ ] Conectar al menos 1 plataforma valida
- [ ] Ir a `/upload`
- [ ] Cargar video
- [ ] Completar metadata
- [ ] Ejecutar batch
- [ ] Validar progreso y resultado
- [ ] Logout y bloqueo de rutas privadas

### Criterio de listo
- [ ] Typecheck OK
- [ ] Lint OK
- [ ] Build OK
- [ ] E2E completo 2 veces seguidas

---

## Registro de errores e incidencias

| Fecha | ID | Tipo | Prioridad | Estado | Modulo | Descripcion | Accion siguiente |
|---|---|---|---|---|---|---|---|
| 2026-05-05 | ERR-001 | bug | alta | resuelto | Social Connect | Marcaba `connected` sin verificar existencia real. | Mantener verificacion server-side por plataforma. |
| 2026-05-05 | ERR-002 | bug | media | resuelto | Accounts Form | Mensajes de error genericos. | Mostrar mensaje detallado de API. |
| 2026-05-05 | ERR-003 | bug | media | resuelto | OAuth Context | Estado no persistia tras recarga. | Hidratar desde `/api/social/status`. |

---

## Mejoras implementadas

| Fecha | ID | Prioridad | Estado | Area | Mejora | Resultado |
|---|---|---|---|---|---|---|
| 2026-05-05 | IMP-001 | alta | resuelto | Auth | Google OAuth (NextAuth). | Login real y sesion persistente. |
| 2026-05-05 | IMP-002 | alta | resuelto | Social Connect | Verificacion server-side de cuentas. | Conexion valida solo si cuenta existe. |
| 2026-05-05 | IMP-003 | media | resuelto | UI | Connection Gate por plataforma. | Campos bloqueados hasta conectar. |
| 2026-05-05 | IMP-004 | media | resuelto | Batch | Filtro por `enabled && linked`. | Progreso coherente por plataforma. |

---

## Backlog proximo

| ID | Prioridad | Estado | Area | Tarea | Dependencias |
|---|---|---|---|---|---|
| TODO-001 | alta | pendiente | Integraciones | OAuth real por plataforma (code -> token). | Credenciales y apps oficiales. |
| TODO-002 | alta | pendiente | Persistencia | Migrar estado usuario/conexiones a DB (Prisma + Postgres). | Esquema de datos. |
| TODO-003 | alta | pendiente | Publicacion | Implementar upload real YouTube/TikTok/Meta. | OAuth real + refresh token. |
| TODO-004 | media | pendiente | Scheduling | Calendario interactivo por plataforma. | Modelo de scheduling. |
| TODO-005 | media | pendiente | Seguridad | Rate limiting y hardening endpoints. | Middleware/Redis. |
| TODO-006 | media | pendiente | QA | Suite E2E automatizada. | Flujo estable. |

---

## Decisiones tecnicas

| Fecha | Decision | Motivo | Impacto |
|---|---|---|---|
| 2026-05-05 | Estado social centralizado con provider | Reducir logica dispersa | Menor complejidad y mantenimiento |
| 2026-05-05 | Validacion server-side para conectar | Evitar falsos positivos | Mayor confianza funcional |
| 2026-05-05 | Upload solo en `enabled && linked` | Coherencia del batch | Menos errores operativos |

