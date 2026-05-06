// ─── Navegación Principal ───
// La Pampa App
//
// Dependencias requeridas:
// npm install @react-navigation/native @react-navigation/native-stack
// npm install react-native-screens react-native-safe-area-context

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  LoginScreen,
  RegisterClienteScreen,
  CrearMeseroScreen,
  AdminDashboard,
  GestionarMeserosScreen,
  GestionarMenuScreen,
  AgregarProductosScreen,
  ReportesScreen,
  MeseroModule,
  ClienteModule,
  CarritoScreen,
} from "../screens";
import { COLORS } from "../theme";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.backgroundDark },
          animation: "slide_from_right",
        }}
      >
        {/* ── Auth ── */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="RegisterCliente"
          component={RegisterClienteScreen}
        />

        {/* ── Admin ── */}
        <Stack.Screen name="CrearMesero" component={CrearMeseroScreen} />
        <Stack.Screen
          name="GestionarMeseros"
          component={GestionarMeserosScreen}
        />
        <Stack.Screen name="GestionarMenuScreen" component={GestionarMenuScreen} />
        <Stack.Screen
          name="AgregarProductosScreen"
          component={AgregarProductosScreen}
        />
        <Stack.Screen name="Reportes" component={ReportesScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />

        {/* ── Mesero ── */}
        <Stack.Screen name="MeseroModule" component={MeseroModule} />

        {/* ── Cliente ── */}
        <Stack.Screen name="ClienteModule" component={ClienteModule} />
        <Stack.Screen name="CarritoScreen" component={CarritoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
