import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { useRebalanceStore } from "../../context/rebalance.store";
import { useGlobalStore } from "../../context/global.store";
import { ICoinDetails } from "./types";
import { HiOutlineViewGrid } from "react-icons/hi";
import { FaList } from "react-icons/fa6";

const BuyTokens: React.FC<{ resetSwapAmount: () => void }> = ({ resetSwapAmount }) => {
    const { buyTokens, toggleBuyToken } = useRebalanceStore();
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

    const [showInList, setShowInList] = useState(false);
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search memecoins..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg outline-none z-10"
                />
                <div className="flex items-center rounded-lg border-zinc-800 border">
                    <button
                        onClick={() => setShowInList(true)}
                        className={`${showInList && "bg-zinc-700"} rounded-lg p-3`}
                    >
                        <FaList />
                    </button>
                    <button
                        onClick={() => setShowInList(false)}
                        className={`${!showInList && "bg-zinc-700"} rounded-lg p-3`}
                    >
                        <HiOutlineViewGrid />
                    </button>
                </div>
            </div>
            <div
                className={`grid ${
                    showInList ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                } gap-2 hide_scrollbar`}
            >
                {displayedCoins.map((coin) => (
                    <Coin
                        key={coin.id}
                        coin={coin}
                        selectedCoins={buyTokens}
                        handleCoinSelect={toggleBuyToken}
                        type={"buy"}
                        showInList={showInList}
                    />
                ))}
            </div>
        </div>
    );
};

export default BuyTokens;
