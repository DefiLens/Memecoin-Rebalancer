import React, { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useGlobalStore } from "../../context/global.store";
import { ICoinDetails } from "./types";
import { BASE_URL } from "../../utils/keys";
import Coin from "./Coin";

const WishListTokens: React.FC = () => {
    const { address } = useAccount();
    const { allCoins } = useGlobalStore(); // Get the setter from Zustand
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(25);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!address) {
            console.log("No user address available");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/wishlist/${address}`);
            if (!response.ok) {
                throw new Error("Failed to fetch wishlist");
            }
            const wishlistData = await response.json();
            setWishlist(wishlistData.map((item: { coinId: string }) => item.coinId));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }, [address]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 25);
    };

    useEffect(() => {
        let filtered = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered = filtered.filter((coin) => wishlist.includes(coin.id));

        setDisplayedCoins(filtered.slice(0, displayCount));
    }, [allCoins, searchTerm, displayCount, showWishlistOnly, wishlist]);

    const toggleView = () => {
        setShowWishlistOnly(!showWishlistOnly);
        setDisplayCount(25); // Reset display count when toggling view
    };

    return (
        <div>
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search coins..."
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDisplayCount(25); // Reset display count when searching
                    }}
                    className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg outline-none"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {displayedCoins.map((coin) => (
                    <Coin key={coin.id} coin={coin} type={"buy"} selectedCoins={[]} handleCoinSelect={() => {}} />
                ))}
            </div>
            {displayedCoins.length < 0 &&
                (searchTerm
                    ? allCoins.filter(
                          (coin) =>
                              coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                      ).length
                    : allCoins.length) && (
                    <button onClick={loadMore} className="mt-4 p-2 bg-zinc-700 text-white rounded w-full">
                        Load More
                    </button>
                )}
        </div>
    );
};

export default WishListTokens;
