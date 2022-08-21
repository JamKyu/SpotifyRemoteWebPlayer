import { getSession } from "next-auth/react";
import Head from "next/head";
import Center from "../components/Center";
import NoSsr from "../components/NoSsr";
import Player from "../components/Player";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="bg-[#191414] h-screen overflow-hidden">
      <Head>
        <title>Spotify Remote Player</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <NoSsr>
          <Player />
        </NoSsr>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
