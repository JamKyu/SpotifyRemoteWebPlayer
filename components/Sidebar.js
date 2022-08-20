import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  console.log("Playlist ID:", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className="text-gray-400 p-5 text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] border-r border-zinc-800 overflow-y-scroll scrollbar-hide h-screen bg-black hidden md:inline-flex">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white transition-all ease duration-300 font-bold cursor-not-allowed">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white transition-all ease duration-300 font-bold cursor-not-allowed">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white transition-all ease duration-300 font-bold cursor-not-allowed">
          <LibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="border-t-[0.1px] border-zinc-800" />
        <button className="flex items-center space-x-2 hover:text-white transition-all ease duration-300 font-bold cursor-not-allowed">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white transition-all ease duration-300 font-bold cursor-not-allowed">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <hr className="border-t-[0.1px] border-zinc-800 " />

        {playlists.map((playlist) => (
          <div className="flex justify-between items-center" key={playlist.id}>
            {playlistId === playlist.id ? (
              <p className="cursor-pointer text-white">{playlist.name}</p>
            ) : (
              <p
                className="cursor-pointer hover:text-white"
                onClick={() => setPlaylistId(playlist.id)}
              >
                {playlist.name}
              </p>
            )}
            {playlist?.collaborative ? (
              <UserGroupIcon width="16px" height="16px" />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
