# ✅ CHECKLIST - Configuración La Pampa App

## 🎯 Objetivo

Tener la app funcionando con Firebase configurado y listo para probar.

---

## 📋 Fase 1: Preparación (Ya Hecho ✅)

- [x] Estructura del proyecto creada
- [x] Autenticación con Firebase integrada
- [x] 3 Dashboards implementados
- [x] Navegación configurada
- [x] Documentación lista

---

## 🔧 Fase 2: Configuración Firebase (AHORA MISMO)

### ⏱️ Tiempo estimado: 10-15 minutos

### Paso 1: Crear Proyecto en Firebase

```
[ ] Abre https://console.firebase.google.com
[ ] Presiona "Crear proyecto"
[ ] Nombre: "la-pampa-app"
[ ] País: "Colombia"
[ ] Acepta términos
[ ] Presiona "Crear proyecto"
[ ] ⏳ Espera 2-3 minutos
```

✅ **Resultado esperado**: Ves el dashboard de Firebase con tu proyecto

---

### Paso 2: Obtener Credenciales

```
[ ] En Firebase Console, presiona ⚙️ (engranaje)
[ ] Presiona "Configuración del Proyecto"
[ ] Ve a pestaña "Mis apps"
[ ] Busca tu app Web (o crea una)
[ ] Copia el objeto firebaseConfig (verás los 6 valores)
```

**Lo que necesitas copiar:**

```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

✅ **Resultado esperado**: Tienes 6 valores listos para copiar

---

### Paso 3: Crear .env.local

```
[ ] Abre tu editor VS Code
[ ] Ve a la carpeta raíz del proyecto
[ ] Crea un nuevo archivo: .env.local
[ ] Copia el contenido de .env.local.example
[ ] Reemplaza CADA valor:

EXPO_PUBLIC_FIREBASE_API_KEY=PEGAELVALORDE_apiKey_AQUI
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=PEGAELVALORDE_authDomain_AQUI
EXPO_PUBLIC_FIREBASE_PROJECT_ID=PEGAELVALORDE_projectId_AQUI
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=PEGAELVALORDE_storageBucket_AQUI
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PEGAELVALORDE_messagingSenderId_AQUI
EXPO_PUBLIC_FIREBASE_APP_ID=PEGAELVALORDE_appId_AQUI

[ ] Guarda el archivo (Ctrl+S)
```

⚠️ **IMPORTANTE**:

- NO guarda este archivo en Git
- Ya está protegido por .gitignore
- Las comillas ya están, solo pega el valor

✅ **Resultado esperado**: Archivo `.env.local` creado con valores reales

---

### Paso 4: Habilitar Autenticación

```
[ ] En Firebase Console, ve a Build → Authentication
[ ] Presiona "Comenzar"
[ ] Presiona "Email/Contraseña"
[ ] En el popup, presiona el toggle AZUL para activar
[ ] Presiona "Guardar"
```

✅ **Resultado esperado**: Ves "Email/Contraseña" como HABILITADO (azul)

---

### Paso 5: Habilitar Firestore Database

```
[ ] En Firebase Console, ve a Build → Firestore Database
[ ] Presiona "Crear base de datos"
[ ] En modo de seguridad, selecciona "Iniciar en modo de prueba"
[ ] Región: "us-central1" (u otra cercana a Colombia)
[ ] Presiona "Crear"
[ ] ⏳ Espera a que se cree (30 segundos)
```

✅ **Resultado esperado**: Ves la base de datos vacía y lista

---

### Paso 6: Verificar Configuración

```
[ ] Abre Terminal en VS Code
[ ] Navega a la carpeta del proyecto: cd la-pampa-app
[ ] Ejecuta: bash verify-firebase.sh
[ ] Verifica que todas las variables digan ✅
```

**Deberías ver algo como:**

```
✅ EXPO_PUBLIC_FIREBASE_API_KEY
✅ EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ EXPO_PUBLIC_FIREBASE_PROJECT_ID
✅ EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ EXPO_PUBLIC_FIREBASE_APP_ID

🎉 ¡Todas las variables están configuradas!
```

✅ **Resultado esperado**: Todas las variables verificadas correctamente

---

## 🚀 Fase 3: Ejecutar la App

### Paso 1: Instalar dependencias

```bash
[ ] npm install
```

⏳ Espera a que termine (1-2 minutos)

✅ **Resultado esperado**: Sin errores, carpeta `node_modules` creada

---

### Paso 2: Iniciar servidor Expo

```bash
[ ] npm start
```

Verás algo como:

```
✔ Metro Bundler ready
  ▸ Press 'w' to open web
  ▸ Press 'a' to open Android
  ▸ Press 'i' to open iOS
