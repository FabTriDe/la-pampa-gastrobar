import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { COLORS } from "../theme";
import ReporteService from "../services/ReporteService";

const TABS = ["Día", "Semana", "Mes"];

export default function ReportesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("Día");
  const [fecha, setFecha] = useState(new Date());
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarReporte = useCallback(async () => {
    setLoading(true);
    let result;
    if (activeTab === "Día") {
      result = await ReporteService.obtenerReporteDiario(fecha);
    } else if (activeTab === "Semana") {
      result = await ReporteService.obtenerReporteSemanal(fecha);
    } else {
      result = await ReporteService.obtenerReporteMensual(
        fecha.getMonth() + 1,
        fecha.getFullYear(),
      );
    }
    if (result?.exito) setReporte(result);
    setLoading(false);
  }, [activeTab, fecha]);

  useEffect(() => {
    cargarReporte();
  }, [cargarReporte]);

  const navPrev = () => {
    const d = new Date(fecha);
    if (activeTab === "Día") d.setDate(d.getDate() - 1);
    else if (activeTab === "Semana") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    setFecha(d);
  };

  const navNext = () => {
    const hoy = new Date();
    const d = new Date(fecha);
    if (activeTab === "Día") d.setDate(d.getDate() + 1);
    else if (activeTab === "Semana") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    // No navegar al futuro
    if (d <= hoy) setFecha(d);
  };

  const esPeriodoActual = () => {
    const hoy = new Date();
    if (activeTab === "Día") return fecha.toDateString() === hoy.toDateString();
    if (activeTab === "Mes")
      return (
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear()
      );
    // Semana: misma semana
    const inicioSemana = (d) => {
      const x = new Date(d);
      x.setDate(d.getDate() - d.getDay());
      x.setHours(0, 0, 0, 0);
      return x;
    };
    return inicioSemana(fecha).getTime() === inicioSemana(hoy).getTime();
  };

  const getPeriodoLabel = () => {
    if (activeTab === "Día") {
      return fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    }
    if (activeTab === "Semana") {
      return reporte?.semana || "Cargando...";
    }
    return fecha.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
  };

  // Para las barras visuales
  const ventas = reporte?.ventasTotal || 0;
  const gastos = reporte?.gastosTotal || 0;
  const ganancia = reporte?.gananciaNeta ?? ventas;
  const maxVal = Math.max(ventas, gastos, 1);
  const pctVentas = Math.max((ventas / maxVal) * 100, ventas > 0 ? 3 : 0);
  const pctGastos = Math.max((gastos / maxVal) * 100, gastos > 0 ? 3 : 0);
  const pctGanancia = Math.max((ganancia / maxVal) * 100, ganancia > 0 ? 3 : 0);
  const gananciaColor = ganancia >= 0 ? "#2ECC71" : "#E74C3C";

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.backgroundDark}
      />

      {/* ── Top bar — paddingTop absorbe el status bar ── */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 14 }, // 14 = padding visual original
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backArrow}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>REPORTES</Text>
          <Text style={styles.topSubtitle}>Panel Administrador</Text>
        </View>
        <TouchableOpacity onPress={cargarReporte} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>↻</Text>
        </TouchableOpacity>
      </View>

      {/* ── Tabs ── */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
              setFecha(new Date());
              setReporte(null);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Navegación de período ── */}
      <View style={styles.periodNav}>
        <TouchableOpacity onPress={navPrev} style={styles.navArrow}>
          <Text style={styles.navArrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.periodLabel} numberOfLines={1}>
          {getPeriodoLabel()}
        </Text>
        <TouchableOpacity
          onPress={navNext}
          style={[styles.navArrow, esPeriodoActual() && { opacity: 0.3 }]}
          disabled={esPeriodoActual()}
        >
          <Text style={styles.navArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* ── Contenido ── */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginTop: 50 }}
            size="large"
          />
        ) : (
          <>
            {/* KPI Cards */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiIcon}>💰</Text>
                <Text style={styles.kpiLabel}>VENTAS</Text>
                <Text style={styles.kpiValue}>
                  ${ventas.toLocaleString("es-CO")}
                </Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiIcon}>🧾</Text>
                <Text style={styles.kpiLabel}>PEDIDOS</Text>
                <Text style={styles.kpiValue}>
                  {reporte?.totalPedidos || 0}
                </Text>
              </View>
              <View
                style={[styles.kpiCard, { borderColor: gananciaColor + "55" }]}
              >
                <Text style={styles.kpiIcon}>📈</Text>
                <Text style={styles.kpiLabel}>GANANCIA</Text>
                <Text style={[styles.kpiValue, { color: gananciaColor }]}>
                  ${ganancia.toLocaleString("es-CO")}
                </Text>
              </View>
            </View>

            {/* Margen — solo mensual y semanal */}
            {reporte?.margenGanancia && (
              <View style={styles.margenCard}>
                <Text style={styles.margenLabel}>MARGEN DE GANANCIA</Text>
                <Text style={styles.margenValue}>{reporte.margenGanancia}</Text>
              </View>
            )}

            {/* Gráfico de barras */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>COMPARATIVA DEL PERÍODO</Text>
              <BarRow
                label="Ventas"
                pct={pctVentas}
                value={ventas}
                color={COLORS.primary}
              />
              <BarRow
                label="Gastos"
                pct={pctGastos}
                value={gastos}
                color="#E74C3C"
              />
              <BarRow
                label="Ganancia"
                pct={pctGanancia}
                value={ganancia}
                color={gananciaColor}
              />
            </View>

            {/* Sin datos */}
            {reporte?.totalPedidos === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardIcon}>📭</Text>
                <Text style={styles.emptyCardText}>
                  Sin pedidos entregados en este período
                </Text>
              </View>
            )}

            {/* Nota informativa */}
            <View style={styles.noteCard}>
              <Text style={styles.noteText}>
                💡 Solo se contabilizan pedidos con estado "entregado". El
                módulo de gastos estará disponible próximamente.
              </Text>
            </View>

            <View style={{ height: 30 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ══════════════════════════════════════════════════════════════════════════
function BarRow({ label, pct, value, color }) {
  return (
    <View style={barStyles.row}>
      <Text style={barStyles.label}>{label}</Text>
      <View style={barStyles.track}>
        <View
          style={[barStyles.fill, { width: `${pct}%`, backgroundColor: color }]}
        />
      </View>
      <Text style={barStyles.value}>${value.toLocaleString("es-CO")}</Text>
    </View>
  );
}

// ══════════════════════════════════════════════════════════════════════════
const barStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  label: { width: 58, fontSize: 10, fontWeight: "600", color: "#5C3300" },
  track: {
    flex: 1,
    height: 16,
    backgroundColor: "#F6E9BD",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 8, minWidth: 4 },
  value: {
    width: 70,
    fontSize: 10,
    fontWeight: "700",
    color: "#1C0D03",
    textAlign: "right",
  },
});

