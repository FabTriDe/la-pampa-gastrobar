# LA PAMPA - Gastro Bar App 🍽️

Sistema de gestión operativa y gestión de pedidos para "La Pampa" - Gastro Bar en Cali.

## 📱 Características

- **Autenticación** de usuarios (Admin, Mesero, Cliente)
- **Dashboard Admin**: Gestión de meseros, reportes y estadísticas
- **Módulo Mesero**: Gestión de pedidos y mesas
- **Módulo Cliente**: Visualización de menú y pedidos
- **Firebase Authentication** para autenticación segura
- **Firestore Database** para gestión de datos en tiempo real

---

## 🚀 Quick Start

### **1. Clonar el Proyecto**

```bash
git clone <tu-repo>
cd la-pampa-app
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Firebase** (⚠️ IMPORTANTE)

**Lee primero**: [FIREBASE_VISUAL_GUIDE.md](./FIREBASE_VISUAL_GUIDE.md)

Pasos resumidos:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea proyecto "la-pampa-app"
3. Obtén credenciales desde ⚙️ Configuración
4. Crea `.env.local` en la raíz del proyecto
5. Copia variables (ver [VARIABLES_FIREBASE.md](./VARIABLES_FIREBASE.md))
6. Habilita Authentication (Email/Contraseña)
7. Habilita Firestore Database

### **4. Iniciar la App**

```bash
npm start
```

Opciones:

- Presiona `w` para abrir en web
- Presiona `i` para iOS
- Presiona `a` para Android

---

## 📁 Estructura del Proyecto

```
la-pampa-app/
├── App.js                      # Punto de entrada
├── index.js
├── app.json
├── package.json
├── .env.local                  # ⚠️ Confidencial (no subir a Git)
├── .env.local.example          # Template de variables
├── FIREBASE_SETUP.md           # Guía detallada Firebase
├── FIREBASE_VISUAL_GUIDE.md    # Guía visual paso a paso
├── VARIABLES_FIREBASE.md       # Referencia de variables
├── verify-firebase.sh          # Script verificación
│
├── src/
│   ├── assets/                 # Imágenes, fuentes
│   ├── components/             # Componentes reutilizables
│   ├── config/
│   │   └── firebaseConfig.js   # Configuración Firebase
│   ├── navigation/
│   │   └── AppNavigator.js     # Stack Navigator
│   ├── screens/
│   │   ├── LoginScreen.js      # Login
│   │   ├── RegisterClienteScreen.js
│   │   ├── CrearMeseroScreen.js
│   │   ├── AdminDashboard.js   # Panel Admin
│   │   ├── MeseroModule.js     # Módulo Mesero
│   │   ├── ClienteModule.js    # Módulo Cliente
│   │   └── index.js            # Exportaciones
│   ├── services/               # Servicios (Auth, Menu, Pedidos)
│   │   ├── AuthService.js
│   │   ├── MenuService.js
│   │   ├── PedidoService.js
│   │   ├── PropinaService.js
│   │   └── ...
│   └── theme/
│       ├── colors.js           # Paleta de colores
│       └── index.js            # Exportaciones tema
│
└── assets/
    └── ...                     # Fuentes, logos, etc.
```

---

## 🔐 Configuración de Credenciales

### Crear `.env.local`

En la **raíz del proyecto**, crea un archivo `.env.local`:

```bash
# .env.local

EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**⚠️ Importante:**

- **NO** subas `.env.local` a Git (ya está en `.gitignore`)
- Comparte las credenciales de forma segura (no por Git)
- Las credenciales web de Firebase son semi-públicas, pero protegidas por Firestore rules

---

## 🧪 Pruebas de Inicio

Una vez configurado Firebase:

### **Verificar configuración**

```bash
bash verify-firebase.sh
```

Deberías ver:

```
✅ EXPO_PUBLIC_FIREBASE_API_KEY
✅ EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
...
🎉 ¡Todas las variables están configuradas!
```

### **Probar la App**

