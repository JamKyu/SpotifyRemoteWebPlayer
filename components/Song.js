import Image from "next/image";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import { calcDuration } from "../lib/time";
import explicit from "../public/explicit.png";

export default function Song({ order, track }) {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = async () => {
    setCurrentTrackId(track.track.id);
    setIsPlaying(true);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className="grid grid-cols-2 px-4 py-1 text-gray-400 hover:bg-zinc-800 rounded-lg cursor-pointer"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p className="w-5 text-right">{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt="Track Image"
        />
        <div>
          <p className="w-36 lg:w-64 text-white truncate">{track.track.name}</p>
          <div className="w-40 truncate flex">
            {track.track.explicit ? (
              <>
                <p>
                  <Image
                    src={explicit}
                    width="24px"
                    height="24px"
                    className="explicit"
                  />
                </p>
                <p className="ml-1.5">{track.track.artists[0].name}</p>
              </>
            ) : (
              <p>{track.track.artists[0].name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline truncate">
          {track.track.album.name}
        </p>
        <p>{calcDuration(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}
