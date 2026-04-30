// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - PROPINA SERVICE
// Servicio de gestión de propinas
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

class PropinaService {
  /**
   * Crear registro de propinas
   * @param {Object} propina - {meseroId, montoTotal, distribucion[], adminId}
   * @returns {Promise<Object>}
   */
  async crearPropina(propina) {
    try {
      const docRef = await addDoc(collection(db, "propinas"), {
        ...propina,
        fecha: Timestamp.now(),
      });
      return { exito: true, id: docRef.id, mensaje: "Propina registrada" };
    } catch (error) {
      console.error("❌ Error creando propina:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener propinas de un mesero
   * @param {string} meseroId
   * @returns {Promise<Array>}
   */
  async obtenerPropinasMesero(meseroId) {
    try {
      const q = query(
        collection(db, "propinas"),
        where("meseroId", "==", meseroId),
      );
      const querySnapshot = await getDocs(q);
      const propinas = [];
      let totalPropinas = 0;

      querySnapshot.forEach((doc) => {
        propinas.push({ id: doc.id, ...doc.data() });
        totalPropinas += doc.data().montoTotal;
      });

      return { exito: true, propinas, totalPropinas };
    } catch (error) {
      console.error("❌ Error obteniendo propinas:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener propinas del día
   * @returns {Promise<Array>}
   */
  async obtenerPropinasDia() {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const manana = new Date(hoy);
      manana.setDate(manana.getDate() + 1);

      const q = query(
        collection(db, "propinas"),
        where("fecha", ">=", Timestamp.fromDate(hoy)),
        where("fecha", "<", Timestamp.fromDate(manana)),
      );

      const querySnapshot = await getDocs(q);
      const propinas = [];
      querySnapshot.forEach((doc) => {
        propinas.push({ id: doc.id, ...doc.data() });
      });

      return { exito: true, propinas };
    } catch (error) {
      console.error("❌ Error obteniendo propinas del día:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Calcular propina automática basada en total de venta
   * @param {number} montoVenta
   * @param {number} porcentaje - Porcentaje de propina (por defecto 10)
   * @returns {number} Monto de propina
   */
  calcularPropinaAutomatica(montoVenta, porcentaje = 10) {
    return (montoVenta * porcentaje) / 100;
  }
}

export default new PropinaService();
