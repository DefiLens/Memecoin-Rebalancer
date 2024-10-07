import { useState, useEffect, useCallback } from 'react';
import { useAccount } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import Head from 'next/head';
import Header from "../components/Header";
import CoinList from "../components/CoinList";
import WalletInfo from "../components/WalletInfo";
import SelectionInterface from "../components/SelectionInterface";
import RebalanceModal from "../components/RebalanceModal";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  market_cap: number;
  total_volume: number;
  ath: number;
}

interface CoinDetails {
  id: string;
  name: string;
  symbol: string;
  contract_address: string;
  decimal_place: number;
  image: string;
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<CoinDetails[]>([]);
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const { isConnected } = useAccount();

  const {
    writeContractsAsync,
    error: txError,
    status: txStatus,
    data: txData,
  } = useWriteContracts();

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-meme-coins&order=volume_desc&price_change_percentage=24h%2C7d');
        const data = await response.json();
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 45000);

    return () => clearInterval(interval);
  }, []);

  const handleCoinSelect = useCallback(async (id: string) => {
    console.log("Hello1")
    const isAlreadySelected = selectedCoins.some(coin => coin.id === id);
    console.log("Hello12")

    if (isAlreadySelected) {
      console.log("Hello13")

      setSelectedCoins(prev => prev.filter(coin => coin.id !== id));
    } else {
      console.log("Hello14")

      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await response.json();
        const coin = coins.find(c => c.id === id);
        console.log("Hello15")

        if (coin) {
          const newCoinDetails: CoinDetails = {
            id,
            name: data.name,
            symbol: data.symbol,
            contract_address: data.detail_platforms.base?.contract_address || '',
            decimal_place: data.detail_platforms.base?.decimal_place || 18,
            image: coin.image
          };
          console.log("Hello156")

          setSelectedCoins(prev => [...prev, newCoinDetails]);
        }
      } catch (error) {
        console.error('Error fetching coin details:', error);
      }
    }
  }, [coins, selectedCoins]);

  const handleRebalance = (amount: string, percentages: { [key: string]: number }) => {
    console.log('Rebalancing with amount:', amount);
    console.log('Percentages:', percentages);
    console.log('Selected coins:', selectedCoins);
    
    // Here you would implement the logic to execute the trades via Uniswap
    
    // Reset selections after rebalance
    setSelectedCoins([]);
    setShowRebalanceModal(false);
  };

  return (
    <div className="min-h-screen bg-dark-blue">
      <Head>
        <title>BigBags - Memecoin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="container mx-auto px-4 py-8">
        {isConnected && <WalletInfo />}
        <SelectionInterface 
          selectedCount={selectedCoins.length} 
          onRebalance={() => setShowRebalanceModal(true)}
        />
        <h2 className="text-2xl font-bold text-white mb-6">Top Memecoins</h2>
        <CoinList 
          coins={coins} 
          selectedCoins={selectedCoins.map(coin => coin.id)}
          onSelect={handleCoinSelect}
        />
        {txStatus === 'success' && (
          <div className="mt-4 text-white">
            <h3>Transaction Sent:</h3>
            <p>Status: {txStatus}</p>
            {txData && <p>Transaction Hash: {txData}</p>}
          </div>
        )}
        {txError && (
          <div className="mt-4 text-red-500">
            <h3>Transaction Error:</h3>
            <p>{txError.message}</p>
          </div>
        )}
        {showRebalanceModal && (
          <RebalanceModal
            selectedCoins={selectedCoins}
            onClose={() => setShowRebalanceModal(false)}
            onRebalance={handleRebalance}
          />
        )}
      </main>
    </div>
  );
}