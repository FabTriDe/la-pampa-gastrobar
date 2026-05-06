import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "../theme";
import MenuService from "../services/MenuService";

const TIPOS = ["todos", "cocina", "bar", "bebidas", "postres"];

export default function GestionarMenuScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipoActivo, setTipoActivo] = useState("todos");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargarProductos);
    return unsubscribe;
  }, [navigation]);

  const cargarProductos = async () => {
    setLoading(true);
    const result = await MenuService.obtenerProductos();
    if (result.exito) {
      setProductos(result.productos);
    } else {
      Alert.alert("Error", "No se pudieron cargar los productos");
    }
    setLoading(false);
  };

  const handleEliminar = (producto) => {
    Alert.alert(
      "Eliminar producto",
      `¿Eliminar "${producto.nombre}" del menú?\n\nEsta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const result = await MenuService.eliminarProducto(producto.id);
            if (result.exito) {
              setProductos((prev) => prev.filter((p) => p.id !== producto.id));
            } else {
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          },
        },
      ],
    );
  };

  const productosFiltrados =
    tipoActivo === "todos"
      ? productos
      : productos.filter((p) => p.tipo === tipoActivo);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />

      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>GESTIONAR MENÚ</Text>
          <Text style={styles.topSubtitle}>Panel Administrador</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AgregarProductosScreen")}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosContainer}
        contentContainerStyle={styles.filtrosList}
      >
        {TIPOS.map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[
              styles.filtroChip,
              tipoActivo === tipo && styles.filtroChipActive,
            ]}
            onPress={() => setTipoActivo(tipo)}
          >
            <Text
              style={[
                styles.filtroChipText,
                tipoActivo === tipo && styles.filtroChipTextActive,
              ]}
            >
              {tipo.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>
            {productosFiltrados.length} PRODUCTO
            {productosFiltrados.length !== 1 ? "S" : ""}
          </Text>

          {productosFiltrados.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyText}>
                {tipoActivo === "todos"
                  ? "No hay productos en el menú"
                  : `No hay productos en ${tipoActivo.toUpperCase()}`}
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate("AgregarProductosScreen")}
              >
                <Text style={styles.emptyBtnText}>AÑADIR PRIMER PRODUCTO</Text>
              </TouchableOpacity>
            </View>
          ) : (
            productosFiltrados.map((producto) => (
              <View key={producto.id} style={styles.productoCard}>
                <View style={styles.productoImgContainer}>
                  {producto.imagen ? (
                    <Image
                      source={{ uri: producto.imagen }}
                      style={styles.productoImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.productoImgPlaceholder}>
                      <Text style={styles.productoImgEmoji}>🍽️</Text>
                    </View>
                  )}
                </View>

                <View style={styles.productoInfo}>
                  <Text style={styles.productoNombre} numberOfLines={1}>
                    {producto.nombre}
                  </Text>
                  <Text style={styles.productoDesc} numberOfLines={2}>
                    {producto.descripcion}
                  </Text>
                  <View style={styles.productoMeta}>
                    <View style={styles.tipoBadge}>
                      <Text style={styles.tipoBadgeText}>
                        {producto.tipo?.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.productoPrecio}>
                      ${producto.precio?.toLocaleString("es-CO")}
                    </Text>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("AgregarProductosScreen", {
                        producto,
                      })
                    }
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEliminar(producto)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF6E3" },

  topBar: {
    backgroundColor: "#1C0D03",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#3a2010",
  },
  backArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2a1500",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowText: { fontSize: 18, color: "#E8A020", fontWeight: "700" },
  topTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1.5,
  },
  topSubtitle: { fontSize: 9, color: "#BBA060" },
  addBtn: {
    backgroundColor: "#E8A020",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnText: { fontSize: 11, fontWeight: "700", color: "#1C0D03" },

  filtrosContainer: {
    maxHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#E4D8B0",
    backgroundColor: "#FDF6E3",
  },
  filtrosList: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  filtroChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  filtroChipActive: { backgroundColor: "#E8A020", borderColor: "#E8A020" },
  filtroChipText: { fontSize: 12, fontWeight: "600", color: "#5C3300" },
  filtroChipTextActive: { color: "#1C0D03" },

  content: { flex: 1, padding: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  emptyState: { alignItems: "center", marginTop: 60, gap: 14 },
  emptyIcon: { fontSize: 52 },
  emptyText: { fontSize: 14, color: "#5C3300", textAlign: "center" },
  emptyBtn: {
    backgroundColor: "#E8A020",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 1,
  },

  productoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    overflow: "hidden",
  },
  productoImgContainer: { width: 80, height: 80 },
  productoImg: { width: "100%", height: "100%" },
  productoImgPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F6E9BD",
    justifyContent: "center",
    alignItems: "center",
  },
  productoImgEmoji: { fontSize: 28 },
  productoInfo: { flex: 1, padding: 10, gap: 3 },
  productoNombre: { fontSize: 13, fontWeight: "700", color: "#1C0D03" },
  productoDesc: { fontSize: 11, color: "#5C3300", lineHeight: 15 },
  productoMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 3,
  },
  tipoBadge: {
    backgroundColor: "#F6E9BD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tipoBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1,
  },
  productoPrecio: { fontSize: 13, fontWeight: "700", color: "#E8A020" },
  actions: { paddingHorizontal: 10, gap: 8, alignItems: "center" },
  actionBtn: { padding: 10 },
  actionBtnText: { fontSize: 20 },
});
