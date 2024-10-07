import { useAccount } from "wagmi";
import Head from 'next/head';
import Header from "../components/Header";
import WalletInfo from "../components/WalletInfo";
import MemecoinsRebalancer from "../components/MemecoinsRebalancer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-dark-blue">
      <Head>
        <title>DefiLens - Memecoin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="container mx-auto px-4 py-8">
        {isConnected && <WalletInfo />}
        <h2 className="text-2xl font-bold text-white mb-6">Memecoin Rebalancer</h2>
        <MemecoinsRebalancer />
      </main>
      <ToastContainer />
    </div>
  );
}