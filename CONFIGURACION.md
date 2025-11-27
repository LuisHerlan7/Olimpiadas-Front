# Configuración de Conexión Frontend-Backend

## ⚠️ IMPORTANTE: Configuración Requerida

**El error 405 (Method Not Allowed) generalmente ocurre porque falta configurar la variable de entorno `VITE_API_URL` en Vercel.**

## Variables de Entorno

### Frontend (Vercel) - OBLIGATORIO

Para conectar el frontend con el backend, **DEBES** configurar la variable de entorno `VITE_API_URL` en Vercel:

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto `ohsansi`
3. Ve a **Settings** → **Environment Variables**
4. Haz clic en **Add New**
5. Agrega:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://tu-backend.railway.app/api` (reemplaza `tu-backend.railway.app` con tu URL real de Railway)
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
6. Haz clic en **Save**
7. **REDESPLIEGA** tu aplicación en Vercel (Settings → Deployments → Redeploy)

**Ejemplo de valor correcto:**
```
https://olimpiadas-back-production-6956.up.railway.app/api
```

**⚠️ IMPORTANTE**: 
- La URL debe incluir el prefijo `/api` al final
- No debe terminar con una barra `/`
- Debe ser `https://` (no `http://`)

### Desarrollo Local

En desarrollo local, el archivo `vite.config.ts` ya tiene configurado un proxy que redirige `/api` a `http://127.0.0.1:8000`. No necesitas configurar `VITE_API_URL` en desarrollo.

## Backend (Railway)

### Configuración de CORS

El backend ya está configurado para aceptar requests desde:
- `https://ohsansi.vercel.app`
- Cualquier dominio de Vercel (patrón: `https://*.vercel.app`)
- Localhost para desarrollo

La configuración está en `Olimpiadas-Back/config/cors.php`.

### Verificar que el Backend Funcione

1. Asegúrate de que tu backend esté desplegado en Railway
2. Prueba el endpoint de ping: `https://tu-backend.railway.app/api/ping`
3. Deberías recibir una respuesta JSON con `{"status":"ok",...}`

## Solución de Problemas

### Error 405: "Method Not Allowed" ⚠️

**Este es el error más común y generalmente se debe a:**

1. **`VITE_API_URL` no está configurado en Vercel**
   - Ve a Vercel → Settings → Environment Variables
   - Verifica que `VITE_API_URL` exista y tenga el valor correcto
   - **REDESPLIEGA** después de agregar/modificar la variable

2. **La URL del backend es incorrecta**
   - Abre la consola del navegador (F12)
   - Ve a la pestaña "Network"
   - Intenta hacer login
   - Verifica qué URL se está usando en la solicitud fallida
   - Debe ser algo como: `https://tu-backend.railway.app/api/auth/login`
   - Si ves `https://ohsansi.vercel.app/api/auth/login`, entonces `VITE_API_URL` no está configurado

3. **El backend no está respondiendo a OPTIONS (preflight)**
   - El backend ya tiene configuración para manejar OPTIONS
   - Verifica que el backend esté desplegado correctamente en Railway
   - Prueba hacer un request OPTIONS manualmente con Postman o curl

### Error: "Network Error" o CORS

1. Verifica que `VITE_API_URL` esté configurado correctamente en Vercel
2. Verifica que el backend esté accesible desde internet (prueba el ping)
3. Revisa los logs del backend en Railway para ver si hay errores
4. Verifica que la URL del backend no tenga una barra final (`/`) al final
5. Verifica que el backend acepte requests desde `https://ohsansi.vercel.app` (ya configurado)

### Error: 404 Not Found

1. Verifica que la ruta del backend sea correcta
2. Asegúrate de que las rutas en `routes/api.php` estén correctas
3. Verifica que el prefijo `/api` esté incluido en la URL si es necesario
4. Prueba el endpoint de ping: `https://tu-backend.railway.app/api/ping`

### Error: 401 Unauthorized

1. Verifica que las credenciales sean correctas
2. Revisa que el endpoint `/auth/login` esté funcionando correctamente
3. Verifica los logs del backend para ver el error específico

## Verificación Rápida

### 1. Verificar que VITE_API_URL esté configurado

En la consola del navegador (F12), ejecuta:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Si muestra `undefined`, entonces la variable no está configurada en Vercel.

### 2. Verificar que el backend responda

Abre en tu navegador:
```
https://tu-backend.railway.app/api/ping
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Backend OH SanSi activo ✅",
  "time": "..."
}
```

### 3. Verificar CORS

Abre la consola del navegador (F12) → Network → Intenta hacer login → Revisa los headers de la solicitud OPTIONS (preflight). Deberías ver headers `Access-Control-Allow-*` en la respuesta.

