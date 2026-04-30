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

        {/* ── Módulos principales (por implementar) ── */}
        {/* 
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="MeseroModule" component={MeseroModule} />
        <Stack.Screen name="ClienteModule" component={ClienteModule} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
