# Deploy en Vercel — multistream-upload

## Pasos (20 min primera vez)

### 1. Preparar Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials** → **Create credentials** → OAuth 2.0 Client ID
2. Application type: **Web application**
3. Añadir Authorized redirect URIs:
   - `https://YOUR_APP.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
4. Copiar **Client ID** y **Client Secret**

### 2. Desplegar en Vercel

```bash
# Opción A: Vercel CLI
npm i -g vercel
cd multistream-upload
vercel
# Sigue el wizard: scope → proyecto → no override settings

# Opción B: GitHub
# Ir a vercel.com/new → Import Git Repository → mcherif004/multistream-upload
```

### 3. Variables de entorno en Vercel Dashboard

**Settings → Environment Variables** (añadir para Production + Preview):

| Variable | Valor |
|----------|-------|
| `AUTH_SECRET` | Ejecuta: `openssl rand -base64 32` (o genera en https://generate-secret.vercel.app/32) |
| `GOOGLE_CLIENT_ID` | Del paso 1 |
| `GOOGLE_CLIENT_SECRET` | Del paso 1 |
| `NEXTAUTH_URL` | `https://TU_APP.vercel.app` |

> **NUNCA** pongas estos valores en `.env.local` del repo ni en `vercel.json`.

### 4. Actualizar `next.config.js`

```js
// next.config.js — añade si no está
/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXTAUTH_URL se inyecta por Vercel automáticamente en producción
};
module.exports = nextConfig;
```

### 5. Redeploy y verificar

```bash
vercel --prod
```

Comprueba:
- `https://TU_APP.vercel.app/login` → Google OAuth funciona
- `https://TU_APP.vercel.app/upload` → redirige si no hay sesión

### 6. Actualizar README y CV

En `README.md` descomenta y edita:

```markdown
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://TU_APP.vercel.app)
```

En `CV_MOSTAFA_CHERIF_ES.md` y `CV_MOSTAFA_CHERIF_EN.md` añade:

```
Demo: https://TU_APP.vercel.app
```

Luego: `python build_cv_pdf.py`

## Solución de problemas

| Error | Causa | Fix |
|-------|-------|-----|
| `NEXTAUTH_URL` mismatch | URL sin actualizar | Actualiza variable en Vercel dashboard |
| OAuth redirect_uri_mismatch | Google Console | Añade la URL de Vercel a Authorized URIs |
| Build fail `next export` | No compatible con API routes | Elimina `output: 'export'` de `next.config.js` |
