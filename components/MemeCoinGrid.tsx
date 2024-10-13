import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/keys";
import Coin from "./Coin";
import { memeCoinData } from "../utils/constant";
import { ICoinDetails } from "./rebalance/types";

interface MemeCoinGridProps {
    selectedCoins: ICoinDetails[];
    handleCoinSelect: (coin: ICoinDetails) => Promise<void>;
}

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ selectedCoins, handleCoinSelect }) => {
    const [allCoins, setAllCoins] = useState<ICoinDetails[]>([]);
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(25);

    const fetchCoins = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/swap/token`);
            const backendData: ICoinDetails[] = await response.json();

            const mergedData = backendData.map((coin) => {
                const frontendCoin = memeCoinData.find((fcoin) => fcoin.id === coin.id);
                if (frontendCoin && frontendCoin.detail_platforms.base) {
                    return {
                        ...coin,
                        decimal_place: frontendCoin.detail_platforms.base.decimal_place,
                        contract_address: frontendCoin.detail_platforms.base.contract_address,
                    };
                }
                return coin;
            });

            setAllCoins(mergedData);
        } catch (error) {
            console.error("Error fetching coin data:", error);
            toast.error("Failed to fetch memecoin list");
        }
    }, []);

    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 25);
    };

    useEffect(() => {
        fetchCoins();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    useEffect(() => {
        const filtered = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedCoins(filtered.slice(0, displayCount));
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
                    <Coin coin={coin} selectedCoins={selectedCoins} handleCoinSelect={handleCoinSelect} />
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

export default MemeCoinGrid;
