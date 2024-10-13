import { encodeFunctionData } from 'viem';

// ERC20 Transfer function ABI
const erc20TransferABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
];

/**
 * Generates the calldata for an ERC20 token transfer.
 * 
 * @param to - The recipient's address
 * @param amount - The amount of tokens to transfer (in wei)
 * @returns The encoded calldata for the transfer function
 */
export function generateERC20TransferCalldata(to: string, amount: bigint): string {
  return encodeFunctionData({
    abi: erc20TransferABI,
    functionName: 'transfer',
    args: [to, amount],
  });
}

/**
 * Builds the complete transaction object for an ERC20 token transfer.
 * 
 * @param tokenAddress - The address of the ERC20 token contract
 * @param to - The recipient's address
 * @param amount - The amount of tokens to transfer (in wei)
 * @returns The transaction object ready to be sent
 */
export async function buildERC20TransferTransaction(tokenAddress: string, to: string, amount: bigint) {
  const data = generateERC20TransferCalldata(to, amount);
  
  return {
    to: tokenAddress,
    data,
    value: BigInt(0), // For a standard ERC20 transfer, no ETH is sent
  };
}