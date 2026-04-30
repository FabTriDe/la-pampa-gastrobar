// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - TEMA GLOBAL
// Colores, tipografía, espaciado y estilos base
// ═══════════════════════════════════════════════════════════════════════════

// ─── PALETA DE COLORES ───
export const COLORS = {
  // Colores primarios
  PRIMARY: "#F5A623", // Naranja/Dorado
  PRIMARY_DARK: "#E89A1F", // Naranja oscuro
  PRIMARY_LIGHT: "#FFC857", // Naranja claro

  // Colores secundarios
  SECONDARY: "#3D2817", // Marrón oscuro
  SECONDARY_LIGHT: "#5C4033", // Marrón claro

  // Fondos
  BACKGROUND: "#F5E6D3", // Crema/Beige
  BACKGROUND_DARK: "#2B2520", // Negro oscuro

  // Textos
  TEXT_PRIMARY: "#3D2817", // Marrón oscuro (para texto principal)
  TEXT_SECONDARY: "#6B5B4A", // Marrón grisáceo (para texto secundario)
  TEXT_LIGHT: "#F5E6D3", // Crema (para texto sobre fondos oscuros)
  TEXT_WHITE: "#FFFFFF", // Blanco

  // Estados
  SUCCESS: "#4CAF50", // Verde (éxito, pedido completado)
  WARNING: "#FF9800", // Naranja (en progreso)
  ERROR: "#F44336", // Rojo (error)
  INFO: "#2196F3", // Azul (información)

  // Neutral
  BORDER: "#DDD6CC", // Borde gris claro
  DISABLED: "#CCCCCC", // Deshabilitado
  WHITE: "#FFFFFF",
  BLACK: "#000000",

  // Estados de mesa
  TABLE_FREE: "#4CAF50", // Mesa libre (verde)
  TABLE_OCCUPIED: "#F44336", // Mesa ocupada (rojo)
  TABLE_PENDING: "#FF9800", // Mesa pendiente (naranja)
};

// ─── TIPOGRAFÍA ───
export const FONTS = {
  // Tamaños
  SIZE_XS: 10,
  SIZE_SM: 12,
  SIZE_BASE: 14,
  SIZE_LG: 16,
  SIZE_XL: 18,
  SIZE_2XL: 20,
  SIZE_3XL: 24,
  SIZE_4XL: 28,
  SIZE_5XL: 32,

  // Pesos
  WEIGHT_LIGHT: "300",
  WEIGHT_NORMAL: "400",
  WEIGHT_MEDIUM: "500",
  WEIGHT_SEMIBOLD: "600",
  WEIGHT_BOLD: "700",
};

// ─── ESPACIADO ───
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// ─── BORDES ───
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  FULL: 9999,
};

// ─── SOMBRAS ───
export const SHADOWS = {
  SMALL: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  LARGE: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

// ─── ESTILOS COMPONENTES COMUNES ───
export const BUTTON_STYLES = {
  PRIMARY: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.MD,
  },
  SECONDARY: {
    backgroundColor: COLORS.SECONDARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.MD,
  },
  OUTLINED: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.XL,
    borderRadius: BORDER_RADIUS.MD,
  },
};

// ─── ESTILOS INPUT ───
export const INPUT_STYLES = {
  CONTAINER: {
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.WHITE,
  },
  FOCUSED: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 2,
  },
  ERROR: {
    borderColor: COLORS.ERROR,
  },
};

// ─── ESTILOS CARD ───
export const CARD_STYLES = {
  CONTAINER: {
    backgroundColor: COLORS.WHITE,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    ...SHADOWS.SMALL,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BUTTON_STYLES,
  INPUT_STYLES,
  CARD_STYLES,
};
