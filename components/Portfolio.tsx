import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPublicClient, http, parseAbi, formatUnits, Address } from 'viem';
import { base } from 'viem/chains';
import { USDC_ADDRESS, memeCoinData } from '../utils/constant';
import { useBalance } from 'wagmi';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';

interface PortfolioProps {
    isOpen: boolean;
    onClose: () => void;
    userAddress: Address;
}

interface TokenBalance {
    id: string;
    name: string;
    symbol: string;
    balance: string;
    image: string;
}

const BATCH_SIZE = 20;

const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

const erc20ABI = parseAbi([
    'function balanceOf(address) view returns (uint256)'
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
            publicClient.readContract({
                address: token.detail_platforms.base.contract_address as Address,
                abi: erc20ABI,
                functionName: 'balanceOf',
                args: [userAddress]
            })
        );

        const results = await Promise.all(balancePromises);

        const newBalances: TokenBalance[] = results.map((balance, index) => {
            const token = batch[index];
            return {
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                balance: formatUnits(balance as bigint, token.detail_platforms.base.decimal_place),
                image: token.image.small
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
            <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-4xl m-4 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-white">Meme Portfolio</h2>
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
                                <th className="py-4 px-6 text-lg font-bold">Symbol</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700 text-white">
                                <td className="py-4 px-6 flex items-center">
                                    <span className="mr-4 font-bold text-lg">1</span> {/* Token Number */}
                                    <Image src="/usdc.png" alt="USDC" width={40} height={40} className="mr-6 rounded-full" /> {/* Increased image size and space */}
                                    <span className="text-lg ml-4 font-semibold">USDC</span> {/* Increased font size and bold */}
                                </td>
                                <td className="py-4 px-6 text-lg font-semibold">{usdcBalance.formatted}</td> {/* Larger font for balance */}
                                <td className="py-4 px-6 text-lg font-semibold">USDC</td> {/* Increased font size and bold */}
                            </tr>

                            {/* Example for tokenBalances */}
                            {tokenBalances.map((token, index) => (
                                <tr key={token.id} className="border-b border-gray-700 text-white">
                                    <td className="py-4 px-6 flex items-center">
                                        <span className="mr-4 font-bold text-lg">{index + 2}</span> {/* Token Number */}
                                        <Image src={token.image} alt={token.name} width={40} height={40} className="mr-6 rounded-full" /> {/* Bigger image with more margin */}
                                        <span className="text-lg ml-4 font-semibold">{token.name}</span> {/* Increased font size and bold */}
                                    </td>
                                    <td className="py-4 px-6 text-lg font-semibold">{parseFloat(token.balance).toFixed(6)}</td> {/* Larger font for balance */}
                                    <td className="py-4 px-6 text-lg font-semibold">{token.symbol.toUpperCase()}</td> {/* Increased font size and bold */}
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
