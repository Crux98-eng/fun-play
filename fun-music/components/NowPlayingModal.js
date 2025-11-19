
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Dimensions} from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { usePlayer } from '../app/utils/PlayerContext';
const {width,heigt} = Dimensions.get('window');


const NowPlayingModal = React.forwardRef((props, ref) => {
    
  const { currentTrack, player, next, previous } = usePlayer();
  const modalRef = ref || useRef();

  if (!currentTrack) return null;

  const handleClose = () => {
    // If you want to stop and free when closing:
    try {
      player.pause?.();
      // optionally free memory:
      // player.remove?.();
    } catch (e) {} 
    modalRef.current?.close();
  };

  return (
    <Modalize
      ref={modalRef}
      modalHeight={heigt* .8}
      onClosed={handleClose}
      handleStyle={{ backgroundColor: '#666' }}
      modalStyle={{ backgroundColor: '#1a1a1a' }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.name}</Text>

        <View style={styles.controls}>
          <TouchableOpacity onPress={previous}>
            <MaterialIcons name="skip-previous" size={50} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (player.playing) player.pause();
              else player.play();
            }}
          >
            <MaterialIcons
              name={player.playing ? 'pause-circle' : 'play-circle-fill'}
              size={70}
              color={'white'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={next}>
            <MaterialIcons name="skip-next" size={50} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </Modalize>
  );
});

export default NowPlayingModal;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  artist: { color: '#bbb', fontSize: 16, marginBottom: 20 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, alignItems: 'center' },
});
