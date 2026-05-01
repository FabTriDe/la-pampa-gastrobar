import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { COLORS, BORDER_RADIUS } from "../theme";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default function RegisterClienteScreen({ navigation }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  // ─── Validación ───
  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) {
      e.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = "Ingresa un correo válido";
    }
    if (!form.telefono.trim()) {
      e.telefono = "El teléfono es obligatorio";
    } else if (form.telefono.replace(/\D/g, "").length < 10) {
      e.telefono = "Mínimo 10 dígitos";
    }
    if (!form.password) {
      e.password = "La contraseña es obligatoria";
    } else if (form.password.length < 6) {
      e.password = "Mínimo 6 caracteres";
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Las contraseñas no coinciden";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Registro ───
  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      const user = userCredential.user;

      // Actualizar el perfil con el nombre
      await updateProfile(user, {
        displayName: form.nombre,
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        id: user.uid,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        rol: "cliente",
        fechaCreacion: new Date(),
        activo: true,
      });

      Alert.alert("Cuenta creada", "Ya puedes iniciar sesión.", [
        { text: "Ir al login", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error) {
      let msg = "Error al crear la cuenta";
      if (error.code === "auth/email-already-in-use") {
        msg = "Ya existe una cuenta con este correo";
      } else if (error.code === "auth/weak-password") {
        msg = "La contraseña es muy débil";
      } else if (error.code === "auth/invalid-email") {
        msg = "Correo no válido";
      }
      Alert.alert("Error", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled={true}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("../assets/logo_lapampa.jpg")}
              style={styles.logoImage}
            />
            <Text style={styles.brandTitle}>LA PAMPA</Text>
            <Text style={styles.brandSub}>CREAR CUENTA · CLIENTE</Text>
          </View>

          <View style={styles.archContainer}>
            <View style={styles.arch} />
          </View>

          {/* Form */}
          <View style={styles.formArea}>
            <Text style={styles.welcomeText}>
              Completa tus datos para registrarte
            </Text>

            {/* Nombre */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOMBRE COMPLETO</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.nombre && styles.fieldInputError,
                ]}
              >
                <View style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: María López"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={form.nombre}
                  onChangeText={(v) => updateField("nombre", v)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.nombre && (
                <Text style={styles.errorText}>{errors.nombre}</Text>
              )}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CORREO ELECTRÓNICO</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.email && styles.fieldInputError,
                ]}
              >
                <View style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="tu@correo.com"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={form.email}
                  onChangeText={(v) => updateField("email", v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Teléfono */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TELÉFONO</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.telefono && styles.fieldInputError,
                ]}
              >
                <View style={styles.fieldIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="300 123 4567"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={form.telefono}
                  onChangeText={(v) => updateField("telefono", v)}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.telefono && (
                <Text style={styles.errorText}>{errors.telefono}</Text>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.password && styles.fieldInputError,
                ]}
              >
                <View style={[styles.fieldIcon, styles.fieldIconSq]} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={form.password}
                  onChangeText={(v) => updateField("password", v)}
                  secureTextEntry
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirmar contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONFIRMAR CONTRASEÑA</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.confirmPassword && styles.fieldInputError,
                ]}
              >
                <View style={[styles.fieldIcon, styles.fieldIconSq]} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={form.confirmPassword}
                  onChangeText={(v) => updateField("confirmPassword", v)}
                  secureTextEntry
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.actionBtn, isLoading && styles.actionBtnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.textDark} size="small" />
              ) : (
                <Text style={styles.actionBtnText}>CREAR CUENTA</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => navigation.goBack()}
              disabled={isLoading}
            >
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta?{" "}
                <Text style={styles.linkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.homeInd}>
            <View style={styles.homeBar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  header: {
    backgroundColor: COLORS.backgroundDark,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 18,
  },
  logoImage: {
    width: 65,
    height: 65,
    borderRadius: 33,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: 3,
  },
  brandSub: {
    fontSize: 9,
    color: COLORS.primaryBorder,
    letterSpacing: 2.5,
    fontWeight: "600",
    marginTop: 2,
  },

  archContainer: {
    height: 16,
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  arch: {
    height: 32,
    backgroundColor: COLORS.backgroundDark,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    marginTop: -16,
  },

  formArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 16,
    gap: 10,
  },
  welcomeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textBrown,
    textAlign: "center",
    marginBottom: 2,
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
    height: 40,
    gap: 7,
  },
  fieldInputError: { borderColor: COLORS.error },
  fieldIcon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  fieldIconSq: { borderRadius: 3 },
  textInput: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    paddingVertical: 0,
  },
  errorText: { fontSize: 9, color: COLORS.error, marginLeft: 4 },

  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  actionBtnDisabled: { opacity: 0.6 },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: 2,
  },

  linkBtn: { alignItems: "center", marginTop: 2 },
  linkText: { fontSize: 11, color: COLORS.textLabel },
  linkBold: {
    color: COLORS.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  homeInd: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    alignItems: "center",
  },
  homeBar: {
    width: 72,
    height: 4,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 2,
  },
});
