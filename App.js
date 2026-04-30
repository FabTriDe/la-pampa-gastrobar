import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from "./src/theme";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>LP</Text>
      </View>
      <Text style={styles.title}>LA PAMPA</Text>
      <Text style={styles.subtitle}>GASTRO BAR • CALI</Text>
      <Text style={styles.placeholder}>
        Sistema de gestión operativa y pedidos
      </Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_DARK,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.LG,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.XXL,
  },
  logoText: {
    fontSize: FONTS.SIZE_4XL,
    fontWeight: FONTS.WEIGHT_BOLD,
    color: COLORS.BACKGROUND_DARK,
  },
  title: {
    fontSize: FONTS.SIZE_4XL,
    fontWeight: FONTS.WEIGHT_BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: FONTS.SIZE_SM,
    color: COLORS.TEXT_LIGHT,
    letterSpacing: 2,
    marginBottom: SPACING.XXL,
  },
  placeholder: {
    fontSize: FONTS.SIZE_BASE,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});
