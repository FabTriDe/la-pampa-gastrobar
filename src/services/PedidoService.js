// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - PEDIDO SERVICE
// Servicio de gestión de pedidos en mesa
// ═══════════════════════════════════════════════════════════════════════════

import { db } from "../config/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

class PedidoService {
  /**
   * Crear nuevo pedido en mesa
   * @param {Object} pedido - {mesaId, usuarioId, productos[], notas}
   * @returns {Promise<Object>}
   */
  async crearPedido(pedido) {
    try {
      const docRef = await addDoc(collection(db, "pedidos"), {
        ...pedido,
        estado: "pendiente",
        fechaCreacion: Timestamp.now(),
        total: this._calcularTotal(pedido.productos),
      });
      return { exito: true, id: docRef.id };
    } catch (error) {
      console.error("❌ Error creando pedido:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener pedidos por mesa
   * @param {string} mesaId
   * @returns {Promise<Array>}
   */
  async obtenerPedidosPorMesa(mesaId) {
    try {
      const q = query(collection(db, "pedidos"), where("mesaId", "==", mesaId));
      const querySnapshot = await getDocs(q);
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, pedidos };
    } catch (error) {
      console.error("❌ Error obteniendo pedidos:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener pedidos activos (no completados)
   * @returns {Promise<Array>}
   */
  async obtenerPedidosActivos() {
    try {
      const q = query(
        collection(db, "pedidos"),
        where("estado", "in", ["pendiente", "preparando", "listo"]),
      );
      const querySnapshot = await getDocs(q);
      const pedidos = [];
      querySnapshot.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, pedidos };
    } catch (error) {
      console.error("❌ Error obteniendo pedidos activos:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Actualizar estado del pedido
   * @param {string} pedidoId
   * @param {string} nuevoEstado - 'pendiente' | 'preparando' | 'listo' | 'entregado'
   * @returns {Promise<Object>}
   */
  async actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
      await updateDoc(doc(db, "pedidos", pedidoId), {
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
   * Agregar item a pedido existente
   * @param {string} pedidoId
   * @param {Object} item - {productoId, nombre, precio, cantidad}
   * @returns {Promise<Object>}
   */
  async agregarItemPedido(pedidoId, item) {
    try {
      const pedidoRef = doc(db, "pedidos", pedidoId);
      const pedidoDoc = await getDocs(
        query(collection(db, "pedidos"), where("__name__", "==", pedidoId)),
      );

      if (!pedidoDoc.empty) {
        const pedido = pedidoDoc.docs[0].data();
        const productosActualizados = [...(pedido.productos || []), item];
        await updateDoc(pedidoRef, {
          productos: productosActualizados,
          total: this._calcularTotal(productosActualizados),
        });
        return { exito: true, mensaje: "Item agregado" };
      }
      return { exito: false, error: "Pedido no encontrado" };
    } catch (error) {
      console.error("❌ Error agregando item:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Eliminar pedido
   * @param {string} pedidoId
   * @returns {Promise<Object>}
   */
  async eliminarPedido(pedidoId) {
    try {
      await deleteDoc(doc(db, "pedidos", pedidoId));
      return { exito: true, mensaje: "Pedido eliminado" };
    } catch (error) {
      console.error("❌ Error eliminando pedido:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Calcular total de pedido
   * @private
   */
  _calcularTotal(productos) {
    return productos.reduce((total, item) => {
      return total + item.precio * (item.cantidad || 1);
    }, 0);
  }
}

export default new PedidoService();
