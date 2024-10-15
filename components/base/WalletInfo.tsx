import React, { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { FiExternalLink } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaWallet, FaChartPie, FaRocket } from "react-icons/fa";
import Image from "next/image";
import CopyButton from "../shared/CopyButton";
import AvatarIcon from "../shared/Avatar";
import WithdrawModal from "../WithdrawModal";
import Portfolio from "../Portfolio";
import { toast } from "react-toastify";
import CoinbaseButton from "./CoinbaseButton";

const WalletInfo: React.FC = () => {
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const [isAddressHovered, setIsAddressHovered] = useState(false);
    const { address, isConnected } = useAccount();
    const { data: ethBalance } = useBalance({ address });
    const { data: usdcBalance } = useBalance({
        address,
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC address on Base
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Address copied to clipboard!");
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 10)}`;

    return (
        <div className="bg-B1">
            {isConnected && (
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-">
                                <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
                                    <AvatarIcon address={address ?? ""} />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex bg-zinc-800 rounded-lg p-4 mb-4">
                                        {/* <h2 className="text-xl font-bold text-white mb-2">Wallet Balance</h2> */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src="/ethereum.svg"
                                                    alt="ETH"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                                <span className="text-lg text-white">
                                                    {ethBalance?.formatted || "0"} ETH
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src="/usdc.png"
                                                    alt="USDC"
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                                <span className="text-lg text-white">
                                                    {usdcBalance?.formatted || "0"} USDC
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="relative">
                    <p
                      onMouseEnter={() => setIsAddressHovered(true)}
                      onMouseLeave={() => setIsAddressHovered(false)}
                      className="text-zinc-400 font-mono text-sm mb-4 flex items-center"
                    >
                      {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : 'Not connected'}
                      {address && <CopyButton copy={address} className="ml-2 text-blue-400 hover:text-blue-300" />}
                    </p>
                    {isAddressHovered && address && (
                      <div className="absolute left-0 top-6 bg-zinc-800 text-white p-2 rounded shadow-lg text-xs z-10">
                        {address}
                      </div>
                    )}
                  </div> */}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => setShowDepositModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                                >
                                    <MdOutlineFileDownload className="text-xl" />
                                    <span>Deposit USDC</span>
                                </button>
                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                                >
                                    <FaWallet className="text-xl" />
                                    <span>Withdraw</span>
                                </button>
                                <button
                                    onClick={() => setShowPortfolio(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                                >
                                    <FaChartPie className="text-xl" />
                                    <span>Portfolio</span>
                                </button>
                            </div>
                        </div>

                        <div className="lg:w-6/12 bg-zinc-800 rounded-lg p-6 flex flex-col justify-center text-center h-fit">
                            <div className="flex items-center gap-4">
                                <FaRocket className="text-4xl text-cyan-500" />
                                <h3 className="text-2xl font-semibold text-white">Meme Trading Made Easy</h3>
                            </div>
                            <p className="text-zinc-300 text-base leading-5 tracking-wide mt-3 text-start">
                                Buy, sell, and rebalance your meme portfolio with just a few clicks. Start your meme
                                trading journey today!
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal components (kept the same) */}
            {showDepositModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-800 p-6 rounded-lg max-w-2xl w-full relative">
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
                                    <CopyButton
                                        copy={address}
                                        className="text-lg ml-2 text-blue-400 hover:text-blue-300"
                                    />
                                    <a
                                        href={`https://basescan.org/address/${address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-lg ml-2 text-blue-400 hover:text-blue-300"
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
                    userAddress={address || ""}
                />
            )}
            {showPortfolio && <Portfolio isOpen={showPortfolio} onClose={() => setShowPortfolio(false)} />}
        </div>
    );
};

export default WalletInfo;
