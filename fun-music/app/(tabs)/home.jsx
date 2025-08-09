import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet, Text, View, Dimensions, Image, SafeAreaView, TouchableOpacity,
  TextInput
} from 'react-native';

import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Modalize } from 'react-native-modalize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';





const { width } = Dimensions.get('window');
const DEFAULT_IMAGE = require('../../assets/images/m3.jpg');

const Home = () => {
   const [coverImage, setCoverImage] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [playbackObj, setPlaybackObj] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isSeeking = useRef(false);
  const allTracksSheetRef = useRef(null);
  const favoriteSheetRef = useRef(null);
console.log("image ==>",coverImage);
  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return alert('Media permission denied');

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100,
        sortBy: ['creationTime'],
      });

      const saved = await AsyncStorage.getItem('@favorites');
      setAudioFiles(media.assets);
      setFavorites(saved ? JSON.parse(saved) : []);
      setPlaybackObj(new Audio.Sound());
    })();

    return () => {
      if (playbackObj) playbackObj.unloadAsync();
    };

     
     
  }, []);
useEffect(()=>{
   const loadImage = async () => {
      const uri = await AsyncStorage.getItem('coverImage');
      setCoverImage(uri);
    };
    loadImage();
},[])

  useEffect(() => {
    if (currentIndex !== null && playbackObj && audioFiles[currentIndex]) {
      loadAudio(audioFiles[currentIndex]);
    }
  }, [currentIndex]);

  const loadAudio = async (audio) => {
    try {
      await playbackObj.unloadAsync();
      await playbackObj.loadAsync({ uri: audio.uri }, { shouldPlay: true });
      playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setPlaybackStatus(null);
    } catch (error) {
      alert('Failed to load audio');
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!isSeeking.current) setPlaybackStatus(status);
    if (status?.didJustFinish) {
      if (isRepeat) {
        playbackObj.replayAsync();
      } else {
        handleNext();
      }
    }
  };

  const handlePlayPause = async () => {
    if (!playbackStatus?.isLoaded) return;
    if (playbackStatus.isPlaying) await playbackObj.pauseAsync();
    else await playbackObj.playAsync();
  };

  const handleNext = () => {
    if (!audioFiles.length) return;
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex((prev) => (prev + 1) % audioFiles.length);
    }
  };

  const handlePrev = () => {
    if (!audioFiles.length) return;
    setCurrentIndex((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
  };

  const seekAudio = async (value) => {
    if (!playbackStatus) return;
    const pos = value * playbackStatus.durationMillis;
    await playbackObj.setPositionAsync(pos);
  };

  const toggleFavorite = async (audio) => {
    const exists = favorites.find((f) => f.id === audio.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== audio.id)
      : [...favorites, audio];
    setFavorites(updated);
    await AsyncStorage.setItem('@favorites', JSON.stringify(updated));
  };

  const isFavorite = (audio) => favorites.some((f) => f.id === audio.id);
  const getFormattedTime = (millis) => {
    if (!millis) return '0:00';
    const total = Math.floor(millis / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const currentAudio = currentIndex !== null ? audioFiles[currentIndex] : null;
  const artworkSource = currentAudio?.artwork ? { uri: currentAudio.artwork } : DEFAULT_IMAGE;
  const filteredAudioFiles = audioFiles.filter(item =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
    
      <View style={styles.topCard}>
        <Image source={coverImage? {uri:coverImage}: artworkSource} style={styles.imageTop} />
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{currentAudio?.filename || 'Select a Track'}</Text>
          <Text style={styles.songArtist}>Local Audio</Text>
        </View>

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
          disabled={!playbackStatus}
        />

        <View style={styles.timeStamp}>
          <Text style={styles.timeText}>{getFormattedTime(playbackStatus?.positionMillis)}</Text>
          <Text style={styles.timeText}>{getFormattedTime(playbackStatus?.durationMillis)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={() => setIsShuffle(!isShuffle)}>
            <MaterialIcons name='shuffle' size={24} color={isShuffle ? Colors.secondary : 'gray'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === null}>
            <MaterialIcons name='skip-previous' size={40} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} disabled={currentIndex === null}>
            <MaterialIcons
              name={playbackStatus?.isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
              size={70}
              color={Colors.secondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} disabled={currentIndex === null}>
            <MaterialIcons name='skip-next' size={40} color={Colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRepeat(!isRepeat)}>
            <MaterialIcons name='repeat' size={24} color={isRepeat ? Colors.secondary : 'gray'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={() => allTracksSheetRef.current?.open()}>
          <MaterialIcons name='menu' size={30} color={Colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => currentAudio && toggleFavorite(currentAudio)} disabled={!currentAudio}>
          <MaterialIcons
            name={currentAudio && isFavorite(currentAudio) ? 'favorite' : 'favorite-border'}
            size={30}
            color={Colors.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => favoriteSheetRef.current?.open()}>
          <MaterialIcons name='star' size={30} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <Modalize
        ref={allTracksSheetRef}
        snapPoint={500}
        modalStyle={styles.sheet}
        flatListProps={{
          data: filteredAudioFiles,
          keyExtractor: (item) => item.id,
          ListHeaderComponent: (
            <>
              <Text style={styles.sheetTitle}>All Tracks</Text>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
            </>
          ),
          renderItem: ({ item, index }) => (
            <TouchableOpacity style={styles.trackItem} onPress={() => setCurrentIndex(index)}>
              <Text style={styles.trackText}>{item.filename}</Text>
              <MaterialIcons name='play-arrow' size={20} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />

      <Modalize
        ref={favoriteSheetRef}
        snapPoint={500}
        modalStyle={styles.sheet}
        flatListProps={{
          data: favorites,
          keyExtractor: (item) => item.id,
          ListHeaderComponent: <Text style={styles.sheetTitle}>Favorites</Text>,
          ListEmptyComponent: <Text style={styles.emptyText}>No favorites yet.</Text>,
          renderItem: ({ item }) => (
            <TouchableOpacity
              style={styles.trackItem}
              onPress={() => {
                const index = audioFiles.findIndex((a) => a.id === item.id);
                if (index !== -1) setCurrentIndex(index);
              }}
            >
              <Text style={styles.trackText}>{item.filename}</Text>
              <MaterialIcons name='play-arrow' size={20} color={Colors.secondary} />
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 40,
  },
  topCard: {
    width: width * 0.9,
    alignItems: 'center',
  },
  imageTop: {
    width: width * 0.8,
    height: 260,
    borderRadius: 15,
  },
  songDetails: {
    marginTop: 15,
    alignItems: 'center',
  },
  songTitle: {
    color: Colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songArtist: {
    color: 'white',
    fontSize: 14,
    marginTop: 3,
  },
  timeStamp: {
    width: width * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: width * 0.85,
    alignItems: 'center'
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    width: width * 0.9,
  },
  sheet: {
    padding: 20,
    backgroundColor: Colors.primary,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 15,
  },
  trackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    marginBottom: 10,
  },
  trackText: {
    color: '#fff',
    width: width * 0.7,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

});
