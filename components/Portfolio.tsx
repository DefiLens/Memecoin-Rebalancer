import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPublicClient, http, parseAbi, formatUnits, Address } from 'viem';
import { base } from 'viem/chains';
import { USDC_ADDRESS, memeCoinData } from '../utils/constant';
import { useAccount, useBalance } from 'wagmi';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { ICoinDetails } from './rebalance/types';

interface PortfolioProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TokenBalance {
    id: string;
    name: string;
    symbol: string;
    balance: string;
    image: string;
    price: number;
    value: number;
}

const BATCH_SIZE = 20;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api';

const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

const erc20ABI = parseAbi([
    'function balanceOf(address) view returns (uint256)'
]);

const Portfolio: React.FC<PortfolioProps> = ({ isOpen, onClose }) => {
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [allCoins, setAllCoins] = useState<ICoinDetails[]>([]);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const { address } = useAccount();

    const { data: usdcBalance } = useBalance({
        address: address,
        token: USDC_ADDRESS as Address,
    });

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

    const fetchBalancesBatch = useCallback(async (page: number) => {
        if (!address || allCoins.length === 0) return;
        setIsLoading(true);
        const start = page * BATCH_SIZE;
        const end = Math.min((page + 1) * BATCH_SIZE, memeCoinData.length);
        const batch = memeCoinData.slice(start, end);

        const balancePromises = batch.map(token =>
            publicClient.readContract({
                address: token.detail_platforms.base.contract_address as Address,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [address]
            })
        );

        const results = await Promise.all(balancePromises);

        const newBalances = results.map((balance, index) => {
            const token = batch[index];
            const tokenBalance = formatUnits(balance as bigint, token.detail_platforms.base.decimal_place);
            const coinDetails = allCoins.find(coin => coin.id === token.id);
            if (parseFloat(tokenBalance) > 0 && coinDetails) {
                const value = parseFloat(tokenBalance) * coinDetails.current_price;
                return {
                    id: token.id,
                    name: token.name,
                    symbol: token.symbol,
                    balance: tokenBalance,
                    image: token.image.small,
                    price: coinDetails.current_price,
                    value: value
                };
            }
            return null;
        }).filter((token): token is TokenBalance => token !== null);

        setTokenBalances(prev => [...prev, ...newBalances]);
        setTotalPortfolioValue(prev => prev + newBalances.reduce((sum, token) => sum + token.value, 0));
        setIsLoading(false);
    }, [address, allCoins]);

    useEffect(() => {
        if (isOpen) {
            fetchCoins();
        }
    }, [isOpen, fetchCoins]);

    useEffect(() => {
        if (isOpen && address && allCoins.length > 0) {
            setTokenBalances([]);
            setCurrentPage(0);
            setTotalPortfolioValue(0);
            fetchBalancesBatch(0);
        }
    }, [isOpen, address, allCoins, fetchBalancesBatch]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        observer.current = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !isLoading) {
                setCurrentPage((prevPage) => {
                    const nextPage = prevPage + 1;
                    if (nextPage * BATCH_SIZE < memeCoinData.length) {
                        fetchBalancesBatch(nextPage);
                    }
                    return nextPage;
                });
            }
        }, options);

        if (loadingRef.current) {
            observer.current.observe(loadingRef.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [isLoading, fetchBalancesBatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white">Meme Portfolio</h2>
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
                            <tr className="border-b border-gray-700 text-white">
                                <td className="py-4 px-6 flex items-center">
                                    <span className="mr-4 font-bold text-lg">1</span>
                                    <Image src="/usdc.png" alt="USDC" width={40} height={40} className="mr-6 rounded-full" />
                                    <span className="text-lg ml-4 font-semibold">USDC</span>
                                </td>
                                {usdcBalance ? <td className="py-4 px-6 text-lg font-semibold">{usdcBalance.formatted}</td> : "0"}
                                <td className="py-4 px-6 text-lg font-semibold">$1.00</td>
                                <td className="py-4 px-6 text-lg font-semibold">${usdcBalance ? parseFloat(usdcBalance.formatted).toFixed(2) : "0.00"}</td>
                            </tr>

                            {tokenBalances.map((token, index) => (
                                <tr key={token.id} className="border-b border-gray-700 text-white">
                                    <td className="py-4 px-6 flex items-center">
                                        <span className="mr-4 font-bold text-lg">{index + 2}</span>
                                        <Image src={token.image} alt={token.name} width={40} height={40} className="mr-6 rounded-full" />
                                        <span className="text-lg ml-4 font-semibold">{token.name}</span>
                                    </td>
                                    <td className="py-4 px-6 text-lg font-semibold">{parseFloat(token.balance).toFixed(6)}</td>
                                    <td className="py-4 px-6 text-lg font-semibold">${token.price.toFixed(6)}</td>
                                    <td className="py-4 px-6 text-lg font-semibold">${token.value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div ref={loadingRef} className="text-center py-4">
                        {isLoading && <p className="text-white">Loading more tokens...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;