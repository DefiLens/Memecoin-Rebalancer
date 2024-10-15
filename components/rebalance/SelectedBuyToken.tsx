import React from "react";
import { ICoinDetails, ISwapAmount } from "./types";
import { useRebalanceStore } from "../../context/rebalance.store";
import { RxCross1 } from "react-icons/rx";
import FormatDecimalValue from "../base/FormatDecimalValue";
import { ISwapData } from "./MemecoinsRebalancer";

interface SelectedSellTokenProps {
    coin: ICoinDetails;
    swapData: ISwapData[] | null;
    percentages: { [key: string]: string };
    handlePercentageChange: (id: string, value: string) => void;
    swapAmounts: { [key: string]: { amountIn: string; amountOut: string } };
}

const SelectedBuyToken: React.FC<SelectedSellTokenProps> = ({
    coin,
    swapData,
    percentages,
    handlePercentageChange,
    swapAmounts,
}) => {
    const { removeBuyToken } = useRebalanceStore();

    return (
        <div className="mb-3 bg-zinc-800 py-2 px-3 rounded-lg ">
            <div className="flex items-center justify-between mb-2 capitalize">
                <div className="flex items-center">
                    <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full mr-2" />
                    <span className="font-bold">{coin.symbol}</span>
                </div>
                <button
                    onClick={() => removeBuyToken(coin)}
                    className="p-1 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
                >
                    <RxCross1 />
                </button>
            </div>
            <div className="flex items-center mb-2 text-zinc-300">
                <input
                    type="text"
                    inputMode="numeric"
                    value={percentages[coin.id] || ""}
                    onChange={(e) => handlePercentageChange(coin.id, e.target.value)}
                    className="w-20 border border-zinc-700 p-1 bg-zinc-800 text-white rounded-lg sticky top-0 outline-none mr-1"
                    min="0"
                    max="100"
                    step="0.01"
                />
                <span>% of portfolio</span>
            </div>
            {swapAmounts[coin.id] && (
                <div className="mt-2 flex capitalize items-center gap-4">
                    <span className="text-xs text-cyan-500">
                        {Number(swapAmounts[coin.id].amountIn)} USDC ={" "}
                        {FormatDecimalValue(Number(swapAmounts[coin.id].amountOut))}{" "}
                        <span className="capitalize">{coin.symbol.toLocaleUpperCase()}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default SelectedBuyToken;
