import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import Loader from "../shared/Loader";
import { ButtonState, ICoinDetails, ISwapAmount } from "./types";

interface ReviewRebalanceProps {
    selectedCoins: ICoinDetails[];
    swapAmounts: { [key: string]: ISwapAmount };
    buttonState: ButtonState,
    toggleReview: () => void;
    handleExecute: () => void;
}

const ReviewRebalance: React.FC<ReviewRebalanceProps> = ({
    selectedCoins,
    toggleReview,
    swapAmounts,
    buttonState,
    handleExecute,
}) => {
    return (
        <div className="fixed w-full h-full flex justify-center items-center top-0 right-0 left-0 bottom-0 z-50 text-zinc-100 backdrop-brightness-50 p-5 md:p-10">
            <div className="min-h-60 w-[35rem] flex flex-col justify-center items-center gap-2 bg-B1 border-2 border-zinc-800 rounded-2xl relative p-3">
                {/* Heading */}
                <div className="w-full flex items-center justify-between text-center text-xl md:text-2xl font-bold">
                    <span>Review Batch</span>
                    <button
                        onClick={toggleReview}
                        className="p-1 text-sm hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300"
                    >
                        <RxCross1 />
                    </button>
                </div>
                <div className="h-full w-full flex flex-col justify-center items-center gap-2">
                    <div className="w-full border-3 max-h-96 overflow-auto flex flex-col justify-start items-center gap-5 my-5">
                        <div className="w-full max-h-full overflow-auto flex flex-col gap-5">
                            {selectedCoins?.length > 0 &&
                                selectedCoins.map((coin) => (
                                    <div
                                        key={coin.id}
                                        className="w-full flex flex-col justify-between items-start gap-2 p-3 rounded-xl border border-zinc-700 bg-zinc-800"
                                    >
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="w-full flex justify-between items-center gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src="/usdc.png"
                                                            alt="USDC"
                                                            className="h-10 w-10 bg-font-200 rounded-full mt-1.5"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-start items-start">
                                                        <span className="text-lg font-semibold text-B200">Usdc</span>
                                                        {swapAmounts[coin.id] && (
                                                            <p className="inline-flex items-center gap-2 text-sm text-zinc-400 text-font-600">
                                                                {Number(swapAmounts[coin.id].amountIn)} USDC
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <FaArrowRightLong size="20px" />
                                                <div className="flex justify-start items-center gap-3">
                                                    <div className="relative">
                                                        <img
                                                            src={coin.image}
                                                            alt="network logo"
                                                            className="h-10 w-10 bg-font-200 rounded-full mt-1.5"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col justify-start items-start">
                                                        <span className="text-lg font-semibold text-B200 capitalize">
                                                            {coin.name}
                                                        </span>
                                                        {swapAmounts[coin.id] && (
                                                            <p className="inline-flex items-center gap-2 text-sm text-zinc-400 text-font-600">
                                                                {Number(swapAmounts[coin.id].amountOut).toPrecision(10)}{" "}
                                                                {coin.symbol}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <table className="w-full border-t border-zinc-700">
                        <tbody className="grid grid-cols-1 divide-y divide-zinc-700 dark:divide-moon-700">
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                    Max. slippage
                                </th>
                                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                    <span>0.5%</span>
                                </td>
                            </tr>

                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 font-medium text-sm leading-5">Gas Fee</th>
                                <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                    <span>Sponsored by Defilens</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={handleExecute}
                    className={`${
                        false ? "cursor-not-allowed opacity-40" : ""
                    } bg-zinc-800 border border-zinc-700 hover:bg-opacity-80 w-full flex justify-center items-center gap-2 py-3 px-5 rounded-lg text-base md:text-lg font-semibold font-mono transition duration-300
          ${(buttonState === "quoting" || buttonState === "rebalancing") && "cursor-not-allowed opacity-50"}
          `}
                    disabled={buttonState === "quoting" || buttonState === "rebalancing" || selectedCoins.length === 0}
                >
                    {(buttonState === "quoting" || buttonState === "rebalancing") && <Loader />}
                    Execute
                </button>
            </div>
        </div>
    );
};

export default ReviewRebalance;
