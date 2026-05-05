import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { COLORS } from "../theme";
import { getAuth, signOut } from "firebase/auth";

export default function MeseroModuleScreen({ navigation }) {
  const [vista, setVista] = useState("mesas");
  const [productos, setProductos] = useState([]);
  const [historialPedidos, setHistorialPedidos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [nombreUsuario, setNombreUsuario] = useState("Usuario");
  const db = getFirestore();

  useEffect(() => {
  const obtenerUsuario = async () => {
    if (!user) return;

    try {
      const ref = doc(db, "usuarios", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setNombreUsuario(snap.data().nombre || "Usuario");
      }
    } catch (error) {
      console.log("Error obteniendo usuario:", error);
    }
  };
  obtenerUsuario();
}, [user]);

useEffect(() => {
  const obtenerProductos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "productos"));

      const listaProductos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProductos(listaProductos);

      if (listaProductos.length > 0) {
        setProductoSeleccionado(listaProductos[0]);
      }
    } catch (error) {
      console.log("Error obteniendo productos:", error);
      Alert.alert("Error", "No se pudieron cargar los productos.");
    }
  };

  obtenerProductos();
}, []);

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      navigation.replace("Login"); 
    })
    .catch((error) => {
      Alert.alert("Error", error.message);
    });
};

const crearMesas = () =>
  Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    nombre: `M${i + 1}`,
    estado: "Libre",
    capacidad: [4,2,4,6,2,4,8,4,2][i],
    pedido: [],
  }));

const [mesas, setMesas] = useState(crearMesas());

  const abrirMesa = (mesa) => {
    setMesaSeleccionada(mesa);
    setVista("pedido");
  };

 const totalPedido = () => {
  if (!mesaSeleccionada) return 0;

  return mesaSeleccionada.pedido.reduce(
    (total, item) => total + item.precio * (item.cantidad || 1),
    0
  );
};

const actualizarCantidad = (itemId, cambio) => {
  if (!mesaSeleccionada) return;

  const mesasActualizadas = mesas.map((mesa) => {
    if (mesa.id !== mesaSeleccionada.id) return mesa;

    const pedidoActualizado = mesa.pedido.map((item) =>
      item.id === itemId
        ? {
            ...item,
            cantidad: Math.max((item.cantidad || 1) + cambio, 1),
          }
        : item
    );

    return {
      ...mesa,
      pedido: pedidoActualizado,
    };
  });

  setMesas(mesasActualizadas);

  const mesaActualizada = mesasActualizadas.find(
    (mesa) => mesa.id === mesaSeleccionada.id
  );

  setMesaSeleccionada(mesaActualizada);
};

const eliminarItem = (itemId) => {
  if (!mesaSeleccionada) return;

  const mesasActualizadas = mesas.map((mesa) => {
    if (mesa.id !== mesaSeleccionada.id) return mesa;

    return {
      ...mesa,
      pedido: mesa.pedido.filter((item) => item.id !== itemId),
    };
  });

  setMesas(mesasActualizadas);

  const mesaActualizada = mesasActualizadas.find(
    (mesa) => mesa.id === mesaSeleccionada.id
  );

  setMesaSeleccionada(mesaActualizada);
};

const agregarItem = () => {
  if (!mesaSeleccionada) return;

const nuevoProducto = {
  ...productoSeleccionado,
  id: Date.now().toString(),
  cantidad: 1,
};

  if (!productoSeleccionado) {
  Alert.alert("Producto requerido", "Selecciona un producto antes de agregarlo.");
  return;
}

  const mesasActualizadas = mesas.map((mesa) =>
    mesa.id === mesaSeleccionada.id
      ? {
          ...mesa,
          estado: "En pedido",
          pedido: [...mesa.pedido, nuevoProducto],
        }
      : mesa
  );

  setMesas(mesasActualizadas);

  const mesaActualizada = mesasActualizadas.find(
    (mesa) => mesa.id === mesaSeleccionada.id
  );

  setMesaSeleccionada(mesaActualizada);
};

