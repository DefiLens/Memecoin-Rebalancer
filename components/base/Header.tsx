import React, { useEffect, useRef, useState } from "react";
import AvatarIcon from "../shared/Avatar";
import useClickOutside from "../../utils/hooks/useClickOutside";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { IoIosArrowDown } from "react-icons/io";
import { shorten } from "../../utils/helper";
import CopyButton from "../shared/CopyButton";
import { LuLogOut } from "react-icons/lu";
import WithdrawModal from "../modals/WithdrawModal";
import { MdOutlineFileDownload } from "react-icons/md";
import { handleLogin } from "../../utils/apis/trackingApi";
import Image from "next/image";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { useGlobalStore } from "../../context/global.store";
import { useRebalanceStore } from "../../context/rebalance.store";
import DepositModal from "../modals/DepositModal";
import PortfolioModal from "../modals/PortfolioModal";
import { IoWalletOutline } from "react-icons/io5";
import { FiDownload, FiUpload } from "react-icons/fi";
import Link from "next/link";
import { tabList } from "../shared/TabBar";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();
  const location = router.pathname;
  const { showCart, setShowCart } = useGlobalStore();
  const { buyTokens, sellTokens } = useRebalanceStore();
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

  const [showChainDropDown, setShowChainDropdown] = useState(false);
  const selectChainRef = useRef(null);
  useClickOutside([selectChainRef], () => {
    setShowChainDropdown(false);
  });

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  function connectToSmartWallet() {
    console.log("coonec");
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
    <header className="bg-zinc-950 h-[60px] flex items-center border-b border-zinc-700">
      <div className="w-full flex justify-between items-center px-4">
        <div className="flex items-center">
          <div className="flex items-center">
            <img height={50} width={50} src="/assets/snapbam.svg" alt="DefiLens" className="h-8 w-8 mr-2 block" />
            <img height={50} width={50} src="/assets/snapbam_text.svg" alt="DefiLens" className="w-24 mr-2" />
          </div>
          <div className="hidden sm:flex items-end border-zinc-500 h-10 ml-10">
            {tabList.map((item) => {
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`flex items-center justify-center gap-2 text-[.7rem] sm:text-sm px-3 sm:px-3.5 py-2 transition-all duration-300 tracking-wide whitespace-nowrap font-semibold cursor-pointer ${
                      location === item.href ? " text-cyan-600" : "text-zinc-400 hover:text-zinc-100"
                    }`}
                  >
                    {item.name}
                    {item.href === "/new-pool" && (
                      <span className="text-[10px] flex items-center gap-2 bg-zinc-800 rounded-xl text-zinc-200 p-0.5 px-2">
                        <span className="block animate-ping h-1 w-1 bg-green-500 rounded-full" />
                        Live
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* <CoinbaseButton /> */}
        <div className="flex gap-2 items-center">
          <div
            onClick={() => setShowChainDropdown(!showChainDropDown)}
            ref={selectChainRef}
            className="relative flex justify-center items-center gap-3 px-2 sm:px-2 py-1.5 sm:py-2 rounded-xl transition duration-300 cursor-pointer bg-zinc-800 hover:bg-opacity-60"
          >
            <a className="tracking-wide group cursor-pointer flex text-sm font-medium text-left px-1 rounded-md items-center">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 text-zinc-200">
                  <Image height={50} width={50} src="/base.svg" alt="Pump Fun" />
                </span>
                <span className="transition-opacity duration-75">Base</span>
              </div>
            </a>
            {/* <IoIosArrowDown
                className={`text-white text-xl transition-all duration-150 ${showChainDropDown ? "rotate-180" : ""}`}
              /> */}

            {showChainDropDown && (
              <div className="absolute top-14 right-0 z-50 flex flex-col justify-center items-start border-1 shadow-xl rounded-lg">
                <div className="bg-zinc-950 border border-zinc-700 w-full relative flex flex-col p-4 gap-2 cursor-default rounded-xl min">
                  <a className="tracking-wide group cursor-pointer flex text-sm font-medium text-left rounded-md items-center px-4 py-2 bg-zinc-800 border border-zinc-600 hover:bg-opacity-70 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 text-zinc-200">
                        <Image height={50} width={50} src="/base.svg" alt="Pump Fun" />
                      </span>
                      <span className="transition-opacity duration-75">Base</span>
                    </div>
                  </a>
                  <a
                    href="https://solana.snapbam.fun/"
                    target="_blank"
                    className="tracking-wide group cursor-pointer flex text-sm font-medium text-left rounded-md items-center px-3 py-2 bg-zinc-800 hover:bg-opacity-70 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-7 w-7 text-zinc-200">
                        <Image height={50} width={50} src="/solana.webp" alt="Pump Fun" />
                      </span>
                      <span className="transition-opacity duration-75">Solana</span>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
          {isConnected && (
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-opacity-70 transition-all duration-200 flex items-center gap-2 pr-2 pl-2"
            >
              <div className="flex items-center gap-2 sm:border-r sm:border-zinc-700 p-2">
                <Image src="/usdc.png" alt="USDC" width={20} height={20} className="rounded-full" />
                <span className="text-sm text-white">{usdcBalance?.formatted || "0"} USDC</span>
              </div>

              <MdOutlineFileDownload className="hidden sm:inline text-xl" />
              {/* <span className="hidden sm:inline">Deposit USDC</span> */}
            </button>
          )}
          <button
            onClick={() => setShowCart(!showCart)}
            className={`${
              showCart ? "bg-cyan-800" : "bg-zinc-800"
            } inline p-2 border border-zinc-700 rounded-xl hover:bg-opacity-70 transition-all duration-200 relative`}
          >
            {buyTokens.length + sellTokens.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-cyan-600 h-4 w-4 rounded-full text-[10px] flex items-center justify-center">
                {buyTokens.length + sellTokens.length}
              </div>
            )}
            <PiShoppingCartSimpleBold className="text-xl" />
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
              className="relative flex justify-center items-center gap-3 sm:px-5 sm:py-2 rounded-full sm:rounded-xl transition duration-300 cursor-pointer bg-zinc-800 hover:bg-opacity-60"
            >
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <AvatarIcon address={String(address)} />
              </div>
              <span className="hidden sm:inline text-white rounded-full text-base font-semibold">
                {shorten(address)}
              </span>
              <IoIosArrowDown
                className={`hidden sm:inline text-white text-xl transition-all duration-150 ${
                  showDropDown ? "rotate-180" : ""
                }`}
              />

              {showDropDown && (
                <div className="absolute top-14 right-0 z-50 flex flex-col justify-center items-start border-1 shadow-xl rounded-lg">
                  {/* SCW Address and Balance */}
                  <div className="bg-zinc-950 border border-zinc-700 w-full relative flex flex-col p-4 gap-2 cursor-default rounded-xl min-w-80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 p-2">
                        <div className="h-7 w-7 rounded-full overflow-hidden">
                          <AvatarIcon address={String(address)} />
                        </div>
                        <span className="text-white rounded-full text-sm sm:text-lg font-semibold">
                          {shorten(String(address))}
                        </span>
                        <CopyButton copy={String(address)} className="text-xs" />
                      </div>
                      <div className="flex items-center gap-5">
                        <button onClick={() => disconnect()}>
                          <LuLogOut className="text-white text-xl" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="flex items-center gap-3 p-2 bg-zinc-800 bg-opacity-80 hover:bg-zinc-900 rounded-lg text-zinc-200 text-sm sm:text-base font-medium"
                    >
                      <FiDownload className="text-xl" />
                      <span>Deposit USDC</span>
                    </button>

                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="flex items-center gap-3 p-2 bg-zinc-800 bg-opacity-80 hover:bg-zinc-900 rounded-lg text-zinc-200 text-sm sm:text-base font-medium"
                    >
                      <FiUpload className="text-xl" />
                      <span>Withdraw</span>
                    </button>
                    <Link href="/wallet">
                      <button
                        // onClick={() => setShowPortfolio(true)}
                        className="flex items-center gap-3 p-2 bg-zinc-800 bg-opacity-80 hover:bg-zinc-900 rounded-lg text-zinc-200 text-sm sm:text-base font-medium"
                      >
                        <IoWalletOutline className="text-xl" />
                        <span>Wallet</span>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showDepositModal && <DepositModal onClose={() => setShowDepositModal(false)} />}
      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          userAddress={address || ""}
        />
      )}
      {showPortfolio && <PortfolioModal isOpen={showPortfolio} onClose={() => setShowPortfolio(false)} />}
    </header>
  );
};

export default Header;
