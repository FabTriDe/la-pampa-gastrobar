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
  Switch,
  Modal,
  TextInput,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "../theme";
import MeseroService from "../services/MeseroService";

export default function GestionarMeserosScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [meseros, setMeseros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [meseroEditando, setMeseroEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ nombre: "", telefono: "" });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", cargarMeseros);
    return unsubscribe;
  }, [navigation]);

  const cargarMeseros = async () => {
    setLoading(true);
    const result = await MeseroService.obtenerMeseros();
    if (result.exito) {
      setMeseros(result.meseros);
    } else {
      Alert.alert("Error", "No se pudieron cargar los meseros");
    }
    setLoading(false);
  };

  // ── Toggle activo/inactivo ─────────────────────────────────────────────
  const handleToggleActivo = async (mesero) => {
    const nuevoEstado = !mesero.activo;
    // Actualización optimista para respuesta inmediata en UI
    setMeseros((prev) =>
      prev.map((m) => (m.id === mesero.id ? { ...m, activo: nuevoEstado } : m)),
    );
    const result = await MeseroService.toggleActivo(mesero.id, nuevoEstado);
    if (!result.exito) {
      // Revertir si Firebase falló
      setMeseros((prev) =>
        prev.map((m) =>
          m.id === mesero.id ? { ...m, activo: mesero.activo } : m,
        ),
      );
      Alert.alert("Error", "No se pudo actualizar el estado");
    }
  };

  // ── Eliminar ───────────────────────────────────────────────────────────
  const handleEliminar = (mesero) => {
    Alert.alert(
      "Eliminar mesero",
      `¿Eliminar la cuenta de ${mesero.nombre}?\n\nNo podrá iniciar sesión. Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const result = await MeseroService.eliminarMesero(mesero.id);
            if (result.exito) {
              setMeseros((prev) => prev.filter((m) => m.id !== mesero.id));
            } else {
              Alert.alert("Error", "No se pudo eliminar el mesero");
            }
          },
        },
      ],
    );
  };

  // ── Abrir modal de edición ─────────────────────────────────────────────
  const abrirEdicion = (mesero) => {
    setMeseroEditando(mesero);
    setFormEdit({
      nombre: mesero.nombre || "",
      telefono: mesero.telefono || "",
    });
    setModalVisible(true);
  };

  // ── Guardar edición ────────────────────────────────────────────────────
  const handleGuardarEdicion = async () => {
    if (!formEdit.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    setGuardando(true);
    const result = await MeseroService.actualizarMesero(meseroEditando.id, {
      nombre: formEdit.nombre.trim(),
      telefono: formEdit.telefono.trim(),
    });
    setGuardando(false);

    if (result.exito) {
      setMeseros((prev) =>
        prev.map((m) =>
          m.id === meseroEditando.id
            ? {
                ...m,
                nombre: formEdit.nombre.trim(),
                telefono: formEdit.telefono.trim(),
              }
            : m,
        ),
      );
      setModalVisible(false);
      setMeseroEditando(null);
    } else {
      Alert.alert("Error", "No se pudo guardar los cambios");
    }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>GESTIONAR MESEROS</Text>
          <Text style={styles.topSubtitle}>Panel Administrador</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("CrearMesero")}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          style={{ marginTop: 40 }}
          size="large"
        />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>
            {meseros.length} MESERO{meseros.length !== 1 ? "S" : ""} REGISTRADO
            {meseros.length !== 1 ? "S" : ""}
          </Text>

          {meseros.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyText}>No hay meseros registrados</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate("CrearMesero")}
              >
                <Text style={styles.emptyBtnText}>CREAR PRIMER MESERO</Text>
              </TouchableOpacity>
            </View>
          ) : (
            meseros.map((mesero) => (
              <View key={mesero.id} style={styles.meseroCard}>
                {/* Avatar con inicial */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {mesero.nombre?.charAt(0)?.toUpperCase() || "?"}
                  </Text>
                </View>

                {/* Info — usa "correo" que es el campo real en Firestore */}
                <View style={styles.meseroInfo}>
                  <Text style={styles.meseroNombre}>{mesero.nombre}</Text>
                  <Text style={styles.meseroCorreo}>{mesero.correo}</Text>
                  {!!mesero.telefono && (
                    <Text style={styles.meseroTelefono}>
                      📞 {mesero.telefono}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.estadoBadge,
                      mesero.activo
                        ? styles.estadoActivo
                        : styles.estadoInactivo,
                    ]}
                  >
                    <Text style={styles.estadoText}>
                      {mesero.activo ? "● ACTIVO" : "● INACTIVO"}
                    </Text>
                  </View>
                </View>

                {/* Acciones */}
                <View style={styles.actions}>
                  <Switch
                    value={!!mesero.activo}
                    onValueChange={() => handleToggleActivo(mesero)}
                    trackColor={{
                      false: "#3a2010",
                      true: COLORS.primary + "88",
                    }}
                    thumbColor={mesero.activo ? COLORS.primary : "#888"}
                  />
                  <TouchableOpacity
                    onPress={() => abrirEdicion(mesero)}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionBtnText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEliminar(mesero)}
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

      {/* ── Modal de Edición ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>EDITAR MESERO</Text>
            {meseroEditando && (
              <Text style={styles.modalSubtitle}>{meseroEditando.correo}</Text>
            )}

            <Text style={styles.fieldLabel}>NOMBRE COMPLETO</Text>
            <TextInput
              style={styles.modalInput}
              value={formEdit.nombre}
              onChangeText={(v) => setFormEdit({ ...formEdit, nombre: v })}
              placeholder="Nombre del mesero"
              placeholderTextColor="#BBA060"
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>TELÉFONO</Text>
            <TextInput
              style={styles.modalInput}
              value={formEdit.telefono}
              onChangeText={(v) => setFormEdit({ ...formEdit, telefono: v })}
              placeholder="300 123 4567"
              placeholderTextColor="#BBA060"
              keyboardType="phone-pad"
            />

            <Text style={styles.modalNote}>
              El correo no se puede editar porque está vinculado a Firebase
              Auth.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={guardando}
              >
                <Text style={styles.modalCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, guardando && { opacity: 0.6 }]}
                onPress={handleGuardarEdicion}
                disabled={guardando}
              >
                {guardando ? (
                  <ActivityIndicator color="#1C0D03" size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>GUARDAR</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  emptyText: { fontSize: 14, color: "#5C3300" },
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

  meseroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8A020",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#1C0D03" },
  meseroInfo: { flex: 1, gap: 2 },
  meseroNombre: { fontSize: 13, fontWeight: "700", color: "#1C0D03" },
  meseroCorreo: { fontSize: 11, color: "#5C3300" },
  meseroTelefono: { fontSize: 11, color: "#5C3300" },
  estadoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 5,
  },
  estadoActivo: { backgroundColor: "#2ECC7133" },
  estadoInactivo: { backgroundColor: "#E74C3C33" },
  estadoText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 1,
  },
  actions: { alignItems: "center", gap: 8 },
  actionBtn: { padding: 10 },
  actionBtnText: { fontSize: 18 },

  // Modal — se mantiene oscuro porque es overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#2a1500",
    borderRadius: 14,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#3a2010",
    gap: 10,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1.5,
  },
  modalSubtitle: { fontSize: 11, color: "#BBA060", marginBottom: 4 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#BBA060",
    letterSpacing: 1,
  },
  modalInput: {
    backgroundColor: "#1a0a00",
    borderWidth: 1.5,
    borderColor: "#3a2010",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#FDF6E3",
    marginBottom: 4,
  },
  modalNote: {
    fontSize: 10,
    color: "#BBA06099",
    fontStyle: "italic",
    marginTop: -4,
  },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 8 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#1a0a00",
    borderWidth: 1,
    borderColor: "#3a2010",
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#BBA060",
    letterSpacing: 1,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#E8A020",
  },
  modalSaveText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 1,
  },
});
