import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '../constants/Colors'
import {router} from 'expo-router'

const { width, height } = Dimensions.get("window");
const Index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.topimageContainer}>
        <Image

          source={require('../assets/images/m4.jpg')}

          style={styles.imgs}
        />
        <Text style={{
          position: 'absolute',
          top: height * .7,
          color: '#fff',
          fontSize: 24,
          fontWeight: '300',
        }}>lets vibe the music together</Text>
        <TouchableOpacity onPress={()=>router.push('/home')}  style={styles.btn}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>Start</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  topimageContainer: {
    width: width,
    height: height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  imgs: {
    width: '100%',
    height: '100%',
  },
  btn: {
    width: width * .8,
    height: 50,
    backgroundColor: Colors.btn_pink,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: height * .8,
    borderRadius: 8,
  },

})