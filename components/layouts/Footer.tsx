import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { BASE_URL } from "../../utils/keys";
import { socialHandles } from "../../utils/constant";

// Define the base asset interface
interface BaseAsset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  twitter?: string;
  website?: string;
  dev: string;
  usdPrice: number;
  nativePrice: number;
  poolAmount: number;
  circSupply: number;
  totalSupply: number;
  fdv: number;
  mcap: number;
  launchpad: string;
  tokenProgram: string;
  devMintCount: number;
}

// Define the quote asset interface
interface QuoteAsset {
  id: string;
  symbol: string;
  decimals: number;
  poolAmount: number;
}

// Define the audit information interface
interface Audit {
  mintAuthorityDisabled: boolean;
  freezeAuthorityDisabled: boolean;
  topHoldersPercentage: number;
  lpBurnedPercentage: number;
}

// Define the stats interface for time intervals
interface Stats {
  priceChange: number;
  buyVolume: number;
  sellVolume: number;
  numBuys: number;
  numSells: number;
  numSellers: number;
  numTraders: number;
  numBuyers: number;
}

// Define the main token interface
export interface Token {
  id: string;
  chain: string;
  dex: string;
  type: string;
  baseAsset: BaseAsset;
  quoteAsset: QuoteAsset;
  audit: Audit;
  createdAt: string;
  liquidity: number;
  stats5m: Stats;
  stats1h: Stats;
  stats6h: Stats;
  stats24h: Stats;
  bondingCurve: number;
  updatedAt: string;
}

interface ITransactionSummary {
  nativeToken: Token;
  data: {
    totalTxns: number;
    totalAmount: number;
    buy: {
      count: number;
      totalAmount: number;
    };
    sell: {
      count: number;
      totalAmount: number;
    };
  };
}

const Footer = () => {
  const [txnSummary, setTxnSummary] = useState<ITransactionSummary>();
  const [loading, setLoading] = useState<boolean>(true);
  const getSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/txn/solana/summary`);
      const res = await axios.get(`${BASE_URL}/swap/get-pump/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm`);
      const tokenData: Token = res.data.pools[0];

      setTxnSummary({ nativeToken: tokenData, data: response.data.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      getSummary();
    }, 10000);

    // Initial call with loading state
    getSummary();

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatNumber = (num: number): string => {
    if (!num) return "";
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1)}B`; // Billions
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`; // Millions
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`; // Thousands
    } else {
      return num.toFixed(2).toString(); // Less than 1k
    }
  };

  return (
    <footer className="hidden lg:flex h-[36px] bg-zinc-950 border border-t border-gray-800 items-center">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="hidden sm:flex items-center gap-4">
            {socialHandles.map((item) => (
              <a key={item.key} href={item.href} target="_blank" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.key}</span>
                <item.icon />
              </a>
            ))}
          </div>
        </div>
        <div className="text-sm text-zinc-200 flex items-center gap-2">
          {/* <ToolTip tip="Total Txns"> */}
            <div className="flex items-center">
              <span className="pr-0.5 text-zinc-400">T: </span>
              {loading ? (
                <div className="w-12 h-4 animate-pulse rounded-md bg-zinc-800"></div>
              ) : (
                <span className="font-semibold tabular-nums tracking-tight">
                  {Number(txnSummary?.data.totalTxns ?? 0) + 1000}
                </span>
              )}
            </div>
          {/* </ToolTip> */}
          <span>|</span>
          {/* <ToolTip tip="Total Volume"> */}
            <div className="flex items-center">
              <span className="pr-0.5 text-zinc-400">V: </span>
              {loading ? (
                <div className="w-12 h-4 animate-pulse rounded-md bg-zinc-800"></div>
              ) : (
                <span className="font-semibold tabular-nums tracking-tight">
                  $
                  {formatNumber(
                    Number(txnSummary?.data.totalAmount) * Number(txnSummary?.nativeToken?.baseAsset?.nativePrice) +
                      10000
                  )}
                </span>
              )}
            </div>
          {/* </ToolTip> */}
          <div className="bg-zinc-800 px-3 py-1 rounded-lg flex items-center gap-1 ml-5">
            <Image height={18} width={18} src="/solana.webp" alt="Pump Fun" className="h-4 w-4" />$
            {formatNumber(txnSummary?.nativeToken.baseAsset.nativePrice ?? 0)}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
