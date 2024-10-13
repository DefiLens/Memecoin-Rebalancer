import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPublicClient, http, parseAbi, formatUnits, Address } from 'viem';
import { base } from 'viem/chains';
import { USDC_ADDRESS, memeCoinData } from '../utils/constant';
import { useBalance } from 'wagmi';
import { FiX } from 'react-icons/fi';

interface PortfolioProps {
    isOpen: boolean;
    onClose: () => void;
    userAddress: Address;
}

interface TokenBalance {
    id: string;
    balance: string;
    symbol: string;
}

interface TokenData {
    id: string;
    detail_platforms: {
        base: {
            contract_address: string;
            decimal_place: number;
        };
    };
}

const BATCH_SIZE = 20;

const publicClient = createPublicClient({
  chain: base,
  transport: http()
});

const erc20ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)'
]);

const Portfolio: React.FC<PortfolioProps> = ({ isOpen, onClose, userAddress }) => {
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    const { data: usdcBalance } = useBalance({
        address: userAddress,
        token: USDC_ADDRESS as Address,
    });

    const fetchBalancesBatch = useCallback(async (page: number) => {
        setIsLoading(true);
        const start = page * BATCH_SIZE;
        const end = Math.min((page + 1) * BATCH_SIZE, memeCoinData.length);
        const batch = memeCoinData.slice(start, end);

        const balancePromises = batch.map(token => 
            publicClient.multicall({
                contracts: [
                    {
                        address: token.detail_platforms.base.contract_address as Address,
                        abi: erc20ABI,
                        functionName: 'balanceOf',
                        args: [userAddress]
                    },
                    {
                        address: token.detail_platforms.base.contract_address as Address,
                        abi: erc20ABI,
                        functionName: 'symbol'
                    }
                ]
            })
        );

        const results = await Promise.all(balancePromises);

        const newBalances: TokenBalance[] = results.map((result, index) => {
            const [balanceResult, symbolResult] = result;
            const balance = balanceResult.result ? 
                formatUnits(balanceResult.result as bigint, batch[index].detail_platforms.base.decimal_place) : 
                '0';
            const symbol = symbolResult.result as string || '';

            return {
                id: batch[index].id,
                balance,
                symbol
            };
        }).filter(token => parseFloat(token.balance) > 0);

        setTokenBalances(prev => [...prev, ...newBalances]);
        setIsLoading(false);
    }, [userAddress]);

    useEffect(() => {
        if (isOpen && userAddress) {
            setTokenBalances([]);
            setCurrentPage(0);
            fetchBalancesBatch(0);
        }
    }, [isOpen, userAddress, fetchBalancesBatch]);

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
            <div className="bg-zinc-800 p-6 rounded-lg w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Your Portfolio</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-zinc-800">
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="py-3 px-4">Token</th>
                                <th className="py-3 px-4">Balance</th>
                                <th className="py-3 px-4">Symbol</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usdcBalance && parseFloat(usdcBalance.formatted) > 0 && (
                                <tr className="border-b border-gray-700 text-white">
                                    <td className="py-3 px-4">USDC</td>
                                    <td className="py-3 px-4">{usdcBalance.formatted}</td>
                                    <td className="py-3 px-4">USDC</td>
                                </tr>
                            )}
                            {tokenBalances.map((token) => (
                                <tr key={token.id} className="border-b border-gray-700 text-white">
                                    <td className="py-3 px-4">{token.id}</td>
                                    <td className="py-3 px-4">{parseFloat(token.balance).toFixed(6)}</td>
                                    <td className="py-3 px-4">{token.symbol}</td>
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