import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalPortal } from 'react-native-modals';
import { PlayerProvider } from '../app/utils/PlayerContext';
const queryClient = new QueryClient();

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>

        {/* 🔥 MUST be at the root level */}
        <ModalPortal />
        </PlayerProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Layout;
