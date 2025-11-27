
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Modal } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { Colors } from '../constants/Colors';
import { createAudioPlayer } from 'expo-audio';
import { usePlayer } from '../app/utils/PlayerContext';
const { width, height } = Dimensions.get('window');
const MusicCard = ({ songs }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const playerIdRef = useRef(`local-player-${Math.random().toString(36).slice(2,9)}`);
  const { registerExternalPlayer, unregisterExternalPlayer, stopInternalPlayer } = usePlayer();

  // initialize player once
  useEffect(() => {
    playerRef.current = createAudioPlayer(null);
    // register with global PlayerContext so that when the global player starts,
    // this local player can be asked to stop.
    const id = playerIdRef.current;
    try {
      registerExternalPlayer(id, {
        pause: async () => {
          try { await playerRef.current?.pause?.(); } catch (e) {}
        },
        stop: async () => {
          try { await playerRef.current?.pause?.(); } catch (e) {}
        },
      });
    } catch (e) {}
    return () => {
      try {
        playerRef.current?.pause?.();
        playerRef.current?.remove?.();
        playerRef.current = null;
      } catch (e) {}
      try { unregisterExternalPlayer(playerIdRef.current); } catch (e) {}
    };
  }, []);

  const openAndPlay = async (index) => {
    const track = songs?.[index];
    if (!track) return;
    setCurrentIndex(index);
    setModalOpen(true);

    const uri = track.url || track.song || track.uri || null;
    if (!uri) return console.warn('No audio URI for track', track);

    try {
      // ask global player (PlayerContext) to stop first
      try { await stopInternalPlayer(); } catch (e) {}
      // stop previous
      if (playerRef.current?.playing) {
        try { await playerRef.current.pause(); } catch (e) {}
      }

      // replace with new source and play
      await playerRef.current.replace({ uri });
      try { await playerRef.current.seekTo(0); } catch (e) {}
      playerRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.error('openAndPlay error', e);
    }
  };

  const togglePlay = () => {
    try {
      if (!playerRef.current) return;
      if (playerRef.current.playing) {
        playerRef.current.pause();
        setIsPlaying(false);
      } else {
        playerRef.current.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('togglePlay error', e);
    }
  };

  const playAt = async (index) => {
    if (index < 0 || index >= songs.length) return;
    setCurrentIndex(index);
    const track = songs[index];
    const uri = track.url || track.song || track.uri || null;
    if (!uri) return;
    try {
      await playerRef.current.replace({ uri });
      try { await playerRef.current.seekTo(0); } catch (e) {}
      playerRef.current.play();
      setIsPlaying(true);
    } catch (e) {
      console.warn('playAt error', e);
    }
  };

  const next = () => {
    const nextIndex = (currentIndex + 1) % songs.length;
    playAt(nextIndex);
  };

  const previous = () => {
    const prevIndex = currentIndex <= 0 ? songs.length - 1 : currentIndex - 1;
    playAt(prevIndex);
  };

  const closeModal = () => {
    try {
      playerRef.current?.pause?.();
    } catch (e) {}
    setModalOpen(false);
    setIsPlaying(false);
    setCurrentIndex(-1);
  };

  const RenderItem = (song, index) => {
    const playing = currentIndex === index && isPlaying;
    return (
      <View style={styles.container} key={song.id ?? index}>
        <View style={styles.icon}>
          <MaterialIcons name="headset" size={30} color="#474747ff" />
        </View>

        <View style={styles.details}>
          <Text style={{ color: '#fff' }}>{song.artist || 'loading...'}</Text>
          <Text style={{ color: '#fff' }}>{song.title || 'loading...'}</Text>
        </View>

        <TouchableOpacity
          style={styles.playbtn}
          onPress={() => openAndPlay(index)}
        >
          <MaterialIcons
            name={playing ? 'pause-circle-outline' : 'play-circle-filled'}
            size={36}
            color={playing ? 'green' : Colors.primary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.scroll_container}>
      <ScrollView>
        {songs.map((song, index) => RenderItem(song, index))}
      </ScrollView>

      <Modal visible={isModalOpen} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{songs?.[currentIndex]?.title}</Text>
            <Text style={styles.modalArtist}>{songs?.[currentIndex]?.artist}</Text>

            <View style={styles.controls}>
              <TouchableOpacity onPress={previous}>
                <MaterialIcons name="skip-previous" size={50} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlay}>
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

            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scroll_container:{
    width: width,
   height:500,
   backgroundColor:'#0003',
   display:'flex',
   alignItems:'center',
   paddingTop:20,
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
  modalContainer: {
    height: height * 0.5,
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  modalArtist: { color: '#bbb', fontSize: 14, marginBottom: 10 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  closeBtn: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
});
