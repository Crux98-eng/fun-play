import React, { useRef, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Modalize } from 'react-native-modalize';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { usePlayer } from '../app/utils/PlayerContext';

const { width, height } = Dimensions.get('window');

const NowPlayingModal = React.forwardRef((props, ref) => {

  const { currentTrack, next, previous, togglePlay, isPlaying } = usePlayer();

  //console.log("Rendering NowPlayingModal with track:", currentTrack);
  // Internal stable ref for Modalize
  const internalRef = useRef(null);

  // Expose open/close to parent
  useImperativeHandle(ref, () => ({
    open: () => internalRef.current?.open(),
    close: () => internalRef.current?.close()
  }));

  if (!currentTrack) return null;

  const handleClose = () => {
    try {
      // attempt to pause when modal closed
      if (!isPlaying) return;
      togglePlay();
    } catch (e) {}
  };

  return (
    <Modalize
      ref={internalRef}
      modalHeight={height * 0.8}   // FIXED
      onClosed={handleClose}
      handleStyle={{ backgroundColor: '#666' }}
      modalStyle={{ backgroundColor: '#1a1a1a' }}
      withOverlay={true}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{currentTrack.title}</Text>
        <Text style={styles.artist}>{currentTrack.name}</Text>

        <View style={styles.controls}>
          <TouchableOpacity onPress={previous}>
            <MaterialIcons name="skip-previous" size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => togglePlay()}>
            <MaterialIcons
              name={isPlaying ? 'pause-circle' : 'play-circle-fill'}
              size={70}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={next}>
            <MaterialIcons name="skip-next" size={50} color="white" />
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
    alignItems: 'center'
  },
});
