// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - MENU SERVICE
// Servicio de gestión del menú digital
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
  Timestamp,
} from "firebase/firestore";

class MenuService {
  /**
   * Obtener todos los productos
   * @returns {Promise<Array>}
   */
  async obtenerProductos() {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productos = [];
      querySnapshot.forEach((doc) => {
        productos.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, productos };
    } catch (error) {
      console.error("❌ Error obteniendo productos:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener productos por categoría
   * @param {string} categoria - 'cocina', 'bar', 'bebidas', 'postres'
   * @returns {Promise<Array>}
   */
  async obtenerProductosPorCategoria(categoria) {
    try {
      const q = query(
        collection(db, "productos"),
        where("categoria", "==", categoria),
      );
      const querySnapshot = await getDocs(q);
      const productos = [];
      querySnapshot.forEach((doc) => {
        productos.push({ id: doc.id, ...doc.data() });
      });
      return { exito: true, productos };
    } catch (error) {
      console.error("❌ Error obteniendo productos por categoría:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Crear nuevo producto
   * @param {Object} producto - {nombre, descripcion, precio, categoria, disponible}
   * @returns {Promise<Object>}
   */
  async crearProducto(producto) {
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        ...producto,
        fechaCreacion: Timestamp.now(),
        disponible: true,
      });
      return { exito: true, id: docRef.id, mensaje: "Producto creado" };
    } catch (error) {
      console.error("❌ Error creando producto:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Actualizar producto
   * @param {string} productoId
   * @param {Object} actualizaciones
   * @returns {Promise<Object>}
   */
  async actualizarProducto(productoId, actualizaciones) {
    try {
      await updateDoc(doc(db, "productos", productoId), {
        ...actualizaciones,
        fechaActualizacion: Timestamp.now(),
      });
      return { exito: true, mensaje: "Producto actualizado" };
    } catch (error) {
      console.error("❌ Error actualizando producto:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Eliminar producto
   * @param {string} productoId
   * @returns {Promise<Object>}
   */
  async eliminarProducto(productoId) {
    try {
      await deleteDoc(doc(db, "productos", productoId));
      return { exito: true, mensaje: "Producto eliminado" };
    } catch (error) {
      console.error("❌ Error eliminando producto:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Obtener menú organizado por categoría
   * @returns {Promise<Object>}
   */
  async obtenerMenuOrganizado() {
    try {
      const categorias = ["cocina", "bar", "bebidas", "postres"];
      const menu = {};

      for (const cat of categorias) {
        const q = query(
          collection(db, "productos"),
          where("categoria", "==", cat),
        );
        const querySnapshot = await getDocs(q);
        menu[cat] = [];
        querySnapshot.forEach((doc) => {
          menu[cat].push({ id: doc.id, ...doc.data() });
        });
      }

      return { exito: true, menu };
    } catch (error) {
      console.error("❌ Error obteniendo menú organizado:", error);
      return { exito: false, error: error.message };
    }
  }

  /**
   * Buscar productos por nombre
   * @param {string} termino
   * @returns {Promise<Array>}
   */
  async buscarProductos(termino) {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const productos = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.nombre.toLowerCase().includes(termino.toLowerCase())) {
          productos.push({ id: doc.id, ...data });
        }
      });
      return { exito: true, productos };
    } catch (error) {
      console.error("❌ Error buscando productos:", error);
      return { exito: false, error: error.message };
    }
  }
}

export default new MenuService();
