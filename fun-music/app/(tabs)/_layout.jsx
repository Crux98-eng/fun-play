import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View,Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import {Colors} from '../../constants/Colors'
const TabsLayout=()=> {
  const [openmenu,setOpenmenu] =useState(false)
 
  return (
 
      <Stack>
        <Stack.Screen name="home" 
        options={{
           headerShown: false, 
         
        }}
        />
      </Stack>
  );
}

export default TabsLayout