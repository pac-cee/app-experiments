import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { BrokerProvider } from "@/context/BrokerContext";
import { RideProvider } from "@/context/RideContext";
import { RiderProvider } from "@/context/RiderContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerShadowVisible: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(rider)" options={{ headerShown: false }} />
      <Stack.Screen
        name="booking/rider-detail"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="booking/price-confirm"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="booking/waiting"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="booking/tracking"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="booking/rating"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="rider-booking/customer-detail"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="rider-booking/price-accept"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="rider-booking/active-ride"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="rider-booking/rating"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <BrokerProvider>
              <RideProvider>
                <RiderProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <KeyboardProvider>
                      <RootLayoutNav />
                    </KeyboardProvider>
                  </GestureHandlerRootView>
