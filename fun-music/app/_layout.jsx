import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalPortal } from 'react-native-modals';

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>

        {/* 🔥 MUST be at the root level */}
        <ModalPortal />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Layout;
