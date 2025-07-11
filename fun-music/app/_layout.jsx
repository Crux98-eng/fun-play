import React from 'react';
import { Stack } from 'expo-router';

export function RootLayoutNav() {
  

  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
  );
}
