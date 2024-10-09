import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { BASE_URL } from '../utils/keys';
import { handleLogin } from '../utils/apis/trackingApi';

const buttonStyles = {
  border: '1px solid transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontSize: 16,
  padding: '8px 20px 8px 14px',
  borderRadius: 10,
  color: 'white',
  cursor: 'pointer',
};

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
      <button style={buttonStyles} onClick={() => disconnect()} className='bg-primary-gradient'>
        <span>Disconnect</span>
      </button>
    );

  return (
    <button style={buttonStyles} onClick={connectToSmartWallet} className='bg-primary-gradient'>
      <span>Connect Wallet</span>
    </button>
  );
}
