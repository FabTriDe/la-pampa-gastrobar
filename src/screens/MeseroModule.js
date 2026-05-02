import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS } from "../theme";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const productosBase = [
  { id: "1", nombre: "Patacón pisao", area: "Cocina", precio: 28000 },
  { id: "2", nombre: "Chuleta de cerdo", area: "Cocina", precio: 32000 },
  { id: "3", nombre: "Michelada", area: "Bar", precio: 15000 },
  { id: "4", nombre: "Lulada", area: "Bar", precio: 12000 },
];

export default function MeseroModuleScreen({ navigation }) {
  const [vista, setVista] = useState("mesas");
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

const handleLogout = () => {
  signOut(auth)
    .then(() => {
      navigation.replace("Login"); 
    })
    .catch((error) => {
      Alert.alert("Error", error.message);
    });
};

  const [mesas, setMesas] = useState([
    { id: 1, nombre: "M1", estado: "Libre", capacidad: 4, pedido: [] },
    { id: 2, nombre: "M2", estado: "En pedido", capacidad: 2, pedido: [] },
    { id: 3, nombre: "M3", estado: "Listo", capacidad: 4, pedido: [] },
    { id: 4, nombre: "M4", estado: "En pedido", capacidad: 6, pedido: productosBase },
    { id: 5, nombre: "M5", estado: "Libre", capacidad: 2, pedido: [] },
    { id: 6, nombre: "M6", estado: "Libre", capacidad: 4, pedido: [] },
    { id: 7, nombre: "M7", estado: "En pedido", capacidad: 8, pedido: [] },
    { id: 8, nombre: "M8", estado: "Listo", capacidad: 4, pedido: [] },
    { id: 9, nombre: "M9", estado: "Libre", capacidad: 2, pedido: [] },
  ]);

  const abrirMesa = (mesa) => {
    setMesaSeleccionada(mesa);
    setVista("pedido");
  };

  const totalPedido = () => {
    if (!mesaSeleccionada) return 0;
    return mesaSeleccionada.pedido.reduce((total, item) => total + item.precio, 0);
  };

  const agregarItem = () => {
    if (!mesaSeleccionada) return;

    const nuevoProducto = {
      id: Date.now().toString(),
      nombre: "Nuevo producto",
      area: "Cocina",
      precio: 18000,
    };

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

  const enviarPedido = () => {
    if (!mesaSeleccionada || mesaSeleccionada.pedido.length === 0) {
      Alert.alert("Pedido vacío", "Agrega productos antes de enviar.");
      return;
    }

    Alert.alert(
      "Pedido enviado",
      "La orden fue enviada correctamente a cocina/bar."
    );
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
                    x{index === 2 ? 3 : index === 0 ? 2 : 1} · {item.area}
                  </Text>
                </View>

                <Text style={styles.itemPrice}>
                  ${item.precio.toLocaleString("es-CO")}
                </Text>
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

          <TouchableOpacity>
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

        <TouchableOpacity>
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
});