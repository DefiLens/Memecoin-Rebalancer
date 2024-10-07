// import { AlphaRouter, SwapOptions, SwapType } from "@uniswap/smart-order-router";
// import { CurrencyAmount, Ether, Percent, Token, TradeType } from "@uniswap/sdk-core";
// import { http, parseUnits } from "viem";
// import { getPublicClient } from "@wagmi/core";
// import { baseSepolia } from "wagmi/chains";
// import { config } from '../config/wagmi'
// import { ViemProvider } from "./customProvider";
// import { ethers } from "ethers";

// export async function generateUniswapCalldata(
//   tokenIn: string,
//   tokenOut: string,
//   amountIn: string,
//   address: string,
//   chainId: number
// ) {
//   const publicClient = getPublicClient(config, { chainId: 8453 });
// //   const customProvider = new ViemProvider(publicClient);
//   const newprovider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider("https://base-mainnet.g.alchemy.com/v2/<key>");

// //   const router = new AlphaRouter({
// //     chainId,
// //     provider: newprovider,
// //   });

// //   const tokenInDecimals = await publicClient.readContract({
// //     address: tokenIn as `0x${string}`,
// //     abi: [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }],
// //     functionName: 'decimals',
// //   });

// //   const tokenOutDecimals = await publicClient.readContract({
// //     address: tokenOut as `0x${string}`,
// //     abi: [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }],
// //     functionName: 'decimals',
// //   });

// //   const options: SwapOptions = {
// //     recipient: address,
// //     slippageTolerance: new Percent(50, 10_000),
// //     deadline: Math.floor(Date.now() / 1000 + 1800),
// //     type: SwapType.SWAP_ROUTER_02,
// //   };

// //   const currencyIn = new Token(chainId, tokenIn, 6);
// //   const currencyOut = new Token(chainId, tokenOut, 18);

// //   const amount = CurrencyAmount.fromRawAmount(currencyIn, 1000);

// //   const route = await router.route(
// //     amount,
// //     currencyOut,
// //     TradeType.EXACT_INPUT,
// //     options
// //   );

// //   if (!route) throw new Error("No route found");

// //   return {
// //     calldata: route.methodParameters?.calldata,
// //     amountOut: route.quote.toExact(),
// //   };
// }

// export const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"; // Uniswap Universal Router on Base Sepolia