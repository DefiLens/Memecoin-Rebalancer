import React, { useEffect, useRef, useState } from "react";
import CoinbaseButton from "./CoinbaseButton";
import AvatarIcon from "../shared/Avatar";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { IoIosArrowDown } from "react-icons/io";
import { shorten } from "../../utils/helper";
import CopyButton from "../shared/CopyButton";
import { LuLogOut } from "react-icons/lu";
import { FaChartPie, FaWallet } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import WithdrawModal from "../WithdrawModal";
import Portfolio from "../Portfolio";
import { MdOutlineFileDownload } from "react-icons/md";
import { handleLogin } from "../../utils/apis/trackingApi";
import Image from "next/image";

const Header: React.FC = () => {
    const [showDropDown, setShowDropdown] = useState(false);
    const walletAddressRef = useRef(null);
    const { address, isConnected, isConnecting, isDisconnected } = useAccount();
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showPortfolio, setShowPortfolio] = useState(false);
    const { data: usdcBalance } = useBalance({
        address,
        token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC address on Base
    });
    useClickOutside([walletAddressRef], () => {
        setShowDropdown(false);
    });

    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();

    function connectToSmartWallet() {
        const coinbaseWalletConnector = connectors.find((connector) => connector.id === "coinbaseWalletSDK");

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

    return (
        <header className="bg-B1 h-[60px] flex items-center">
            <div className="w-full flex justify-between items-center px-4"> {/* Removed 'container mx-auto' */}
                <div className="flex items-center">
                    <img src="/assets/logo.svg" alt="DefiLens" className="h-8 w-8 mr-2" />
                    <h1 className="text-2xl font-bold text-white">DefiLens</h1>
                </div>
                {/* <CoinbaseButton /> */}

                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setShowDepositModal(true)}
                        className="bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-opacity-70 transition-all duration-200 flex items-center gap-2 pr-4 pl-2"
                    >
                        <div className="flex items-center gap-2 border-r border-zinc-700 p-2">
                            <Image src="/usdc.png" alt="USDC" width={20} height={20} className="rounded-full" />
                            <span className="text-sm text-white">{usdcBalance?.formatted || "0"} USDC</span>
                        </div>

                        <MdOutlineFileDownload className="text-xl" />
                        <span>Deposit USDC</span>
                    </button>
                    {!isConnected && (
                        <button
                            onClick={connectToSmartWallet}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 hover:bg-opacity-70 transition-all duration-200"
                        >
                            <span>Connect Wallet</span>
                        </button>
                    )}
                    {isConnected && (
                        <div
                            onClick={() => setShowDropdown(!showDropDown)}
                            ref={walletAddressRef}
                            className="relative flex justify-center items-center gap-3 px-5 py-2 rounded-xl transition duration-300 cursor-pointer bg-zinc-800 hover:bg-opacity-60"
                        >
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                                <AvatarIcon address={String(address)} />
                            </div>
                            <span className="text-white rounded-full text-base">{shorten(address)}</span>
                            <IoIosArrowDown
                                className={`text-white text-xl transition-all duration-150 ${showDropDown ? "rotate-180" : ""
                                    }`}
                            />

                            {showDropDown && (
                                <div className="absolute top-14 right-0 z-50 flex flex-col justify-center items-start border-1 shadow-xl rounded-lg">
                                    {/* SCW Address and Balance */}
                                    <div className="bg-zinc-950 border-zinc-700 w-full relative flex flex-col p-4 gap-2 cursor-default rounded-xl min-w-80">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 p-2">
                                                <div className="h-7 w-7 rounded-full overflow-hidden">
                                                    <AvatarIcon address={String(address)} />
                                                </div>
                                                <span className="text-white rounded-full text-lg">
                                                    {shorten(address)}
                                                </span>
                                                <CopyButton copy={address} />
                                            </div>
                                            <div className="flex items-center gap-5">
                                                <button onClick={() => disconnect()}>
                                                    <LuLogOut className="text-white text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowWithdrawModal(true)}
                                            className="flex items-center gap-3 p-2 bg-zinc-800 bg-opacity-80 hover:bg-zinc-900 rounded-lg text-zinc-200"
                                        >
                                            <FaWallet className="text-xl" />
                                            <span>Withdraw tokens</span>
                                        </button>
                                        <button
                                            onClick={() => setShowPortfolio(true)}
                                            className="flex items-center gap-3 p-2 bg-zinc-800 bg-opacity-80 hover:bg-zinc-900 rounded-lg text-zinc-200"
                                        >
                                            <FaChartPie className="text-xl" />
                                            <span>Meme Portfolio</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
        </header>
    );
};

export default Header;
