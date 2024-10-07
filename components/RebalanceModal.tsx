import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSendCalls } from 'wagmi/experimental';
import { parseUnits, encodeFunctionData } from 'viem';

interface CoinDetails {
    id: string;
    name: string;
    symbol: string;
    contract_address: string;
    decimal_place: number;
    image: string;
}

interface RebalanceModalProps {
    selectedCoins: CoinDetails[];
    onClose: () => void;
    onRebalance: (amount: string, percentages: { [key: string]: number }) => void;
}

const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const RebalanceModal: React.FC<RebalanceModalProps> = ({ selectedCoins, onClose, onRebalance }) => {
    const [amount, setAmount] = useState('');
    const [isEqualDistribution, setIsEqualDistribution] = useState(true);
    const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [swapData, setSwapData] = useState<any>(null);
    const [stage, setStage] = useState<'input' | 'rebalance'>('input');

    const { address } = useAccount();
    const { sendCallsAsync } = useSendCalls();

    useEffect(() => {
        const equalPercentage = (100 / selectedCoins.length).toFixed(2);
        const initialPercentages = Object.fromEntries(
            selectedCoins.map(coin => [coin.id, equalPercentage])
        );
        setPercentages(initialPercentages);
    }, [selectedCoins]);

    const handlePercentageChange = (id: string, value: string) => {
        setPercentages(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const adjustPercentages = (percentages: { [key: string]: number }): { [key: string]: number } => {
        const total = Object.values(percentages).reduce((sum, p) => sum + p, 0);
        if (Math.abs(total - 100) <= 0.1) {
            const lastCoinId = selectedCoins[selectedCoins.length - 1].id;
            return {
                ...percentages,
                [lastCoinId]: percentages[lastCoinId] + (100 - total)
            };
        }
        return percentages;
    };

    const handleProceed = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const numericPercentages = Object.fromEntries(
                Object.entries(percentages).map(([key, value]) => [key, Number(value)])
            );

            const adjustedPercentages = adjustPercentages(numericPercentages);

            const swapRequests = selectedCoins.map(coin => ({
                tokenIn: USDC_ADDRESS,
                tokenOut: coin.contract_address,
                amountIn: Math.floor(Number(amount) * 1e6 * adjustedPercentages[coin.id] / 100).toString(),
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
            setStage('rebalance');
        } catch (error: any) {
            console.error('Error during swap data generation:', error);
            setError(`Failed to generate swap data: ${error.message}`);
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
        try {
            const totalAmount = parseUnits(amount, 6); // Assuming USDC has 6 decimals
            const approvalData = encodeFunctionData({
                abi: [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
                functionName: 'approve',
                args: ["0x2626664c2603336E57B271c5C0b26F421741e481", totalAmount]
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
            console.log('Rebalance transaction submitted:', callsId);
            onRebalance(amount, adjustPercentages(Object.fromEntries(Object.entries(percentages).map(([key, value]) => [key, Number(value)]))));
        } catch (error: any) {
            console.error('Error during rebalance:', error);
            setError(`Failed to execute rebalance: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-light-blue p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Rebalance Portfolio ({selectedCoins.length} coins)</h2>
                {stage === 'input' && (
                    <>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter USDC amount"
                            className="w-full p-2 mb-4 bg-dark-blue text-white rounded"
                        />
                        <div className="mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isEqualDistribution}
                                    onChange={() => setIsEqualDistribution(!isEqualDistribution)}
                                    className="mr-2"
                                />
                                Equal Distribution
                            </label>
                        </div>
                        <div className="mb-4">
                            {selectedCoins.map(coin => (
                                <div key={coin.id} className="flex items-center mb-2">
                                    <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
                                    <span className="w-24 truncate" title={`${coin.name} (${coin.symbol})`}>
                                        {coin.symbol}:
                                    </span>
                                    <input
                                        type="number"
                                        value={percentages[coin.id] || ''}
                                        onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                                        disabled={isEqualDistribution}
                                        className="w-20 p-1 bg-dark-blue text-white rounded"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                    />
                                    <span className="ml-2">%</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleProceed}
                            className="w-full bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Proceed'}
                        </button>
                    </>
                )}
                {stage === 'rebalance' && (
                    <>
                        <p className="mb-4">Swap data generated successfully. Ready to rebalance.</p>
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRebalance}
                                className="bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Rebalancing...' : 'Rebalance'}
                            </button>
                        </div>
                    </>
                )}
                {error && <div className="text-red-500 mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default RebalanceModal;