// import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import React from 'react';
// import { useAudioPlayer } from 'expo-audio';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
// import { Colors } from '../constants/Colors';

// const { width } = Dimensions.get('window');

// const MusicCard = ({ name, title, song }) => {

//   const player = useAudioPlayer(song);

//   return (
//     <View style={styles.container}>

//       <View style={styles.icon}>
//         <MaterialIcons name="headset" size={30} color="#474747ff" />
//       </View>

//       <View style={styles.details}>
//         <Text style={{ color: '#fff' }}>{name || 'loading...'}</Text>
//         <Text style={{ color: '#fff' }}>{title || 'loading...'}</Text>
//       </View>

//       <TouchableOpacity
//         style={styles.playbtn}
//         onPress={() => {
//           player.playing ? player.pause() : player.play();
//         }}
//       >
//         <MaterialIcons
//           name={player.playing ? 'pause-circle-outline' : 'play-circle-filled'}
//           size={36}
//           color={player.playing? 'green' :Colors.primary}
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
//     flex: 1,
//   },
//   playbtn: {
//     marginRight: 10,
//   },
// });

// MusicCard.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Colors } from '../constants/Colors';
import { usePlayer } from '../app/utils/PlayerContext';

const { width } = Dimensions.get('window');

const MusicCard = ({ name, title, song, index, playlist, openModal }) => {
  const { playSong, currentTrack, player } = usePlayer();

  const isThisPlaying = currentTrack?.song === song && player?.playing;

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
        onPress={async () => {
          await playSong({ name, title, song }, index, playlist);
          openModal?.();
        }}
      >
        <MaterialIcons
          name={isThisPlaying ? 'pause-circle-outline' : 'play-circle-filled'}
          size={36}
          color={isThisPlaying ? 'green' : Colors.primary}
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
