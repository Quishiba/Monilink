
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppContext } from "@/context/AppContext";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="admin-dashboard" />
      <Stack.Screen name="admin-users" />
      <Stack.Screen name="admin-transactions" />
      <Stack.Screen name="admin-kyc" />
      <Stack.Screen name="admin-messages" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" options={{ presentation: "modal" }} />
      <Stack.Screen name="reset-password" options={{ presentation: "modal" }} />
      <Stack.Screen name="create-offer" options={{ presentation: "modal" }} />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="transaction/[id]" />
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="phone-verification" options={{ presentation: "modal" }} />
      <Stack.Screen name="kyc-verification" options={{ presentation: "modal" }} />
      <Stack.Screen name="profile-info" />
      <Stack.Screen name="profile-security" />
      <Stack.Screen name="profile-support" />
      <Stack.Screen name="profile-evaluation" />
      <Stack.Screen name="profile-terms" />
      <Stack.Screen name="profile-privacy" />
      <Stack.Screen name="test-sms-send" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContext>
          <GestureHandlerRootView>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </AppContext>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
