import React from 'react';
import CoinbaseButton from './CoinbaseButton';

const Header: React.FC = () => {
  return (
    <header className="bg-B1 h-[60px] flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div></div>
        {/* <div className="flex items-center">
          <img src="/assets/logo.svg" alt="DefiLens" className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">DefiLens</h1>
        </div> */}
        <CoinbaseButton />
      </div>
    </header>
  );
};

export default Header;