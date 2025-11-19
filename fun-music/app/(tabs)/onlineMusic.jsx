import React, { useState,useEffect ,useRef} from 'react';
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
import { Audio } from 'expo-audio';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import videobg from '../../assets/videos/videobg.mp4';
import MusicCard from '../../components/musicCard';
import FailedMusicLoad from '../../components/failed_to_load_music';
import { router } from 'expo-router';
import NowPlayingModal from '../../components/NowPlayingModal';
const { width, height } = Dimensions.get('window');

//const BASE_URL = 'http://192.168.8.104:5000/api/tracks';
 const BASE_URL = 'http://localhost:5000/api/tracks';


export default function OnlineMusic() {
  const [currentSound, setCurrentSound] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);

  const modalRef = useRef(null);
  const openModal = () => modalRef.current?.open()
  // FETCH MUSIC (Fully debugged)



  const fetchMusic = async () => {

    try {
      const response = await fetch('http://192.168.8.102:5000/api/tracks');

      // If response is not JSON → print raw text
      const text = await response.text();
      //console.log("RAW RESPONSE => ", text);


      const json = JSON.parse(text);   // Safe JSON parse
    

      return json;  // Your backend returns an array
    } catch (error) {
      console.log("Fetch Error:", error);
      //throw error;
    }
  };

 
  // REACT QUERY
  const { data: tracks, isLoading, isError,refetch } = useQuery(['tracks'], fetchMusic);

  
  // BACKGROUND VIDEO
  const player = useVideoPlayer(videobg, (p) => {
    p.loop = true;
    p.play();

  });

//handle navigation to home
const navigateHome=()=>{
  //navigation.navigate('Home');
  
  router.push('/home');

};


 //----------------------
  // PLAY TRACK
  // ---------------------------
  const playTrack = async (track) => {
    try {
      if (!track?.url) {
        console.log("Track has no URL:", track);
        return;
      }

      if (currentSound) {
        await currentSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true }
      );

      setCurrentSound(sound);
      setPlayingTrack(track.title);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingTrack(null);
        }
      });
    } catch (error) {
      console.log("Error playing track:", error);
    }
  };

  // ---------------------------
  // UI STATES
  // ---------------------------
  if (isLoading)
    return (
      <ActivityIndicator
        size="large"
        color="#ff9900ff"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );

  if (isError)
    return <FailedMusicLoad
    go_home={()=>navigateHome()}
    refresh={()=>refetch()}
  
  />;

  // Guard: ensure data is array
  if (!Array.isArray(tracks)) {
    return <Text style={{ color: 'white' }}>Invalid response format.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />

      <View style={styles.text_container}>
        <Text style={styles.main_text}>VIBE FREE</Text>
        {playingTrack && (
          <Text style={{ color: 'yellow', marginTop: 10 }}>
            Playing: {playingTrack}
          </Text>
        )}
      </View>

      <ScrollView style={styles.scroll_container}>
        <View style={styles.scrollable_content}>
          {tracks.map((item, index) => (
            
           <MusicCard
            key={index}
            {...item}
            index={index}
            playlist={tracks}
            openModal={openModal}
            />
          ))}
          
        </View>
      </ScrollView>
      <NowPlayingModal ref={modalRef} />
    </SafeAreaView>
  );
}

// ---------------------------
// STYLES
// ---------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: width,
    height: 300,
  },
  main_text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text_container: {
    position: 'absolute',
    top: height * 0.35,
    width: width,
    alignItems: 'center',
  },
  scroll_container: {
    width: width,
    height: height * 0.6,
  },
  scrollable_content: {
    backgroundColor: '#0c0c0cff',
    width: width,
    minHeight: height * 0.6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 20,
    padding: 20,
  },
  trackItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  trackName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 3,
  },
});
