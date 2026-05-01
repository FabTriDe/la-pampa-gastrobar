# 🔧 Configuración Firebase - La Pampa App

## Paso a Paso para Configurar Firebase

### **Paso 1: Crear Proyecto en Firebase Console**

1. Ve a **[https://console.firebase.google.com](https://console.firebase.google.com)**
2. Haz clic en **"Crear proyecto"**
3. Nombre del proyecto: **la-pampa-app**
4. Desactiva Google Analytics (opcional)
5. Haz clic en **"Crear proyecto"** y espera a que se cree (2-3 minutos)

---

### **Paso 2: Obtener las Credenciales**

Una vez el proyecto esté creado:

1. En el Dashboard, haz clic en el icono de **engranaje (⚙️)** arriba a la izquierda
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"Mis apps"**
4. Si no hay una app web, haz clic en **"Agregar app"** y selecciona **Web**
5. En el popup, copia el objeto `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};
```

---

### **Paso 3: Crear archivo .env.local**

1. En la **raíz del proyecto** (mismo nivel que `package.json`), crea un archivo llamado `.env.local`
2. Copia el contenido de `.env.local.example`
3. Reemplaza cada valor con los datos de tu Firebase:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

---

### **Paso 4: Habilitar Autenticación en Firebase**

1. En **Firebase Console**, ve a **Authentication** (en el menú izquierdo)
2. Haz clic en **"Comenzar"**
3. Ve a **"Métodos de acceso"**
4. **Habilita "Email/Contraseña"**:
   - Haz clic en "Email/Contraseña"
   - Activa la opción "Email/Contraseña"
   - Guarda

---

### **Paso 5: Habilitar Firestore Database**

1. En **Firebase Console**, ve a **Firestore Database** (menú izquierdo)
2. Haz clic en **"Crear base de datos"**
3. Selecciona modo **"Iniciar en modo de prueba"** (para desarrollo)
4. Selecciona región más cercana a Colombia
5. Haz clic en **"Crear"**

---

### **Paso 6: Crear Estructura de Datos en Firestore**

Ve a **Firestore Database** y crea una colección **"usuarios"** (la app la creará automáticamente al registrar, pero es bueno tenerla lista).

---

### **Paso 7: Probar la Configuración**

1. Asegúrate de que `.env.local` esté en la raíz
2. Reinicia el servidor Expo:
   ```bash
   npm start
   ```
3. Abre la app y prueba el registro/login

---

## ⚠️ Importante

- **NO SUBAS `.env.local` a Git** - Añádelo a `.gitignore` (ya debería estar)
- Las credenciales de Firebase son públicas, así que no hay problema en exponerlas en una app, pero mejor mantenerlas privadas
- En producción, usa reglas de Firestore más restrictivas

---

## 🆘 Errores Comunes

### ❌ "Firebase initialized incorrectly"

- Verifica que `.env.local` esté en la **raíz del proyecto**
- Reinicia el servidor Expo después de agregar `.env.local`

### ❌ "Email already in use"

- Es normal si registraste antes - crea una nueva cuenta

### ❌ "Permission denied" en Firestore

- Asegúrate de estar en modo "Prueba" en Firestore
- O crea reglas específicas en Firestore → Rules

---

¿Tienes dudas en algún paso? ¡Cuéntame!
