import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { ICoinDetails, ISwapAmount } from "./types";
import { useRebalanceStore } from "../../context/rebalance.store";
import FormatDecimalValue from "../base/FormatDecimalValue";
import { ISwapData } from "./MemecoinsRebalancer";
import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { Address } from "viem";
import { decreasePowerByDecimals, incresePowerByDecimals } from "../../utils/helper";

import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 20 });

interface SelectedSellTokenProps {
    coin: ICoinDetails;
    swapData: ISwapData[] | null;
    swapAmounts: { [key: string]: { amountIn: string; amountOut: string } };
}

const SelectedSellToken: React.FC<SelectedSellTokenProps> = ({ coin, swapData, swapAmounts }) => {
    const { updateSellTokenAmount, removeSellToken } = useRebalanceStore();
    const [amount, setAmount] = useState<string>("");
    const { address } = useAccount();
    const tokenAddress = coin.contract_address as Address; // Explicitly cast to Address type
    const { data: balance, isLoading } = useBalance({
        address,
        token: tokenAddress,
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    //set amount value
    const setAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let amountChange = e.target.value;

        // Allow the input to be cleared (empty string)
        if (amountChange === "") {
            setErrorMessage(null);
            setAmount("");
            updateSellTokenAmount(coin.id, "");
            return;
        }

        // Remove any non-numeric characters except a single decimal point
        amountChange = amountChange.replace(/[^0-9.]/g, "");

        // Ensure only one decimal point is allowed
        const decimalParts = amountChange.split(".");
        if (decimalParts.length > 2) {
            amountChange = decimalParts[0] + "." + decimalParts.slice(1).join("");
        }

        // Restrict the integer part length to 10 characters
        if (decimalParts[0].length > 10) {
            decimalParts[0] = decimalParts[0].slice(0, 10);
        }

        // Combine the integer and decimal parts back
        amountChange = decimalParts.join(".");

        // Convert the amount to the correct decimal power
        const increasedPower = incresePowerByDecimals(amountChange, Number(coin.decimal_place));
        const increasedUsdcPower = incresePowerByDecimals(String(balance?.formatted), Number(coin.decimal_place));

        const condition = increasedUsdcPower;
        if (bg(increasedPower).gte(bg(condition))) {
            setErrorMessage("Insufficient balance.");
            return;
        }

        // Clear any previous errors and update the state
        setErrorMessage(null);
        setAmount(amountChange);
        updateSellTokenAmount(coin.id, amountChange);
    };

    const setMaxAmount = () => {
        if (!balance) return;
        setAmount(balance.formatted);
        updateSellTokenAmount(coin.id, balance.formatted);
    };

    return (
        <div key={coin.id} className="mb-3 bg-zinc-800 py-2 px-3 rounded-lg">
            <div className="flex items-center justify-between mb-2 capitalize">
                <div className="flex items-center">
                    <img src={coin.image} alt={coin.symbol} className="w-8 h-8 rounded-full mr-2" />
                    <span className="font-bold">{coin.symbol}</span>
                </div>
                <button
                    onClick={() => removeSellToken(coin)}
                    className="p-1 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
                >
                    <RxCross1 />
                </button>
            </div>
            <div className="flex items-center mb-1 text-zinc-300">
                <div className="w-full relative">
                    <input
                        type="text" // Change type to text
                        inputMode="numeric" // Set input mode to numeric
                        className="bg-zinc-900 rounded-xl px-4 py-2 w-full text-zinc-200 text-base outline-none"
                        placeholder={`Amount in ${coin.symbol}`}
                        value={amount}
                        onChange={setAmountChange}
                    />
                    <div className="text-red-500 text-[10px] mt-1">{errorMessage}</div>
                    <div className="absolute right-3 top-2 flex items-center gap-4">
                        {coin.symbol.toLocaleUpperCase()}
                        <button
                            onClick={setMaxAmount}
                            className="text-cyan-500 hover:text-cyan-400 transition-all duration-300 font-semibold text-xs bg-zinc-800 px-2 py-1 rounded-lg"
                        >
                            Max
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex capitalize items-center justify-between gap-4 px-1">
                {swapAmounts[coin.id] && (
                    <span className="text-xs text-cyan-500">
                        {Number(swapAmounts[coin.id].amountIn).toPrecision(4)} {coin.symbol.toLocaleUpperCase()} ={" "}
                        {Number(swapAmounts[coin.id].amountOut)} USDC
                    </span>
                )}
                <span className="text-xs text-cyan-500 ml-auto">
                    Balance: {Number(balance?.formatted)} {coin.symbol.toLocaleUpperCase()}
                </span>
            </div>
        </div>
    );
};
export default SelectedSellToken;
