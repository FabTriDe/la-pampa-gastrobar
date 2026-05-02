import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { COLORS } from "../theme";

export default function CarritoScreen({ navigation, route }) {
  const { cartItems = [], total = 0 } = route.params || {};
  const [pagoMethod, setPagoMethod] = useState("Efectivo");

  const handleConfirmarOrden = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C0D03" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TU ORDEN</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionLabel}>RESUMEN DE ORDEN</Text>

        {/* Items */}
        <View style={styles.resumenCard}>
          {cartItems.length > 0 ? (
            cartItems.map((item, idx) => (
              <View key={idx} style={styles.resumenRow}>
                <View>
                  <Text style={styles.resumenNombre}>{item.nombre}</Text>
                  <Text style={styles.resumenQty}>x{item.cantidad}</Text>
                </View>
                <Text style={styles.resumenPrecio}>
                  ${(item.precio * item.cantidad).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Sin artículos</Text>
          )}
          <View style={styles.resumenTotal}>
            <Text style={styles.resumenTotalLabel}>TOTAL</Text>
            <Text style={styles.resumenTotalValue}>
              ${total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Método de Pago */}
        <Text style={styles.sectionLabel}>MÉTODO DE PAGO</Text>
        <View style={styles.pagoOpts}>
          {["Efectivo", "Nequi", "Daviplata"].map((metodo) => (
            <TouchableOpacity
              key={metodo}
              style={[
                styles.pagoOpt,
                pagoMethod === metodo && styles.pagoOptSelected,
              ]}
              onPress={() => setPagoMethod(metodo)}
            >
              <View
                style={[
                  styles.pagoOptBox,
                  pagoMethod === metodo && styles.pagoOptBoxSelected,
                ]}
              />
              <Text style={styles.pagoOptText}>{metodo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Información adicional */}
        <Text style={styles.sectionLabel}>INFORMACIÓN DE ENTREGA</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo:</Text>
            <Text style={styles.infoValue}>En mesa</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimado:</Text>
            <Text style={styles.infoValue}>15-20 min</Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelBtnText}>CANCELAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirmarOrden}
        >
          <Text style={styles.confirmBtnText}>CONFIRMAR ORDEN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6E3",
  },
  header: {
    backgroundColor: "#1C0D03",
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8A020",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 6,
  },
  resumenCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  resumenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EDD99A",
  },
  resumenNombre: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1C0D03",
  },
  resumenQty: {
    fontSize: 9,
    color: "#8B6000",
    marginTop: 2,
  },
  resumenPrecio: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5C3300",
  },
  emptyText: {
    fontSize: 12,
    color: "#8B6000",
    fontStyle: "italic",
  },
  resumenTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1.5,
    borderTopColor: "#E8A020",
  },
  resumenTotalLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#5C3300",
    letterSpacing: 1,
  },
  resumenTotalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1C0D03",
  },
  pagoOpts: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 12,
  },
  pagoOpt: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: "#EDD99A",
    borderRadius: 7,
    alignItems: "center",
    gap: 3,
  },
  pagoOptSelected: {
    borderColor: "#E8A020",
    backgroundColor: "#FFF8EC",
  },
  pagoOptBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#EDD99A",
  },
  pagoOptBoxSelected: {
    backgroundColor: "#E8A020",
  },
  pagoOptText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5C3300",
  },
  infoCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#EDD99A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EDD99A",
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8B6000",
  },
  infoValue: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1C0D03",
  },
  bottomActions: {
    backgroundColor: "#1C0D03",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#5C3300",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E8A020",
    letterSpacing: 1,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#E8A020",
    borderRadius: 8,
    alignItems: "center",
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1C0D03",
    letterSpacing: 1,
  },
});
