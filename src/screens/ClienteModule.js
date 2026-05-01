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

export default function ClienteModule({ navigation, route }) {
  const [user] = useState(route.params?.user || null);
  const [activeTab, setActiveTab] = useState("menu");

  const [menuItems] = useState([
    {
      id: "1",
      nombre: "Arepa Reina Pepiada",
      precio: "$8.500",
      categoria: "Arepas",
    },
    {
      id: "2",
      nombre: "Bandeja Paisa",
      precio: "$12.000",
      categoria: "Platos",
    },
    { id: "3", nombre: "Ceviche", precio: "$14.000", categoria: "Mar" },
    {
      id: "4",
      nombre: "Lomo al Trapo",
      precio: "$28.000",
      categoria: "Carnes",
    },
  ]);

  const [pedidos] = useState([
    {
      id: "1",
      fecha: "15 Abr",
      items: 2,
      total: "$22.500",
      estado: "completado",
    },
    {
      id: "2",
      fecha: "12 Abr",
      items: 3,
      total: "$35.000",
      estado: "completado",
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

  const RenderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItemCard}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.nombre}</Text>
        <Text style={styles.menuItemCategory}>{item.categoria}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.precio}</Text>
      </View>
    </TouchableOpacity>
  );

  const RenderPedido = ({ item }) => (
    <TouchableOpacity style={styles.pedidoCard}>
      <View style={styles.pedidoInfo}>
        <Text style={styles.pedidoDate}>{item.fecha}</Text>
        <Text style={styles.pedidoItems}>{item.items} artículos</Text>
      </View>
      <View style={styles.pedidoRight}>
        <Text style={styles.pedidoTotal}>{item.total}</Text>
        <View style={styles.pedidoEstado}>
          <Text style={styles.pedidoEstadoText}>
            {item.estado.toUpperCase()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerSubtitle}>Cliente</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Bienvenido, Cliente</Text>
          <Text style={styles.userEmail}>
            {user?.email || "cliente@lapampa.com"}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "menu" && styles.tabActive]}
          onPress={() => setActiveTab("menu")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "menu" && styles.tabTextActive,
            ]}
          >
            📋 Menú
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pedidos" && styles.tabActive]}
          onPress={() => setActiveTab("pedidos")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pedidos" && styles.tabTextActive,
            ]}
          >
            📦 Mis Pedidos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "menu" ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nuestro Menú</Text>
            <FlatList
              data={menuItems}
              renderItem={({ item }) => <RenderMenuItem item={item} />}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
            <TouchableOpacity style={styles.orderBtn}>
              <Text style={styles.orderBtnText}>🛒 Hacer Pedido</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis Pedidos</Text>
            {pedidos.length > 0 ? (
              <FlatList
                data={pedidos}
                renderItem={({ item }) => <RenderPedido item={item} />}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📭</Text>
                <Text style={styles.emptyStateText}>Sin pedidos aún</Text>
              </View>
            )}
          </View>
        )}

        {/* Additional info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Más Opciones</Text>
          <TouchableOpacity style={styles.optionCard}>
            <Text style={styles.optionIcon}>⭐</Text>
            <Text style={styles.optionText}>Dejar Reseña</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Text style={styles.optionIcon}>🎯</Text>
            <Text style={styles.optionText}>Promociones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard}>
            <Text style={styles.optionIcon}>💬</Text>
            <Text style={styles.optionText}>Contactar Soporte</Text>
          </TouchableOpacity>
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
    marginBottom: SPACING.MD,
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.SM,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLabel,
  },
  tabTextActive: {
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  section: {
    marginBottom: SPACING.LG,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.MD,
    letterSpacing: 1,
  },
  menuItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textBrown,
  },
  menuItemCategory: {
    fontSize: 11,
    color: COLORS.textLabel,
    marginTop: 2,
  },
  priceContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.SM,
  },
  price: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: SPACING.MD,
  },
  orderBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  pedidoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pedidoInfo: {
    flex: 1,
  },
  pedidoDate: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textBrown,
  },
  pedidoItems: {
    fontSize: 11,
    color: COLORS.textLabel,
    marginTop: 2,
  },
  pedidoRight: {
    alignItems: "flex-end",
    gap: SPACING.SM,
  },
  pedidoTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  pedidoEstado: {
    backgroundColor: "#2ECC71",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pedidoEstadoText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.LG,
    alignItems: "center",
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: SPACING.MD,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textLabel,
  },
  optionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    marginBottom: SPACING.SM,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.MD,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textBrown,
  },
});
