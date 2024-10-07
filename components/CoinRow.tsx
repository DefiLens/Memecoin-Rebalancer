import React from 'react';

interface CoinRowProps {
  coin: {
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
  };
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const CoinRow: React.FC<CoinRowProps> = ({ coin, isSelected, onSelect }) => {
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  const getPercentageColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'text-gray-400';
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <tr className="border-b border-gray-700 hover:bg-light-blue transition duration-300">
      <td className="p-4 flex items-center">
        <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-3 rounded-full" />
        <div>
          <span className="font-bold text-white">{coin.symbol.toUpperCase()}</span>
          <span className="text-gray-400 text-sm block">{coin.name}</span>
        </div>
      </td>
      <td className="p-4 text-white">${coin.current_price.toFixed(6)}</td>
      <td className={`p-4 ${getPercentageColor(coin.price_change_percentage_24h)}`}>
        {formatPercentage(coin.price_change_percentage_24h)}
      </td>
      <td className={`p-4 ${getPercentageColor(coin.price_change_percentage_7d_in_currency)}`}>
        {formatPercentage(coin.price_change_percentage_7d_in_currency)}
      </td>
      <td className="p-4 text-white">${coin.market_cap.toLocaleString()}</td>
      <td className="p-4 text-white">${coin.total_volume.toLocaleString()}</td>
      <td className="p-4 text-white">${coin.ath.toFixed(6)}</td>
      <td className="p-4">
        <button
          onClick={() => onSelect(coin.id)}
          className={`${
            isSelected ? 'bg-accent-green' : 'bg-gray-600'
          } hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300`}
        >
          {isSelected ? '✓ Selected' : 'Select'}
        </button>
      </td>
    </tr>
  );
};

export default CoinRow;