import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { ICoinDetails } from "../components/rebalance/types";
import { BASE_URL } from "../utils/keys";
import { erc20Abi, memeCoinData, publicClient } from "../utils/constant";
import { toast } from "react-toastify";
import { useGlobalStore } from "./global.store"; // Zustand store
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";

BigNumber.config({ DECIMAL_PLACES: 10 });
export const DataContext = createContext<any | null>(null);

const DataProvider = ({ children }: any) => {
    const { address } = useAccount();
    const { allCoins, setAllCoins, activeFilter } = useGlobalStore(); // Get the active filter from Zustand

    const fetchCoins = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                [activeFilter]: "desc", // Apply the active filter dynamically
            });
            const response = await fetch(`${BASE_URL}/swap/token?${queryParams}`);
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

            setAllCoins(mergedData); // Update Zustand state with merged data
        } catch (error) {
            console.error("Error fetching coin data:", error);
            toast.error("Failed to fetch memecoin list");
        }
    }, [setAllCoins, activeFilter]);

    useEffect(() => {
        fetchCoins();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    //Tokens with balances
    const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState<boolean>(false);
    const [tokenBalances, setTokenBalances] = useState<ICoinDetails[]>([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
    const fetchBalances = useCallback(async () => {
        if (!address) return;

        setIsTokenBalanceLoading(true);
        try {
            const multicallContracts = allCoins.map((token) => {
                const contractAddress = token.contract_address as Address;
                return {
                    address: contractAddress,
                    abi: erc20Abi,
                    functionName: "balanceOf",
                    args: [address],
                };
            });

            const results = await publicClient.multicall({
                contracts: multicallContracts,
            });

            let totalValue = 0;
            const balances = results
                .map((result: any, index: number) => {
                    if (result.status === "success") {
                        const token = allCoins[index];
                        const balance = formatUnits(BigInt(result.result as string), Number(token.decimal_place));

                        const priceData = allCoins.find((price: ICoinDetails) => price.id === token.id);
                        const price = priceData?.current_price || 0;

                        const value = parseFloat(balance) * price;
                        totalValue += value;

                        return {
                            ...token,
                            balance: balance.toString(),
                            value: value.toFixed(2),
                        };
                    } else {
                        console.error(`Failed to fetch balance for ${allCoins[index].name}`);
                        return null;
                    }
                })
                .filter((token) => token !== null) as ICoinDetails[];

            setTokenBalances(balances);
            setTotalPortfolioValue(totalValue);
        } catch (error) {
            console.error("Error fetching balances:", error);
            toast.error("Failed to fetch token balances");
        } finally {
            setIsTokenBalanceLoading(false);
        }
    }, [address, allCoins]);

    useEffect(() => {
        if (address) {
            fetchBalances();
        }
    }, [address, fetchBalances]);

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
                isTokenBalanceLoading,
                tokenBalances,
                totalPortfolioValue,
                wishlist,
                setWishlist
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
