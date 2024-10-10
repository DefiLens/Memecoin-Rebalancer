import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useSendCalls, useCallsStatus } from 'wagmi/experimental';
import { parseUnits, encodeFunctionData } from 'viem';
import { toast } from 'react-toastify';
import { FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import TransactionStatus from './TransactionStatus';
import { BASE_URL } from '../utils/keys';
import MemeCoinGrid from './MemeCoinGrid';
import { RxCross1 } from 'react-icons/rx';
import PriceChart from './base/PriceChart';
export interface CoinDetails {
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

interface SwapAmount {
  amountIn: string;
  amountOut: string;
}

const UNISWAP_ROUTER_ADDRESS = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

const MemecoinsRebalancer: React.FC = () => {
  const [selectedCoins, setSelectedCoins] = useState<CoinDetails[]>([]);
  const [amount, setAmount] = useState('');
  const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [swapData, setSwapData] = useState<any>(null);
  const [buttonState, setButtonState] = useState<
    'proceed' | 'quoting' | 'rebalance' | 'rebalancing'
  >('proceed');
  const [selectTokenLoading, setSelectTokenLoading] = useState<string | null>(null);
  const [swapAmounts, setSwapAmounts] = useState<{ [key: string]: SwapAmount }>({});

  const { address } = useAccount();
  const {
    sendCallsAsync,
    data: callsId,
    status: sendCallsStatus,
    error: sendCallsError,
  } = useSendCalls();
  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
    },
  });

  useEffect(() => {
    if (selectedCoins.length > 0) {
      const equalPercentage = (100 / selectedCoins.length).toFixed(2);
      const initialPercentages = Object.fromEntries(
        selectedCoins.map((coin) => [coin.id, equalPercentage])
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
    if (selectedCoins.find((c) => c.id === coin.id)) {
      setSelectedCoins(selectedCoins.filter((c) => c.id !== coin.id));
    } else {
      try {
        setSelectTokenLoading(coin.id);
        const response = await fetch(`${BASE_URL}/swap/token/${coin.id}`);
        const data = await response.json();
        const updatedCoin: CoinDetails = {
          ...coin,
          contract_address: data.detail_platforms.base?.contract_address || '',
          decimal_place: data.detail_platforms.base?.decimal_place || 18,
        };
        setSelectedCoins([...selectedCoins, updatedCoin]);
        setSelectTokenLoading(null);
      } catch (error) {
        console.error('Error fetching coin details:', error);
        toast.error(`Failed to fetch details for ${coin.symbol}`);
        setSelectTokenLoading(null);
      }
    }
  };

  const handlePercentageChange = (id: string, value: string) => {
    setPercentages((prev) => ({
      ...prev,
      [id]: value,
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
      const swapRequests = selectedCoins.map((coin) => ({
        tokenIn: USDC_ADDRESS,
        tokenOut: coin.contract_address,
        amountIn: Math.floor(
          (Number(amount) * 1e6 * Number(percentages[coin.id])) / 100
        ).toString(),
        recipient: address,
        decimalsIn: 6,
        decimalsOut: coin.decimal_place,
      }));

      const response = await fetch(`${BASE_URL}/swap/generate`, {
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
      data.forEach((item: any, index: number) => {
        amounts[selectedCoins[index].id] = {
          amountIn: (Number(item.amountIn) / 1e6).toFixed(6), // Convert from USDC's 6 decimals
          amountOut: item.amountOut,
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
        abi: [
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'approve',
        args: [swapData[0].to, totalAmount],
      });

      const calls = [
        {
          to: USDC_ADDRESS,
          data: approvalData,
          value: BigInt(0),
        },
        ...swapData.map((data: any) => ({
          to: data.to,
          data: data.calldata,
          value: BigInt(data.value || 0),
        })),
      ];

      const callsId = await sendCallsAsync({
        calls,
        capabilities: {
          paymasterService: {
            // Paymaster Proxy Node url goes here.
            url: process.env.NEXT_PUBLIC_BASE_PAYMASTER,
          },
        },
      });
    } catch (error: any) {
      console.error('Error during rebalance:', error);
      setError(`Failed to execute rebalance: ${error.message}`);
      toast.error('Rebalance failed. Please try again.');
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

  const saveTxn = async (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (
      callsStatus?.status === 'CONFIRMED' &&
      callsStatus.receipts &&
      callsStatus.receipts.length > 0
    ) {
      const txHash = callsStatus.receipts[0].transactionHash;
      // const txHash = "transactionHash";

      saveTxn({
        hash: txHash,
        amount: amount,
        selectedCoins: selectedCoins,
        swapData: swapData,
        percentages: percentages,
      });
      toast.success(`Transaction successful! Hash: ${txHash}`);
      resetState();
    }
  }, [callsStatus]);

  const setAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let amountChange = e.target.value;

    // Allow the input to be cleared (empty string)
    if (amountChange === '') {
      setAmount(amountChange);
      return;
    }

    // Remove any non-numeric characters except a single decimal point
    amountChange = amountChange.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point is allowed
    const decimalParts = amountChange.split('.');
    if (decimalParts.length > 2) {
      amountChange = decimalParts[0] + '.' + decimalParts.slice(1).join('');
    }

    // Restrict the integer part length to 10 characters
    if (decimalParts[0].length > 10) {
      decimalParts[0] = decimalParts[0].slice(0, 10);
    }

    // Combine the integer and decimal parts back
    amountChange = decimalParts.join('.');
    setAmount(amountChange);
  };

  return (
    <>
      <div className="flex flex-1 bg-P1 p-4 rounded-lg overflow-hidden">
        {/* Left side: Memecoin list (60%) */}
        <div className="w-8/12 pr-4 overflow-auto hide_scrollbar h-full">
          <MemeCoinGrid
            selectedCoins={selectedCoins}
            handleCoinSelect={handleCoinSelect}
            selectTokenLoading={selectTokenLoading}
          />
        </div>

        {/* Right side: Rebalancing controls (40%) */}
        <div className="w-4/12 pl-4 border-l border-zinc-700 flex flex-col gap-2 h-full">
          <div className="">
            <h2 className="text-xl font-bold mb-4 text-white">Rebalance Portfolio</h2>
            <h2 className="text-sm text-zinc-200 mb-1">Amount</h2>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter USDC amount"
              className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none"
            />
          </div>

          <div className="flex-grow overflow-y-auto hide_scrollbar">
            {selectedCoins.map((coin) => (
              <div key={coin.id} className="mb-4 bg-zinc-800 p-4 rounded-lg ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
                    <span className="font-bold">{coin.symbol}</span>
                  </div>
                  <button
                    onClick={() => handleCoinSelect(coin)}
                    className="p-1 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
                  >
                    <RxCross1 />
                  </button>
                </div>
                <div className="flex items-center mb-2 text-zinc-300">
                  <input
                    type="number"
                    value={percentages[coin.id] || ''}
                    onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                    className="w-20 border border-zinc-700 p-1 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none mr-1"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span>% of portfolio</span>
                </div>
                {swapAmounts[coin.id] && (
                  <div className="text-sm text-zinc-300">
                    <div className="font-light text-zinc-400">
                      <span className="font-semibold text-zinc-200">Input:</span>{' '}
                      {swapAmounts[coin.id].amountIn} USDC
                    </div>
                    <div className="font-light text-zinc-400">
                      <span className="font-semibold text-zinc-200">Expected Output:</span>{' '}
                      {swapAmounts[coin.id].amountOut} {coin.symbol}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex justify-between items-center">
              <button
                onClick={
                  buttonState === 'proceed'
                    ? handleProceed
                    : buttonState === 'rebalance'
                    ? handleRebalance
                    : undefined
                }
                className={`px-3 py-2 bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 ${
                  selectedCoins.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={
                  isLoading ||
                  buttonState === 'quoting' ||
                  buttonState === 'rebalancing' ||
                  selectedCoins.length === 0
                }
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
                className="p-2 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
              >
                <FiTrash2 />
              </button>
            </div>
            {/* {sendCallsStatus !== 'idle' && (
              <div className="mt-4 text-white">Rebalance Status: {sendCallsStatus}</div>
            )} */}
            {sendCallsError && <div className="text-red-500 mt-4">{sendCallsError.message}</div>}
            <TransactionStatus callStatus={callsStatus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemecoinsRebalancer;
