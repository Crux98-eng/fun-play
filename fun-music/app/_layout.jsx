import { Stack } from 'expo-router';
import React,{useEffect} from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ModalPortal } from 'react-native-modals';
import {PlayerProvider}  from '../app/utils/PlayerContext';
const queryClient = new QueryClient();
import { setAudioModeAsync } from 'expo-audio';
const Layout = () => {
  useEffect(() => {
    const configureAudio = async () => {
      await setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: "doNotMix",
        interruptionModeIOS: "doNotMix",
      });
    };

    configureAudio();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PlayerProvider>
          
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>

        <ModalPortal />
        </PlayerProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default Layout;
