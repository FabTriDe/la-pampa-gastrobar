// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - DOMICILIO SERVICE
// Servicio de gestión de domicilios
// ═══════════════════════════════════════════════════════════════════════════

import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

class DomicilioService {
  /**
   * Crear nuevo domicilio
   * @param {Object} domicilio - {clienteId, direccion, telefono, productos[], total}
   * @returns {Promise<Object>}
   */
  async crearDomicilio(domicilio) {
    try {
      const docRef = await addDoc(collection(db, "domicilios"), {
        ...domicilio,
        estado: "pendiente",
        fechaCreacion: Timestamp.now(),
      });
      return { exito: true, id: docRef.id, mensaje: "Domicilio registrado" };
    } catch (error) {
      console.error("❌ Error creando domicilio:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener todos los domicilios
   * @returns {Promise<Array>}
   */
  async obtenerTodosDomicilios() {
    try {
      const querySnapshot = await getDocs(collection(db, "domicilios"));
      const domicilios = [];
      querySnapshot.forEach((doc) => {
        domicilios.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, domicilios };
    } catch (error) {
      console.error("❌ Error obteniendo domicilios:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener domicilios pendientes
   * @returns {Promise<Array>}
   */
  async obtenerDomiciliosPendientes() {
    try {
      const q = query(
        collection(db, "domicilios"),
        where("estado", "==", "pendiente"),
      );
      const querySnapshot = await getDocs(q);
      const domicilios = [];
      querySnapshot.forEach((doc) => {
        domicilios.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, domicilios };
    } catch (error) {
      console.error("❌ Error obteniendo domicilios pendientes:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Actualizar estado del domicilio
   * @param {string} domicilioId
   * @param {string} nuevoEstado - 'pendiente' | 'confirmado' | 'en_ruta' | 'entregado'
   * @returns {Promise<Object>}
   */
  async actualizarEstadoDomicilio(domicilioId, nuevoEstado) {
    try {
      await updateDoc(doc(db, "domicilios", domicilioId), {
        estado: nuevoEstado,
        fechaActualizacion: Timestamp.now(),
      });
      return { exito: true, mensaje: "Estado actualizado" };
    } catch (error) {
      console.error("❌ Error actualizando estado:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener domicilios por cliente
   * @param {string} clienteId
   * @returns {Promise<Array>}
   */
  async obtenerDomiciliosPorCliente(clienteId) {
    try {
      const q = query(
        collection(db, "domicilios"),
        where("clienteId", "==", clienteId),
      );
      const querySnapshot = await getDocs(q);
      const domicilios = [];
      querySnapshot.forEach((doc) => {
        domicilios.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, domicilios };
    } catch (error) {
      console.error("❌ Error obteniendo domicilios del cliente:", error);
      return { exito: false, error: error.message };
    }
  }
}

export default new DomicilioService();
