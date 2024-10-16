import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import { parseUnits, encodeFunctionData, Address } from "viem";
import { toast } from "react-toastify";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { RiExternalLinkLine } from "react-icons/ri";
import axios from "axios";
import { BASE_URL } from "../../utils/keys";
import MemeCoinGrid from "./MemeCoinGrid";
import Loader from "../shared/Loader";
import ReviewRebalance from "../shared/ReviewRebalance";
import { ButtonState, ApprovalAddress, TransactionStatus } from "./types";
import { USDC_ADDRESS } from "../../utils/constant";
import { useRebalanceStore } from "../../context/rebalance.store";
import SelectedSellToken from "./SelectedSellToken";
import SelectedBuyToken from "./SelectedBuyToken";
import { decreasePowerByDecimals, incresePowerByDecimals } from "../../utils/helper";
import { BigNumber as bg } from "bignumber.js";
import {
    FaArrowCircleDown,
    FaArrowCircleUp,
    FaBitbucket,
    FaClock,
    FaExchangeAlt,
    FaFireAlt,
    FaShoppingCart,
    FaSync,
} from "react-icons/fa";
import { useGlobalStore } from "../../context/global.store";
bg.config({ DECIMAL_PLACES: 20 });

export interface ISwapData {
    amountIn: string;
    amountOut: string;
    calldata: string;
    to: Address;
    value: string;
}

