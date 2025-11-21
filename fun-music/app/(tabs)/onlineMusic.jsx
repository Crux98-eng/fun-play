import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { usePlayer } from '../utils/PlayerContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import videobg from '../../assets/videos/videobg.mp4';
import MusicCard from '../../components/musicCard';
import FailedMusicLoad from '../../components/failed_to_load_music';
import { router } from 'expo-router';
import NowPlayingModal from '../../components/NowPlayingModal';

const { width, height } = Dimensions.get('window');


// LOCAL or LAN
const BASE_URL = 'http://192.168.177.150:5000/api/tracks';

export default function OnlineMusic() {
  const { currentTrack, isPlaying } = usePlayer();

  // Modal Ref
  const modalRef = useRef(null);
  const openModal = () => modalRef.current?.open();

  // --------------------------------------------------
  // FETCH MUSIC
  // --------------------------------------------------
  const fetchMusic = async () => {
    const response = await fetch(BASE_URL);
    const text = await response.text();

    try {
      return JSON.parse(text);
    } catch (e) {
      console.log("JSON PARSE ERROR:", e);
      return [];
    }
  };

  const { data: tracks, isLoading, isError, refetch } = useQuery(['tracks'], fetchMusic);

  // --------------------------------------------------
  // MEMOIZED PLAYLIST — FIXES RE-RENDER LOOP
  // --------------------------------------------------
  const memoPlaylist = useMemo(() => tracks || [], [tracks]);

  // --------------------------------------------------
  // BACKGROUND VIDEO
  // --------------------------------------------------
  const player = useVideoPlayer(videobg, (p) => {
    p.loop = true;
    p.play();
  });

  // Cleanup BG video
  useEffect(() => {
    return () => {
      player?.stop?.();
      player?.unload?.();
    };
  }, []);
  // playback is handled by PlayerContext

  // --------------------------------------------------
  // NAVIGATION
  // --------------------------------------------------
  const navigateHome = () => router.push('/home');

  // --------------------------------------------------
  // UI STATES
  // --------------------------------------------------
  if (isLoading)
    return (
      <ActivityIndicator
        size="large"
        color="#ff9900ff"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );

  if (isError)
    return (
      <FailedMusicLoad
        go_home={navigateHome}
        refresh={refetch}
      />
    );

  if (!Array.isArray(tracks)) {
    return <Text style={{ color: 'white' }}>Invalid data format</Text>;
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Background video */}
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View style={styles.text_container}>
        <Text style={styles.main_text}>VIBE FREE</Text>
        {currentTrack && (
          <Text style={styles.playingText}>
            {isPlaying ? 'Playing: ' : 'Paused: '}
            {currentTrack.title}
          </Text>
        )}
      </View>

      <ScrollView style={styles.scroll_container}>
        <View style={styles.scrollable_content}>
          
            <MusicCard
             songs={memoPlaylist}
            />
         
        </View>
      </ScrollView>

      <NowPlayingModal ref={modalRef} />
    </SafeAreaView>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  video: { width, height: 300 },
  main_text: { color: 'white', fontSize: 30, fontWeight: 'bold' },
  playingText: { color: 'yellow', marginTop: 10 },
  text_container: {
    position: 'absolute',
    top: height * 0.35,
    width,
    alignItems: 'center',
  },
  scroll_container: { width, height: height * 0.6 },


});