// ══════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  // Container crema — ya NO afecta el área del status bar
  container: {
    flex: 1,
    backgroundColor: "#FDF6E3",
  },

  // topBar oscuro que "crece" hacia arriba absorbiendo el inset
  // paddingTop se aplica inline con insets.top + 14
  topBar: {
    backgroundColor: "#1C0D03",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: 14, // antes era paddingVertical: 14, ahora separado
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
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#2a1500",
    justifyContent: "center",
    alignItems: "center",
  },
  refreshBtnText: { fontSize: 18, color: "#E8A020", fontWeight: "700" },

  tabs: {
    flexDirection: "row",
    backgroundColor: "#F6E9BD",
    margin: 14,
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#1C0D03" },
  tabText: { fontSize: 12, fontWeight: "600", color: "#5C3300" },
  tabTextActive: { color: "#E8A020" },

  periodNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 14,
    gap: 8,
  },
  navArrow: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    justifyContent: "center",
    alignItems: "center",
  },
  navArrowText: {
    fontSize: 22,
    color: "#1C0D03",
    fontWeight: "700",
    lineHeight: 26,
  },
  periodLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#1C0D03",
    textAlign: "center",
    textTransform: "capitalize",
  },

  content: { flex: 1, paddingHorizontal: 14 },

  kpiRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  kpiCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
    gap: 4,
  },
  kpiIcon: { fontSize: 20 },
  kpiLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1C0D03",
    textAlign: "center",
  },

  margenCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  margenLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    letterSpacing: 1,
  },
  margenValue: { fontSize: 18, fontWeight: "700", color: "#E8A020" },

  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
    letterSpacing: 1.5,
    marginBottom: 16,
  },

  emptyCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 24,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#E4D8B0",
  },
  emptyCardIcon: { fontSize: 36 },
  emptyCardText: { fontSize: 13, color: "#5C3300", textAlign: "center" },

  noteCard: {
    backgroundColor: "#F6E9BD",
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#E8A020",
    marginBottom: 14,
  },
  noteText: { fontSize: 11, color: "#5C3300", lineHeight: 18 },
});