1. Inicia: `npm start`
2. Abre en navegador o emulador
3. **Prueba Registro** (Cliente):
   - Ve a Login → Cliente → "¿No tienes cuenta?" → Regístrate
   - Completa datos y presiona "CREAR CUENTA"
   - Deberías ver un alerta de éxito
4. **Prueba Login**:
   - Vuelve a Login
   - Ingresa credenciales del cliente registrado
   - Presiona "INICIAR SESIÓN"
   - Deberías ver el ClienteModule

5. **Prueba Logout**:
   - En cualquier dashboard, presiona "Salir"
   - Deberías volver a Login

---

## 📚 Documentación Completa

- [**FIREBASE_SETUP.md**](./FIREBASE_SETUP.md) - Guía paso a paso de Firebase
- [**FIREBASE_VISUAL_GUIDE.md**](./FIREBASE_VISUAL_GUIDE.md) - Guía visual
- [**VARIABLES_FIREBASE.md**](./VARIABLES_FIREBASE.md) - Referencia de variables

---

## 🎨 Tema y Estilos

El proyecto usa un sistema de tema centralizado en `src/theme/`:

### Colores principales:

```javascript
COLORS.primary; // #E8A020 (Oro)
COLORS.backgroundDark; // #1C0D03 (Marrón oscuro)
COLORS.surface; // #FDF6E3 (Beige)
COLORS.textDark; // #1C0D03
COLORS.textBrown; // #5C3300
COLORS.primary; // #E8A020
```

### Personalizar:

Edita `src/theme/colors.js` para cambiar la paleta.

---

## 📦 Dependencias Principales

```json
{
  "expo": "~54.0.33",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/native-stack": "^7.14.12",
  "@react-native-firebase/app": "^24.0.0",
  "@react-native-firebase/auth": "^24.0.0",
  "@react-native-firebase/firestore": "^24.0.0"
}
```

Para instalar nuevas dependencias:

```bash
npm install <package-name>
```

---

## 🛠️ Scripts Disponibles

```bash
npm start          # Inicia servidor Expo
npm run android    # Abre en emulador Android
npm run ios        # Abre en emulador iOS
npm run web        # Abre en navegador
```

---

## 🗺️ Roadmap / Por Implementar

- [ ] Menú dinámico desde Firestore
- [ ] Gestión real de pedidos
- [ ] Sistema de propinas
- [ ] Reportes de ventas
- [ ] Notificaciones push
- [ ] Imágenes de platos
- [ ] Historial de pedidos
- [ ] Preferencias de usuario
- [ ] Chat en tiempo real
- [ ] Historial de domicilios

---

## 🆘 Troubleshooting

### "Firebase initialized incorrectly"

```bash
# Verifica que .env.local existe en la raíz
ls .env.local

# Reinicia Expo
npm start
```

### "Permission denied" en Firestore

- Asegúrate de estar en "modo de prueba" en Firestore
- O configura reglas en Firestore:

```javascript
rules_version = '3';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // Solo para desarrollo
    }
  }
}
```

### "Email already in use"

- Es normal. Crea una nueva cuenta o recupera contraseña en Firebase

### "Cannot find module '@react-navigation'"

```bash
npm install
npm start
```

---

## 👥 Roles de Usuario

### **Admin**

- Crear y gestionar meseros
- Ver reportes
- Configuración del sistema
- Acceso a estadísticas

### **Mesero**

- Ver mesas activas
- Gestionar pedidos
- Registrar propinas
- Ver notificaciones

### **Cliente**

- Ver menú
- Realizar pedidos
- Ver historial
- Dejar reseñas

---

## 📞 Contacto y Soporte

Para dudas sobre:

- **Firebase**: Ve a [Firebase Docs](https://firebase.google.com/docs)
- **React Native**: Ve a [React Native Docs](https://reactnative.dev/docs)
- **Este proyecto**: Contacta al desarrollador

---

## 📄 Licencia

Proyecto privado para La Pampa - Gastro Bar

---

**Última actualización**: 1 de mayo de 2026  
**Versión**: 1.0.0
