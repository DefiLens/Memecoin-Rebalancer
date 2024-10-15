import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { useRebalanceStore } from "../../context/rebalance.store";
import { useGlobalStore } from "../../context/global.store";
import { ICoinDetails } from "./types";

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

export default BuyTokens;
