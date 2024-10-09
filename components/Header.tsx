import React from 'react';
import CoinbaseButton from './CoinbaseButton';

const Header: React.FC = () => {
  return (
    <header className="bg-P1 p-4 border-zinc-700 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.svg" alt="DefiLens" className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">DefiLens</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-zinc-300">
            {/* <li className="hover:text-white cursor-pointer">Rebalance Your Memes in GasLess</li> */}
          </ul>
        </nav>
        <CoinbaseButton />
      </div>
    </header>
  );
};

export default Header;