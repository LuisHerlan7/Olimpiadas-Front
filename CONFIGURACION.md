# Configuración de Conexión Frontend-Backend

## Variables de Entorno

### Frontend (Vercel)

Para conectar el frontend con el backend, necesitas configurar la variable de entorno `VITE_API_URL` en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Nombre**: `VITE_API_URL`
   - **Valor**: `https://tu-backend.railway.app/api` (reemplaza con tu URL real de Railway)
   - **Environment**: Production, Preview, Development (según necesites)

**Importante**: 
- Si tu backend en Railway ya expone las rutas con el prefijo `/api`, usa: `https://tu-backend.railway.app/api`
- Si tu backend expone las rutas directamente (sin prefijo), usa: `https://tu-backend.railway.app`

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

### Error: "Network Error" o CORS

1. Verifica que `VITE_API_URL` esté configurado correctamente en Vercel
2. Verifica que el backend esté accesible desde internet
3. Revisa los logs del backend en Railway para ver si hay errores
4. Verifica que la URL del backend no tenga una barra final (`/`) al final

### Error: 404 Not Found

1. Verifica que la ruta del backend sea correcta
2. Asegúrate de que las rutas en `routes/api.php` estén correctas
3. Verifica que el prefijo `/api` esté incluido en la URL si es necesario

### Error: 401 Unauthorized

1. Verifica que las credenciales sean correctas
2. Revisa que el endpoint `/auth/login` esté funcionando correctamente
3. Verifica los logs del backend para ver el error específico

