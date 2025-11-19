
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createAudioPlayer } from 'expo-audio';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  // createAudioPlayer returns a persistent player instance (you must remove() when done)
  const playerRef = useRef(createAudioPlayer(null));
  const player = playerRef.current;

  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(-1);
  const [currentTrack, setCurrentTrack] = useState(null);

  // play a given track (track = { name, title, song })
  const playSong = async (track, idx = 0, list = []) => {
    // if switching playlist
    if (list.length) setPlaylist(list);

    // if same track already loaded
    if (currentTrack?.song === track.song) {
      // toggle
      if (player.playing) player.pause();
      else player.play();
      setCurrentTrack(track);
      setIndex(idx);
      return;
    }

    // ensure previous audio is stopped/paused and replaced (no overlapping)
    try {
      if (player.playing) player.pause();
      // replace loads new source and keeps same player instance
      await player.replace(track.song);
      // optional: reset position
      await player.seekTo(0);
      player.play();
      setCurrentTrack(track);
      setIndex(idx);
    } catch (e) {
      console.error('player playSong error', e);
    }
  };

  const next = async () => {
    if (!playlist.length) return;
    const nextIndex = (index + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    await playSong(nextTrack, nextIndex, playlist);
  };

  const previous = async () => {
    if (!playlist.length) return;
    const prevIndex = index <= 0 ? playlist.length - 1 : index - 1;
    const prevTrack = playlist[prevIndex];
    await playSong(prevTrack, prevIndex, playlist);
  };

  // unload player when app unmounts / provider unmounts
  useEffect(() => {
    return () => {
      try {
        // remove frees resources
        player.pause?.();
        player.remove?.();
      } catch (e) {
        /* ignore cleanup errors */
      }
    };
  }, [player]);

  return (
    <PlayerContext.Provider
      value={{
        player,
        playSong,
        next,
        previous,
        currentTrack,
        playlist,
        index,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
