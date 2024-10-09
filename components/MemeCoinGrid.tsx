import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CoinDetails } from './MemecoinsRebalancer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { BASE_URL } from '../utils/keys';

const MemeCoinGrid = ({ selectedCoins, handleCoinSelect, selectTokenLoading }: any) => {
  const [allCoins, setAllCoins] = useState<CoinDetails[]>([]);
  const [displayedCoins, setDisplayedCoins] = useState<CoinDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(25);

  const fetchCoins = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/swap/token`);
      const data = await response.json();
      setAllCoins(
        data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          current_price: coin.current_price,
          price_change_percentage_24h: coin.price_change_percentage_24h,
          price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          ath: coin.ath,
          contract_address: '',
          decimal_place: 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching coin data:', error);
      toast.error('Failed to fetch memecoin list');
    }
  }, []);
  useEffect(() => {
    fetchCoins();
    const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
    return () => clearInterval(intervalId);
  }, [fetchCoins]);

  useEffect(() => {
    const filtered = allCoins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedCoins(filtered.slice(0, displayCount));
  }, [allCoins, searchTerm, displayCount]);

  const toggleExpand = (coinId: string) => {
    setExpandedCoin(expandedCoin === coinId ? null : coinId);
  };

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 25);
  };

  const formatPrice = (price: number) => (price < 0.01 ? price.toFixed(6) : price.toFixed(2));
  const formatPercentage = (percentage: number | null) =>
    percentage ? percentage.toFixed(2) : 'N/A';
  const formatMarketCap = (marketCap: number) => {
    if (marketCap > 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap > 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <input
        type="text"
        placeholder="Search memecoins..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setDisplayCount(25); // Reset display count when searching
        }}
        className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2 hide_scrollbar">
        {displayedCoins.map((coin: any) => (
          <div key={coin.id} className="border-zinc-700 border p-2 rounded-lg flex flex-col h-fit">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img src={coin.image} alt={coin.name} className="w-12 h-12 rounded-full mr-1" />
                <span className="font-bold text-base">{coin.symbol.toUpperCase()}</span>
              </div>
              <button
                onClick={() => handleCoinSelect(coin)}
                className={`px-2 py-0.5 rounded text-sm ${
                  selectedCoins.find((c: any) => c.id === coin.id)
                    ? 'bg-primary-gradient'
                    : 'bg-zinc-700 hover:bg-zinc-700 hover: bg-opacity-70'
                }`}
              >
                {selectTokenLoading === coin.id ? (
                  <>Loading...</>
                ) : selectedCoins.find((c: any) => c.id === coin.id) ? (
                  'Selected'
                ) : (
                  'Select'
                )}
              </button>
            </div>
            <div className="text-sm mb-1">
              <span className="text-zinc-400 mr-1">Price:</span>
              <span>${formatPrice(coin.current_price)}</span>
            </div>
            <button
              onClick={() => toggleExpand(coin.id)}
              className="text-zinc-400 hover:text-white text-xs flex items-center justify-center mt-1"
            >
              {expandedCoin === coin.id ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {expandedCoin === coin.id && (
              <div className="text-sm mt-2 border-t border-zinc-600 pt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">24h:</span>
                  <span
                    className={
                      coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}%
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-400">7d:</span>
                  <span
                    className={
                      coin.price_change_percentage_7d_in_currency &&
                      coin.price_change_percentage_7d_in_currency >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {formatPercentage(coin.price_change_percentage_7d_in_currency)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Market Cap:</span>
                  <span>{formatMarketCap(coin.market_cap)}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {displayedCoins.length <
        (searchTerm
          ? allCoins.filter(
              (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            ).length
          : allCoins.length) && (
        <button
          onClick={loadMore}
          className="mt-4 bg-zinc-800 border border-zinc-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default MemeCoinGrid;
