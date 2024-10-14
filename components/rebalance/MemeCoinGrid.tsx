import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/keys";
import Coin from "./Coin";
import { memeCoinData } from "../../utils/constant";
import { ICoinDetails, MemeCoinGridProps } from "./types";
import { useAccount } from "wagmi";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ selectedCoins, handleCoinSelect }) => {
  const { address } = useAccount();
  const [allCoins, setAllCoins] = useState<ICoinDetails[]>([]);
  const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(25);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const fetchCoins = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/swap/token`);
      if (!response.ok) {
        throw new Error('Failed to fetch coin data');
      }
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
    if (!address) {
      console.log("No user address available");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/wishlist/${address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      const wishlistData = await response.json();
      setWishlist(wishlistData.map((item: { coinId: string }) => item.coinId));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [address]);

  const toggleWishlist = async (coinId: string) => {
    if (!address) {
      toast.error("Please connect your wallet to use the wishlist feature");
      return;
    }

    try {
      const isWishlisted = wishlist.includes(coinId);
      const method = isWishlisted ? 'DELETE' : 'POST';
      const endpoint = isWishlisted ? `/wishlist/removeWishlist/${coinId}` : '/wishlist/add';

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userAddress: address, coinId })
      });

      if (!response.ok) {
        throw new Error('Failed to update wishlist');
      }

      setWishlist(prevWishlist =>
        isWishlisted
          ? prevWishlist.filter(id => id !== coinId)
          : [...prevWishlist, coinId]
      );
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
      filtered = filtered.filter((coin) => wishlist.includes(coin.id));
    }

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
        <button onClick={toggleView} className="p-2 h-full bg-zinc-700 text-white rounded whitespace-nowrap">
          <div className={`${!showWishlistOnly && 'flex gap-2'}`}>
            {!showWishlistOnly && (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" id="bookmark">
                <path fill="#FF0101" d="M11.0699,0.0001 C13.7799,0.0001 15.9699,1.0701 15.9999,3.7901 L15.9999,3.7901 L15.9999,18.9701 C15.9999,19.1401 15.9599,19.3101 15.8799,19.4601 C15.7499,19.7001 15.5299,19.8801 15.2599,19.9601 C14.9999,20.0401 14.7099,20.0001 14.4699,19.8601 L14.4699,19.8601 L7.9899,16.6201 L1.4999,19.8601 C1.3509,19.9391 1.1799,19.9901 1.0099,19.9901 C0.4499,19.9901 -0.0001,19.5301 -0.0001,18.9701 L-0.0001,18.9701 L-0.0001,3.7901 C-0.0001,1.0701 2.1999,0.0001 4.8999,0.0001 L4.8999,0.0001 Z M11.7499,6.0401 L4.2199,6.0401 C3.7899,6.0401 3.4399,6.3901 3.4399,6.8301 C3.4399,7.2691 3.7899,7.6201 4.2199,7.6201 L4.2199,7.6201 L11.7499,7.6201 C12.1799,7.6201 12.5299,7.2691 12.5299,6.8301 C12.5299,6.3901 12.1799,6.0401 11.7499,6.0401 L11.7499,6.0401 Z" transform="translate(4 2)"></path>
              </svg>
            )}
            {showWishlistOnly ? "Show All" : "Show Bookmarks"}
          </div>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {displayedCoins.map((coin) => (
          <Coin
            key={coin.id}
            coin={coin}
            selectedCoins={selectedCoins}
            handleCoinSelect={handleCoinSelect}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
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
            className="mt-4 p-2 bg-zinc-700 text-white rounded w-full"
          >
            Load More
          </button>
        )}
    </div>
  );
};

export default MemeCoinGrid;