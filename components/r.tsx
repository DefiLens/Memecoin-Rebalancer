// import React, { useState, useEffect } from 'react';
// import { useSendCalls, useWriteContracts } from 'wagmi/experimental';
// import { useAccount, useSendTransaction } from 'wagmi';
// import { parseUnits, encodeFunctionData } from 'viem';

// interface CoinDetails {
//     id: string;
//     name: string;
//     symbol: string;
//     contract_address: string;
//     decimal_place: number;
//     image: string;
// }

// interface RebalanceModalProps {
//     selectedCoins: CoinDetails[];
//     onClose: () => void;
//     onRebalance: (amount: string, percentages: { [key: string]: number }) => void;
// }

// const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD"; // Uniswap Universal Router on Base Sepolia
// const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // USDC address on Base Sepolia

// const RebalanceModal: React.FC<RebalanceModalProps> = ({ selectedCoins, onClose, onRebalance }) => {
//     const [amount, setAmount] = useState('');
//     const [isEqualDistribution, setIsEqualDistribution] = useState(true);
//     const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const { address, chain } = useAccount();
//     const {
//         writeContractsAsync,
//         error: mintError,
//         status: mintStatus,
//         data: id,
//       } = useWriteContracts();
//     const { writeContracts } = useWriteContracts()
//     const { sendTransaction } = useSendTransaction()
//     const { sendCallsAsync } = useSendCalls();

//     useEffect(() => {
//         const equalPercentage = (100 / selectedCoins.length).toFixed(2);
//         const initialPercentages = Object.fromEntries(
//             selectedCoins.map(coin => [coin.id, equalPercentage])
//         );
//         setPercentages(initialPercentages);
//     }, [selectedCoins]);

//     const handlePercentageChange = (id: string, value: string) => {
//         setPercentages(prev => ({
//             ...prev,
//             [id]: value
//         }));
//     };

//     const adjustPercentages = (percentages: { [key: string]: number }): { [key: string]: number } => {
//         const total = Object.values(percentages).reduce((sum, p) => sum + p, 0);
//         if (Math.abs(total - 100) <= 0.1) {
//             const lastCoinId = selectedCoins[selectedCoins.length - 1].id;
//             return {
//                 ...percentages,
//                 [lastCoinId]: percentages[lastCoinId] + (100 - total)
//             };
//         }
//         return percentages;
//     };

//     const handleRebalance = async () => {
//         if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
//             setError('Please enter a valid amount');
//             return;
//         }

//         const numericPercentages = Object.fromEntries(
//             Object.entries(percentages).map(([key, value]) => [key, Number(value)])
//         );

//         const adjustedPercentages = adjustPercentages(numericPercentages);
//         const total = Object.values(adjustedPercentages).reduce((sum, p) => sum + p, 0);

//         if (Math.abs(total - 100) > 0.1) {
//             setError('Percentages must sum to approximately 100%');
//             return;
//         }

//         if (!address || !chain) {
//             setError('Wallet not connected');
//             return;
//         }

//         setError('');
//         setIsLoading(true);

//         // console.log(Math.floor(Number(amount) * 1e6 * adjustedPercentages[coin.id] / 100).toString())
//         try {
//             const swapRequests = selectedCoins.map(coin => ({
//                 tokenIn: USDC_ADDRESS,
//                 tokenOut: coin.contract_address,
//                 amountIn: Math.floor(Number(amount) * 1e6 * adjustedPercentages[coin.id] / 100).toString(),
//                 recipient: address
//             }));
//             console.log("swapRequests: ", swapRequests)

//             const response = await fetch('http://localhost:3002/api/generate-swap-data', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(swapRequests),
//             });
//             console.log("response", response)

//             if (!response.ok) {
//                 throw new Error('Failed to generate swap data');
//             }

//             const swapData = await response.json();
//             console.log("swapData", swapData)

//             //   [swapData.map((data: any) => ({
//             //     target: data.to,
//             //     callData: data.calldata,
//             //     value: data.value,
//             //   }))],


//             // const txResult1 = await sendTransaction(
//             //     swapData.map((data: any) => ({
//             //         to: swapData[0].to,
//             //         value: swapData[0].value,
//             //         data: swapData[0].calldata
//             //     }))
//             //     // }
//             // )

//             const totalAmount = parseUnits("10", 6); // Assuming USDC has 6 decimals
//             const spender = "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989"//swapData[0].to; // Use the first 'to' address as the spender
//             const approvalData = encodeFunctionData({
//                 abi: [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
//                 functionName: 'approve',
//                 args: [spender, totalAmount]
//             });
//             console.log("approvalData: ", approvalData)

