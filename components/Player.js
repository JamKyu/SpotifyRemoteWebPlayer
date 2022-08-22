import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RefreshIcon,
  RewindIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { repeatState, shuffleState } from "../atoms/playbackAtom";
import { debounce } from "lodash";
import ReactSlider from "react-slider";

export default function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [shuffled, setShuffle] = useRecoilState(shuffleState);
  const [repeated, setRepeat] = useRecoilState(repeatState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now Playing:", data.body?.item);
        setCurrentIdTrack(data.body?.item?.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const handleShuffle = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.shuffle_state) {
        spotifyApi.setShuffle(false);
        setShuffle(false);
      } else {
        spotifyApi.setShuffle(true);
        setShuffle(true);
      }
    });
  };

  const handleRepeat = () => {
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      if (repeated) {
        spotifyApi.setRepeat("off");
        setRepeat(false);
      } else {
        spotifyApi.setRepeat("track");
        setRepeat(true);
      }
    });
  };

  const handleSkip = () => {
    spotifyApi.skipToNext();
  };

  const handlePrevious = () => {
    spotifyApi.skipToPrevious();
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  useEffect(() => {
    if (volume >= 0 && volume <= 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-[#191414] border-t-[1px] border-zinc-800 text-white text-opacity-60 grid grid-cols-3 text-xs md:text-base px-2 md:px-4">
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-16 w-16"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3 className="text-white">{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon
          className={`button ${
            shuffled ? "text-[#1DB954] hover:text-[#1ed760]" : ""
          }`}
          onClick={handleShuffle}
        />
        <RewindIcon
          className="button cursor-not-allowed"
          // onClick={handlePrevious}
        />

        {isPlaying ? (
          <PauseIcon
            className="button w-10 h-10 text-white hover:scale-110"
            onClick={handlePlayPause}
          />
        ) : (
          <PlayIcon
            className="button w-10 h-10 text-white hover:scale-110"
            onClick={handlePlayPause}
          />
        )}

        <FastForwardIcon
          className="button cursor-not-allowed"
          // onClick={handleSkip}
        />
        <RefreshIcon
          className={`button ${
            repeated ? "text-[#1DB954] hover:text-[#1ed760]" : ""
          }`}
          onClick={handleRepeat}
        />
      </div>
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-2 md:pr-5">
        <div className="volume flex items-center space-x-3 md:space-x-4 group">
          {volume > 0 ? (
            <VolumeUpIcon className="button" onClick={() => setVolume(0)} />
          ) : (
            <VolumeOffIcon className="button" onClick={() => setVolume(50)} />
          )}
          <ReactSlider
            className="slider h-1 w-16 md:w-48 rounded-md"
            thumbClassName="w-3 h-3 md:w-4 md:h-4 invisible group-hover:visible hover:cursor-pointer bg-white rounded-full focus:outline-none -top-[4px] md:-top-[6px]"
            trackClassName="track"
            min={0}
            max={100}
            value={volume}
            onChange={(value) => setVolume(value)}
          />
        </div>
      </div>
    </div>
  );
}
