import "../../global.css";
import { Stack } from "expo-router/stack";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#120824" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="alphabet" />
        <Stack.Screen name="colors" />
        <Stack.Screen name="animals" />
        <Stack.Screen name="summary" />
      </Stack>
    </SafeAreaProvider>
  );
}
