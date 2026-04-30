// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - REPORTE SERVICE
// Servicio de generación de reportes
// ═══════════════════════════════════════════════════════════════════════════

import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from "firebase/firestore";

class ReporteService {
  /**
   * Obtener reporte diario
   * @param {Date} fecha
   * @returns {Promise<Object>}
   */
  async obtenerReporteDiario(fecha = new Date()) {
    try {
      const inicio = new Date(fecha);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(fecha);
      fin.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, "pedidos"),
        where("fechaCreacion", ">=", Timestamp.fromDate(inicio)),
        where("fechaCreacion", "<=", Timestamp.fromDate(fin)),
      );

      const querySnapshot = await getDocs(q);
      const pedidos = [];
      let ventasTotal = 0;

      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        pedidos.push(pedido);
        if (pedido.estado === "entregado") {
          ventasTotal += pedido.total;
        }
      });

      return {
        exito: true,
        fecha: fecha.toISOString().split("T")[0],
        totalPedidos: pedidos.length,
        ventasTotal,
        pedidos,
      };
    } catch (error) {
      console.error("❌ Error obteniendo reporte diario:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener reporte semanal
   * @param {Date} fecha
   * @returns {Promise<Object>}
   */
  async obtenerReporteSemanal(fecha = new Date()) {
    try {
      const primerDia = new Date(fecha);
      primerDia.setDate(fecha.getDate() - fecha.getDay());
      primerDia.setHours(0, 0, 0, 0);

      const ultimoDia = new Date(primerDia);
      ultimoDia.setDate(primerDia.getDate() + 6);
      ultimoDia.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, "pedidos"),
        where("fechaCreacion", ">=", Timestamp.fromDate(primerDia)),
        where("fechaCreacion", "<=", Timestamp.fromDate(ultimoDia)),
      );

      const querySnapshot = await getDocs(q);
      let ventasTotal = 0;
      let gastosTotal = 0;
      const pedidos = [];

      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        pedidos.push(pedido);
        if (pedido.estado === "entregado") {
          ventasTotal += pedido.total;
        }
      });

      const gananciaNeta = ventasTotal - gastosTotal;

      return {
        exito: true,
        semana: `${primerDia.toISOString().split("T")[0]} - ${
          ultimoDia.toISOString().split("T")[0]
        }`,
        ventasTotal,
        gastosTotal,
        gananciaNeta,
        totalPedidos: pedidos.length,
      };
    } catch (error) {
      console.error("❌ Error obteniendo reporte semanal:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener reporte mensual
   * @param {number} mes (1-12)
   * @param {number} anio
   * @returns {Promise<Object>}
   */
  async obtenerReporteMensual(
    mes = new Date().getMonth() + 1,
    anio = new Date().getFullYear(),
  ) {
    try {
      const inicio = new Date(anio, mes - 1, 1);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(anio, mes, 0);
      fin.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, "pedidos"),
        where("fechaCreacion", ">=", Timestamp.fromDate(inicio)),
        where("fechaCreacion", "<=", Timestamp.fromDate(fin)),
      );

      const querySnapshot = await getDocs(q);
      let ventasTotal = 0;
      let gastosTotal = 0;
      const pedidos = [];

      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        pedidos.push(pedido);
        if (pedido.estado === "entregado") {
          ventasTotal += pedido.total;
        }
      });

      const gananciaNeta = ventasTotal - gastosTotal;
      const margenGanancia = ((gananciaNeta / ventasTotal) * 100).toFixed(2);

      return {
        exito: true,
        periodo: `${mes}/${anio}`,
        ventasTotal,
        gastosTotal,
        gananciaNeta,
        margenGanancia: `${margenGanancia}%`,
        totalPedidos: pedidos.length,
      };
    } catch (error) {
      console.error("❌ Error obteniendo reporte mensual:", error);
      return { exito: false, error: error.message };
    }
  }
}

export default new ReporteService();
