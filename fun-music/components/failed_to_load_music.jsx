import { View, Text ,StyleSheet,Image, TouchableOpacity} from 'react-native'
import React from 'react'
import no_connection from '../assets/images/no_connection.jpg';
const FailedMusicLoad = ({ go_home, refresh}) => {
  return (
    <View style={styles.container}>
     <Image 
     source={no_connection}
     resizeMode='contain'
     style={styles.img}
     />
     <Text style={{color:'#f80000ff', fontSize:16, fontWeight:600}}>NO CONNECTION OR NETWORK ERROR</Text>
     <View style={styles.btns_container}>
     <TouchableOpacity onPress={refresh} style={styles.btn1} >
        <Text>Refresh</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={go_home} style={styles.btn2} >
            <Text>Go to Home</Text>
     </TouchableOpacity>
     </View>
    </View>
  )
}

export default FailedMusicLoad
const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'white',
    alignItems:'center',
},
img:{
    width:300,
    height:300,
    alignSelf:'center',
    marginTop:100,
},
btns_container:{
    width:'80%',
    flexDirection:'row',
    justifyContent:'space-around',
    marginTop:50,
},
btn1:{
    width:130,
    height:40,
    backgroundColor:'#067406ff',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
},
btn2:{
    width:130,
    height:40,
    borderWidth:1,
    borderColor:'#ff0000ff',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5,
    
},

})