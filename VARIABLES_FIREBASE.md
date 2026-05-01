# 📋 Referencia Rápida - Variables de Firebase

## Mapeó de Variables

| Variable en .env.local                     | Dónde encontrarla en Firebase                             | Ejemplo                               |
| ------------------------------------------ | --------------------------------------------------------- | ------------------------------------- |
| `EXPO_PUBLIC_FIREBASE_API_KEY`             | Firebase Console → ⚙️ Configuración → `apiKey`            | `AIzaSyDpFCR2IpqYVBN5HQ-v1K2W3X4Y5Z6` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`         | Firebase Console → ⚙️ Configuración → `authDomain`        | `la-pampa-app.firebaseapp.com`        |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID`          | Firebase Console → ⚙️ Configuración → `projectId`         | `la-pampa-app`                        |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`      | Firebase Console → ⚙️ Configuración → `storageBucket`     | `la-pampa-app.appspot.com`            |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → ⚙️ Configuración → `messagingSenderId` | `987654321`                           |
| `EXPO_PUBLIC_FIREBASE_APP_ID`              | Firebase Console → ⚙️ Configuración → `appId`             | `1:987654321:web:zyx654wvu321`        |

---

## 🔍 ¿Cómo copiar desde Firebase Console?

### Opción 1: Copiar el objeto completo (recomendado)

1. Ve a **⚙️ Configuración del Proyecto**
2. En **"Mis apps"**, haz clic en tu app web
3. Verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "la-pampa-app.firebaseapp.com",
  projectId: "la-pampa-app",
  storageBucket: "la-pampa-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456",
};
```

4. Copia **los valores** (no la estructura) a tu `.env.local`

### Opción 2: Copiar uno por uno

Si prefieres, cada valor está disponible en la misma pantalla. Solo asegúrate de que coincidan las claves.

---

## 📝 Plantilla de .env.local (Copia y Pega)

```bash
# Reemplaza los valores AQUÍ con los de Firebase Console

EXPO_PUBLIC_FIREBASE_API_KEY=PEGAAQUITU_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=PEGAAQUITU_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=PEGAAQUITU_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=PEGAAQUITU_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=PEGAAQUITU_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=PEGAAQUITU_APP_ID
```

---

## ✅ Checklist Final

Antes de empezar a usar la app:

- [ ] Proyecto creado en Firebase Console
- [ ] Credenciales copiadas desde Firebase
- [ ] Archivo `.env.local` creado en la raíz del proyecto
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Autenticación habilitada (Email/Contraseña)
- [ ] Firestore Database creada
- [ ] `.env.local` está en `.gitignore`
- [ ] Servidor Expo reiniciado (`npm start`)

---

## 🎯 Qué Pasa Cuando Ingresas las Credenciales

1. **Registro de Cliente**: Crea usuario en `Auth` y guarda datos en `Firestore` → colección `usuarios`
2. **Login**: Autentica en `Auth` y obtiene rol desde `Firestore`
3. **Dashboards**: Se cargan según el rol del usuario
4. **Logout**: Cierra sesión en `Auth`

---

## 🆘 Si algo sale mal

### "Firebase initialized incorrectly"

- Verifica que `.env.local` esté en la **raíz**
- Reinicia `npm start` después de agregar `.env.local`
- Verifica que las variables no tengan espacios en blanco

### "apiKey is invalid"

- Copia correctamente desde Firebase Console
- Asegúrate de no incluir comillas adicionales

### "Project not found"

- Verifica el `projectId` (debe coincidir exactamente)
- Asegúrate de que el proyecto existe en Firebase Console

---

## 📞 Preguntas Rápidas

**P: ¿Debo agregar .env a Git?**  
A: No. `.env.local` ya está en `.gitignore` por seguridad.

**P: ¿Puedo usar el mismo proyecto para iOS, Android y Web?**  
A: Sí, son solo diferentes "apps" en el mismo proyecto de Firebase.

**P: ¿Las credenciales son secretas?**  
A: Las credenciales web de Firebase están diseñadas para ser públicas. La seguridad viene de Firestore rules.

**P: ¿Qué es "Modo de prueba" en Firestore?**  
A: Permite lectura/escritura sin restricciones por 30 días. Perfecto para desarrollo. Cambia después.

---

¡Listo! Ahora tienes todo lo que necesitas. 🚀