const enviarPedido = async () => {
  if (!mesaSeleccionada || !mesaSeleccionada.pedido || mesaSeleccionada.pedido.length === 0) {
    Alert.alert("Pedido vacío", "Agrega productos antes de enviar.");
    return;
  }

  try {
    await addDoc(collection(db, "ordenes"), {
      tipoOrden: "mesa",
      mesaId: mesaSeleccionada.id,
      mesaNombre: mesaSeleccionada.nombre,
      productos: mesaSeleccionada.pedido,
      total: totalPedido(),
      estado: "Listo",
      meseroId: user.uid,
      meseroNombre: nombreUsuario,
      createdAt: new Date(),
    });

    const mesasActualizadas = mesas.map((mesa) =>
      mesa.id === mesaSeleccionada.id
        ? { ...mesa, estado: "Listo" }
        : mesa
    );

    const mesaActualizada = mesasActualizadas.find(
      (mesa) => mesa.id === mesaSeleccionada.id
    );

    setMesas(mesasActualizadas);
    setMesaSeleccionada(mesaActualizada);

    Alert.alert("Pedido enviado", "Guardado en Firebase correctamente");
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "No se pudo guardar el pedido");
  }
};

const liberarMesa = () => {
  if (!mesaSeleccionada) return;

  const mesasActualizadas = mesas.map((mesa) =>
    mesa.id === mesaSeleccionada.id
      ? {
          ...mesa,
          estado: "Libre",
          pedido: [],
        }
      : mesa
  );

  setMesas(mesasActualizadas);
  setMesaSeleccionada(null);
  setVista("mesas");

  Alert.alert("Mesa liberada", "La mesa quedó disponible nuevamente.");
};

