import { getProviders, signIn } from "next-auth/react";
import Logo from "../public/Spotify.png";
import Image from "next/image";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-[#191414] min-h-screen w-full justify-center">
      <div className="mb-5">
        <Image width="208px" height="208px" src={Logo} alt="Spotify Logo" />
      </div>

      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#1DB954] text-[#191414] px-10 py-5 rounded-full hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition ease duration-300 font-semibold"
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
