import { StyleSheet, Text, View ,Dimensions,Image,SafeAreaView, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import {Colors} from '../../constants/Colors'
const {width,height}= Dimensions.get("window");
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

import Slider from '@react-native-community/slider';
import MusicFiles from 'react-native-get-music-files'
import { Audio } from 'expo-av';
const Home = () => {
const [tracks, setTracks]=useState([]);
useEffect(()=>{
MusicFiles.getAll({
blured:false,
artist:true,
duration:true,
cover:true,
genre:true,
title:true,
}).then(songs=>{
  setTracks(songs);
})
console.log(tracks);

},[])



  return (
    <SafeAreaView style={styles.mainContainer} >
      <View style={styles.topCard}>
          <Image 
          source={require('../../assets/images/m3.jpg')}
          style={styles.imageTop}
          />
          <View style={styles.songDetails}>  
            <Text style={{
              fontSize:24,
              fontWeight:600,
              color:Colors.secondary
            }}>Song title</Text>
            <Text style={{color:'white'}}>song artist</Text>

          </View>
          <Slider 
            style={{width: 400, height: 60}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor={Colors.secondary}
            maximumTrackTintColor='#fff'
          />
          <View style={styles.timeStamp}>
          <Text style={{color:'white'}}>0:00</Text>
          <Text style={{color:'white'}}>3:30</Text>
          </View>
          <View style={styles.controls}>
           <TouchableOpacity>
             <MaterialIcons name='skip-next' size={30} color={Colors.secondary}/>
           </TouchableOpacity>
          <TouchableOpacity>
          <MaterialIcons name='play-circle' size={50} color={Colors.secondary}/>

          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialIcons name='skip-next' size={30} color={Colors.secondary}/>

          </TouchableOpacity>

          </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity>
          <MaterialIcons  name='menu' size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons  name='favorite-border' size={30} />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons  name='share' size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
mainContainer:{
backgroundColor:Colors.primary,
height:height,
width:width,
flex:1,
alignItems:'center',
paddingTop:40,

},
topCard:{
  width:width*.9,
  height:height*.6,

  alignItems:'center'
},
imageTop:{
width:width*.8,
height:300,
borderRadius:15,
},
timeStamp:{
  width:width*.7,
  height:20,
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',

},
controls:{
  width:width*.7,
  height:60,
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  marginTop:30,
  
},
songDetails:{
  width:width*.7,
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  height:50,
  paddingTop:10,
},
bottomContainer: {
  width: width * 0.9,
  height: 100,
  borderTopColor: Colors.secondary,
  borderTopWidth: 1, 
  marginTop: 70,
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center'
 
},

})  