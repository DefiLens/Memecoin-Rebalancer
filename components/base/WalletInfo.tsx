import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import CopyButton from '../shared/CopyButton';
import AvatarIcon from '../shared/Avatar';
import { MdOutlineFileDownload } from 'react-icons/md';
import WithdrawModal from './WithdrawModal';
import Portfolio from './Portfolio';

const WalletInfo: React.FC = () => {
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPortfolio, setShowPortfolio] = useState(false);
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
    <>
      {/* <div className=" w-full flex flex-row justify-between items-center gap-3 bg-N0 shadow-lg rounded-lg px-2 py-3 bg-P1 pr-10"> */}
      <div className=" w-full flex flex-row justify-between items-center gap-3 bg-N0 shadow-lg rounded-lg px-2 py-3 bg-B1 pr-10">
        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-2 text-start relative">
          {/* User Image and total Worth of tokens */}
          <div className="flex flex-row items-center gap-2">
            <div className="h-28 w-28 rounded-xl overflow-hidden">
              <AvatarIcon address={address ?? ''} />
            </div>
            <div className="w-full max-w-full sm:max-w-fit flex flex-col sm:flex-row lg:flex-row justify-center items-start gap-4 text-B200 font-bold">
              <div className="w-full relative flex justify-between items-center p-2 rounded bg-W100 gap-3">
                <div className="flex flex-col justify-center gap-2 items-start">
                  <span className="text-B100 text-xl flex items-center gap-2">
                    <Image
                      src="/ethereum.svg"
                      alt="ETH"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {ethBalance?.formatted || '0'} ETH
                  </span>
                  <span className="text-B100 text-xl flex items-center gap-2">
                    <Image
                      src="/usdc.png"
                      alt="USDC"
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    {usdcBalance?.formatted || '0'} USDC
                  </span>
                  {address ? (
                    <span
                      onMouseEnter={() => setIsAddressHovered(true)}
                      onMouseLeave={() => setIsAddressHovered(false)}
                      className="relative text-base font-medium inline-flex items-center gap-1"
                    >
                      {address && address.slice(0, 14) + '...' + address.slice(-8)}
                      <CopyButton copy={address} className="text-xs ml-2" />
                      {isAddressHovered && (
                        <div className="absolute left-0 bottom-5 mb-2 bg-zinc-900 text-white p-2 rounded shadow-lg whitespace-nowrap text-sm">
                          {address}
                        </div>
                      )}
                    </span>
                  ) : (
                    <span>Not connected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="hidden lg:flex h-full px-4 py-2 rounded-lg border text-xs font-semibold text-zinc-200 border-zinc-700 bg-P1 hover:bg-zinc-800 transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed mr-2"
            >
              <MdOutlineFileDownload className="text-B200 text-lg" />
              Deposit USDC
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="hidden lg:flex h-full px-4 py-2 rounded-lg border text-xs font-semibold text-zinc-200 border-zinc-700 bg-P1 hover:bg-zinc-800 transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed"
            >
              Withdraw Tokens
            </button>
            <button
              onClick={() => setShowPortfolio(true)}
              className="hidden lg:flex h-full px-4 py-2 rounded-lg border text-xs font-semibold text-zinc-200 border-zinc-700 bg-P1 hover:bg-zinc-800 transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center gap-1 font-condensed"
            >
              Meme Portfolio
            </button>
          </div>
        </div>
      </div>
      {showDepositModal && (
        <div className="fixed inset-0 bg-P3 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-P1 p-6 rounded-lg max-w-2xl w-full relative">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-3 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">Deposit USDC</h3>
            <p className="mb-4 text-zinc-300">Please send USDC to the following address:</p>
            <div className="bg-zinc-700 p-3 rounded mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-mono break-all">{address}</span>
                <div className="flex items-center ml-2">
                  <CopyButton copy={address} className="text-lg ml-2" />

                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg ml-2"
                  >
                    <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>
            <p className="text-sm text-yellow-400 mb-4">
              Note: Please ensure you are sending USDC on the Base network. USDC Contract:
              0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
            </p>
          </div>
        </div>
      )}
      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          userAddress={address || ''}
        />
      )}
      {showPortfolio && (
        <Portfolio
          isOpen={showPortfolio}
          onClose={() => setShowPortfolio(false)}
          userAddress={address?.startsWith('0x') ? address : undefined}
        />
      )}
    </>
  );
};

export default WalletInfo;
