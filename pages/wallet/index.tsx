"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { useGlobalStore } from "../../context/global.store";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { toast } from "react-toastify";
import Moralis from "moralis";
import { DataState } from "../../context/dataProvider";
import { useRebalanceStore } from "../../context/rebalance.store";
import { ICoinDetails } from "../../components/rebalance/types";
import Loader from "../../components/shared/Loader";
import TokenList from "../../components/Token/TokenList";
import TokenGrid from "../../components/Token/TokenGrid";
import { BASE_URL } from "../../utils/keys";

export type SortKey =
  | "balance"
  | "value"
  | "current_price"
  | "price_change_percentage_1h_in_currency"
  | "price_change_percentage_24h"
  | "price_change_percentage_7d_in_currency"
  | "market_cap"
  | "total_volume";
export type SortOrder = "asc" | "desc";

const Bookmark = () => {
  const { selectAllSellTokens, clearAllSellTokens, sellTokens } = useRebalanceStore();
  const { viewMode } = DataState();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    order: SortOrder;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const { address } = useAccount();
  const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
  const [tokenBalances, setTokenBalances] = useState<ICoinDetails[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(0);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState<boolean>(false);
  const [isMoralisInitialized, setIsMoralisInitialized] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState<boolean>(false);

  async function initializeMoralis() {
    if (!isMoralisInitialized) {
      try {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
        setIsMoralisInitialized(true);
      } catch (error) {
        if (!(error as Error).message.includes("Modules are started already")) {
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
        chain: "0x2105",
        address: address,
      });

      if (!response || !response.jsonResponse) {
        console.error("Invalid response from Moralis");
        return;
      }

      const res = await fetch(`${BASE_URL}/swap/token`);
      const backendData: ICoinDetails[] = await res.json();

      let totalValue = 0;
      const balances = response.jsonResponse
        .map((result: any) => {
          if (BigInt(result.balance) > 0) {
            const token = backendData.find(
              (obj: any) =>
                obj?.detail_platforms?.base?.contract_address?.toLowerCase() === result.token_address?.toLowerCase()
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
              value: value,
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
      localStorage.setItem("lastFetchTimestamp", Date.now().toString());
      setHasInitialFetch(true);
    } catch (error) {
      console.error("Error fetching balances:", error);
      toast.error("Failed to fetch token balances");
    } finally {
      setIsTokenBalanceLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) fetchBalances();
  }, [address]);

  useEffect(() => {
    let filteredCoins = tokenBalances.filter(
      (coin: ICoinDetails) =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedCoins(filteredCoins);
  }, [tokenBalances, searchTerm]);

  const currentTokens = useMemo(() => {
    // First, filter the tokens based on the search term
    console.log("displayedCoins", displayedCoins);
    let result = displayedCoins.filter(
      (token: any) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then, sort the filtered tokens if a sort configuration is set
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        const key = sortConfig.key;
        const order = sortConfig.order;
        if (a[key] < b[key]) {
          return order === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [displayedCoins, searchTerm, sortConfig]);

  // Paginate the sorted tokens
  const requestSort = (key: SortKey) => {
    let order: SortOrder = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  const areAllTokensSelected = displayedCoins.every((token) =>
    sellTokens.some((selectedToken) => selectedToken.id === token.id)
  );

  const handleSelectOrClearAll = () => {
    if (areAllTokensSelected) {
      clearAllSellTokens(); // Clear all tokens if all are selected
    } else {
      clearAllSellTokens();
      selectAllSellTokens(displayedCoins); // Select all tokens if not all are selected
    }
  };

  return (
    <MainLayout>
      <div className="w-full flex flex-col h-full">
        <div className="bg-zinc-950 px-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-end h-fit sm:h-14 border-y border-zinc-800">
          <div className="h-full flex items-center text-lg font-semibold">Your Wallet</div>
          <div className="flex items-center justify-end p-2 gap-3"></div>
        </div>
        <main className="flex-grow overflow-hidden relative">
          <div className={`h-full overflow-auto`}>
            {isLoading && (
              <div className="w-full flex items-center justify-center h-full">
                <Loader />
              </div>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!isLoading && !error && (
              <>
                {viewMode === "list" ? (
                  <TokenList tokens={currentTokens} sortConfig={sortConfig} requestSort={requestSort} action="sell" />
                ) : (
                  <TokenGrid tokens={currentTokens} sortConfig={sortConfig} requestSort={requestSort} action="sell" />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default Bookmark;
