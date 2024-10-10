import React, { useState } from 'react';
import { FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { currencyFormat } from '../utils/helper';
import SingleCoin from './coin/SingleCoin';

const Coin = ({ coin, selectTokenLoading, selectedCoins, handleSelect }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleCoinClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div>
      <div>
        {/* <div className="grid grid-cols-3 sm:grid-cols-5 font-light items-center p-2 rounded hover:bg-zinc-800 my-1"> */}
        <div className="grid grid-cols-3 sm:grid-cols-5 font-light items-center p-2 rounded my-1">
          <div
            className="flex items-center gap-2 w-full hover:text-cyan-500 cursor-pointer"
            onClick={handleCoinClick}
          >
            <img className="w-10 h-10 rounded-full" src={coin.image} alt={coin.name} />
            <p>{coin.name}</p>
          </div>
          <span className="w-full text-center">{currencyFormat(coin.current_price)}</span>
          <span
            className={`flex items-center gap-2 ${
              coin.price_change_percentage_24h < 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {coin.price_change_percentage_24h < 0 ? <FiTrendingDown /> : <FiTrendingUp />}
            {coin.price_change_percentage_24h}
          </span>
          <div className="hidden sm:block">
            <p className="font-semibold text-zinc-200 text-xs">Market Cap</p>
            <span>{currencyFormat(coin.market_cap)}</span>
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleSelect}
              className={`border border-zinc-700 text-xs rounded-lg p-1 ${
                selectedCoins.find((c: any) => c.id === coin.id)
                  ? 'bg-cyan-700'
                  : 'bg-zinc-800 hover:bg-zinc-800 hover:bg-opacity-70'
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
            <button
              onClick={handleCoinClick}
              className="bg-zinc-800 hover:bg-zinc-8z00 hover:bg-opacity-70 text-xs p-1 border border-zinc-700 rounded-lg"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
      <SingleCoin isOpen={isModalOpen} onClose={handleCloseModal} coin={coin} />
    </div>
  );
};

export default Coin;
