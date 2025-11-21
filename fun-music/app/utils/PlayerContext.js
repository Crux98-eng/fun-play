
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const soundRef = useRef(null);
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // load and play a track. track should have a `url` property (or `song`)
  const _getUri = (track) => track?.url || track?.song || track?.uri || null;

  const playSong = async (track, idx = 0, list = []) => {
    if (!track) return;
    const uri = _getUri(track);
    if (!uri) return console.warn('playSong: track has no uri', track);

    if (list.length) setPlaylist(list);

    // If same track currently loaded, toggle play/pause
    if (currentTrack && _getUri(currentTrack) === uri && soundRef.current) {
      try {
        const status = await soundRef.current.getStatusAsync();
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
        setIndex(idx);
        setCurrentTrack(track);
      } catch (e) {
        console.warn('toggle play error', e);
      }
      return;
    }

    // otherwise unload previous and load new
    try {
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
        } catch (e) {}
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {}
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
      soundRef.current = sound;

      soundRef.current.setOnPlaybackStatusUpdate((status) => {
        if (!status) return;
        setIsPlaying(!!status.isPlaying);
        if (status.didJustFinish) {
          // automatically go to next track when finished
          _playNextAfterFinish();
        }
      });

      setCurrentTrack(track);
      setIndex(idx);
    } catch (e) {
      console.error('playSong error', e);
    }
  };

  const _playNextAfterFinish = async () => {
    if (!playlist || !playlist.length) {
      setIsPlaying(false);
      return;
    }
    const nextIndex = (index + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    await playSong(nextTrack, nextIndex, playlist);
  };

  const next = async () => {
    if (!playlist || !playlist.length) return;
    const nextIndex = (index + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    await playSong(nextTrack, nextIndex, playlist);
  };

  const previous = async () => {
    if (!playlist || !playlist.length) return;
    const prevIndex = index <= 0 ? playlist.length - 1 : index - 1;
    const prevTrack = playlist[prevIndex];
    await playSong(prevTrack, prevIndex, playlist);
  };

  const togglePlay = async () => {
    try {
      if (!soundRef.current) return;
      const status = await soundRef.current.getStatusAsync();
      if (status.isPlaying) await soundRef.current.pauseAsync();
      else await soundRef.current.playAsync();
    } catch (e) {
      console.warn('togglePlay error', e);
    }
  };

  // cleanup
  useEffect(() => {
    return () => {
      (async () => {
        try {
          if (soundRef.current) {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
        } catch (e) {}
      })();
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playSong,
        next,
        previous,
        togglePlay,
        currentTrack,
        playlist,
        index,
        isPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
