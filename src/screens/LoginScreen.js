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
import { COLORS, FONTS, SPACING, FONT_SIZES, BORDER_RADIUS } from "../theme";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "../config/firebaseConfig";

// NOTA: Para usar Oswald y Nunito en React Native, instalar:
// npx expo install expo-font @expo-google-fonts/oswald @expo-google-fonts/nunito
// O usar: expo-font con assets locales
// Por ahora usamos System como fallback hasta configurar las fuentes

const ROLES = ["Admin", "Mesero", "Cliente"];

const PLACEHOLDERS = {
  Admin: "admin@lapampa.com",
  Mesero: "mesero@lapampa.com",
  Cliente: "cliente@lapampa.com",
};

export default function LoginScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ─── Validación ───
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingresa un correo válido";
    }
    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Login ───
  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Obtener datos del usuario de Firestore
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (!userDoc.exists()) {
        throw new Error("Usuario no encontrado en la base de datos");
      }

      const userData = userDoc.data();
      const rol = userData.rol?.toLowerCase() || "cliente";

      // Validar que el rol del usuario coincida con el seleccionado
      if (rol !== selectedRole.toLowerCase()) {
        await auth.signOut();
        throw new Error(
          `Este correo pertenece a una cuenta de ${rol}, no de ${selectedRole.toLowerCase()}`,
        );
      }

      // Navegar según el rol
      switch (selectedRole.toLowerCase()) {
        case "admin":
          navigation.replace("AdminDashboard", { user });
          break;
        case "mesero":
          navigation.replace("MeseroModule", { user });
          break;
        case "cliente":
          navigation.replace("ClienteModule", { user });
          break;
        default:
          throw new Error("Rol desconocido");
      }
    } catch (error) {
      let message = "Error al iniciar sesión";
      if (error.code === "auth/user-not-found") {
        message = "No existe una cuenta con este correo";
      } else if (error.code === "auth/wrong-password") {
        message = "Contraseña incorrecta";
      } else if (error.code === "auth/too-many-requests") {
        message = "Demasiados intentos. Intenta más tarde";
      } else if (error.code === "auth/invalid-email") {
        message = "Correo no válido";
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───
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
          {/* ── Brand header ── */}
          <View style={styles.header}>
            <Image
              source={require("../assets/logo_lapampa.jpg")}
              style={styles.logoImage}
            />
            <Text style={styles.brandTitle}>LA PAMPA</Text>
            <Text style={styles.brandSub}>GASTRO BAR · CALI</Text>
          </View>

          {/* ── Arch separator (curved transition) ── */}
          <View style={styles.archContainer}>
            <View style={styles.arch} />
          </View>

          {/* ── Form area ── */}
          <View style={styles.formArea}>
            <Text style={styles.welcomeText}>
              Bienvenido — Selecciona tu perfil
            </Text>

            {/* Role tabs */}
            <View style={styles.roleTabs}>
              {ROLES.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleBtn,
                    selectedRole === role && styles.roleBtnActive,
                  ]}
                  onPress={() => setSelectedRole(role)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roleBtnText,
                      selectedRole === role && styles.roleBtnTextActive,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
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
                  placeholder={PLACEHOLDERS[selectedRole]}
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
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

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
              <View
                style={[
                  styles.fieldInput,
                  errors.password && styles.fieldInputError,
                ]}
              >
                <View style={[styles.fieldIcon, styles.fieldIconSquare]} />
                <TextInput
                  style={styles.textInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textPlaceholder}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password)
                      setErrors({ ...errors, password: null });
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.showPasswordText}>
                    {showPassword ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Login button */}
            <TouchableOpacity
              style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.textDark} size="small" />
              ) : (
                <Text style={styles.loginBtnText}>INICIAR SESIÓN</Text>
              )}
            </TouchableOpacity>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => {
                Alert.alert(
                  "Recuperar contraseña",
                  "Se enviará un enlace de recuperación a tu correo electrónico.",
                );
              }}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Link a registro (para clientes) */}
            {selectedRole === "Cliente" && (
              <TouchableOpacity
                style={styles.registerBtn}
                onPress={() => {
                  navigation.navigate("RegisterCliente");
                }}
                disabled={isLoading}
              >
                <Text style={styles.registerText}>
                  ¿No tienes cuenta?{" "}
                  <Text style={styles.registerLink}>Regístrate aquí</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Home indicator ── */}
          <View style={styles.homeIndicator}>
            <View style={styles.homeBar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Estilos (valores exactos de los mockups) ───
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // ── Brand header ──
  header: {
    backgroundColor: COLORS.backgroundDark,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  brandTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-condensed",
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary, // #E8A020
    letterSpacing: 3,
  },
  brandSub: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 10,
    color: COLORS.primaryBorder, // #C4860E
    letterSpacing: 2.5,
    fontWeight: "600",
    marginTop: 2,
  },

  // ── Arch ──
  archContainer: {
    height: 20,
    backgroundColor: COLORS.surface, // #FDF6E3
    overflow: "hidden",
  },
  arch: {
    height: 40,
    backgroundColor: COLORS.backgroundDark, // #1C0D03
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    marginTop: -20,
  },

  // ── Form ──
  formArea: {
    flex: 1,
    backgroundColor: COLORS.surface, // #FDF6E3
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  welcomeText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textBrown, // #5C3300
    textAlign: "center",
  },

  // ── Role tabs ──
  roleTabs: {
    flexDirection: "row",
    gap: 3,
    backgroundColor: COLORS.primaryLight, // #EDD99A
    borderRadius: BORDER_RADIUS.md,
    padding: 3,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.sm,
  },
  roleBtnActive: {
    backgroundColor: COLORS.backgroundDark, // #1C0D03
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textInactive, // #7A4800
  },
  roleBtnTextActive: {
    color: COLORS.primary, // #E8A020
  },

  // ── Fields ──
  fieldGroup: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.textLabel, // #8B6000
    letterSpacing: 1,
  },
  fieldInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceWhite,
    borderWidth: 1.5,
    borderColor: COLORS.primaryInput, // #D4A843
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  fieldInputError: {
    borderColor: COLORS.error,
  },
  fieldIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary, // #E8A020
  },
  fieldIconSquare: {
    borderRadius: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    paddingVertical: 0,
  },
  showPasswordText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "700",
  },
  errorText: {
    fontSize: 10,
    color: COLORS.error,
    marginLeft: 4,
  },

  // ── Login button ──
  loginBtn: {
    backgroundColor: COLORS.primary, // #E8A020
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-condensed",
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark, // #1C0D03
    letterSpacing: 2,
  },

  // ── Links ──
  forgotBtn: {
    alignItems: "center",
  },
  forgotText: {
    fontSize: 12,
    color: COLORS.textLabel, // #8B6000
    textDecorationLine: "underline",
  },
  registerBtn: {
    alignItems: "center",
    marginTop: 4,
  },
  registerText: {
    fontSize: 12,
    color: COLORS.textLabel,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },

  // ── Home indicator ──
  homeIndicator: {
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
