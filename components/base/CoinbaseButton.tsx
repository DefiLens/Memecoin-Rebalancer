import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { handleLogin } from '../../utils/apis/trackingApi';

export default function CoinbaseButton() {
  const { connect, connectors } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  function connectToSmartWallet() {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }

  // Effect to save user address after successful connection
  useEffect(() => {
    if (isConnected && address) {
      handleLogin(address);
    }
  }, [isConnected, address]);

  if (isConnected)
    return (
      <button
        onClick={() => disconnect()}
        className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-opacity-70 transition-all duration-200"
      >
        <span>Disconnect</span>
      </button>
    );

  return (
    <button
      onClick={connectToSmartWallet}
      className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-opacity-70 transition-all duration-200"
    >
      <span>Connect Wallet</span>
    </button>
  );
}
