import React, { useState, useEffect, useCallback } from "react";
import { createPublicClient, http, formatUnits, Address, parseAbi } from "viem";
import { useAccount } from "wagmi";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { toast } from "react-toastify";
import { base } from "viem/chains";
import { memeCoinData } from "../utils/constant";
import { BASE_URL } from "../utils/keys";
import { useGlobalStore } from "../context/global.store";
import { ICoinDetails } from "./rebalance/types";

// Setup the public client with viem on Base network
const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

// Define ERC20 ABI for multicall
const erc20Abi = parseAbi(["function balanceOf(address owner) view returns (uint256)"]);

// Portfolio Component
interface PortfolioProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TokenDetails {
    id: string;
    name: string;
    symbol: string;
    contractAddress: Address;
    decimalPlaces: number;
    imageUrl: string;
}

interface TokenBalance {
    id: string;
    name: string;
    symbol: string;
    balance: string;
    price: number;
    value: number;
    imageUrl: string;
}

const URL = BASE_URL || "http://localhost:4500/api";

// Fetch the meme coin data from meme_coin_details.json
const fetchTokenDetails = async (): Promise<TokenDetails[]> => {
    try {
        const { allCoins } = useGlobalStore(); // Get the setter from Zustand
        return allCoins.map((token: any) => {
            console.log("token", token);

            return {
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                contractAddress: token.contract_address as Address,
                decimalPlaces: token.decimal_place,
                imageUrl: token.image.thumb,
            };
        });
    } catch (error) {
        console.error("Failed to fetch token details:", error);
        return [];
    }
};

const Portfolio: React.FC<PortfolioProps> = ({ isOpen, onClose }) => {
    const { address } = useAccount();
    const [tokenBalances, setTokenBalances] = useState<ICoinDetails[]>([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { allCoins } = useGlobalStore(); // Get the setter from Zustand

    // Fetch token prices

    const fetchBalances = useCallback(async () => {
        if (!address) return;

        setIsLoading(true);
        try {
            // Prepare multicall contracts to get balances
            const multicallContracts = allCoins.map((token) => {
                const contractAddress = token.contract_address as Address; // Explicitly cast to Address type
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
                .map((result: any, index: any) => {
                    if (result.status === "success") {
                        const token = allCoins[index];
                        const balance = formatUnits(BigInt(result.result as string), Number(token.decimal_place));

                        const priceData = allCoins.find((price: any) => price.id === token.id);
                        const price = priceData?.current_price || 0;

                        const value = parseFloat(balance) * price;

                        totalValue += value;
                        return {
                            ...token, // Return the whole token object
                            balance: balance, // Include the balance for the token
                            value: value, // Include the calculated value of the token
                        };
                    } else {
                        console.error(`Failed to fetch balance for ${allCoins[index].name}`);
                        return null;
                    }
                })
                .filter((token): token is ICoinDetails => token !== null);

            // console.log("all", allCoins);
            // console.log("balances", balances);
            setTokenBalances(balances);
            setTotalPortfolioValue(totalValue);
        } catch (error) {
            console.error("Error fetching balances:", error);
            toast.error("Failed to fetch token balances");
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    useEffect(() => {
        if (isOpen && address) {
            fetchBalances();
        }
    }, [isOpen, address, fetchBalances]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white">Token Portfolio</h2>
                        <p className="text-xl text-gray-300 mt-2">Total Value: ${totalPortfolioValue.toFixed(2)}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-zinc-900">
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="py-4 px-6 text-lg font-bold">Token</th>
                                <th className="py-4 px-6 text-lg font-bold">Balance</th>
                                <th className="py-4 px-6 text-lg font-bold">Price</th>
                                <th className="py-4 px-6 text-lg font-bold">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokenBalances.map(
                                (token) =>
                                    parseFloat(String(token.balance)) > 0 && (
                                        <tr key={token.id} className="border-b border-gray-700 text-white">
                                            <td className="py-4 px-6 flex items-center">
                                                <Image
                                                    src={token.image}
                                                    alt={token.name}
                                                    width={40}
                                                    height={40}
                                                    className="mr-6 rounded-full"
                                                />
                                                <span className="text-lg ml-4 font-semibold">{token.name}</span>
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                {parseFloat(String(token.balance)).toFixed(6)}
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                ${token.current_price.toFixed(6)}
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                ${Number(token.value).toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </table>
                    {isLoading && <div className="text-center py-4 text-white">Loading...</div>}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
