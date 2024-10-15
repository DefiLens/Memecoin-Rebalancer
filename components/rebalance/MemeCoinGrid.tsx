import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { ICoinDetails, MemeCoinGridProps } from "./types";
import { useGlobalStore } from "../../context/global.store";
import { useRebalanceStore } from "../../context/rebalance.store";

const BuyTokens: React.FC<{ resetSwapAmount: () => void }> = ({ resetSwapAmount }) => {
    const { buyTokens, toggleBuyToken } = useRebalanceStore();
    const { allCoins } = useGlobalStore(); // Get the setter from Zustand
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(25);

    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 25);
    };

    useEffect(() => {
        let filteredCoins = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setDisplayedCoins(filteredCoins.slice(0, displayCount));
    }, [allCoins, searchTerm, displayCount]);
    return (
        <div className="w-full flex flex-col gap-4">
            <input
                type="text"
                placeholder="Search memecoins..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setDisplayCount(25); // Reset display count when searching
                }}
                className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none z-10"
            />

            <div className="grid grid-cols-3 gap-2 hide_scrollbar">
                {displayedCoins.map((coin) => (
                    <Coin
                        key={coin.id}
                        coin={coin}
                        selectedCoins={buyTokens}
                        handleCoinSelect={toggleBuyToken}
                        type={"buy"}
                    />
                ))}
            </div>

            {displayedCoins.length <
                (searchTerm
                    ? allCoins.filter(
                          (coin) =>
                              coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length
                    : allCoins.length) && (
                <button
                    onClick={loadMore}
                    className="mt-4 bg-zinc-800 border border-zinc-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Load More
                </button>
            )}
        </div>
    );
};

const SellTokens: React.FC<{ resetSwapAmount: () => void }> = ({ resetSwapAmount }) => {
    const { sellTokens, toggleSellToken } = useRebalanceStore();
    const { allCoins } = useGlobalStore(); // Get the setter from Zustand
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let filteredCoins = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedCoins(filteredCoins);
    }, [allCoins, searchTerm]);

    return (
        <div className="w-full flex flex-col gap-4">
            <input
                type="text"
                placeholder="Search memecoins..."
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // setDisplayCount(25); // Reset display count when searching
                }}
                className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none z-10"
            />

            <div className="grid grid-cols-3 gap-2 hide_scrollbar">
                {displayedCoins.map((coin) => (
                    <Coin
                        key={coin.id}
                        coin={coin}
                        selectedCoins={sellTokens}
                        handleCoinSelect={toggleSellToken}
                        type={"sell"}
                    />
                ))}
            </div>
            {/* {displayedCoins.length <
                (searchTerm
                    ? allCoins.filter(
                          (coin) =>
                              coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length
                    : allCoins.length) && (
                <button
                    onClick={loadMore}
                    className="mt-4 bg-zinc-800 border border-zinc-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Load More
                </button>
            )} */}
        </div>
    );
};

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex gap-3">
                <button
                    className={`px-4 py-2 w-20 rounded-lg border ${
                        activeTab === "buy"
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}
                    onClick={() => setActiveTab("buy")}
                >
                    Buy
                </button>
                <button
                    className={`px-4 py-2 w-20 rounded-lg border ${
                        activeTab === "sell"
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}
                    onClick={() => setActiveTab("sell")}
                >
                    Sell
                </button>
            </div>

            {activeTab === "buy" ? (
                <BuyTokens resetSwapAmount={resetSwapAmount} />
            ) : (
                <SellTokens resetSwapAmount={resetSwapAmount} />
            )}
        </div>
    );
};

export default MemeCoinGrid;
