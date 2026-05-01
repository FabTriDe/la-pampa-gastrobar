# Firebase Console - Guía Visual Paso a Paso

## 🎯 Resumen Rápido

```
Firebase Console
       ↓
   1️⃣  Crear Proyecto → "la-pampa-app"
       ↓
   2️⃣  Obtener Credenciales (⚙️ Configuración)
       ↓
   3️⃣  Crear .env.local en el proyecto
       ↓
   4️⃣  Habilitar Autenticación (Email/Contraseña)
       ↓
   5️⃣  Habilitar Firestore Database
       ↓
   ✅  Listo para usar
```

---

## 📱 Paso 1: Crear Proyecto

**Ubicación**: [Firebase Console](https://console.firebase.google.com)

```
[Crear proyecto]
    ↓
Nombre: "la-pampa-app"
País: Colombia
Google Analytics: ❌ (Desactiva si quieres)
    ↓
[Crear proyecto]
    ↓
⏳ Espera 2-3 minutos...
    ↓
✅ Proyecto creado
```

---

## 🔑 Paso 2: Obtener Credenciales

**Ubicación**: Firebase Console → ⚙️ (arriba-izquierda) → Configuración del proyecto

```
┌─────────────────────────────────────────┐
│ ⚙️ Configuración del Proyecto           │
├─────────────────────────────────────────┤
│ [General] [Usuarios] [Servicios] ...     │
│                                          │
│ Mis apps:                                │
│ ☑ tu-app (Web)                           │
│                                          │
│ firebaseConfig:                          │
│ const firebaseConfig = {                 │
│   apiKey: "AIzaSy...",                   │
│   authDomain: "la-pampa-app....",        │
│   projectId: "la-pampa-app",             │
│   storageBucket: "...",                  │
│   messagingSenderId: "...",              │
│   appId: "..."                           │
│ }                                        │
│                                          │
│ 📋 [Copiar]                              │
└─────────────────────────────────────────┘
```

**⚠️ Copia SOLO los valores, no todo el objeto**

---

## 📝 Paso 3: Crear .env.local

**Ubicación**: Raíz del proyecto (mismo nivel que `package.json`)

```bash
# .env.local (crear este archivo)

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=la-pampa-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=la-pampa-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=la-pampa-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Ejemplo con valores reales:**

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyDpFCR2IpqYVBN5HQ-v1K2W3X4Y5Z6
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=la-pampa-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=la-pampa-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=la-pampa-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321
EXPO_PUBLIC_FIREBASE_APP_ID=1:987654321:web:zyx654wvu321
```

---

## 🔐 Paso 4: Habilitar Autenticación

**Ubicación**: Firebase Console → Authentication (menú izquierdo)

```
Firebase Console
    ↓
[Build] (menú izquierdo)
    ↓
[Authentication]
    ↓
[Get started]
    ↓
[Métodos de acceso]
    ↓
┌─────────────────────────────────────────┐
│ Métodos de acceso disponibles:          │
│ ├─ Email/Contraseña        ❌ ACTIVAR   │
│ ├─ Google                   ❌           │
│ ├─ Facebook                 ❌           │
│ └─ ...                                   │
└─────────────────────────────────────────┘
    ↓
Haz clic en "Email/Contraseña"
    ↓
[ACTIVAR]
    ↓
✅ Email/Contraseña habilitado
```

---

## 🗄️ Paso 5: Habilitar Firestore Database

**Ubicación**: Firebase Console → Firestore Database (menú izquierdo)

```
Firebase Console
    ↓
[Build] (menú izquierdo)
    ↓
[Firestore Database]
    ↓
[Crear base de datos]
    ↓
Modo de seguridad:
  ◉ Iniciar en modo de prueba (recomendado para desarrollo)
  ○ Iniciar en modo bloqueado
    ↓
Ubicación: América Central (us-central1)
[CREAR]
    ↓
⏳ Creando... (2-3 segundos)
    ↓
✅ Base de datos creada
```

---

## ✅ Verificación Final

Después de todo lo anterior:

```bash
# En la terminal, en la raíz del proyecto:
bash verify-firebase.sh
```

Deberías ver:

```
✅ EXPO_PUBLIC_FIREBASE_API_KEY
✅ EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
✅ EXPO_PUBLIC_FIREBASE_PROJECT_ID
✅ EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
✅ EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✅ EXPO_PUBLIC_FIREBASE_APP_ID

🎉 ¡Todas las variables están configuradas!
```

---

## 🚀 Próximos Pasos

```bash
npm install        # Instalar dependencias
npm start          # Iniciar servidor Expo
```

Abre la app y prueba:

- ✅ Registro de cliente
- ✅ Login
- ✅ Dashboard según rol

---

## 📸 Screenshots Útiles

### En Firebase Console verás esto:

```
┌──────────────────────────────────────────┐
│          Firebase Console                │
│  Proyectos                               │
│  ├─ la-pampa-app  ← Tu proyecto          │
│     ├─ Overview                          │
│     ├─ Authentication                    │
│     ├─ Firestore Database                │
│     ├─ Cloud Storage                     │
│     └─ ...                               │
└──────────────────────────────────────────┘
```

---

## 🆘 Preguntas Frecuentes

**P: ¿Dónde está el botón de "Crear proyecto"?**
A: Cuando entras a Firebase Console, si no tienes proyectos, verás un botón grande. Si ya tienes, está en la esquina superior.

**P: ¿Qué es "modo de prueba" en Firestore?**
A: Es para desarrollo - permite lectura/escritura sin restricciones. En producción lo cambias.

**P: ¿Puedo usar el mismo proyecto de Firebase para múltiples apps?**
A: Sí, uno puede tener varias apps web/móvil en el mismo proyecto.

**P: ¿Expongo mis credenciales siendo públicas?**
A: Las credenciales de Firebase web son "públicas" por diseño - se protege con Firestore rules.

---

¿Necesitas ayuda en algún paso? 📞
