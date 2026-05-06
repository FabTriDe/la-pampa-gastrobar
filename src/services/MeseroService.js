import { db } from "../config/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

class MeseroService {
  /**
   * Obtener todos los meseros (rol == "mesero")
   */
  async obtenerMeseros() {
    try {
      const q = query(
        collection(db, "usuarios"),
        where("rol", "==", "mesero")
      );
      const snap = await getDocs(q);
      const meseros = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return { exito: true, meseros };
    } catch (error) {
      console.error("❌ Error obteniendo meseros:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener un mesero por su UID
   */
  async obtenerMeseroPorId(uid) {
    try {
      const snap = await getDoc(doc(db, "usuarios", uid));
      if (!snap.exists()) return { exito: false, error: "Mesero no encontrado" };
      return { exito: true, mesero: { id: snap.id, ...snap.data() } };
    } catch (error) {
      console.error("❌ Error obteniendo mesero:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Actualizar nombre y teléfono de un mesero
   * No se actualiza correo porque está ligado a Firebase Auth
   */
  async actualizarMesero(uid, datos) {
    try {
      await updateDoc(doc(db, "usuarios", uid), {
        nombre: datos.nombre,
        telefono: datos.telefono,
        fechaActualizacion: Timestamp.now(),
      });
      return { exito: true, mensaje: "Mesero actualizado correctamente" };
    } catch (error) {
      console.error("❌ Error actualizando mesero:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Activar o desactivar un mesero
   */
  async toggleActivo(uid, nuevoEstado) {
    try {
      await updateDoc(doc(db, "usuarios", uid), {
        activo: nuevoEstado,
        fechaActualizacion: Timestamp.now(),
      });
      return {
        exito: true,
        mensaje: `Mesero ${nuevoEstado ? "activado" : "desactivado"}`,
      };
    } catch (error) {
      console.error("❌ Error cambiando estado del mesero:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Eliminar un mesero de Firestore
   * Nota: elimina solo el documento. La cuenta de Firebase Auth
   * queda huérfana — para eliminarla también se necesita Firebase Admin SDK.
   */
  async eliminarMesero(uid) {
    try {
      await deleteDoc(doc(db, "usuarios", uid));
      return { exito: true, mensaje: "Mesero eliminado" };
    } catch (error) {
      console.error("❌ Error eliminando mesero:", error);
      return { exito: false, error: error.message };
    }
  }
}

export default new MeseroService();