import { useAccount } from 'wagmi';
import Head from 'next/head';
import Header from '../components/Header';
import WalletInfo from '../components/WalletInfo';
import MemecoinsRebalancer from '../components/MemecoinsRebalancer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Footer from '../components/base/Footer';
import MetaTags from '../components/metaTags';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="flex flex-col h-screen bg-[#131313]">
      <MetaTags />
      <header className="h-[60px] bg-B1">
        <Header />
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">
        <section className="px-2 pt-2">{isConnected && <WalletInfo />}</section>

        <section className="flex-1 overflow-hidden">
          <div className="p-2 flex h-full flex-col">
            <MemecoinsRebalancer />
          </div>
        </section>
      </main>

      <Footer />
      <ToastContainer theme="dark" />
    </div>
  );
}
