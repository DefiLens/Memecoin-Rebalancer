import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSendCalls, useCallsStatus } from 'wagmi/experimental';
import { parseUnits, encodeFunctionData } from 'viem';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import TransactionStatus from './TransactionStatus';
import Link from 'next/link';

interface CoinDetails {
    id: string;
    name: string;
    symbol: string;
    contract_address: string;
    decimal_place: number;
    image: string;
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

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-meme-coins&order=volume_desc&price_change_percentage=24h%2C7d');
                const data = await response.json();
                setAllCoins(data.map((coin: any) => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.image,
                    contract_address: '',
                    decimal_place: 0
                })));
            } catch (error) {
                console.error('Error fetching coin data:', error);
                toast.error('Failed to fetch memecoin list');
            }
        };

        fetchCoins();
    }, []);

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
                abi: [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
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
        setButtonState('proceed');
    };

    const filteredCoins = allCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (callsStatus?.status === 'CONFIRMED' && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const txHash = callsStatus.receipts[0].transactionHash;
            toast.success(`Transaction successful! Hash: ${txHash}`);
            resetState();
        }
    }, [callsStatus]);

    return (
        <div className="flex flex-wrap -mx-2">
            <div className="w-full lg:w-3/5 px-2 mb-4 lg:mb-0">
                <input
                    type="text"
                    placeholder="Search memecoins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredCoins.map(coin => (
                        <div 
                            key={coin.id} 
                            className={`p-4 rounded cursor-pointer ${selectedCoins.find(c => c.id === coin.id) ? 'bg-accent-green' : 'bg-light-blue'}`}
                            onClick={() => handleCoinSelect(coin)}
                        >
                            <img src={coin.image} alt={coin.name} className="w-8 h-8 mb-2" />
                            <p className="font-bold">{coin.symbol}</p>
                            <p className="text-sm">{coin.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full lg:w-2/5 px-2">
                <h2 className="text-xl font-bold mb-4">Rebalance Portfolio</h2>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter USDC amount"
                    className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                />
                {selectedCoins.map(coin => (
                    <div key={coin.id} className="flex items-center mb-2">
                        <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
                        <span className="w-24 truncate">{coin.symbol}:</span>
                        <input
                            type="number"
                            value={percentages[coin.id] || ''}
                            onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                            className="w-20 p-1 bg-gray-700 text-white rounded"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                        <span className="ml-2">%</span>
                        <button 
                            onClick={() => handleCoinSelect(coin)}
                            className="ml-2 text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {error && <div className="text-red-500 mt-4">{error}</div>}
                <div className="flex justify-between items-center mt-4">
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
                {sendCallsStatus != "idle" && <div>Rebalance Status: {sendCallsStatus}</div>}
                {sendCallsError && <div className="text-red-500 mt-4">{sendCallsError.message}</div>}
                <TransactionStatus callStatus={callsStatus} />
            </div>
        </div>
    );
};

export default MemecoinsRebalancer;