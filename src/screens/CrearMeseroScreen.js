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
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS, BORDER_RADIUS } from "../theme";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db, firebaseConfig } from "../config/firebaseConfig";

const getSecondaryAuth = () => {
  const existing = getApps().find((a) => a.name === "Secondary");
  const secondaryApp = existing || initializeApp(firebaseConfig, "Secondary");
  return getAuth(secondaryApp);
};

// ─── Field fuera del componente para evitar pérdida de focus ───
const Field = ({
  label,
  field,
  placeholder,
  keyboardType,
  autoCapitalize,
  right,
  value,
  onChangeText,
  error,
  editable,
}) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.fieldInput, error && styles.fieldInputError]}>
      <View style={styles.fieldIcon} />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textPlaceholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || "default"}
        autoCapitalize={autoCapitalize || "sentences"}
        autoCorrect={false}
        editable={editable}
      />
      {right}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

export default function CrearMeseroScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) {
      e.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Correo no válido";
    }
    if (!form.telefono.trim()) e.telefono = "El teléfono es obligatorio";
    if (!form.password) {
      e.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      e.password = "Mínimo 6 caracteres";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const secondaryAuth = getSecondaryAuth();

      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        form.email,
        form.password,
      );

      await setDoc(doc(db, "usuarios", credential.user.uid), {
        id: credential.user.uid,
        nombre: form.nombre,
        correo: form.email,
        telefono: form.telefono,
        rol: "mesero",
        activo: true,
        creadoEn: Timestamp.now(),
      });

      await secondaryAuth.signOut();

      Alert.alert(
        "Mesero creado",
        `Cuenta de ${form.nombre} creada.\n\nCorreo: ${form.email}\nContraseña: ${form.password}\n\nComparte estos datos con el mesero.`,
        [
          {
            text: "Crear otro",
            onPress: () =>
              setForm({ nombre: "", email: "", telefono: "", password: "" }),
          },
          { text: "Volver al panel", onPress: () => navigation.goBack() },
        ],
      );
    } catch (error) {
      let msg = "Error al crear la cuenta";
      if (error.code === "auth/email-already-in-use")
        msg = "Ya existe una cuenta con este correo";
      else if (error.code === "auth/invalid-email") msg = "Correo no válido";
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let pwd = "";
    for (let i = 0; i < 8; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    updateField("password", pwd);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <KeyboardAvoidingView
        style={styles.flex}
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
              <Text style={styles.topTitle}>CREAR MESERO</Text>
              <Text style={styles.topSubtitle}>Panel Administrador</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.infoCard}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                El mesero recibirá estas credenciales para iniciar sesión en la
                app. Asegúrate de compartirlas de forma segura.
              </Text>
            </View>

            <Text style={styles.sectionLabel}>DATOS DEL MESERO</Text>

            <Field
              label="NOMBRE COMPLETO"
              field="nombre"
              placeholder="Ej: Diana Dorado"
              autoCapitalize="words"
              value={form.nombre}
              onChangeText={(v) => updateField("nombre", v)}
              error={errors.nombre}
              editable={!isLoading}
            />
            <Field
              label="CORREO ELECTRÓNICO"
              field="email"
              placeholder="mesero@lapampa.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              error={errors.email}
              editable={!isLoading}
            />
            <Field
              label="TELÉFONO"
              field="telefono"
              placeholder="300 123 4567"
              keyboardType="phone-pad"
              value={form.telefono}
              onChangeText={(v) => updateField("telefono", v)}
              error={errors.telefono}
              editable={!isLoading}
            />

            <Text style={styles.sectionLabel}>CREDENCIALES DE ACCESO</Text>

            <Field
              label="CONTRASEÑA INICIAL"
              field="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChangeText={(v) => updateField("password", v)}
              error={errors.password}
              editable={!isLoading}
              right={
                <TouchableOpacity
                  onPress={generatePassword}
                  style={styles.genBtn}
                >
                  <Text style={styles.genBtnText}>Generar</Text>
                </TouchableOpacity>
              }
            />

            {form.password.length > 0 && (
              <View style={styles.passwordPreview}>
                <Text style={styles.passwordPreviewLabel}>Contraseña:</Text>
                <Text style={styles.passwordPreviewValue}>{form.password}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.createBtn, isLoading && styles.createBtnDisabled]}
              onPress={handleCreate}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Text style={styles.createBtnText}>CREAR CUENTA DE MESERO</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface, paddingBottom: 8 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  topBar: {
    backgroundColor: COLORS.backgroundDark,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  backArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundAccent,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrowText: { fontSize: 18, color: COLORS.primary, fontWeight: "700" },
  topInfo: {},
  topTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  topSubtitle: { fontSize: 9, color: COLORS.primaryBorder },
  content: { flex: 1, padding: 16, gap: 12 },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceGold,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    gap: 8,
    alignItems: "flex-start",
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 3,
  },
  infoText: { flex: 1, fontSize: 11, color: COLORS.textLabel, lineHeight: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textBrown,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  fieldGroup: { gap: 3 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.textLabel,
    letterSpacing: 1,
  },
  fieldInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceWhite,
    borderWidth: 1.5,
    borderColor: COLORS.primaryInput,
    borderRadius: 7,
    paddingHorizontal: 10,
    height: 42,
    gap: 7,
  },
  fieldInputError: { borderColor: COLORS.error },
  fieldIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  textInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    paddingVertical: 0,
  },
  errorText: { fontSize: 9, color: COLORS.error, marginLeft: 4 },
  genBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  genBtnText: { fontSize: 10, fontWeight: "700", color: COLORS.textInactive },
  passwordPreview: {
    flexDirection: "row",
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    alignItems: "center",
    gap: 8,
  },
  passwordPreviewLabel: {
    fontSize: 10,
    color: COLORS.primaryBorder,
    fontWeight: "600",
  },
  passwordPreviewValue: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
    letterSpacing: 1,
  },
  createBtn: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 8,
  },
  createBtnDisabled: { opacity: 0.6 },
  createBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 2,
  },
});
