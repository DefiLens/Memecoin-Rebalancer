import React from 'react';
import { useAccount, useBalance } from 'wagmi';

const WalletInfo: React.FC = () => {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });

  const shortenAddress = (addr: string) => {
    return addr//`${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Address copied to clipboard!');
  };

  const getNetworkName = (id: number | undefined) => {
    switch (id) {
      case 8453:
        return 'Base';
      case 84532:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  if (!address || !chain) return null;

  return (
    <div className="bg-light-blue p-4 rounded-lg mb-6">
      <h3 className="text-xl font-bold mb-2">Wallet Info</h3>
      <p className="mb-2">
        Address:{' '}
        <span
          className="cursor-pointer hover:text-accent-green"
          onClick={() => copyToClipboard(address)}
          title="Click to copy"
        >
          {shortenAddress(address)}
        </span>
      </p>
      <p className="mb-2">Network: {getNetworkName(chain.id)}</p>
      {balance && (
        <p>
          Balance: {balance.formatted} {balance.symbol}
        </p>
      )}
    </div>
  );
};

export default WalletInfo;