const cargarHistorial = async () => {
  try {
    const q = query(
      collection(db, "ordenes"),
      where("tipoOrden", "==", "mesa")
    );

    const snapshot = await getDocs(q);

    const pedidos = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
  .sort((a, b) => {
    const fechaA = a.createdAt?.seconds || 0;
    const fechaB = b.createdAt?.seconds || 0;

    return fechaB - fechaA; // más nuevos primero
  });

    setHistorialPedidos(pedidos);
    setVista("historial");
  } catch (error) {
    console.log("Error cargando historial:", error);
    Alert.alert("Error", "No se pudo cargar el historial.");
  }
};

  if (vista === "pedido" && mesaSeleccionada) {
    return (
      <View style={styles.container}>
            <View style={styles.topBar}>
      <View>
        <Text style={styles.greetingText}>
          Hola, <Text style={styles.userNameText}>{nombreUsuario}</Text>
        </Text>

        <Text style={styles.userEmailText}>
          {user?.email || "mesero@lapampa.com"}
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>× Salir</Text>
      </TouchableOpacity>
    </View>

        <ScrollView style={styles.body}>
          <Text style={styles.sectionTitle}>ORDEN ACTUAL</Text>

          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderTitle}>
                Mesa {mesaSeleccionada.id} · Orden #031
              </Text>
              <View style={styles.timePill}>
                <Text style={styles.timePillText}>Hace 8 min</Text>
              </View>
            </View>

            {mesaSeleccionada.pedido.map((item, index) => (
              <View key={item.id} style={styles.orderItem}>
                <View>
                  <Text style={styles.itemName}>{item.nombre}</Text>
                  <Text style={styles.itemArea}>
                    x{item.cantidad || 1} · {item.area}
                  </Text>
                </View>

                <Text style={styles.itemPrice}>
                  ${item.precio.toLocaleString("es-CO")}
                </Text>
                <View style={styles.itemActions}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => actualizarCantidad(item.id, -1)}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => actualizarCantidad(item.id, 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => eliminarItem(item.id)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>
                ${totalPedido().toLocaleString("es-CO")}
              </Text>
            </View>

            <TouchableOpacity style={styles.sendBtn} onPress={enviarPedido}>
              <Text style={styles.sendBtnText}>ENVIAR A COCINA / BAR</Text>
            </TouchableOpacity>
            {mesaSeleccionada.estado === "Listo" && (
            <TouchableOpacity style={styles.freeBtn} onPress={liberarMesa}>
              <Text style={styles.freeBtnText}>LIBERAR MESA</Text>
            </TouchableOpacity>
            )}
            <View style={styles.dropdown}>
              {productos.map((producto) => (
                <TouchableOpacity
                  key={producto.id}
                  style={[
                    styles.dropdownItem,
                    productoSeleccionado?.id === producto.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => setProductoSeleccionado(producto)}
                >
                  <Text style={styles.dropdownText}>
                    {producto.nombre} - ${producto.precio.toLocaleString("es-CO")}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={agregarItem}>
              <Text style={styles.addBtnText}>+ Agregar ítem al pedido</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>ESTADO DEL PEDIDO</Text>

          <View style={styles.statusCard}>
            <View>
              <Text style={styles.itemName}>Patacón pisao x2</Text>
              <Text style={styles.itemArea}>Cocina</Text>
            </View>
            <View style={styles.preparingPill}>
              <Text style={styles.preparingText}>Preparando</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View>
              <Text style={styles.itemName}>Michelada x3</Text>
              <Text style={styles.itemArea}>Bar</Text>
            </View>
            <View style={styles.readyPill}>
              <Text style={styles.readyText}>Listo</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => setVista("mesas")}>
            <Text style={styles.navText}>MES{"\n"}Mesas</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={[styles.navText, styles.navActive]}>PED{"\n"}Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={cargarHistorial}>
            <Text style={styles.navText}>HIS{"\n"}Historial</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (vista === "historial") {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>
            Historial, <Text style={styles.userNameText}>{nombreUsuario}</Text>
          </Text>
          <Text style={styles.userEmailText}>
            {user?.email || "mesero@lapampa.com"}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>× Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.sectionTitle}>HISTORIAL DE PEDIDOS</Text>

        {historialPedidos.length === 0 ? (
          <Text style={styles.itemArea}>No hay pedidos registrados.</Text>
        ) : (
          historialPedidos.map((pedido) => (
            <View key={pedido.id} style={styles.orderCard}>
              <Text style={styles.orderTitle}>
                Mesa {pedido.mesaId} · {pedido.estado}
              </Text>

              <Text style={styles.itemArea}>
                Mesero: {pedido.meseroNombre}
              </Text>

              <Text style={styles.itemArea}>
                Productos: {pedido.productos?.length || 0}
              </Text>

              <Text style={styles.totalValue}>
                ${pedido.total?.toLocaleString("es-CO")}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setVista("mesas")}>
          <Text style={styles.navText}>MES{"\n"}Mesas</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.navText}>PED{"\n"}Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={cargarHistorial}>
          <Text style={styles.navText}>HIS{"\n"}Historial</Text>
        </TouchableOpacity>
              </View>
            </View>
  );
}

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
         <Text style={styles.greetingText}>
            Mesero, <Text style={styles.userNameText}>{nombreUsuario}</Text>
        </Text>
        <Text style={styles.userEmailText}>
          {user?.email || "mesero@lapampa.com"}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>× Salir</Text>
      </TouchableOpacity>
    </View>

      <ScrollView style={styles.body}>
        <Text style={styles.sectionTitle}>SALÓN PRINCIPAL</Text>

        <View style={styles.grid}>
          {mesas.map((mesa) => (
            <TouchableOpacity
              key={mesa.id}
              style={[
                styles.tableCard,
                mesa.estado === "Libre" && styles.tableFree,
                mesa.estado === "En pedido" && styles.tableBusy,
                mesa.estado === "Listo" && styles.tableReady,
              ]}
              onPress={() => abrirMesa(mesa)}
            >
              <Text
                style={[
                  styles.tableName,
                  mesa.estado === "En pedido" && styles.tableNameBusy,
                ]}
              >
                {mesa.nombre}
              </Text>

              <View
                style={[
                  styles.tablePill,
                  mesa.estado === "En pedido" && styles.tablePillBusy,
                  mesa.estado === "Listo" && styles.tablePillReady,
                ]}
              >
                <Text style={styles.tablePillText}>{mesa.estado}</Text>
              </View>

              <Text
                style={[
                  styles.capacity,
                  mesa.estado === "En pedido" && styles.capacityBusy,
                ]}
              >
                Cap. {mesa.capacidad}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#F6E9BD" }]} />
            <Text style={styles.legendText}>Libre</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#1C0D03" }]} />
            <Text style={styles.legendText}>En pedido</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#E8A020" }]} />
            <Text style={styles.legendText}>Listo</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Text style={[styles.navText, styles.navActive]}>MES{"\n"}Mesas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (mesaSeleccionada) setVista("pedido");
            else Alert.alert("Selecciona una mesa", "Primero elige una mesa.");
          }}
        >
          <Text style={styles.navText}>PED{"\n"}Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={cargarHistorial}>
          <Text style={styles.navText}>HIS{"\n"}Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const DARK = "#1C0D03";
const GOLD = "#E8A020";
const CREAM = "#FDF6E3";
const BORDER = "#E4A51C";
const BROWN = "#5C3300";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },
topBar: {
  backgroundColor: DARK,
  paddingTop: 46,
  paddingBottom: 22,
  paddingHorizontal: 22,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottomWidth: 1,
  borderBottomColor: "#3A1F08",
},

greetingText: {
  color: "#B8770A",
  fontSize: 20,
},

userNameText: {
  color: GOLD,
  fontSize: 25,
  fontWeight: "bold",
},

userEmailText: {
  color: "#B8770A",
  fontSize: 11,
  marginTop: 4,
},

logoutButton: {
  borderWidth: 1.5,
  borderColor: "#8A4F0A",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 10,
},

logoutButtonText: {
  color: GOLD,
  fontSize: 16,
  fontWeight: "bold",
},
  logoCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: DARK,
    fontWeight: "bold",
  },
  topInfo: {
    flex: 1,
  },
  topTitle: {
    color: GOLD,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  topSub: {
    color: "#B8770A",
    fontSize: 11,
  },
  statusPill: {
    backgroundColor: GOLD,
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
  },
  statusPillText: {
    color: DARK,
    fontWeight: "bold",
    fontSize: 12,
  },
  body: {
    flex: 1,
    backgroundColor: CREAM,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionTitle: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 2,
    marginBottom: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tableCard: {
    width: "30.8%",
    height: 90,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  tableFree: {
    backgroundColor: "#FFF9E9",
  },
  tableBusy: {
    backgroundColor: DARK,
  },
  tableReady: {
    backgroundColor: "#FFF9E9",
  },
  tableName: {
    color: GOLD,
    fontSize: 20,
    fontWeight: "bold",
  },
  tableNameBusy: {
    color: GOLD,
  },
  tablePill: {
    backgroundColor: "#F6E9BD",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    marginVertical: 5,
  },
  tablePillBusy: {
    backgroundColor: GOLD,
  },
  tablePillReady: {
    backgroundColor: GOLD,
  },
  tablePillText: {
    fontSize: 9,
    color: BROWN,
    fontWeight: "bold",
  },
  capacity: {
    color: BROWN,
    fontSize: 10,
    fontWeight: "bold",
  },
  capacityBusy: {
    color: GOLD,
  },
  legend: {
    flexDirection: "row",
    marginTop: 18,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  legendText: {
    color: BROWN,
    fontSize: 11,
    fontWeight: "bold",
  },
  orderCard: {
    backgroundColor: "#FFF9E9",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitle: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 17,
  },
  timePill: {
    backgroundColor: "#F6E9BD",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  timePillText: {
    color: GOLD,
    fontSize: 10,
    fontWeight: "bold",
  },
  orderItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6BC54",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemName: {
    color: BROWN,
    fontSize: 14,
    fontWeight: "bold",
  },
  itemArea: {
    color: "#9A6A15",
    fontSize: 11,
    marginTop: 2,
  },
  itemPrice: {
    color: BROWN,
    fontWeight: "bold",
    fontSize: 14,
  },
  totalRow: {
    marginTop: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: BROWN,
    fontSize: 17,
    fontWeight: "bold",
  },
  totalValue: {
    color: DARK,
    fontSize: 20,
    fontWeight: "bold",
  },
  sendBtn: {
    backgroundColor: DARK,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  sendBtnText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addBtnText: {
    color: BROWN,
    fontWeight: "bold",
  },
  statusCard: {
    backgroundColor: "#FFF9E9",
    borderWidth: 1.2,
    borderColor: "#E6BC54",
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preparingPill: {
    backgroundColor: "#F6E9BD",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  preparingText: {
    color: "#A66A00",
    fontSize: 11,
    fontWeight: "bold",
  },
  readyPill: {
    backgroundColor: "#DFFFD8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  readyText: {
    color: "#3DAA35",
    fontSize: 11,
    fontWeight: "bold",
  },
  bottomNav: {
    height: 72,
    backgroundColor: DARK,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2C1607",
  },
  navText: {
    color: "#6A3B08",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  navActive: {
    color: GOLD,
  },
  itemActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  marginTop: 6,
},

qtyButton: {
  borderWidth: 1,
  borderColor: BORDER,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 4,
},

qtyButtonText: {
  color: BROWN,
  fontWeight: "bold",
},

deleteButton: {
  borderWidth: 1,
  borderColor: "#B00020",
  borderRadius: 8,
  paddingHorizontal: 8,
  paddingVertical: 4,
},

deleteButtonText: {
  color: "#B00020",
  fontWeight: "bold",
  fontSize: 11,
},
dropdown: {
  marginBottom: 10,
  borderWidth: 1,
  borderColor: BORDER,
  borderRadius: 10,
  padding: 8,
},

dropdownItem: {
  paddingVertical: 6,
},

dropdownItemActive: {
  backgroundColor: "#F6E9BD",
  borderRadius: 6,
},

dropdownText: {
  color: BROWN,
  fontSize: 12,
},
freeBtn: {
  backgroundColor: GOLD,
  paddingVertical: 15,
  borderRadius: 10,
  alignItems: "center",
  marginBottom: 10,
},

freeBtnText: {
  color: DARK,
  fontSize: 16,
  fontWeight: "bold",
  letterSpacing: 2,
},
});