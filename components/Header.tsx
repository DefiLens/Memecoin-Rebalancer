import React from 'react';
import CoinbaseButton from './CoinbaseButton';

const Header: React.FC = () => {
  return (
    <header className="bg-dark-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="/logo.png" alt="MemeFolio" className="h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">MemeFolio</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6 text-gray-300">
            <li className="hover:text-white cursor-pointer">Eliminate jargon</li>
            <li className="hover:text-white cursor-pointer">Trade top 100 memes</li>
          </ul>
        </nav>
        <CoinbaseButton />
      </div>
    </header>
  );
};

export default Header;