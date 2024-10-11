import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CoinDetails } from './MemecoinsRebalancer';
import { BASE_URL } from '../utils/keys';
import Coin from './Coin';

const MemeCoinGrid = ({ selectedCoins, handleCoinSelect, selectTokenLoading }: any) => {
  const [allCoins, setAllCoins] = useState<CoinDetails[]>([]);
  const [displayedCoins, setDisplayedCoins] = useState<CoinDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
          ath_change_percentage: coin.ath_change_percentage,
          ath_date: coin.ath_date,
          atl: coin.atl,
          atl_change_percentage: coin.atl_change_percentage,
          atl_date: coin.atl_date,
          circulating_supply: coin.circulating_supply,
          fully_diluted_valuation: coin.fully_diluted_valuation,
          high_24h: coin.high_24h,
          last_updated: coin.last_updated,
          low_24h: coin.low_24h,
          market_cap_change_24h: coin.market_cap_change_24h,
          market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
          market_cap_rank: coin.market_cap_rank,
          max_supply: coin.max_supply,
          price_change_24h: coin.price_change_24h,
          price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency,
          total_supply: coin.total_supply,
          roi: coin.roi,
          contract_address: '',
          decimal_place: 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching coin data:', error);
      toast.error('Failed to fetch memecoin list');
    }
  }, []);

  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 25);
  };

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

  return (
    <div className="w-full flex flex-col gap-4">
      <input
        type="text"
        placeholder="Search memecoins..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setDisplayCount(25); // Reset display count when searching
        }}
        className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none z-10"
      />
      <div className="grid grid-cols-3 gap-2 hide_scrollbar">
        {displayedCoins.map((coin: any) => (
          <Coin
            coin={coin}
            selectedCoins={selectedCoins}
            selectTokenLoading={selectTokenLoading}
            handleSelect={() => handleCoinSelect(coin)}
          />
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
