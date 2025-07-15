import { Slot } from 'expo-router';
import { View } from 'react-native';
import React from 'react';
const Layout=() =>{
  return (
    
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
export default Layout