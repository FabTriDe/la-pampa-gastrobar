// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - AUTH SERVICE
// Servicio de autenticación y gestión de usuarios
// ═══════════════════════════════════════════════════════════════════════════

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../config/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

class AuthService {
  /**
   * Registrar nuevo usuario (Admin o Mesero)
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @param {string} nombre - Nombre completo
   * @param {string} rol - 'admin', 'mesero' o 'cliente'
   * @returns {Promise<Object>} Usuario creado o error
   */
  async registrarUsuario(email, password, nombre, rol) {
    try {
      // Crear cuenta en Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Actualizar perfil
      await updateProfile(user, { displayName: nombre });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        id: user.uid,
        email,
        nombre,
        rol,
        fechaCreacion: new Date(),
        activo: true,
      });

      return {
        exito: true,
        uid: user.uid,
        mensaje: "Usuario registrado correctamente",
      };
    } catch (error) {
      console.error("❌ Error registrando usuario:", error);
      return { exito: false, error: this._parseError(error.code) };
    }
  }

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Usuario autenticado o error
   */
  async iniciarSesion(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Obtener datos del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (userDoc.exists()) {
        return {
          exito: true,
          uid: user.uid,
          email: user.email,
          nombre: user.displayName,
          rol: userDoc.data().rol,
          userData: userDoc.data(),
        };
      } else {
        return {
          exito: false,
          error: "Usuario no encontrado en la base de datos",
        };
      }
    } catch (error) {
      console.error("❌ Error iniciando sesión:", error);
      return { exito: false, error: this._parseError(error.code) };
    }
  }

  /**
   * Cerrar sesión
   * @returns {Promise<Object>} Confirmación de cierre de sesión
   */
  async cerrarSesion() {
    try {
      await signOut(auth);
      return { exito: true, mensaje: "Sesión cerrada correctamente" };
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
      return { exito: false, error: "Error al cerrar sesión" };
    }
  }

  /**
   * Obtener usuario actual
   * @returns {Promise<Object>} Usuario actual autenticado
   */
  async obtenerUsuarioActual() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          resolve({
            uid: user.uid,
            email: user.email,
            nombre: user.displayName,
            rol: userDoc.exists() ? userDoc.data().rol : null,
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * Obtener usuario por ID
   * @param {string} uid - UID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async obtenerUsuarioPorId(uid) {
    try {
      const userDoc = await getDoc(doc(db, "usuarios", uid));
      if (userDoc.exists()) {
        return { exito: true, usuario: userDoc.data() };
      }
      return { exito: false, error: "Usuario no encontrado" };
    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return { exito: false, error: "Error al obtener usuario" };
    }
  }

  /**
   * Obtener todos los usuarios de un rol específico
   * @param {string} rol - Rol a filtrar ('admin', 'mesero', 'cliente')
   * @returns {Promise<Array>} Lista de usuarios
   */
  async obtenerUsuariosPorRol(rol) {
    try {
      const q = query(collection(db, "usuarios"), where("rol", "==", rol));
      const querySnapshot = await getDocs(q);
      const usuarios = [];
      querySnapshot.forEach((doc) => {
        usuarios.push(doc.data());
      });
      return { exito: true, usuarios };
    } catch (error) {
      console.error("❌ Error obteniendo usuarios por rol:", error);
      return { exito: false, error: "Error al obtener usuarios" };
    }
  }

  /**
   * Validar si email existe
   * @param {string} email - Email a validar
   * @returns {Promise<Boolean>}
   */
  async emailExists(email) {
    try {
      const q = query(collection(db, "usuarios"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("❌ Error validando email:", error);
      return false;
    }
  }

  /**
   * Parsear errores de Firebase
   * @param {string} code - Código de error de Firebase
   * @returns {string} Mensaje de error personalizado
   */
  _parseError(code) {
    const errorMessages = {
      "auth/email-already-in-use": "Este email ya está registrado",
      "auth/invalid-email": "Email inválido",
      "auth/weak-password": "La contraseña es muy débil (mínimo 6 caracteres)",
      "auth/user-not-found": "Usuario no encontrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/operation-not-allowed": "Esta operación no está permitida",
      "auth/too-many-requests": "Demasiados intentos. Intenta más tarde",
    };
    return errorMessages[code] || "Error de autenticación";
  }
}

export default new AuthService();
