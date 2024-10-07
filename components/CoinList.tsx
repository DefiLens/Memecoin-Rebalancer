import React from 'react';
import CoinRow from './CoinRow';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  market_cap: number;
  total_volume: number;
  ath: number;
}

interface CoinListProps {
  coins: Coin[];
  selectedCoins: string[];
  onSelect: (id: string) => void;
}

const CoinList: React.FC<CoinListProps> = ({ coins, selectedCoins, onSelect }) => {
  return (
    <div className="overflow-x-auto bg-light-blue rounded-lg shadow-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-dark-blue">
            <th className="p-4 text-gray-300">Token</th>
            <th className="p-4 text-gray-300">Price</th>
            <th className="p-4 text-gray-300">24h</th>
            <th className="p-4 text-gray-300">7d</th>
            <th className="p-4 text-gray-300">Market Cap</th>
            <th className="p-4 text-gray-300">Volume</th>
            <th className="p-4 text-gray-300">ATH</th>
            <th className="p-4 text-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => (
            <CoinRow 
              key={coin.id} 
              coin={coin} 
              isSelected={selectedCoins.includes(coin.id)}
              onSelect={onSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoinList;