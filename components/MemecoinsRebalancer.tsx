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

const UNISWAP_ROUTER_ADDRESS = '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import moment from 'moment';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface CoinChartData {
  x: number;
  y: string;
}

const HistoryChart = () => {
  const [data, setData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('365'); // Default to 1 year

  const id = 'bitcoin'; // You can pass this as a prop if dynamic

  const getData = async (days: string) => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  useEffect(() => {
    getData(timeframe); // Fetch data when component mounts or timeframe changes
  }, [timeframe]);

  if (!data) {
    return <>Loading...</>;
  }

  // Map the API response to chart data format
  const coinChartData: CoinChartData[] = data?.prices?.map((value: any) => ({
    x: value[0],
    y: value[1].toFixed(2),
  }));

  // Chart options and data
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Market Price History',
      },
    },
  };

  const chartData = {
    labels: coinChartData.map((value) => moment(value.x).format('MMM DD')),
    datasets: [
      {
        fill: true,
        label: `${id.toUpperCase()} Price (USD)`,
        data: coinChartData.map((val) => val.y),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const handleTimeframeChange = (days: string) => {
    setTimeframe(days);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between mb-4">
        <button onClick={() => handleTimeframeChange('1')} className="btn">
          Today
        </button>
        <button onClick={() => handleTimeframeChange('7')} className="btn">
          1 Week
        </button>
        <button onClick={() => handleTimeframeChange('30')} className="btn">
          1 Month
        </button>
        <button onClick={() => handleTimeframeChange('182')} className="btn">
          6 Months
        </button>
        <button onClick={() => handleTimeframeChange('365')} className="btn">
          1 Year
        </button>
      </div>
      <span
        data-converter-target="price"
        data-coin-id="39910"
        data-price-target="price"
        data-price-btc="6.218603274842037e-11"
        data-prev-price="0.000003858537491411746"
      >
        $0.0<sub title="$0.000003859">5</sub>3859
      </span>
      <Line options={options} data={chartData} />
    </div>
  );
};

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
      {/* <HistoryChart /> */}

      <div className="bg-P1 p-4 rounded-lg flex h-[calc(100vh-100px)]">
        {/* Left side: Memecoin list (60%) */}
        <div className="w-3/5 pr-4 overflow-y-auto hide_scrollbar">
          <MemeCoinGrid
            selectedCoins={selectedCoins}
            handleCoinSelect={handleCoinSelect}
            selectTokenLoading={selectTokenLoading}
          />
        </div>

        {/* Right side: Rebalancing controls (40%) */}
        <div className="w-2/5 pl-4 border-l border-zinc-700 flex flex-col">
          <div className="mb-4 sticky top-0 z-10">
            <h2 className="text-xl font-bold mb-4 text-white">Rebalance Portfolio</h2>
            <label htmlFor="amount" className="text-sm text-zinc-200">
              Amount
            </label>
            <input
              type="text" // Change type to text
              inputMode="numeric"
              value={amount}
              onChange={setAmountChange}
              placeholder="Enter USDC amount"
              className="w-full p-2 mb-4 bg-zinc-800 border border-zinc-700 outline-none text-white rounded"
            />
          </div>
          <div className="flex-grow overflow-y-auto">
            {selectedCoins.map((coin) => (
              <div
                key={coin.id}
                className="flex items-center mb-2 border border-zinc-700 p-2 rounded"
              >
                <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
                <span className="w-24 truncate mr-2">{coin.symbol}:</span>
                <input
                  type="text" // Change type to text
                  inputMode="numeric" // Set input mode to numeric
                  value={percentages[coin.id] || ''}
                  onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                  className="w-20 p-1 bg-zinc-800 text-white rounded outline-none"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="ml-2">%</span>
                <button
                  onClick={() => handleCoinSelect(coin)}
                  className="ml-auto text-zinc-200 hover:bg-zinc-700 p-1 rounded-md transition-all duration-200"
                >
                  <RxCross1 />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 sticky bottom-0 z-10">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={
                  buttonState === 'proceed'
                    ? handleProceed
                    : buttonState === 'rebalance'
                    ? handleRebalance
                    : undefined
                }
                className={`bg-primary-gradient text-white font-bold py-2 px-4 rounded ${
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
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded ml-2"
              >
                <FiTrash2 />
              </button>
            </div>
            {/* {sendCallsStatus !== 'idle' && (
            <div className="mt-4 text-white">Rebalance Status: {sendCallsStatus}</div>
          )} */}
            {/* {error && <div className="text-red-500 mb-4">{error}</div>}  */}
            {sendCallsError && <div className="text-red-500 mt-4">{sendCallsError.message}</div>}
            <TransactionStatus callStatus={callsStatus} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemecoinsRebalancer;
