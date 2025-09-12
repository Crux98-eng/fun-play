import { Slot } from 'expo-router';

import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Layout=() =>{
  return (
    
     <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
export default Layout