import { useAccount } from 'wagmi';
import Head from 'next/head';
import Header from '../components/Header';
import WalletInfo from '../components/WalletInfo';
import MemecoinsRebalancer from '../components/MemecoinsRebalancer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-zinc-950">
      <Head>
        <title>DefiLens - Memecoin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <div className="absolute h-screen left-0 top-0 z-50 w-16 hover:w-60 transition-all duration-200 bg-zinc-800 flex flex-col items-center py-4 rounded-tr-xl rounded-br-xl">
        <img src="/logo.svg" alt="DefiLens" className="h-12 w-12" />
      </div> */}
      <Header />
      <main className="container mx-auto px-4 py-8 flex flex-col gap-5">
        {isConnected && <WalletInfo />}
        <MemecoinsRebalancer />
      </main>
      <ToastContainer />
    </div>
  );
}
