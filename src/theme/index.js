// ═══════════════════════════════════════════════════════════════════════════
// LA PAMPA APP - TEMA GLOBAL
// Colores, tipografía, espaciado y estilos base
// ═══════════════════════════════════════════════════════════════════════════

// ─── PALETA DE COLORES ───
export const COLORS = {
  // ── Fondos ──
  backgroundDark: "#1C0D03",
  backgroundAccent: "#2C1200",
  surface: "#FDF6E3",
  surfaceWhite: "#FFFFFF",
  surfaceHighlight: "#FFF8EC",
  surfaceGold: "#FFF3CC",
  surfaceGoldLight: "#FFF0CC",

  // ── Dorados ──
  primary: "#E8A020",
  primaryBorder: "#C4860E",
  primaryLight: "#EDD99A",
  primaryInput: "#D4A843",

  // ── Texto ──
  textWhite: "#FFFFFF",
  textDark: "#1C0D03",
  textBrown: "#5C3300",
  textGold: "#E8A020",
  textGoldMuted: "#C4860E",
  textLabel: "#8B6000",
  textInactive: "#7A4800",
  textPlaceholder: "#BBA060",

  // ── Estados ──
  statusPrep: "#FFF0CC",
  statusPrepText: "#8B6000",
  statusDone: "#DDFFD0",
  statusDoneText: "#2A6E00",
  statusWait: "#FFE8CC",
  statusWaitText: "#8B3000",
  error: "#F44336",
};

// ─── TIPOGRAFÍA ───
export const FONTS = {
  heading: "Oswald",
  body: "Nunito",
  SIZE_XS: 10,
  SIZE_SM: 12,
  SIZE_BASE: 14,
  SIZE_LG: 16,
  SIZE_XL: 18,
  SIZE_2XL: 20,
  SIZE_3XL: 24,
  SIZE_4XL: 28,
  SIZE_5XL: 32,

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
  sm: 6,
  md: 8,
  lg: 10,
  xl: 20,
  full: 999,
};

// ─── SOMBRAS ───
export const SHADOWS = {
  SMALL: {
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  LARGE: {
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

// ─── ESTILOS CARD ───
export const CARD_STYLES = {
  CONTAINER: {
    backgroundColor: COLORS.surfaceWhite,
    borderRadius: BORDER_RADIUS.lg,
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
  CARD_STYLES,
};
