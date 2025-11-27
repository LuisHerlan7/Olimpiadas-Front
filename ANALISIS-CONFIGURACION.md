# 📋 Análisis Completo de Configuración Frontend-Backend

## ✅ Estado Actual de la Configuración

### 1. **Frontend Local → Backend Local (http://127.0.0.1:8000)**

**✅ FUNCIONA CORRECTAMENTE**

- **Configuración:** `vite.config.ts` tiene un proxy que redirige `/api` y `/sanctum` a `http://127.0.0.1:8000`
- **Cómo funciona:**
  - Cuando el frontend hace una petición a `/api/auth/login`
  - Vite intercepta y la redirige a `http://127.0.0.1:8000/api/auth/login`
  - No necesitas configurar `VITE_API_URL` en este caso

**Archivos relevantes:**
- `vite.config.ts` líneas 36-47: Proxy configurado
- `src/api.ts` línea 13: `baseURL = import.meta.env.VITE_API_URL || "/api"`

---

### 2. **Frontend Local → Backend Deployado (Railway)**

**⚠️ REQUIERE CONFIGURACIÓN**

**Para que funcione, necesitas:**

1. **Crear archivo `.env.local` en `Olimpiadas-Front/`** con:
   ```
   VITE_API_URL=https://olimpiadas-back-production-6956.up.railway.app/api
   ```

2. **Reiniciar el servidor de desarrollo:**
   ```bash
   # Detén el servidor (Ctrl+C)
   # Luego reinicia
   npm run dev
   ```

**¿Por qué funciona?**
- Cuando `VITE_API_URL` está definido, `api.ts` usa esa URL directamente
- El proxy de Vite se ignora cuando hay una URL absoluta
- Las peticiones van directamente a Railway

**Verificación de CORS:**
- ✅ El backend ya tiene configurado CORS para `http://localhost:5173` y `http://127.0.0.1:5173`
- ✅ También acepta cualquier dominio `*.vercel.app`
- Archivo: `Olimpiadas-Back/config/cors.php` líneas 22-32

---

### 3. **Frontend Deployado (Vercel) → Backend Deployado (Railway)**

**✅ CONFIGURADO (según CONFIGURACION.md)**

- Debes configurar `VITE_API_URL` en las variables de entorno de Vercel
- Valor: `https://olimpiadas-back-production-6956.up.railway.app/api`

---

## 🔍 Análisis Detallado de Archivos

### `src/api.ts`
```typescript
export const baseURL = import.meta.env.VITE_API_URL || "/api";
```
- Si `VITE_API_URL` existe → usa esa URL (absoluta)
- Si no existe → usa `/api` (relativa, manejada por proxy en dev)

### `vite.config.ts` (líneas 36-47)
```typescript
proxy: {
  "/api": {
    target: "http://127.0.0.1:8000",
    changeOrigin: true,
    secure: false,
  },
}
```
- Solo funciona en modo desarrollo (`npm run dev`)
- En producción (build), el proxy NO funciona
- Por eso necesitas `VITE_API_URL` en producción

### `Olimpiadas-Back/config/cors.php`
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://ohsansi.vercel.app',
],
'allowed_origins_patterns' => [
    '#^https://.*\.vercel\.app$#',
],
```
- ✅ Ya configurado para desarrollo local
- ✅ Ya configurado para Vercel

---

## 🧪 Cómo Probar

### Prueba 1: Frontend Local → Backend Local
1. Asegúrate de que NO existe `.env.local` o que `VITE_API_URL` esté comentado
2. Inicia el backend: `php artisan serve` (puerto 8000)
3. Inicia el frontend: `npm run dev` (puerto 5173)
4. Abre `http://localhost:5173`
5. Intenta hacer login
6. **Resultado esperado:** ✅ Debe funcionar

### Prueba 2: Frontend Local → Backend Deployado
1. Crea archivo `.env.local` en `Olimpiadas-Front/`:
   ```
   VITE_API_URL=https://olimpiadas-back-production-6956.up.railway.app/api
   ```
2. Reinicia el servidor de desarrollo (`npm run dev`)
3. Abre `http://localhost:5173`
4. Intenta hacer login
5. **Resultado esperado:** ✅ Debe funcionar (si el backend está activo)

**Verificación rápida:**
- Abre la consola del navegador (F12)
- Ve a la pestaña "Network"
- Intenta hacer login
- Verifica que las peticiones vayan a `https://olimpiadas-back-production-6956.up.railway.app/api/...`
- Si ves `http://localhost:5173/api/...`, entonces `VITE_API_URL` no está configurado

---

## ⚠️ Posibles Problemas

### Problema 1: CORS Error
**Síntoma:** Error en consola: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solución:**
- Verifica que el backend deployado tenga la misma configuración de CORS
- Asegúrate de que `http://localhost:5173` esté en `allowed_origins` del backend deployado

### Problema 2: 405 Method Not Allowed
**Síntoma:** Error 405 al hacer peticiones

**Solución:**
- Verifica que `VITE_API_URL` esté configurado correctamente
- La URL debe terminar en `/api` (no `/api/`)
- Debe ser `https://` (no `http://`)

### Problema 3: Network Error
**Síntoma:** Error de red, no se puede conectar

**Solución:**
- Verifica que el backend esté desplegado y activo
- Prueba acceder a: `https://olimpiadas-back-production-6956.up.railway.app/api/ping`
- Debe devolver: `{"status":"ok",...}`

---

## 📝 Resumen

| Escenario | Configuración | Estado |
|-----------|--------------|--------|
| Frontend Local → Backend Local | Sin `VITE_API_URL` (usa proxy) | ✅ Funciona |
| Frontend Local → Backend Deployado | `.env.local` con `VITE_API_URL` | ⚠️ Requiere config |
| Frontend Deployado → Backend Deployado | `VITE_API_URL` en Vercel | ✅ Configurado |

---

## 🚀 Pasos para Probar con Backend Deployado

1. **Crea `.env.local` en `Olimpiadas-Front/`:**
   ```bash
   # En PowerShell o CMD
   cd Olimpiadas-Front
   echo VITE_API_URL=https://olimpiadas-back-production-6956.up.railway.app/api > .env.local
   ```

2. **Reinicia el servidor:**
   ```bash
   # Detén con Ctrl+C y reinicia
   npm run dev
   ```

3. **Verifica en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a Network
   - Intenta hacer login
   - Las peticiones deben ir a Railway, no a localhost

4. **Si funciona:** ✅ Tu configuración está correcta
5. **Si no funciona:** Revisa los problemas comunes arriba

---

## ✅ Conclusión

**¿Funcionará al cambiar al backend deployado?**

**SÍ, PERO necesitas:**
1. Crear `.env.local` con `VITE_API_URL=https://olimpiadas-back-production-6956.up.railway.app/api`
2. Reiniciar el servidor de desarrollo
3. Verificar que el backend deployado esté activo y responda

**El código está bien configurado, solo falta la variable de entorno.**

