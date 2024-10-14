import React, { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatUnits, Address, parseAbi } from 'viem';
import { useAccount } from 'wagmi';
import { FiX } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { base } from 'viem/chains';
import { memeCoinData } from '../utils/constant';

// Setup the public client with viem on Base network
const publicClient = createPublicClient({
    chain: base,
    transport: http()
});

// Define ERC20 ABI for multicall
const erc20Abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
]);

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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500/api';

// Fetch the meme coin data from meme_coin_details.json
const fetchTokenDetails = async (): Promise<TokenDetails[]> => {
  try {
    const response = memeCoinData;
    const tokenList = response
    return tokenList.map((token: any) => ({
      id: token.id,
      name: token.name,
      symbol: token.symbol,
      contractAddress: token.detail_platforms.base.contract_address as Address,
      decimalPlaces: token.detail_platforms.base.decimal_place,
      imageUrl: token.image.thumb,
    }));
  } catch (error) {
    console.error('Failed to fetch token details:', error);
    return [];
  }
};

const Portfolio: React.FC<PortfolioProps> = ({ isOpen, onClose }) => {
  const { address } = useAccount();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails[]>([]);

  // Fetch token prices
  const fetchTokenPrices = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/swap/token`);
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }
      return await response.json(); // Assume response has token price data
    } catch (error) {
      console.error('Error fetching token prices:', error);
      toast.error('Failed to fetch token prices');
      return [];
    }
  }, []);

  const fetchBalances = useCallback(async () => {
    if (!address || tokenDetails.length === 0) return;

    setIsLoading(true);
    try {
      const tokenPrices = await fetchTokenPrices();

      // Prepare multicall contracts to get balances
      const multicallContracts = tokenDetails.map((token) => ({
        address: token.contractAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      }));

      const results = await publicClient.multicall({
        contracts: multicallContracts,
      });

      let totalValue = 0;
      const balances = results.map((result, index) => {
        if (result.status === 'success') {
          const token = tokenDetails[index];
          const balance = formatUnits(BigInt(result.result as string), token.decimalPlaces);

          const priceData = tokenPrices.find((price: any) => price.id === token.id);
          const price = priceData?.current_price || 0;

          const value = parseFloat(balance) * price;

          totalValue += value;

          return {
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            balance: balance,
            price: price,
            value: value,
            imageUrl: token.imageUrl,
          };
        } else {
          console.error(`Failed to fetch balance for ${tokenDetails[index].name}`);
          return null;
        }
      }).filter((token): token is TokenBalance => token !== null);

      setTokenBalances(balances);
      setTotalPortfolioValue(totalValue);
    } catch (error) {
      console.error('Error fetching balances:', error);
      toast.error('Failed to fetch token balances');
    } finally {
      setIsLoading(false);
    }
  }, [address, tokenDetails, fetchTokenPrices]);

  useEffect(() => {
    if (isOpen && address) {
      // Fetch token details and prices when the portfolio is opened
      fetchTokenDetails().then(setTokenDetails);
    }
  }, [isOpen, address]);

  useEffect(() => {
    if (isOpen && address && tokenDetails.length > 0) {
      fetchBalances();
    }
  }, [isOpen, address, tokenDetails, fetchBalances]);

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
              {tokenBalances.map((token) => ( parseFloat(token.balance) > 0 &&
                <tr key={token.id} className="border-b border-gray-700 text-white">
                  <td className="py-4 px-6 flex items-center">
                    <Image src={token.imageUrl} alt={token.name} width={40} height={40} className="mr-6 rounded-full" />
                    <span className="text-lg ml-4 font-semibold">{token.name}</span>
                  </td>
                  <td className="py-4 px-6 text-lg font-semibold">{parseFloat(token.balance).toFixed(6)}</td>
                  <td className="py-4 px-6 text-lg font-semibold">${token.price.toFixed(6)}</td>
                  <td className="py-4 px-6 text-lg font-semibold">${token.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && <div className="text-center py-4 text-white">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