//             const calls = [
//                 {
//                   to: USDC_ADDRESS,
//                   data: approvalData,
//                   value: BigInt(0)
//                 },
//               ];

//             const callsId = await sendCallsAsync({calls})

//             //   console.log(swapData.map((data: any) => ({
//             //     address: data.to,
//             //     value: data.value,
//             //     data: data.calldata
//             // })))
//             // console.log("mintError", mintError, mintStatus)

//             // await writeContractsAsync({
//             //     contracts: [
//             //       {
//             //         address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//             //         abi: [{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
//             //         functionName: "transfer",
//             //         args: ["0xb50685c25485CA8C520F5286Bbbf1d3F216D6989", BigInt(1)],
//             //       },
//             //       {
//             //         address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
//             //         abi: [{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}],
//             //         functionName: "transfer",
//             //         args: ["0xb50685c25485CA8C520F5286Bbbf1d3F216D6989", BigInt(2)],
//             //       },
//             //     ],
//             //   });
//               console.log("mintError", mintError, mintStatus)

//             // const txResult = await writeContractsAsync({
//             //     contracts: 
//             //     [
//             //         {
//             //           address: USDC_ADDRESS,
//             //           abi: [{ "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }],
//             //           functionName: 'approve',
//             //           args: ["0xb50685c25485CA8C520F5286Bbbf1d3F216D6989", BigInt(100)],
//             //         //   value: 0,
//             //         },
//             //         // {
//             //         //   address: recipient2,
//             //         //   abi: [],
//             //         //   functionName: 'transfer',
//             //         //   args: [],
//             //         //   value: amount,
//             //         // },
//             //       ],
//             // })
//             //   const txResult = await writeContractAsync({
//             //     address: UNISWAP_ROUTER_ADDRESS as `0x${string}`,
//             //     abi: [
//             //       {
//             //         inputs: [
//             //           {
//             //             components: [
//             //               { internalType: "address", name: "target", type: "address" },
//             //               { internalType: "bytes", name: "callData", type: "bytes" },
//             //               { internalType: "uint256", name: "value", type: "uint256" },
//             //             ],
//             //             internalType: "struct Multicall.Call[]",
//             //             name: "calls",
//             //             type: "tuple[]",
//             //           },
//             //         ],
//             //         name: "multicall",
//             //         outputs: [{ internalType: "bytes[]", name: "results", type: "bytes[]" }],
//             //         stateMutability: "payable",
//             //         type: "function",
//             //       },
//             //     ],
//             //     functionName: 'multicall',
//             //     args: [swapData.map((data: any) => ({
//             //       target: data.to,
//             //       callData: data.calldata,
//             //       value: data.value,
//             //     }))],
//             //     value: parseUnits(amount, 6), // Assuming USDC has 6 decimals
//             //   });

//             console.log('Transaction successful:', callsId);
//             onRebalance(amount, adjustedPercentages);
//         } catch (error) {
//             console.error('Error during rebalance:', error);
//             setError('Failed to execute rebalance. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//             <div className="bg-light-blue p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
//                 <h2 className="text-xl font-bold mb-4">Rebalance Portfolio ({selectedCoins.length} coins)</h2>
//                 <input
//                     type="number"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     placeholder="Enter USDC amount"
//                     className="w-full p-2 mb-4 bg-dark-blue text-white rounded"
//                 />
//                 <div className="mb-4">
//                     <label className="flex items-center">
//                         <input
//                             type="checkbox"
//                             checked={isEqualDistribution}
//                             onChange={() => setIsEqualDistribution(!isEqualDistribution)}
//                             className="mr-2"
//                         />
//                         Equal Distribution
//                     </label>
//                 </div>
//                 <div className="mb-4">
//                     {selectedCoins.map(coin => (
//                         <div key={coin.id} className="flex items-center mb-2">
//                             <img src={coin.image} alt={coin.symbol} className="w-6 h-6 mr-2" />
//                             <span className="w-24 truncate" title={`${coin.name} (${coin.symbol})`}>
//                                 {coin.symbol}:
//                             </span>
//                             <input
//                                 type="number"
//                                 value={percentages[coin.id] || ''}
//                                 onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
//                                 disabled={isEqualDistribution}
//                                 className="w-20 p-1 bg-dark-blue text-white rounded"
//                                 min="0"
//                                 max="100"
//                                 step="0.01"
//                             />
//                             <span className="ml-2">%</span>
//                         </div>
//                     ))}
//                 </div>
//                 {error && <div className="text-red-500 mb-4">{error}</div>}
//                 <div className="flex justify-end">
//                     <button
//                         onClick={onClose}
//                         className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
//                         disabled={isLoading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleRebalance}
//                         className="bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? 'Processing...' : 'Rebalance'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RebalanceModal;