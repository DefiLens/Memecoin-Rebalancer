import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { useGlobalStore } from "../../context/global.store";
import { useRebalanceStore } from "../../context/rebalance.store";
import { ICoinDetails } from "./types";

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
        </div>
    );
};

export default SellTokens;