const MemecoinsRebalancer: React.FC = () => {
    const { showCart, setShowCart } = useGlobalStore();
    const { buyTokens, sellTokens, clearSelectedTokens } = useRebalanceStore();
    const [amount, setAmount] = useState("");
    const [percentages, setPercentages] = useState<{ [key: string]: string }>({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [buttonState, setButtonState] = useState<ButtonState>("proceed");
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>("idle");
    const [openReview, setOpenReview] = useState(false);
    const [swapData, setSwapData] = useState<any>(null);
    const [swapAmounts, setSwapAmounts] = useState<{ [key: string]: { amountIn: string; amountOut: string } }>({});
    const { address } = useAccount();
    const { sendCallsAsync, data: callsId, status: sendCallsStatus, error: sendCallsError } = useSendCalls();

    const { data: callsStatus } = useCallsStatus({
        id: callsId as string,
        query: {
            enabled: !!callsId,
            refetchInterval: (data) => (data.state.data?.status === "CONFIRMED" ? false : 1000),
        },
    });
    const tokenAddress = USDC_ADDRESS; // Explicitly cast to Address type
    const { data: usdcBalance } = useBalance({
        address,
        token: tokenAddress,
    });

    useEffect(() => {
        if (buyTokens.length > 0) {
            const equalPercentage = (100 / buyTokens.length).toFixed(2);
            const initialPercentages = Object.fromEntries(buyTokens.map((coin) => [coin.id, equalPercentage]));
            setPercentages(initialPercentages);
        } else {
            setPercentages({});
        }

        if (swapData) {
            setButtonState("proceed");
            setSwapData(null);
        }
    }, [buyTokens]);

    const handlePercentageChange = (id: string, value: string) => {
        setPercentages((prev) => ({
            ...prev,
            [id]: value,
        }));
        setButtonState("proceed");
        setSwapData(null);
    };

    const handleProceed = async () => {
        if (buyTokens.length > 0 && (!amount || isNaN(Number(amount)) || Number(amount) <= 0)) {
            setError("Please enter a valid buy amount");
            return;
        }
        for (const sellToken of sellTokens) {
            if (!sellToken.amount || isNaN(Number(sellToken.amount)) || Number(sellToken.amount) <= 0) {
                setError(`Please enter a valid sell amount for token: ${sellToken.symbol.toLocaleUpperCase()}`);
                return;
            }
        }

        setError("");
        setIsLoading(true);
        setButtonState("quoting");

        try {
            const swapRequests = [
                ...buyTokens.map((coin) => ({
                    tokenIn: USDC_ADDRESS,
                    tokenOut: coin.contract_address,
                    amountIn: Math.floor((Number(amount) * 1e6 * Number(percentages[coin.id])) / 100).toString(),
                    recipient: address,
                    decimalsIn: 6,
                    decimalsOut: coin.decimal_place,
                })),
                ...sellTokens.map((coin) => ({
                    tokenIn: coin.contract_address,
                    tokenOut: USDC_ADDRESS,
                    amountIn: parseUnits(String(coin.amount), Number(coin.decimal_place)).toString(),
                    recipient: address,
                    decimalsIn: coin.decimal_place,
                    decimalsOut: 6,
                })),
            ];

            console.log("swapRequests: ", swapRequests);

            const response = await fetch(`${BASE_URL}/swap/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(swapRequests),
            });

            if (!response.ok) {
                throw new Error("Failed to generate swap data");
            }

            const data = await response.json();
            console.log(data);

            // Create a new amounts object to store amountIn and amountOut for each token.
            const amounts: { [key: string]: { amountIn: string; amountOut: string } } = {};

            data.swapResponses.forEach((item: any, index: number) => {
                if (index < buyTokens.length) {
                    // For buy tokens, set the amountIn and amountOut.
                    amounts[buyTokens[index].id] = {
                        amountIn: (Number(item.amountIn) / 1e6).toFixed(6),
                        amountOut: item.amountOut,
                    };
                } else {
                    // For sell tokens, update amountIn and amountOut.
                    const sellIndex = index - buyTokens.length;
                    amounts[sellTokens[sellIndex].id] = {
                        amountIn: decreasePowerByDecimals(item.amountIn, Number(sellTokens[sellIndex].decimal_place)),
                        amountOut: item.amountOut,
                    };
                }
            });

            // Update states
            setSwapAmounts((prev) => ({
                ...prev,
                ...amounts, // Update for buy tokens
            }));
            setSwapData(data);
            setButtonState("rebalance");
        } catch (error: any) {
            console.error("Error during swap data generation:", error);
            setError(`Failed to generate swap data`);
            setButtonState("proceed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRebalance = async () => {
        if (!swapData || !swapData.swapResponses || !swapData.approvalAddresses) {
            setError("Swap data not available");
            return;
        }

        setIsLoading(true);
        setButtonState("rebalancing");
        setTransactionStatus("pending");

        try {
            const totalAmount = parseUnits(amount, 6);
            // Create approval calls for each unique service
            const approvalCalls = swapData.approvalAddresses.map((approvalObj: ApprovalAddress) => {
                const [service, address] = Object.entries(approvalObj)[0];
                return {
                    to: USDC_ADDRESS,
                    data: encodeFunctionData({
                        abi: [
                            {
                                inputs: [
                                    { internalType: "address", name: "spender", type: "address" },
                                    { internalType: "uint256", name: "amount", type: "uint256" },
                                ],
                                name: "approve",
                                outputs: [{ internalType: "bool", name: "", type: "bool" }],
                                stateMutability: "nonpayable",
                                type: "function",
                            },
                        ],
                        functionName: "approve",
                        args: [address, totalAmount],
                    }),
                    value: BigInt(0),
                };
            });

            // Create swap calls
            const swapCalls = swapData.swapResponses.map((data: any) => ({
                to: data.to,
                data: data.calldata,
                value: BigInt(data.value || 0),
            }));

            const sellApprove = sellTokens.map((token, index) => {
                const approvalData = encodeFunctionData({
                    abi: [
                        {
                            inputs: [
                                { internalType: "address", name: "spender", type: "address" },
                                { internalType: "uint256", name: "amount", type: "uint256" },
                            ],
                            name: "approve",
                            outputs: [{ internalType: "bool", name: "", type: "bool" }],
                            stateMutability: "nonpayable",
                            type: "function",
                        },
                    ],
                    functionName: "approve",
                    args: [
                        swapData.swapResponses[index].to,
                        parseUnits(String(token.amount), Number(token.decimal_place)),
                    ],
                });

                return {
                    to: token.contract_address,
                    data: approvalData,
                    value: BigInt(0),
                };
            });

            // const calls = [
            //     {
            //         to: USDC_ADDRESS,
            //         data: approvalData,
            //         value: BigInt(0),
            //     },
            //     ...sellApprove,
            //     ...swapData.map((data: any) => ({
            //         to: data.to,
            //         data: data.calldata,
            //         value: BigInt(data.value || 0),
            //     })),
            // ];

            // Combine approval and swap calls
            const calls = [...approvalCalls, ...sellApprove, ...swapCalls];

            console.log("Calls:", calls);

            await sendCallsAsync({
                calls,
                capabilities: {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_BASE_PAYMASTER,
                    },
                },
            });

            toast.success("Rebalance executed successfully!");
            setButtonState("rebalance");
            setTransactionStatus("success");
        } catch (error: any) {
            console.error("Error during rebalance:", error);
            setError(`Failed to execute rebalance`);
            toast.error("Rebalance failed. Please try again.");
            setButtonState("rebalance");
            setTransactionStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        clearSelectedTokens();
        setPercentages({});
        setAmount("");
        setSwapData(null);
        setSwapAmounts({});
        setButtonState("proceed");
        setError("");
    };

    const resetSwapAmount = () => {
        setSwapAmounts({});
    };
    const resetTransactionStatus = () => {
        setTransactionStatus("idle");
    };

    useEffect(() => {
        resetSwapAmount();
        setButtonState("proceed");
    }, [buyTokens, sellTokens]);

    const saveTxn = async (data: any) => {
        try {
            const response = await axios.post(`${BASE_URL}/transaction`, data);
            console.log("Transaction stored successfully:", response.data);
        } catch (error) {
            console.error("Failed to store transaction:", error);
        }
    };

    useEffect(() => {
        // if (callsStatus?.status === "CONFIRMED" && callsStatus.receipts && callsStatus.receipts.length > 0) {
        //     const txHash = callsStatus.receipts[0].transactionHash;

        //     await saveTxn({
        //         userAddress: address,
        //         hash: txHash,
        //         amount: amount,
        //         selectedCoins: buyTokens,
        //         percentages: percentages,
        //     });
        //     toast.success(
        //         <a
        //             href={`https://basescan.org/tx/${txHash}`}
        //             target="_blank"
        //             rel="noopener noreferrer"
        //             className="text-base font-light tracking-wide flex items-center gap-2 hover:text-cyan-400 transition-all duration-200"
        //         >
        //             Success: {txHash.substring(0, 5)}...
        //             {txHash.substring(txHash.length - 5, txHash.length)}
        //             <RiExternalLinkLine className="text-base" />
        //         </a>
        //     );
        //     resetState();
        // }
        const handleTransactionSave = async () => {
            if (callsStatus?.status === "CONFIRMED" && callsStatus.receipts && callsStatus.receipts.length > 0) {
                const txHash = callsStatus.receipts[0].transactionHash;

                try {
                    toast.success(
                        <a
                            href={`https://basescan.org/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-light tracking-wide flex items-center gap-2 hover:text-cyan-400 transition-all duration-200"
                        >
                            Success: {txHash.substring(0, 5)}...
                            {txHash.substring(txHash.length - 5, txHash.length)}
                            <RiExternalLinkLine className="text-base" />
                        </a>
                    );
                    // Save the transaction first
                    await saveTxn({
                        userAddress: address,
                        hash: txHash,
                        amount: amount,
                        selectedCoins: buyTokens,
                        percentages: percentages,
                    });
                    // Reset the state after saving the transaction
                    resetState();
                } catch (error) {
                    console.error("Failed to save transaction or reset state:", error);
                }
            }
        };

        handleTransactionSave();
    }, [callsStatus]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //set amount value
    const setAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let amountChange = e.target.value;
        setSwapData(null);
        setSwapAmounts({});
        // Allow the input to be cleared (empty string)
        if (amountChange === "") {
            setErrorMessage(null);
            setAmount("");
            return;
        }
        amountChange = amountChange.replace(/[^0-9.]/g, "");
        const decimalParts = amountChange.split(".");
        if (decimalParts.length > 2) {
            amountChange = decimalParts[0] + "." + decimalParts.slice(1).join("");
        }
        if (decimalParts[0].length > 10) {
            decimalParts[0] = decimalParts[0].slice(0, 10);
        }
        amountChange = decimalParts.join(".");

        // Convert the amount to the correct decimal power
        const increasedPower = incresePowerByDecimals(amountChange, 6);
        const increasedUsdcPower = incresePowerByDecimals(String(usdcBalance?.formatted), 6);

        const condition = increasedUsdcPower;
        if (bg(increasedPower).gte(bg(condition))) {
            setErrorMessage("Insufficient balance.");
            return;
        }

        // Clear any previous errors and update the state
        setErrorMessage(null);
        setAmount(amountChange);
    };
    const setMaxAmount = () => {
        if (!usdcBalance) return;
        setErrorMessage("");
        setError("");
        setAmount(usdcBalance.formatted);
    };

    const toggleReview = () => {
        setOpenReview(!openReview);
    };

    return (
        <>
            <div className="flex flex-1 bg-B1 p-4 rounded-lg overflow-hidden">
                <div className="w-full sm:w-8/12 sm:pr-4 overflow-auto hide_scrollbar h-full">
                    <MemeCoinGrid resetSwapAmount={resetSwapAmount} />
                </div>

                <div
                    className={`${
                        showCart ? "block" : "hidden sm:flex"
                    } sm:static fixed top-[60px] left-0 p-5 overflow-hidden bg-B1 w-screen h-[calc(100vh-60px)] sm:h-full sm:w-4/12 sm:pl-4 flex flex-col gap-2 sm:mr-2 z-[10] border-t sm:border-l sm:border-t-0 border-zinc-800`}
                >
                    <h2 className="text-xl font-bold mb-4 text-white">Rebalance Portfolio</h2>

                    <div className="flex-grow overflow-y-auto hide_scrollbar">
                        {/* Buy Tokens Section */}
                        <div className="border border-zinc-700 p-3 rounded-xl bg-opacity-50 mb-3">
                            <div className="flex items-center">
                                <FaArrowCircleUp className="text-green-500 mr-2" />
                                <h1 className="text-base text-zinc-200 font-bold">Buy Tokens</h1>
                            </div>

                            {/* Buy Token Input and Display */}
                            {buyTokens.length > 0 ? (
                                <div className="flex flex-col mb-2 text-zinc-300 mt-2">
                                    <label className="text-xs text-zinc-200 mb-1">Total amount</label>
                                    <div className="w-full relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            className="bg-zinc-800 rounded-xl px-4 py-2 w-full text-zinc-200 text-base outline-none"
                                            placeholder={`Total Amount in USDC`}
                                            value={amount}
                                            onChange={setAmountChange}
                                        />
                                        <div className="text-red-500 text-[10px] mt-1">{errorMessage}</div>
                                        <div className="absolute right-3 top-2 flex items-center gap-4">
                                            USDC
                                            <button
                                                onClick={setMaxAmount}
                                                className="text-cyan-500 hover:text-cyan-400 transition-all duration-300 font-semibold text-xs bg-zinc-900 px-2 py-1 rounded-lg"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>
                                    <span className="ml-auto text-xs text-cyan-500 mb-1 pr-1">
                                        Balance: {Number(usdcBalance?.formatted)} USDC
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {/* No Tokens Selected or Only Sell Tokens Selected */}
                                    {sellTokens.length === 0 && buyTokens.length === 0 ? (
                                        <div className="h-32 flex flex-col items-center justify-center text-zinc-300">
                                            <FaBitbucket />
                                            <p className="text-sm font-medium">No tokens selected</p>
                                            <p className="text-xs font-light mt-1">
                                                Select tokens to start rebalancing
                                            </p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}

                            {/* List of Selected Buy Tokens */}
                            {buyTokens.map((coin) => (
                                <SelectedBuyToken
                                    key={coin.id}
                                    coin={coin}
                                    swapData={swapData}
                                    percentages={percentages}
                                    handlePercentageChange={handlePercentageChange}
                                    swapAmounts={swapAmounts}
                                />
                            ))}
                        </div>

                        {/* Sell Tokens Section */}
                        <div className="border border-zinc-700 p-3 rounded-xl bg-opacity-50">
                            <div className="flex items-center">
                                <FaArrowCircleDown className="text-red-500 mr-2" />
                                <h1 className="text-base text-zinc-200 font-bold">Sell Tokens</h1>
                            </div>

                            {/* No Tokens Selected or Only Buy Tokens Selected */}
                            {sellTokens.length > 0 ? (
                                <></>
                            ) : (
                                <>
                                    {buyTokens.length === 0 && buyTokens.length === 0 ? (
                                        <div className="h-32 flex flex-col items-center justify-center text-zinc-300">
                                            <FaBitbucket />
                                            <p className="text-sm font-medium">No tokens selected</p>
                                            <p className="text-xs font-light mt-1">
                                                Select tokens to start rebalancing
                                            </p>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}

                            {/* List of Selected Sell Tokens */}
                            {sellTokens.map((coin) => (
                                <SelectedSellToken
                                    key={coin.id}
                                    coin={coin}
                                    swapData={swapData}
                                    swapAmounts={swapAmounts}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full p-4 bg-zinc-900 rounded-lg">
                        {/* Parent container with button, note, and icons */}
                        <div className="bg-zinc-800 rounded-lg p-3">
                            {/* Main Button and Icons in the Same Line */}
                            <div className="flex justify-between items-center">
                                {(buyTokens.length !== 0 || sellTokens.length !== 0) && (
                                    <button
                                        onClick={
                                            buttonState === "proceed"
                                                ? handleProceed
                                                : buttonState === "rebalance"
                                                ? toggleReview
                                                : undefined
                                        }
                                        className={`flex items-center justify-center gap-2 w-full px-5 py-3 bg-zinc-700 text-white rounded-lg transition-all duration-300 
                    ${buyTokens.length === 0 && sellTokens.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
                    ${
                        isLoading || buttonState === "quoting" || buttonState === "rebalancing"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    } text-lg font-bold text-center`} // Center the button text
                                        disabled={
                                            isLoading ||
                                            buttonState === "quoting" ||
                                            buttonState === "rebalancing" ||
                                            (buyTokens.length === 0 && sellTokens.length === 0)
                                        }
                                    >
                                        {(isLoading || buttonState === "quoting" || buttonState === "rebalancing") && (
                                            <Loader />
                                        )}
                                        {buttonState === "proceed" && (
                                            <>
                                                <FaShoppingCart /> {/* Shopping Cart Icon */}
                                                Proceed to Buy & Sell
                                            </>
                                        )}
                                        {buttonState === "quoting" && (
                                            <>
                                                <FaClock /> {/* Clock Icon */}
                                                Waiting for Quote...
                                            </>
                                        )}
                                        {buttonState === "rebalance" && (
                                            <>
                                                <FaExchangeAlt /> {/* Exchange Icon */}
                                                Trade Now
                                            </>
                                        )}
                                        {buttonState === "rebalancing" && (
                                            <>
                                                <FaSync /> {/* Sync Icon */}
                                                Rebalancing Memes...
                                            </>
                                        )}
                                    </button>
                                )}

                                {/* Trash and Refresh Icons */}
                                <div className="flex items-center gap-2 ml-4">
                                    {buyTokens.length > 0 && (
                                        <button
                                            onClick={resetState}
                                            className="p-2 hover:bg-zinc-700 border border-transparent hover:border hover:border-zinc-600 text-white rounded-lg transition-all duration-300"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Zero Gas Fee Label Below the Button, Inside the Box */}
                            <div className="mt-2 ml-1 flex items-center gap-1">
                                <FaFireAlt className="text-orange-600" /> {/* Fire icon */}
                                <span className="text-sm font-semibold text-zinc-200">
                                    Zero Gas Fee Sponsored by Us!
                                </span>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && <div className="text-red-500 mt-2 text-xs">{error}</div>}

                        {/* Review section */}
                        {openReview && (
                            <ReviewRebalance
                                toggleReview={toggleReview}
                                swapAmounts={swapAmounts}
                                buttonState={buttonState}
                                handleExecute={handleRebalance}
                                status={transactionStatus}
                                callsStatus={callsStatus}
                                resetTransactionStatus={resetTransactionStatus}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemecoinsRebalancer;
