import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { COLORS } from "../theme";
import ReporteService from "../services/ReporteService";
import PedidoService from "../services/PedidoService";
import PropinaService from "../services/PropinaService";
import MeseroService from "../services/MeseroService";

const DARK = "#1C0D03";
const GOLD = "#E8A020";
const CREAM = "#FDF6E3";
const BROWN = "#5C3300";

export default function AdminDashboard({ navigation, route }) {
  const user = auth.currentUser;
  const [nombreAdmin, setNombreAdmin] = useState("Admin");
  const [activeTab, setActiveTab] = useState("inicio");
  const [loadingStats, setLoadingStats] = useState(true);

  // Stats
  const [ventasHoy, setVentasHoy] = useState(0);
  const [gastosHoy, setGastosHoy] = useState(0);
  const [gananciaNeta, setGananciaNeta] = useState(0);
  const [totalPropinas, setTotalPropinas] = useState(0);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [totalMeseros, setTotalMeseros] = useState(0);

  // Fecha actual formateada
  const fechaHoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Cargar nombre del admin desde Firestore
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, "usuarios", user.uid))
      .then((snap) => {
        if (snap.exists()) {
          const nombre = snap.data().nombre || "Admin";
          // Mostrar solo primer nombre + inicial apellido
          const partes = nombre.trim().split(" ");
          const display =
            partes.length >= 2
              ? `${partes[0]} ${partes[1].charAt(0)}.`
              : partes[0];
          setNombreAdmin(display);
        }
      })
      .catch(() => {});
  }, [user]);

  // Cargar todos los stats del día
  const cargarStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const [reporte, propinaResult, meserosResult, pedidosResult] =
        await Promise.all([
          ReporteService.obtenerReporteDiario(new Date()),
          PropinaService.obtenerPropinasDia(),
          MeseroService.obtenerMeseros(),
          PedidoService.obtenerPedidosActivos(),
        ]);

      if (reporte.exito) {
        setVentasHoy(reporte.ventasTotal || 0);
        setGastosHoy(reporte.gastosTotal || 0);
        setGananciaNeta(reporte.gananciaNeta ?? reporte.ventasTotal ?? 0);
      }

      if (propinaResult.exito) {
        const total = propinaResult.propinas.reduce(
          (sum, p) => sum + (p.montoTotal || 0),
          0,
        );
        setTotalPropinas(total);
      }

      if (meserosResult.exito) {
        setTotalMeseros(meserosResult.meseros.length);
      }

      if (pedidosResult.exito) {
        // Ordenar por fecha más reciente y tomar los últimos 5
        const ordenados = pedidosResult.pedidos
          .sort((a, b) => {
            const ta = a.fechaCreacion?.toDate?.()?.getTime() || 0;
            const tb = b.fechaCreacion?.toDate?.()?.getTime() || 0;
            return tb - ta;
          })
          .slice(0, 5);
        setPedidosRecientes(ordenados);
      }
    } catch (e) {
      console.error("Error cargando stats:", e);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    cargarStats();
  }, [cargarStats]);

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace("Login");
          } catch {
            Alert.alert("Error", "No se pudo cerrar sesión");
          }
        },
      },
    ]);
  };

  // Formato de tiempo relativo
  const tiempoRelativo = (timestamp) => {
    if (!timestamp?.toDate) return "—";
    const diff = Math.floor(
      (Date.now() - timestamp.toDate().getTime()) / 60000,
    );
    if (diff < 1) return "Ahora";
    if (diff < 60) return `Hace ${diff} min`;
    return `Hace ${Math.floor(diff / 60)}h`;
  };

  const estadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "#9B59B6";
      case "preparando":
        return "#F39C12";
      case "listo":
        return "#27AE60";
      case "entregado":
        return "#2ECC71";
      default:
        return GOLD;
    }
  };

  const estadoLabel = (estado) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente";
      case "preparando":
        return "En cocina";
      case "listo":
        return "Listo";
      case "entregado":
        return "Entregado";
      default:
        return estado;
    }
  };

  const modulos = [
    {
      id: "ped",
      sigla: "PED",
      label: "Pedidos\nMesa",
      action: () =>
        Alert.alert("Próximamente", "Módulo de pedidos en desarrollo"),
    },
    {
      id: "dom",
      sigla: "DOM",
      label: "Domicilios",
      action: () =>
        Alert.alert("Próximamente", "Módulo de domicilios en desarrollo"),
    },
    {
      id: "rep",
      sigla: "REP",
      label: "Reportes",
      action: () => navigation.navigate("Reportes"),
    },
    {
      id: "gas",
      sigla: "GAS",
      label: "Gestión\nMenú",
      action: () => navigation.navigate("GestionarMenuScreen"),
    },
  ];

  const bottomNavItems = [
    { id: "inicio", sigla: "INI", label: "Inicio" },
    {
      id: "meseros",
      sigla: "MES",
      label: "Meseros",
      action: () => navigation.navigate("GestionarMeseros"),
    },
    {
      id: "reportes",
      sigla: "REP",
      label: "Reportes",
      action: () => navigation.navigate("Reportes"),
    },
    {
      id: "config",
      sigla: "CFG",
      label: "Config",
      action: () => Alert.alert("Próximamente"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor={DARK} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>LP</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>LA PAMPA</Text>
            <Text style={styles.headerSubtitle}>
              Administrador — {nombreAdmin}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>× Salir</Text>
        </TouchableOpacity>
      </View>

      {/* ── Fecha y turno ── */}
      <View style={styles.fechaBar}>
        <Text style={styles.fechaText}>{fechaHoy}</Text>
        <View style={styles.turnoPill}>
          <Text style={styles.turnoText}>Turno activo</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Resumen del Día ── */}
        <Text style={styles.sectionTitle}>RESUMEN DEL DÍA</Text>

        {loadingStats ? (
          <ActivityIndicator color={GOLD} style={{ marginVertical: 20 }} />
        ) : (
          <>
            {/* Fila 1: Ventas + Gastos */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.statCardDark]}>
                <Text style={styles.statCardLabelDark}>VENTAS HOY</Text>
                <Text style={styles.statCardValueDark}>
                  ${ventasHoy.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.statCardSub}>Pedidos entregados</Text>
              </View>
              <View style={[styles.statCard, styles.statCardLight]}>
                <Text style={styles.statCardLabel}>GASTOS</Text>
                <Text style={styles.statCardValue}>
                  ${gastosHoy.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.statCardSubLight}>Módulo pendiente</Text>
              </View>
            </View>

            {/* Fila 2: Ganancia + Propinas */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, styles.statCardLight]}>
                <Text style={styles.statCardLabel}>GANANCIA NETA</Text>
                <Text style={styles.statCardValue}>
                  ${gananciaNeta.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.statCardSubLight}>
                  {ventasHoy > 0
                    ? `${Math.round((gananciaNeta / ventasHoy) * 100)}% margen`
                    : "Sin ventas"}
                </Text>
              </View>
              <View style={[styles.statCard, styles.statCardLight]}>
                <Text style={styles.statCardLabel}>PROPINAS</Text>
                <Text style={styles.statCardValue}>
                  ${totalPropinas.toLocaleString("es-CO")}
                </Text>
                <Text style={styles.statCardSubLight}>
                  {totalMeseros} mesero{totalMeseros !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ── Módulos ── */}
        <Text style={styles.sectionTitle}>MÓDULOS</Text>
        <View style={styles.modulosGrid}>
          {modulos.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={styles.moduloCard}
              onPress={mod.action}
              activeOpacity={0.75}
            >
              <View style={styles.moduloIconBox}>
                <Text style={styles.moduloSigla}>{mod.sigla}</Text>
              </View>
              <Text style={styles.moduloLabel}>{mod.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Pedidos Recientes ── */}
        <Text style={styles.sectionTitle}>PEDIDOS RECIENTES</Text>

        {loadingStats ? (
          <ActivityIndicator color={GOLD} style={{ marginVertical: 10 }} />
        ) : pedidosRecientes.length === 0 ? (
          <View style={styles.emptyPedidos}>
            <Text style={styles.emptyPedidosText}>
              No hay pedidos activos en este momento
            </Text>
          </View>
        ) : (
          pedidosRecientes.map((pedido) => {
            const esMesa = !!pedido.mesaId;
            const sigla = esMesa ? `M${pedido.mesaId}` : "DOM";
            const titulo = esMesa
              ? `Mesa ${pedido.mesaId} — ${pedido.productos?.length || 0} ítems`
              : `Domicilio — ${pedido.productos?.length || 0} ítems`;
            const subtitulo = esMesa
              ? `${tiempoRelativo(pedido.fechaCreacion)} · Mesero: ${pedido.meseroNombre || "—"}`
              : `${tiempoRelativo(pedido.fechaCreacion)} · ${pedido.direccion || "—"}`;

            return (
              <View key={pedido.id} style={styles.pedidoCard}>
                <View
                  style={[
                    styles.pedidoSiglaBox,
                    esMesa
                      ? styles.pedidoSiglaBoxMesa
                      : styles.pedidoSiglaBoxDom,
                  ]}
                >
                  <Text style={styles.pedidoSigla}>{sigla}</Text>
                </View>
                <View style={styles.pedidoInfo}>
                  <Text style={styles.pedidoTitulo}>{titulo}</Text>
                  <Text style={styles.pedidoSub}>{subtitulo}</Text>
                </View>
                <View
                  style={[
                    styles.pedidoEstadoPill,
                    { backgroundColor: estadoColor(pedido.estado) + "22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.pedidoEstadoText,
                      { color: estadoColor(pedido.estado) },
                    ]}
                  >
                    {estadoLabel(pedido.estado)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── Bottom Nav ── */}
      <View style={styles.bottomNav}>
        {bottomNavItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => {
              if (item.action) {
                item.action();
              } else {
                setActiveTab(item.id);
              }
            }}
          >
            <Text
              style={[
                styles.navSigla,
                activeTab === item.id && styles.navSiglaActive,
              ]}
            >
              {item.sigla}
            </Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === item.id && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
            {activeTab === item.id && <View style={styles.navDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C0D03" },

  // Header — fondo oscuro
  header: {
    backgroundColor: DARK,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#3A1F08",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: DARK, fontWeight: "900", fontSize: 15, letterSpacing: 1 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: GOLD,
    letterSpacing: 1,
  },
  headerSubtitle: { fontSize: 11, color: "#BBA060", marginTop: 1 },

  // Botón salir — borde claro, texto claro, fondo igual al header
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: "#8A4F0A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  logoutText: {
    color: GOLD,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Fecha bar
  fechaBar: {
    backgroundColor: "#2a1500",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fechaText: { fontSize: 11, color: "#BBA060", textTransform: "capitalize" },
  turnoPill: {
    backgroundColor: GOLD + "22",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GOLD + "55",
  },
  turnoText: { fontSize: 10, fontWeight: "700", color: GOLD },

  scroll: { flex: 1, backgroundColor: CREAM },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: BROWN,
    letterSpacing: 2,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
  },
  statCardDark: { backgroundColor: DARK, borderColor: DARK },
  statCardLight: { backgroundColor: "#FFFFFF", borderColor: "#E4D8B0" },
  statCardLabelDark: {
    fontSize: 9,
    fontWeight: "800",
    color: "#BBA060",
    letterSpacing: 1.5,
  },
  statCardLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: BROWN,
    letterSpacing: 1.5,
  },
  statCardValueDark: {
    fontSize: 22,
    fontWeight: "900",
    color: GOLD,
    marginTop: 6,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: "900",
    color: DARK,
    marginTop: 6,
    marginBottom: 4,
  },
  statCardSub: { fontSize: 10, color: "#BBA060" },
  statCardSubLight: { fontSize: 10, color: "#9A7A40" },

  // Módulos
  modulosGrid: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 4,
  },
  moduloCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  moduloIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
  },
  moduloSigla: {
    fontSize: 14,
    fontWeight: "900",
    color: DARK,
    letterSpacing: 1,
  },
  moduloLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: BROWN,
    textAlign: "center",
    lineHeight: 14,
  },

  // Pedidos
  pedidoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  pedidoSiglaBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  pedidoSiglaBoxMesa: { backgroundColor: DARK },
  pedidoSiglaBoxDom: { backgroundColor: BROWN },
  pedidoSigla: {
    fontSize: 11,
    fontWeight: "900",
    color: GOLD,
    letterSpacing: 0.5,
  },
  pedidoInfo: { flex: 1 },
  pedidoTitulo: { fontSize: 13, fontWeight: "700", color: DARK },
  pedidoSub: { fontSize: 11, color: "#9A7A40", marginTop: 2 },
  pedidoEstadoPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pedidoEstadoText: { fontSize: 10, fontWeight: "700" },
  emptyPedidos: {
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    marginBottom: 16,
  },
  emptyPedidosText: { fontSize: 12, color: "#9A7A40", textAlign: "center" },

  // Bottom nav — sin position absolute, flujo normal
  bottomNav: {
    backgroundColor: DARK,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#2C1607",
    paddingVertical: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
    gap: 2,
  },
  navSigla: {
    fontSize: 11,
    fontWeight: "900",
    color: "#6A3B08",
    letterSpacing: 1,
  },
  navSiglaActive: { color: GOLD },
  navLabel: { fontSize: 9, color: "#6A3B08", fontWeight: "600" },
  navLabelActive: { color: GOLD },
  navDot: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: GOLD,
    marginTop: 2,
  },
});
