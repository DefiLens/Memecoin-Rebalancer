import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/keys";
import Coin from "./Coin";
import { memeCoinData } from "../../utils/constant";
import { ICoinDetails, MemeCoinGridProps } from "./types";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ selectedCoins, handleCoinSelect }) => {
    const [allCoins, setAllCoins] = useState<ICoinDetails[]>([]);
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayCount, setDisplayCount] = useState(25);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [showWishlistOnly, setShowWishlistOnly] = useState(false);

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

    const fetchWishlist = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/wishlist/`);
            const wishlistData = await response.json();
            setWishlist(wishlistData);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Failed to fetch wishlist");
        }
    }, []);

    const toggleWishlist = async (coinId: string): Promise<void> => {
        try {
            // Determine the method and endpoint based on the current state of the wishlist
            const isWishlisted = wishlist.some(item => item.coinId === coinId);
            const method = isWishlisted ? 'DELETE' : 'POST';
            const endpoint = method === 'DELETE' ? `/wishlist/removeWishlist/${coinId}` : '/wishlist/add';

            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: method === 'POST' ? JSON.stringify({ coinId }) : undefined // Only include body for POST
            });

            if (response.ok) {
                setWishlist(prevWishlist => {
                    if (method === 'DELETE') {
                        return prevWishlist.filter(item => item.coinId !== coinId);
                    } else {
                        return [...prevWishlist, { coinId }];
                    }
                });
            } else {
                throw new Error('Failed to update wishlist');
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error("Failed to update wishlist");
        }
    };

    useEffect(() => {
        fetchCoins();
        fetchWishlist();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins, fetchWishlist]);

    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 25);
    };

    useEffect(() => {
        let filtered = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (showWishlistOnly) {
            filtered = filtered.filter((coin) =>
                wishlist.some((item) => item.coinId === coin.id)
            );
        }

        setDisplayedCoins(filtered.slice(0, displayCount));
    }, [allCoins, searchTerm, displayCount, showWishlistOnly, wishlist]);

    const toggleView = () => {
        setShowWishlistOnly(!showWishlistOnly);
        setDisplayCount(25); // Reset display count when toggling view
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="h-full flex justify-between gap-2 items-center">
                <input
                    type="text"
                    placeholder="Search memecoins..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDisplayCount(25); // Reset display count when searching
                    }}
                    className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg outline-none"
                />
                <button
                    onClick={toggleView}
                    className="lg:flex max-h-max px-4 py-2 rounded-lg border text-xs font-semibold text-zinc-200 border-zinc-700 bg-P1 hover:bg-zinc-800 transition-all duration-300 ease-in-out transform shadow-sm items-center justify-center whitespace-nowrap font-condensed"
                >
                    {showWishlistOnly ? "Show All" : "Show Wishlist"}
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2 hide_scrollbar">
                {displayedCoins.map((coin) => (
                    <Coin
                        coin={coin}
                        selectedCoins={selectedCoins}
                        handleCoinSelect={handleCoinSelect}
                        wishlist={wishlist}
                        toggleWishlist={toggleWishlist}
                        toggleView={toggleView}
                        showWishlistOnly={showWishlistOnly}
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

export default MemeCoinGrid;
