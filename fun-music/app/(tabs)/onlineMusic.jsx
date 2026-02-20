import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,

} from 'react-native';


const { width, height } = Dimensions.get('window');



export default function OnlineMusic() {
  
    return(
     
        <View style={styles.container}>
          <Text style={styles.main_text}>Coming Soon</Text>
        </View>

       
    )
  
}

// STYLES

const styles = StyleSheet.create({

  container: { flex: 1,
     backgroundColor: 'black',
     alignItems: 'center',
     justifyContent: 'center',
    },
    main_text:{
      color:'white',
      fontSize:20,
    },


});
