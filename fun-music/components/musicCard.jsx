
// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import React, { useEffect, useRef, useState } from 'react';
// import { Audio } from 'expo-audio';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
// import { Colors } from '../constants/Colors';

// const { width } = Dimensions.get('window');

// const MusicCard = ({ name, title, song }) => {
//   const playerRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   //console.log("song prop => ", song);

//   // Load audio once
//   const loadAudio = async () => {
//     if (playerRef.current) return; // Already loaded

//     const player = new Audio.Sound();
//     await player.loadAsync({ uri: song });
//     playerRef.current = player;
//   };
  

//   const togglePlay = async () => {
//     await loadAudio();

//     if (!isPlaying) {
//       await playerRef.current.playAsync();
//       setIsPlaying(true);
//     } else {
//       await playerRef.current.pauseAsync();
//       setIsPlaying(false);
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (playerRef.current) {
//         playerRef.current.unloadAsync();
//       }
//     };
//   }, []);

//   return (
//     <View style={styles.container}>

//       {/* Left Icon */}
//       <View style={styles.icon}>
//         <MaterialIcons name="headset" size={30} color="#474747ff" />
//       </View>

//       {/* Title + Artist */}
//       <View style={styles.details}>
//         <Text style={{ color: '#fff' }}>{name || 'loading...'}</Text>
//         <Text style={{ color: '#fff' }}>{title || 'loading...'}</Text>
//       </View>

//       {/* Play Button at the END */}
//       <TouchableOpacity style={styles.playbtn} onPress={togglePlay}>
//         <MaterialIcons
//           name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
//           size={36}
//           color={Colors.primary}
//         />
//       </TouchableOpacity>

//     </View>
//   );
// };

// export default MusicCard;

// const styles = StyleSheet.create({
//   container: {
//     width: width * 0.9,
//     backgroundColor: '#313131ff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   icon: {
//     width: 40,
//     height: 40,
//     backgroundColor: '#d9d9d9ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,
//   },

//   details: {
//     marginLeft: 10,
//     flex: 1,     // pushes play button to the end
//   },

//   playbtn: {
//     marginRight: 10,
//   },
// });
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAudioPlayer } from 'expo-audio';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

const MusicCard = ({ name, title, song }) => {

  const player = useAudioPlayer(song);

  return (
    <View style={styles.container}>

      <View style={styles.icon}>
        <MaterialIcons name="headset" size={30} color="#474747ff" />
      </View>

      <View style={styles.details}>
        <Text style={{ color: '#fff' }}>{name || 'loading...'}</Text>
        <Text style={{ color: '#fff' }}>{title || 'loading...'}</Text>
      </View>

      <TouchableOpacity
        style={styles.playbtn}
        onPress={() => {
          player.playing ? player.pause() : player.play();
        }}
      >
        <MaterialIcons
          name={player.playing ? 'pause-circle-outline' : 'play-circle-filled'}
          size={36}
          color={Colors.primary}
        />
      </TouchableOpacity>

    </View>
  );
};

export default MusicCard;

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    backgroundColor: '#313131ff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: '#d9d9d9ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  details: {
    marginLeft: 10,
    flex: 1,
  },
  playbtn: {
    marginRight: 10,
  },
});

