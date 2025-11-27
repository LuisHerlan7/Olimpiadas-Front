# 🔍 Guía para Verificar Configuración en Vercel

## ⚠️ Error: `ERR_NAME_NOT_RESOLVED`

Este error significa que la URL del backend está incompleta o mal configurada en Vercel.

## ✅ Pasos para Verificar y Corregir

### 1. **Verificar Variable de Entorno en Vercel**

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto `ohsansi`
3. Ve a **Settings** → **Environment Variables**
4. Busca la variable `VITE_API_URL`

### 2. **Verificar el Valor Correcto**

La variable `VITE_API_URL` debe tener **EXACTAMENTE** este valor:

```
https://olimpiadas-back-production-6956.up.railway.app/api
```

**⚠️ IMPORTANTE:**
- ✅ Debe empezar con `https://`
- ✅ Debe terminar con `/api` (sin barra final `/`)
- ✅ NO debe tener espacios al inicio o final
- ✅ NO debe tener comillas `"` o `'`

### 3. **Si la Variable NO Existe o Está Mal**

1. Si **NO existe**, haz clic en **Add New** y agrega:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://olimpiadas-back-production-6956.up.railway.app/api`
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**

2. Si **existe pero está mal**, haz clic en ella y corrige el valor.

3. **Guarda** los cambios.

### 4. **REDESPLIEGAR (MUY IMPORTANTE)**

Después de agregar o modificar la variable, **DEBES redesplegar**:

1. Ve a **Deployments**
2. Encuentra el último deployment
3. Haz clic en los **3 puntos** (⋯) → **Redeploy**
4. O simplemente haz un nuevo push a tu repositorio

**⚠️ CRÍTICO:** Las variables de entorno solo se aplican en nuevos deployments. Si no redesplegas, los cambios NO tendrán efecto.

### 5. **Verificar que Funcionó**

Después del redeploy:

1. Abre tu app en Vercel: `https://ohsansi.vercel.app`
2. Abre la consola del navegador (F12)
3. En la consola, ejecuta:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
4. Debería mostrar: `https://olimpiadas-back-production-6956.up.railway.app/api`

**Si muestra `undefined`**, entonces:
- La variable no está configurada
- O no se redesplegó después de agregarla

### 6. **Verificar en Network Tab**

1. Abre **DevTools** (F12) → **Network**
2. Intenta hacer login
3. Busca la petición a `/api/auth/login`
4. Verifica que la URL completa sea:
   ```
   https://olimpiadas-back-production-6956.up.railway.app/api/auth/login
   ```

**Si ves una URL truncada o relativa** (como `/api/auth/login`), entonces `VITE_API_URL` no está configurada.

## 🔧 Solución Rápida

### Opción 1: Configurar en Vercel Dashboard (Recomendado)

1. Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agrega: `VITE_API_URL` = `https://olimpiadas-back-production-6956.up.railway.app/api`
3. Selecciona todos los ambientes (Production, Preview, Development)
4. Guarda
5. **REDESPLIEGA** (Deployments → Redeploy)

### Opción 2: Usar Vercel CLI

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Agregar variable de entorno
vercel env add VITE_API_URL production
# Cuando pregunte el valor, ingresa:
# https://olimpiadas-back-production-6956.up.railway.app/api

# Repetir para preview y development
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development

# Redesplegar
vercel --prod
```

## 🧪 Test Rápido del Backend

Antes de verificar el frontend, asegúrate de que el backend funcione:

```bash
# En tu navegador o con curl
https://olimpiadas-back-production-6956.up.railway.app/api/ping
```

Debería devolver:
```json
{
  "status": "ok",
  "message": "Backend OH SanSi activo ✅",
  "time": "..."
}
```

Si este test falla, el problema está en Railway, no en Vercel.

## 📝 Checklist Final

- [ ] Variable `VITE_API_URL` existe en Vercel
- [ ] Valor es exactamente: `https://olimpiadas-back-production-6956.up.railway.app/api`
- [ ] Variable está configurada para Production, Preview y Development
- [ ] Se hizo REDEPLOY después de agregar/modificar la variable
- [ ] `console.log(import.meta.env.VITE_API_URL)` muestra la URL correcta
- [ ] En Network tab, las peticiones van a Railway (no a localhost)
- [ ] El backend responde en `/api/ping`

## ❓ Si Sigue Sin Funcionar

1. **Verifica los logs de Vercel:**
   - Vercel Dashboard → Tu Proyecto → Deployments
   - Haz clic en el último deployment
   - Revisa los "Build Logs" y "Runtime Logs"

2. **Verifica que el build capture la variable:**
   - En los Build Logs, busca `VITE_API_URL`
   - Debería aparecer en la lista de variables de entorno

3. **Prueba con una variable temporal:**
   - Agrega `VITE_TEST=hola` en Vercel
   - Redesplega
   - En la consola del navegador: `console.log(import.meta.env.VITE_TEST)`
   - Si muestra `undefined`, hay un problema con cómo Vercel está inyectando las variables

