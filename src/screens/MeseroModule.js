import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  FlatList,
} from "react-native";
import { COLORS, BORDER_RADIUS, SPACING } from "../theme";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

export default function MeseroModule({ navigation, route }) {
  const [user] = useState(route.params?.user || null);
  const [activeTab, setActiveTab] = useState("pedidos");

  const [pedidos] = useState([
    {
      id: "1",
      mesa: "01",
      cliente: "Juan García",
      items: 3,
      estado: "pendiente",
    },
    {
      id: "2",
      mesa: "05",
      cliente: "María López",
      items: 2,
      estado: "preparando",
    },
    {
      id: "3",
      mesa: "12",
      cliente: "Carlos Rodríguez",
      items: 4,
      estado: "listo",
    },
  ]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  const RenderPedido = ({ item }) => (
    <TouchableOpacity style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.mesaNumber}>Mesa {item.mesa}</Text>
        <View
          style={[
            styles.estado,
            { backgroundColor: getEstadoColor(item.estado) },
          ]}
        >
          <Text style={styles.estadoText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.clienteName}>{item.cliente}</Text>
      <Text style={styles.itemsCount}>{item.items} artículos</Text>
    </TouchableOpacity>
  );

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "#E8A020";
      case "preparando":
        return "#3498DB";
      case "listo":
        return "#2ECC71";
      default:
        return COLORS.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>LA PAMPA</Text>
          <Text style={styles.headerSubtitle}>Módulo Mesero</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🤵</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Bienvenido, Mesero</Text>
          <Text style={styles.userEmail}>
            {user?.email || "mesero@lapampa.com"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Turno</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Mesas Activas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pedidos Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$2.8K</Text>
              <Text style={styles.statLabel}>Propinas</Text>
            </View>
          </View>
        </View>

        {/* Pedidos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pedidos Activos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={pedidos}
            renderItem={({ item }) => <RenderPedido item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={styles.actionText}>Nuevo Pedido</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionText}>Registrar Propina</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>🔔</Text>
              <Text style={styles.actionText}>Notificaciones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Preferencias</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.LG,
    paddingTop: SPACING.MD,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textDark,
    marginTop: 4,
    opacity: 0.8,
  },
  logoutBtn: {
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.MD,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.MD,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textBrown,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textLabel,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLabel,
    marginTop: 4,
    textAlign: "center",
  },
  pedidoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  mesaNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textBrown,
  },
  estado: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  clienteName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textBrown,
  },
  itemsCount: {
    fontSize: 11,
    color: COLORS.textLabel,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  actionBtn: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: SPACING.SM,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textBrown,
    textAlign: "center",
  },
});
