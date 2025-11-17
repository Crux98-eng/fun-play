// import { View, Text,StyleSheet,Dimensions } from 'react-native';
// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { useEvent } from 'expo';
// import { useVideoPlayer, VideoView } from 'expo-video';
// import videobg from '../../assets/videos/videobg.mp4';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ScrollView } from 'react-native-gesture-handler';

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

// const api_key = 'a1ec83e07e9be33027dfa48c9e897212';
// const baseURL = `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=hip-hop&api_key=${api_key}&format=json`;

// export default function OnlineMusic() {

//   // ✅ Define fetchMusic FIRST
//   const fetchMusic = async () => {
//     try {
//       const response = await fetch(baseURL);
//       const results = await response.json();

//       // Always return something
//       return results?.tracks?.track ?? [];
//       //console.log(results.tracks.track[0])
//     } catch (error) {
//       console.error("Error fetching online music:", error);
//       throw error; // important so React Query sees the error
//     }
//   };

//   // ✅ Now use it here
//   const { data: music, isError, isLoading } = useQuery({
//     queryKey: ['tracks'],
//     queryFn: fetchMusic,
//   });
//  //console.log("my music ===  ",music);
//   const videosourse = videobg;
//   const player = useVideoPlayer(videobg, player => {
//     player.loop = true;
//     player.play();
//   });
//   return (
//     <SafeAreaView style={styles.container}>
//       <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
     
//       <View style={styles.text_container} >
//  <Text style={styles.main_text}> VIBE FREE</Text>
//       </View>
//       <ScrollView style={styles.scrol_container}>
//                <View style={styles.scrollable_content}>
//                {music.map((item,index)=>(
//           <View key={index}>
//             <Text>{item.name}</Text>

//          </View>  



//                ))}


//                </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
// const styles = StyleSheet.create({
// container:{
//   flex:1,
 
//   alignItems:'center',
//   backgroundColor:'black',
// },
// video:{
//   width:width,
//   height:300,
// },
// main_text:{
//   color:'white',
//   fontSize:30,
//   fontWeight:'bold',
 
// },
// text_container:{
//   position:'absolute',
//   top:height*.35,
//   backgroundColor:'black',
//   height:80,
//   width:width,
//   justifyContent:'center',
//   alignItems:'center',
// },
// scroll_container:{
//   width:width,
 
//  height:height*.6,
//  zIndex:1000,

// },
// scrollable_content:{
//  backgroundColor:'#ffff',
//  width:width,
//  height:height*.6,
//  borderTopLeftRadius:30,
//  borderTopRightRadius:30,
//   marginTop:20,
// },

// });

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import videobg from '../../assets/videos/videobg.mp4';

const { width, height } = Dimensions.get('window');
const API_KEY = 'a1ec83e07e9be33027dfa48c9e897212';
const BASE_URL = `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=hip-hop&api_key=${API_KEY}&format=json`;

export default function OnlineMusic() {
  const [currentSound, setCurrentSound] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);

  // Fetch music
  const fetchMusic = async () => {
    const response = await fetch(BASE_URL);
    const results = await response.json();
    return results?.tracks?.track ?? [];
  };

  const { data: music, isLoading, isError } = useQuery(['tracks'], fetchMusic);

  // Background video player
  const player = useVideoPlayer(videobg, p => {
    p.loop = true;
    p.play();
  });

  // Play a track
  const playTrack = async (track) => {
    try {
      if (currentSound) {
        await currentSound.unloadAsync(); // Stop previous track
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.url || track?.streamable?.url || '' },
        { shouldPlay: true }
      );

      setCurrentSound(sound);
      setPlayingTrack(track.name);

      // Auto cleanup
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingTrack(null);
        }
      });
    } catch (error) {
      console.log('Error playing track:', error);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="white" style={{ flex: 1, justifyContent: 'center' }} />;
  if (isError) return <Text style={{ color: 'white' }}>Failed to load music.</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Video */}
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />

      {/* Overlay Text */}
      <View style={styles.text_container}>
        <Text style={styles.main_text}>VIBE FREE</Text>
        {playingTrack && <Text style={{ color: 'yellow', marginTop: 10 }}>Playing: {playingTrack}</Text>}
      </View>

      {/* Music List */}
      <ScrollView style={styles.scroll_container}>
        <View style={styles.scrollable_content}>
          {music.map((item, index) => (
            <TouchableOpacity key={index} style={styles.trackItem} onPress={() => playTrack(item)}>
              <Text style={styles.trackName}>{item.name}</Text>
              <Text style={styles.artistName}>{item.artist.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    backgroundColor: 'transparent',
    width: width,
    alignItems: 'center',
  },
  scroll_container: {
    width: width,
    height: height * 0.6,
    zIndex: 1000,
  },
  scrollable_content: {
    backgroundColor: '#fff',
    width: width,
    height: height * 0.6,
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

 