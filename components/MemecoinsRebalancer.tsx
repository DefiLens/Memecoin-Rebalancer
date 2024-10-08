import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useSendCalls, useCallsStatus } from 'wagmi/experimental';
import { parseUnits, encodeFunctionData } from 'viem';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiTrash2, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import TransactionStatus from './TransactionStatus';
import Image from 'next/image';

interface CoinDetails {
    id: string;
    name: string;
    symbol: string;
    contract_address: string;
    decimal_place: number;
    image: string;
    current_price: number;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d_in_currency: number | null;
    market_cap: number;
    total_volume: number;
    ath: number;
}

interface SwapAmount {
    amountIn: string;
    amountOut: string;
}

const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const MemecoinsRebalancer: React.FC = () => {
    const [allCoins, setAllCoins] = useState<CoinDetails[]>([]);
    const [selectedCoins, setSelectedCoins] = useState<CoinDetails[]>([]);
    const [amount, setAmount] = useState('');
    const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [swapData, setSwapData] = useState<any>(null);
    const [buttonState, setButtonState] = useState<'proceed' | 'quoting' | 'rebalance' | 'rebalancing'>('proceed');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
    const [displayedCoins, setDisplayedCoins] = useState<CoinDetails[]>([]);
    const [displayCount, setDisplayCount] = useState(25);
    const [swapAmounts, setSwapAmounts] = useState<{ [key: string]: SwapAmount }>({});

    const { address } = useAccount();
    const { sendCallsAsync, data: callsId, status: sendCallsStatus, error: sendCallsError } = useSendCalls();
    const { data: callsStatus } = useCallsStatus({
        id: callsId as string,
        query: {
            enabled: !!callsId,
            refetchInterval: (data) =>
                data.state.data?.status === "CONFIRMED" ? false : 1000,
        },
    });

    const fetchCoins = useCallback(async () => {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-meme-coins&order=volume_desc&price_change_percentage=24h%2C7d');
            const data = await response.json();
            setAllCoins(data.map((coin: any) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                image: coin.image,
                current_price: coin.current_price,
                price_change_percentage_24h: coin.price_change_percentage_24h,
                price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
                market_cap: coin.market_cap,
                total_volume: coin.total_volume,
                ath: coin.ath,
                contract_address: '',
                decimal_place: 0
            })));
        } catch (error) {
            console.error('Error fetching coin data:', error);
            toast.error('Failed to fetch memecoin list');
        }
    }, []);

    useEffect(() => {
        fetchCoins();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    useEffect(() => {
        if (selectedCoins.length > 0) {
            const equalPercentage = (100 / selectedCoins.length).toFixed(2);
            const initialPercentages = Object.fromEntries(
                selectedCoins.map(coin => [coin.id, equalPercentage])
            );
            setPercentages(initialPercentages);
        } else {
            setPercentages({});
        }

        if (swapData) {
            setButtonState('proceed');
            setSwapData(null);
        }
    }, [selectedCoins]);

    useEffect(() => {
        const filtered = allCoins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayedCoins(filtered.slice(0, displayCount));
    }, [allCoins, searchTerm, displayCount]);

    const handleCoinSelect = async (coin: CoinDetails) => {
        if (selectedCoins.find(c => c.id === coin.id)) {
            setSelectedCoins(selectedCoins.filter(c => c.id !== coin.id));
        } else {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}`);
                const data = await response.json();
                const updatedCoin: CoinDetails = {
                    ...coin,
                    contract_address: data.detail_platforms.base?.contract_address || '',
                    decimal_place: data.detail_platforms.base?.decimal_place || 18
                };
                setSelectedCoins([...selectedCoins, updatedCoin]);
            } catch (error) {
                console.error('Error fetching coin details:', error);
                toast.error(`Failed to fetch details for ${coin.symbol}`);
            }
        }
    };

    const handlePercentageChange = (id: string, value: string) => {
        setPercentages(prev => ({
            ...prev,
            [id]: value
        }));
        setButtonState('proceed');
        setSwapData(null);
    };

    const handleProceed = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setError('');
        setIsLoading(true);
        setButtonState('quoting');

        try {
            const swapRequests = selectedCoins.map(coin => ({
                tokenIn: USDC_ADDRESS,
                tokenOut: coin.contract_address,
                amountIn: Math.floor(Number(amount) * 1e6 * Number(percentages[coin.id]) / 100).toString(),
                recipient: address
            }));

            const response = await fetch('http://localhost:3002/api/generate-swap-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(swapRequests),
            });

            if (!response.ok) {
                throw new Error('Failed to generate swap data');
            }

            const data = await response.json();
            setSwapData(data);
            
            // Set swap amounts
            const amounts = {};
            data.forEach((item, index) => {
                amounts[selectedCoins[index].id] = {
                    amountIn: (Number(item.amountIn) / 1e6).toFixed(6), // Convert from USDC's 6 decimals
                    amountOut: item.amountOut
                };
            });
            setSwapAmounts(amounts);

            setButtonState('rebalance');
        } catch (error: any) {
            console.error('Error during swap data generation:', error);
            setError(`Failed to generate swap data: ${error.message}`);
            setButtonState('proceed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRebalance = async () => {
        if (!swapData) {
            setError('Swap data not available');
            return;
        }

        setIsLoading(true);
        setButtonState('rebalancing');

        try {
            const totalAmount = parseUnits(amount, 6); // Assuming USDC has 6 decimals
            const approvalData = encodeFunctionData({
                abi: [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
                functionName: 'approve',
                args: [swapData[0].to, totalAmount]
            });

            const calls = [
                {
                    to: USDC_ADDRESS,
                    data: approvalData,
                    value: BigInt(0)
                },
                ...swapData.map((data: any) => ({
                    to: data.to,
                    data: data.calldata,
                    value: BigInt(data.value || 0)
                }))
            ];

            const callsId = await sendCallsAsync({
                calls,
                capabilities: {
                    paymasterService: {
                        // Paymaster Proxy Node url goes here.
                        url: "https://api.developer.coinbase.com/rpc/v1/base/uvzNrW_9bgIu5967om0LMojj4bS6YbTR",
                    },
                },
            });
        } catch (error: any) {
            console.error('Error during rebalance:', error);
            setError(`Failed to execute rebalance: ${error.message}`);
            toast.error("Rebalance failed. Please try again.");
            setButtonState('rebalance');
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setSelectedCoins([]);
        setPercentages({});
        setAmount('');
        setSwapData(null);
        setSwapAmounts({});
        setButtonState('proceed');
    };

    const toggleExpand = (coinId: string) => {
        setExpandedCoin(expandedCoin === coinId ? null : coinId);
    };

    const loadMore = () => {
        setDisplayCount(prevCount => prevCount + 25);
    };

    useEffect(() => {
        if (callsStatus?.status === 'CONFIRMED' && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const txHash = callsStatus.receipts[0].transactionHash;
            toast.success(`Transaction successful! Hash: ${txHash}`);
            resetState();
        }
    }, [callsStatus]);

    const formatPrice = (price: number) => price < 0.01 ? price.toFixed(6) : price.toFixed(2);
    const formatPercentage = (percentage: number | null) => percentage ? percentage.toFixed(2) : 'N/A';
    const formatMarketCap = (marketCap: number) => {
        if (marketCap > 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
        if (marketCap > 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
        return `$${(marketCap / 1e3).toFixed(2)}K`;
    };

    const MemecoinsGrid = () => (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {displayedCoins.map(coin => (
                    <div key={coin.id} className="bg-gray-700 p-2 rounded-lg flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                                <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-1" />
                                <span className="font-bold text-sm">{coin.symbol.toUpperCase()}</span>
                            </div>
                            <button
                                onClick={() => handleCoinSelect(coin)}
                                className={`px-2 py-0.5 rounded text-xs ${
                                    selectedCoins.find(c => c.id === coin.id)
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                {selectedCoins.find(c => c.id === coin.id) ? 'Selected' : 'Select'}
                            </button>
                        </div>
                        <div className="text-xs mb-1">
                            <span className="text-gray-400 mr-1">Price:</span>
                            <span>${formatPrice(coin.current_price)}</span>
                        </div>
                        <button
                            onClick={() => toggleExpand(coin.id)}
                            className="text-gray-400 hover:text-white text-xs flex items-center justify-center mt-1"
                        >
                            {expandedCoin === coin.id ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {expandedCoin === coin.id && (
                            <div className="text-xs mt-2 border-t border-gray-600 pt-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">24h:</span>
                                    <span className={coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {formatPercentage(coin.price_change_percentage_24h)}%
                                    </span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-400">7d:</span>
                                    <span className={coin.price_change_percentage_7d_in_currency && coin.price_change_percentage_7d_in_currency >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {formatPercentage(coin.price_change_percentage_7d_in_currency)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Market Cap:</span>
                                    <span>{formatMarketCap(coin.market_cap)}</span></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {displayedCoins.length < (searchTerm ? allCoins.filter(coin =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            ).length : allCoins.length) && (
                <button
                    onClick={loadMore}
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Load More
                </button>
            )}
        </>
    );

    return (
        <div className="bg-gray-800 p-4 rounded-lg flex h-[calc(100vh-100px)]">
            {/* Left side: Memecoin list (60%) */}
            <div className="w-3/5 pr-4 overflow-y-auto">
                <input
                    type="text"
                    placeholder="Search memecoins..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDisplayCount(25); // Reset display count when searching
                    }}
                    className="w-full p-2 mb-4 bg-gray-700 text-white rounded sticky top-0"
                />
                <MemecoinsGrid />
            </div>

            {/* Right side: Rebalancing controls (40%) */}
            <div className="w-2/5 pl-4 border-l border-gray-700 flex flex-col">
                <div className="mb-4 sticky top-0 bg-gray-800 z-10">
                    <h2 className="text-xl font-bold mb-4 text-white">Rebalance Portfolio</h2>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter USDC amount"
                        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                    />
                </div>
                <div className="flex-grow overflow-y-auto">
                    {selectedCoins.map(coin => (
                        <div key={coin.id} className="mb-4 bg-gray-700 p-4 rounded">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
                                    <span className="font-bold">{coin.symbol}</span>
                                </div>
                                <button 
                                    onClick={() => handleCoinSelect(coin)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="number"
                                    value={percentages[coin.id] || ''}
                                    onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                                    className="w-20 p-1 bg-gray-600 text-white rounded mr-2"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                />
                                <span>% of portfolio</span>
                            </div>
                            {swapAmounts[coin.id] && (
                                <div className="text-sm text-gray-300">
                                    <div>Input: {swapAmounts[coin.id].amountIn} USDC</div>
                                    <div>Expected Output: {swapAmounts[coin.id].amountOut} {coin.symbol}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 sticky bottom-0 bg-gray-800 z-10">
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={buttonState === 'proceed' ? handleProceed : 
                                     buttonState === 'rebalance' ? handleRebalance : 
                                     undefined}
                            className={`bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded ${selectedCoins.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading || buttonState === 'quoting' || buttonState === 'rebalancing' || selectedCoins.length === 0}
                        >
                            {buttonState === 'proceed' && 'Proceed'}
                            {buttonState === 'quoting' && 'Wait for Quote...'}
                            {buttonState === 'rebalance' && 'Rebalance'}
                            {buttonState === 'rebalancing' && 'Rebalancing...'}
                        </button>
                        {buttonState === 'rebalance' && (
                            <button
                                onClick={handleProceed}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                            >
                                <FiRefreshCw />
                            </button>
                        )}
                        <button
                            onClick={resetState}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                    {sendCallsStatus !== "idle" && (
                        <div className="mt-4 text-white">Rebalance Status: {sendCallsStatus}</div>
                    )}
                    {sendCallsError && (
                        <div className="text-red-500 mt-4">{sendCallsError.message}</div>
                    )}
                    <TransactionStatus callStatus={callsStatus} />
                </div>
            </div>
        </div>
    );
};

export default MemecoinsRebalancer;