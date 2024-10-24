import React, { useCallback, useEffect, useState } from "react";
import Coin from "./Coin";
import { useGlobalStore } from "../../context/global.store";
import { useRebalanceStore } from "../../context/rebalance.store";
import { ICoinDetails } from "./types";
import { useAccount } from "wagmi";
import Moralis from 'moralis';
import { formatUnits } from "viem";
import { toast } from "react-toastify";
import { DataState } from "../../context/dataProvider";

const SellTokens: React.FC<{ resetSwapAmount: () => void }> = ({ resetSwapAmount }) => {
    const { address } = useAccount();
    const { allCoins } = useGlobalStore();
    const { sellTokens, toggleSellToken } = useRebalanceStore();
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMoralisInitialized, setIsMoralisInitialized] = useState(false);
    const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState<boolean>(false);
    const [tokenBalances, setTokenBalances] = useState<ICoinDetails[]>([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
    const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false);
    // const { isTokenBalanceLoading, tokenBalances, totalPortfolioValue } = DataState();

    async function initializeMoralis() {
        if (!isMoralisInitialized) {
            try {
                await Moralis.start({
                    apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY
                });
                setIsMoralisInitialized(true);
            } catch (error) {
                if (!(error as Error).message.includes('Modules are started already')) {
                    throw error;
                }
            }
        }
    }

    const fetchBalances = useCallback(async () => {
        if (!address) return;
        setIsTokenBalanceLoading(true);
        try {
            await initializeMoralis();
            const response: any = await Moralis.EvmApi.token.getWalletTokenBalances({
                "chain": "0x2105",
                "address": address
            });

            if (!response || !response.jsonResponse) {
                console.error("Invalid response from Moralis");
                return;
            }

            let totalValue = 0;
            const balances = response.jsonResponse
                .map((result: any) => {
                    if (BigInt(result.balance) > 0) {
                        const token = allCoins.find(
                            (obj: any) => obj.contract_address?.toLowerCase() === result.token_address?.toLowerCase()
                        );    
                        if (!token) {
                            console.error(`Token not found for address: ${result.token_address}`);
                            return null;
                        }
                        const balance = formatUnits(BigInt(result.balance), Number(result.decimals));
                        const price = token.current_price || 0;
                        const value = parseFloat(balance) * price;
                        totalValue += value;
                        return {
                            ...token,
                            balance: balance.toString(),
                            value: value.toFixed(2),
                        };
                    } else {
                        console.warn(`Zero balance for token address: ${result.token_address}`);
                        return null;
                    }
                })
                .filter((token: any) => token !== null);

            setTokenBalances(balances);
            setTotalPortfolioValue(totalValue);
            
            // Save to localStorage
            localStorage.setItem('lastFetchTimestamp', Date.now().toString());
            setHasInitialFetch(true);
        } catch (error) {
            console.error("Error fetching balances:", error);
            toast.error("Failed to fetch token balances");
        } finally {
            setIsTokenBalanceLoading(false);
        }
    }, [address, allCoins]);

    useEffect(() => {
        // Check if this is a fresh page load
        const isPageRefresh = !localStorage.getItem('lastFetchTimestamp');
        const shouldFetch = address && 
                          allCoins.length > 0 && 
                          (!hasInitialFetch || isPageRefresh);

        if (shouldFetch) {
            fetchBalances();
        }

        // Cleanup function to handle page unload
        return () => {
            if (typeof window !== 'undefined') {
                const unloadCallback = () => {
                    localStorage.removeItem('lastFetchTimestamp');
                };
                window.addEventListener('beforeunload', unloadCallback);
                return () => window.removeEventListener('beforeunload', unloadCallback);
            }
        };
    }, [address, allCoins, fetchBalances, hasInitialFetch]);

    useEffect(() => {
        let filteredCoins = tokenBalances.filter(
            (coin: ICoinDetails) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedCoins(filteredCoins);
    }, [tokenBalances, searchTerm]);

    return (
        <div className="w-full flex flex-col gap-4">
            <input
                type="text"
                placeholder="Search memecoins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none z-10"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 hide_scrollbar">
                {tokenBalances.map(
                    (coin: ICoinDetails) =>
                        parseFloat(coin.balance || "0") > 0 && (
                            <Coin
                                key={coin.id}
                                coin={coin}
                                selectedCoins={sellTokens}
                                handleCoinSelect={toggleSellToken}
                                type={"sell"}
                            />
                        )
                )}
            </div>
        </div>
    );
};

export default SellTokens;