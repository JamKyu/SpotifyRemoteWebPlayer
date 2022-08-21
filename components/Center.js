import { LogoutIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import spotifyApi from "../lib/spotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
  "from-teal-500",
  "from-rose-500",
];

export default function Center() {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Error", err));
  }, [spotifyApi, playlistId]);

  // console.log(playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 bg-opacity-70 hover:bg-[#191414] cursor-pointer rounded-full p-1 pr-3 text-white font-semibold"
          onClick={signOut}
        >
          <img
            className="rounded-full w-7 h-7"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <LogoutIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-[#191414] ${color} h-80 text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="uppercase font-medium text-xs">
            {playlist?.public
              ? `public ${playlist?.type}`
              : `private ${playlist?.type}`}
          </p>
          <h2 className="text-6xl font-bold mt-2 mb-8">{playlist?.name}</h2>
          <div className="flex items-center">
            <p className="font-semibold">{playlist?.owner.display_name} ·</p>
            {playlist?.followers.total ? (
              <p className="ml-1">
                {playlist?.followers.total > 1
                  ? `${playlist?.followers.total.toLocaleString(
                      "en"
                    )} followers`
                  : `${playlist?.followers.total} follower`}{" "}
                ·
              </p>
            ) : (
              ""
            )}
            <p className="ml-1">
              {playlist?.tracks.total > 1
                ? `${playlist?.tracks.total.toLocaleString("en")} songs`
                : `${playlist?.tracks.total} song`}
            </p>
          </div>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}
