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

export default function AdminDashboard({ navigation, route }) {
  const [user] = useState(route.params?.user || null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  const adminOptions = [
    {
      id: 1,
      title: "Crear Mesero",
      icon: "👤",
      action: () => navigation.navigate("CrearMesero"),
    },
    {
      id: 2,
      title: "Gestionar Meseros",
      icon: "👥",
      action: () => Alert.alert("En desarrollo"),
    },
    {
      id: 3,
      title: "Reportes",
      icon: "📊",
      action: () => Alert.alert("En desarrollo"),
    },
    {
      id: 4,
      title: "Configuración",
      icon: "⚙️",
      action: () => Alert.alert("En desarrollo"),
    },
  ];

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
          <Text style={styles.headerSubtitle}>Panel de Administrador</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* User info */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👨‍💼</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Bienvenido, Admin</Text>
          <Text style={styles.userEmail}>
            {user?.email || "email@lapampa.com"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Día</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Pedidos Hoy</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Meseros</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>$45.2K</Text>
              <Text style={styles.statLabel}>Ventas Hoy</Text>
            </View>
          </View>
        </View>

        {/* Admin Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión</Text>
          {adminOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={option.action}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          ))}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: SPACING.MD,
    letterSpacing: 1,
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
    fontSize: 24,
  },
  optionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textBrown,
  },
  arrow: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
});
