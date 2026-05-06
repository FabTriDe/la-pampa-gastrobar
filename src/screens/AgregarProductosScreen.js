import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
import CloudinaryService from "../services/CloudinaryService";

const TIPOS = ["cocina", "bar", "bebidas", "postres"];

const Campo = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  editable,
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#BBA060"
      keyboardType={keyboardType || "default"}
      multiline={multiline || false}
      numberOfLines={multiline ? 3 : 1}
      editable={editable !== false}
      autoCorrect={false}
    />
  </View>
);

export default function AgregarProductosScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const productoExistente = route.params?.producto || null;
  const modoEdicion = !!productoExistente;

  const [form, setForm] = useState({
    nombre: productoExistente?.nombre || "",
    descripcion: productoExistente?.descripcion || "",
    precio: productoExistente?.precio?.toString() || "",
    tipo: productoExistente?.tipo || "cocina",
  });
  const [imagenUri, setImagenUri] = useState(productoExistente?.imagen || null);
  const [imagenBase64, setImagenBase64] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return false;
    }
    if (!form.descripcion.trim()) {
      Alert.alert("Error", "La descripción es obligatoria");
      return false;
    }
    if (
      !form.precio ||
      isNaN(Number(form.precio)) ||
      Number(form.precio) <= 0
    ) {
      Alert.alert("Error", "Ingresa un precio válido");
      return false;
    }
    return true;
  };

  const handleGaleria = async () => {
    const resultado = await CloudinaryService.seleccionarDeGaleria();
    if (!resultado) return;
    if (resultado.error) {
      Alert.alert("Permiso denegado", resultado.error);
      return;
    }
    setImagenUri(resultado.uri);
    setImagenBase64(resultado.base64);
  };

  const handleCamara = async () => {
    const resultado = await CloudinaryService.tomarFoto();
    if (!resultado) return;
    if (resultado.error) {
      Alert.alert("Permiso denegado", resultado.error);
      return;
    }
    setImagenUri(resultado.uri);
    setImagenBase64(resultado.base64);
  };

  const handleGuardar = async () => {
    if (!validate()) return;
    setGuardando(true);

    let urlImagen = productoExistente?.imagen || null;

    if (imagenBase64) {
      setSubiendoImagen(true);
      const resultadoUpload = await CloudinaryService.subirImagen(imagenBase64);
      setSubiendoImagen(false);

      if (!resultadoUpload.exito) {
        Alert.alert(
          "Error",
          "No se pudo subir la imagen. El producto se guardará sin imagen.",
        );
      } else {
        urlImagen = resultadoUpload.url;
      }
    }

    const datosProducto = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      tipo: form.tipo, // se guarda en minúscula: "cocina", "bar", etc.
      imagen: urlImagen,
      disponible: true,
    };

    let result;
    if (modoEdicion) {
      result = await MenuService.actualizarProducto(
        productoExistente.id,
        datosProducto,
      );
    } else {
      result = await MenuService.crearProducto(datosProducto);
    }

    setGuardando(false);

    if (result.exito) {
      Alert.alert(
        modoEdicion ? "Producto actualizado" : "Producto creado",
        modoEdicion
          ? `"${form.nombre}" fue actualizado correctamente.`
          : `"${form.nombre}" fue añadido al menú.`,
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } else {
      Alert.alert("Error", "No se pudo guardar el producto");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backArrow}
            >
              <Text style={styles.backArrowText}>←</Text>
            </TouchableOpacity>
            <View style={styles.topInfo}>
              <Text style={styles.topTitle}>
                {modoEdicion ? "EDITAR PRODUCTO" : "AÑADIR PRODUCTO"}
              </Text>
              <Text style={styles.topSubtitle}>Panel Administrador</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.sectionLabel}>IMAGEN</Text>

            <View style={styles.imagenPreview}>
              {imagenUri ? (
                <Image
                  source={{ uri: imagenUri }}
                  style={styles.imagenPreviewImg}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagenPlaceholder}>
                  <Text style={styles.imagenPlaceholderIcon}>🖼️</Text>
                  <Text style={styles.imagenPlaceholderText}>Sin imagen</Text>
                </View>
              )}
            </View>

            <View style={styles.imagenBtns}>
              <TouchableOpacity
                style={styles.imagenBtn}
                onPress={handleGaleria}
                disabled={guardando}
              >
                <Text style={styles.imagenBtnIcon}>🖼️</Text>
                <Text style={styles.imagenBtnText}>
                  Seleccionar{"\n"}de galería
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagenBtn}
                onPress={handleCamara}
                disabled={guardando}
              >
                <Text style={styles.imagenBtnIcon}>📷</Text>
                <Text style={styles.imagenBtnText}>Tomar{"\n"}foto</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>DATOS DEL PRODUCTO</Text>

            <Campo
              label="NOMBRE"
              value={form.nombre}
              onChangeText={(v) => updateField("nombre", v)}
              placeholder="Ej: Patacón pisao"
              editable={!guardando}
            />
            <Campo
              label="DESCRIPCIÓN"
              value={form.descripcion}
              onChangeText={(v) => updateField("descripcion", v)}
              placeholder="Ej: Con hogao, chicharrón y ají"
              multiline
              editable={!guardando}
            />
            <Campo
              label="PRECIO (COP)"
              value={form.precio}
              onChangeText={(v) => updateField("precio", v)}
              placeholder="Ej: 28000"
              keyboardType="numeric"
              editable={!guardando}
            />

            <Text style={styles.sectionLabel}>TIPO</Text>
            <View style={styles.tiposGrid}>
              {TIPOS.map((tipo) => (
                <TouchableOpacity
                  key={tipo}
                  style={[
                    styles.tipoOpt,
                    form.tipo === tipo && styles.tipoOptActive,
                  ]}
                  onPress={() => updateField("tipo", tipo)}
                  disabled={guardando}
                >
                  <Text
                    style={[
                      styles.tipoOptText,
                      form.tipo === tipo && styles.tipoOptTextActive,
                    ]}
                  >
                    {tipo.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, guardando && { opacity: 0.6 }]}
              onPress={handleGuardar}
              disabled={guardando}
              activeOpacity={0.8}
            >
              {guardando ? (
                <View style={styles.saveBtnLoading}>
                  <ActivityIndicator color={COLORS.primary} size="small" />
                  <Text style={styles.saveBtnText}>
                    {subiendoImagen ? "SUBIENDO IMAGEN..." : "GUARDANDO..."}
                  </Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>
                  {modoEdicion ? "GUARDAR CAMBIOS" : "AÑADIR AL MENÚ"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF6E3" },
  scrollContent: { flexGrow: 1 },

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
  topInfo: {},
  topTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1.5,
  },
  topSubtitle: { fontSize: 9, color: "#BBA060" },

  content: { padding: 16, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1.5,
    marginTop: 8,
  },

  imagenPreview: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F6E9BD",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  imagenPreviewImg: { width: "100%", height: "100%" },
  imagenPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  imagenPlaceholderIcon: { fontSize: 40 },
  imagenPlaceholderText: { fontSize: 12, color: "#5C3300" },

  imagenBtns: { flexDirection: "row", gap: 10 },
  imagenBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    gap: 6,
  },
  imagenBtnIcon: { fontSize: 24 },
  imagenBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    textAlign: "center",
    lineHeight: 16,
  },

  fieldGroup: { gap: 5 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1,
  },
  fieldInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#1C0D03",
  },
  fieldInputMultiline: { height: 80, textAlignVertical: "top" },

  tiposGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tipoOpt: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  tipoOptActive: { backgroundColor: "#E8A020", borderColor: "#E8A020" },
  tipoOptText: { fontSize: 12, fontWeight: "600", color: "#5C3300" },
  tipoOptTextActive: { color: "#1C0D03" },

  saveBtn: {
    backgroundColor: "#1C0D03",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnLoading: { flexDirection: "row", gap: 10, alignItems: "center" },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 2,
  },
});
