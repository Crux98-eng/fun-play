import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Text, View, Dimensions, Image, SafeAreaView, TouchableOpacity, FlatList, Alert
} from 'react-native';

import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Modalize } from 'react-native-modalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');
const DEFAULT_IMAGE = require('../../assets/images/m3.jpg'); // Placeholder artwork

const Home = () => {
  // ========== STATE VARIABLES ==========
  const [audioFiles, setAudioFiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackObj, setPlaybackObj] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(false);

  const isSeeking = useRef(false);
  const allTracksSheetRef = useRef(null);
  const favoriteSheetRef = useRef(null);

  // ========== INITIALIZATION ==========
  useEffect(() => {
    // Request permissions & load audio
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Media access is required to play local songs.");
        return;
      }
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100,
        sortBy: ['creationTime'],
      });
      setAudioFiles(media.assets);

      const sound = new Audio.Sound();
      setPlaybackObj(sound);

      // Load saved favorites
      const saved = await AsyncStorage.getItem('@favorites');
      if (saved) setFavorites(JSON.parse(saved));
    })();

    // Cleanup sound on unmount
    return () => {
      if (playbackObj) playbackObj.unloadAsync();
    };
  }, []);

  // Play track when currentIndex changes
  useEffect(() => {
    if (audioFiles.length > 0 && playbackObj) {
      loadAudio(audioFiles[currentIndex]);
    }
  }, [currentIndex, audioFiles]);

  // ========== AUDIO CONTROLS ==========

  // Load and play selected audio file
  const loadAudio = async (audio) => {
    try {

      await playbackObj.unloadAsync();
      await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      
    } catch (error) {
      Alert.alert("Playback Error", "Something went wrong loading this track.");
      console.error("loadAudio error:", error);
    }
  };

  // Playback status update
  const onPlaybackStatusUpdate = (status) => {
    if (!isSeeking.current) setPlaybackStatus(status);
    if (status?.didJustFinish) handleNext();
  };

  const handlePlayPause = async () => {
    if (!playbackStatus) return;
    if (playbackStatus.isPlaying) await playbackObj.pauseAsync();
    else await playbackObj.playAsync();
  };

  const handleNext = () => {
    if (audioFiles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % audioFiles.length);
  };

  const handlePrev = () => {
    if (audioFiles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
  };

  const seekAudio = async (value) => {
    if (!playbackStatus) return;
    const pos = value * playbackStatus.durationMillis;
    await playbackObj.setPositionAsync(pos);
  };

  // ========== FAVORITES ==========

  const toggleFavorite = async (audio) => {
    const exists = favorites.find((item) => item.id === audio.id);
    let updatedFavorites;

    if (exists) {
      updatedFavorites = favorites.filter((item) => item.id !== audio.id);
    } else {
      updatedFavorites = [...favorites, audio];
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (audio) => favorites.some((item) => item.id === audio.id);

  // ========== RENDER HELPERS ==========

  const getFormattedTime = (millis) => {
    if (!millis) return '0:00';
    const total = Math.floor(millis / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentAudio = audioFiles[currentIndex];

  // ========== MAIN UI ==========
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Top Section: Image + Title */}
      <View style={styles.topCard}>
        <Image source={DEFAULT_IMAGE} style={styles.imageTop} />

        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{currentAudio?.filename || "No song playing"}</Text>
          <Text style={styles.songArtist}>{currentAudio?.artist || "Unknown Artist"}</Text>
        </View>

        {/* Slider */}
        <Slider
          style={{ width: width * 0.85 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={Colors.secondary}
          maximumTrackTintColor="#fff"
          value={
            playbackStatus?.positionMillis && playbackStatus?.durationMillis
              ? playbackStatus.positionMillis / playbackStatus.durationMillis
              : 0
          }
          onSlidingStart={() => (isSeeking.current = true)}
          onSlidingComplete={(v) => {
            isSeeking.current = false;
            seekAudio(v);
          }}
        />

        <View style={styles.timeStamp}>
          <Text style={styles.timeText}>{getFormattedTime(playbackStatus?.positionMillis)}</Text>
          <Text style={styles.timeText}>{getFormattedTime(playbackStatus?.durationMillis)}</Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePrev}>
            <MaterialIcons name='skip-previous' size={40} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause}>
            <MaterialIcons name={playbackStatus?.isPlaying ? 'pause-circle-filled' : 'play-circle-filled'} size={70} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext}>
            <MaterialIcons name='skip-next' size={40} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => allTracksSheetRef.current?.open()}>
          <MaterialIcons name='menu' size={30} color={Colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleFavorite(currentAudio)}>
          <MaterialIcons
            name={isFavorite(currentAudio) ? 'favorite' : 'favorite-border'}
            size={30}
            color={Colors.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => favoriteSheetRef.current?.open()}>
          <MaterialIcons name='star' size={30} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* All Tracks Bottom Sheet */}
      <Modalize ref={allTracksSheetRef} snapPoint={500} modalStyle={styles.sheet}>
        <Text style={styles.sheetTitle}>All Tracks</Text>
        <FlatList
          data={audioFiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.trackItem} onPress={() => setCurrentIndex(index)}>
              <Text style={styles.trackText}>{item.filename}</Text>
              <MaterialIcons name='play-arrow' size={20} color={Colors.secondary} />
            </TouchableOpacity>
          )}
        />
      </Modalize>

      {/* Favorites Bottom Sheet */}
      <Modalize ref={favoriteSheetRef} snapPoint={500} modalStyle={styles.sheet}>
        <Text style={styles.sheetTitle}>Favorites</Text>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorites yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.trackItem} onPress={() => {
                const index = audioFiles.findIndex(a => a.id === item.id);
                if (index !== -1) setCurrentIndex(index);
              }}>
                <Text style={styles.trackText}>{item.filename}</Text>
                <MaterialIcons name='play-arrow' size={20} color={Colors.secondary} />
              </TouchableOpacity>
            )}
          />
        )}
      </Modalize>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.primary,
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  topCard: {
    width: width * 0.9,
    alignItems: 'center',
  },
  imageTop: {
    width: width * 0.8,
    height: 280,
    borderRadius: 15,
  },
  songDetails: {
    marginTop: 15,
    alignItems: 'center',
  },
  songTitle: {
    color: Colors.secondary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  songArtist: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  timeStamp: {
    width: width * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  controls: {
    width: width * 0.7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    alignItems: 'center',
  },
  bottomContainer: {
    width: width * 0.9,
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheet: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  sheetTitle: {
    fontSize: 18,
    color: Colors.secondary,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trackItem: {
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trackText: {
    color: 'white',
    width: width * 0.6,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});
