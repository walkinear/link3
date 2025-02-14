import Head from "next/head";
import Link from "next/link";
import type { NextPage } from "next";
import Layout from "../components/layout";
import { useNear } from "../context/near";
import { Logo } from "../components/icons/logo";
import ButtonLogin from "../components/buttons";

const Home: NextPage = () => {
  const { accountId, isLoggedIn, logout, show } = useNear();

  const handleLoginClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      show();
    }
  };

  return (
    <Layout>
      <Head>
        <title>Link3</title>
        <meta
          name="description"
          content="A linktree alternative built on NEAR"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" flex flex-col justify-center items-center space-y-10 h-screen">
        <Logo className="w-80 aspect-square rounded-full " />
        <ButtonLogin
          isLoading={false}
          isLoggedIn={isLoggedIn}
          className="w-40"
          onClick={handleLoginClick}
        />
        <div>
          <h1>Hello Context</h1>
          <h2>isLoggedIn: {isLoggedIn ? "is logado" : "is NOT logado"}</h2>
          <h2>AccountId: {accountId ? accountId : "empty"}</h2>
          <div className="flex flex-col space-y-4"></div>
        </div>
        <Link href="/dashboard">
          <a>
            <button>Dashboard</button>
          </a>
        </Link>
      </main>

      <footer className=""></footer>
    </Layout>
  );
};

export default Home;
