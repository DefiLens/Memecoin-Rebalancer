import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';

const WalletInfo: React.FC = () => {
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [isAddressHovered, setIsAddressHovered] = useState(false);
    const { address } = useAccount();
    const { data: ethBalance } = useBalance({ address });
    const { data: usdcBalance } = useBalance({
        address,
        token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC address on Base
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Address copied to clipboard!');
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 10)}`;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Wallet Info</h2>
                <button
                    onClick={() => setShowDepositModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    + Deposit USDC
                </button>
            </div>
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <Image src="/base.svg" alt="Base" width={24} height={24} className="mr-4" />
                    <span className="text-white ml-1 mr-2">Base Smart Account:</span>
                    {address ? (
                        <div 
                            className="bg-gray-700 px-2 py-1 rounded cursor-pointer relative"
                            onMouseEnter={() => setIsAddressHovered(true)}
                            onMouseLeave={() => setIsAddressHovered(false)}
                            onClick={() => copyToClipboard(address)}
                        >
                            <span>{formatAddress(address)}</span>
                            {isAddressHovered && (
                                <div className="absolute left-0 bottom-full mb-2 bg-gray-900 text-white p-2 rounded shadow-lg whitespace-nowrap">
                                    {address}
                                </div>
                            )}
                        </div>
                    ) : (
                        <span>Not connected</span>
                    )}
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <Image src="/ethereum.svg" alt="ETH" width={24} height={24} className="mr-4" />
                    <span className="text-white ml-1 mr-2">ETH Balance:</span>
                    <span className="text-white font-bold">{ethBalance?.formatted || '0'} ETH</span>
                </div>
            </div>
            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <Image src="/usdc.png" alt="USDC" width={24} height={24} className="mr-4" />
                    <span className="text-white ml-1 mr-2">USDC Balance:</span>
                    <span className="text-white font-bold">{usdcBalance?.formatted || '0'} USDC</span>
                </div>
            </div>

            {showDepositModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4 text-white">Deposit USDC</h3>
                        <p className="mb-4 text-gray-300">
                            Please send USDC to the following address:
                        </p>
                        <div className="bg-gray-700 p-3 rounded mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-mono break-all">{address}</span>
                                <div className="flex items-center ml-2">
                                    <button
                                        onClick={() => address && copyToClipboard(address)}
                                        className="text-blue-400 hover:text-blue-300 mr-2"
                                    >
                                        <FiCopy size={20} />
                                    </button>
                                    <a
                                        href={`https://basescan.org/address/${address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300"
                                    >
                                        <FiExternalLink size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-yellow-400 mb-4">
                            Note: Please ensure you are sending USDC on the Base network.
                            USDC Contract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
                        </p>
                        <button
                            onClick={() => setShowDepositModal(false)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletInfo;