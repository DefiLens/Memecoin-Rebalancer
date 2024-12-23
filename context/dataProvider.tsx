import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { ICoinDetails } from "../components/rebalance/types";
import { BASE_URL } from "../utils/keys";
import { memeCoinData } from "../utils/constant";
import { toast } from "react-toastify";
import { useGlobalStore } from "./global.store"; // Zustand store
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";
import Moralis from "moralis";

BigNumber.config({ DECIMAL_PLACES: 10 });
// Define the context type
type DataContextType = {
  wishlist: string[];
  setWishlist: any;
  viewMode: "list" | "grid";
  setViewMode: (mode: "list" | "grid") => void;
};

export const DataContext = createContext<any | undefined>(undefined);

const DataProvider = ({ children }: any) => {
  const { address } = useAccount();
  const { allCoins, setAllCoins, activeFilter, allCoinLoading, setAllCoinLoading } = useGlobalStore(); // Get the active filter from Zustand
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  useEffect(() => {
    if (!address) return;
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", viewMode);
    }
  }, [address]);

  const fetchCoins = useCallback(async () => {
    try {
      setAllCoinLoading(true);
      const queryParams = new URLSearchParams({
        [activeFilter]: "desc", // Apply the active filter dynamically
      });
      const response = await fetch(`${BASE_URL}/swap/token?${queryParams}`);
      const backendData: ICoinDetails[] = await response.json();

      // console.log("backendData", backendData)
      // const mergedData = backendData.map((coin) => {
      //   const frontendCoin = memeCoinData.find((fcoin) => fcoin.id === coin.id);
      //   if (frontendCoin && frontendCoin.detail_platforms.base) {
      //     return {
      //       ...coin,
      //       decimal_place: frontendCoin.detail_platforms.base.decimal_place,
      //       contract_address: frontendCoin.detail_platforms.base.contract_address,
      //     };
      //   }
      //   return coin;
      // });

      setAllCoins(backendData); // Update Zustand state with merged data
    } catch (error) {
      console.error("Error fetching coin data:", error);
      toast.error("Failed to fetch memecoin list");
    } finally {
      setAllCoinLoading(false);
    }
  }, [setAllCoins, activeFilter]);

  useEffect(() => {
    fetchCoins();
    const intervalId = setInterval(fetchCoins, 1200); // Fetch every 1.2 seconds
    return () => clearInterval(intervalId);
  }, [fetchCoins]);

  const [wishlist, setWishlist] = useState<string[]>([]);

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
    if (address) {
      fetchWishlist();
    }
  }, [address]);

  return (
    <DataContext.Provider
      value={{
        wishlist,
        setWishlist,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
export const DataState = () => {
  return useContext(DataContext);
};

export default DataProvider;