```

✅ **Resultado esperado**: Servidor iniciado sin errores

---

### Paso 3: Abrir la App

Elige una opción:

**Opción A: En Navegador (Recomendado para empezar)**

```
[ ] Presiona 'w' en la terminal
[ ] Se abre http://localhost:19006
```

**Opción B: En Emulador Android**

```
[ ] Asegúrate de tener Android Studio/Emulator abierto
[ ] Presiona 'a' en la terminal
```

**Opción C: En Emulador iOS (Solo Mac)**

```
[ ] Presiona 'i' en la terminal
```

✅ **Resultado esperado**: App cargada, ves pantalla de LOGIN

---

## ✔️ Fase 4: Pruebas

### Test 1: Registro de Cliente

```
[ ] En la pantalla de Login, selecciona "Cliente"
[ ] Presiona "¿No tienes cuenta? Regístrate aquí"
[ ] Completa el formulario:
    - Nombre: "Juan Pérez"
    - Correo: "juan@test.com"
    - Teléfono: "3001234567"
    - Contraseña: "123456"
    - Confirmar: "123456"
[ ] Presiona "CREAR CUENTA"
[ ] Verifica el alerta de éxito
[ ] Presiona "Ir al login"
```

✅ **Resultado esperado**: Registro exitoso, vuelta al login

---

### Test 2: Login con Cliente

```
[ ] Estás en Login → Cliente (debe estar seleccionado)
[ ] Correo: "juan@test.com"
[ ] Contraseña: "123456"
[ ] Presiona "INICIAR SESIÓN"
```

✅ **Resultado esperado**: Accedes al ClienteModule (verás el menú)

---

### Test 3: Logout

```
[ ] En el ClienteModule, presiona el botón "Salir"
[ ] Verifica que vuelves a Login
```

✅ **Resultado esperado**: Sesión cerrada correctamente

---

### Test 4: Login Admin/Mesero

```
[ ] Regresa al Login
[ ] Selecciona "Admin"
[ ] Prueba con credenciales incorrectas
[ ] Verifica el mensaje de error
```

✅ **Resultado esperado**: Error adecuado (email no encontrado, etc.)

---

## 🎉 Fase 5: ¡LISTO!

Si pasaste todos los tests anteriores:

```
✅ Firebase configurado correctamente
✅ App funcionando localmente
✅ Autenticación funcionando
✅ Navegación funcionando
✅ Dashboards listos
```

---

## 📝 Próximos Pasos (Para Después)

Una vez confirmado que todo funciona:

1. **Integrar menú real desde Firestore**
   - Crear colección "menu" en Firestore
   - Cargar items en ClienteModule

2. **Implementar sistema de pedidos**
   - Crear pantalla de pedidos
   - Guardar en Firestore

3. **Agregar reportes de ventas**
   - Crear servicio ReporteService
   - Mostrar en AdminDashboard

4. **Notificaciones push**
   - Usar Firebase Cloud Messaging
   - Avisar a meseros de nuevos pedidos

5. **Detalles UI/UX**
   - Agregar imágenes de platos
   - Animaciones
   - Temas personalizables

---

## 🆘 Si hay problemas

### "Firebase initialized incorrectly"

1. Verifica que `.env.local` existe en la raíz
2. Reinicia `npm start`
3. Verifica los valores en `.env.local`

### "Cannot connect to Firestore"

1. Verifica que Firestore está habilitado en Firebase Console
2. Verifica que estás en modo "Prueba"

### "Email not found"

1. Registra un nuevo usuario primero
2. Luego intenta login

---

## 📱 Detalles de Logeo para Pruebas

**Cliente Ejemplo:**

- Email: `juan@test.com`
- Contraseña: `123456`
- Rol: `cliente`

**Para Admin/Mesero:**

- Necesitas crear en Firebase Console manualmente
- O implementar panel de creación (CrearMeseroScreen)

---

## ✨ Estado Final Esperado

```
┌─────────────────────────────────────────┐
│         LA PAMPA APP                    │
│      ✅ Firebase Configurado            │
│      ✅ Login Funcionando               │
│      ✅ 3 Módulos Listos                │
│      ✅ Listo para Desarrollo           │
└─────────────────────────────────────────┘
```

---

**¡Felicidades! 🎉 Ya tienes la app funcionando!**

Próximos pasos: Desarrollar features según requerimientos.
