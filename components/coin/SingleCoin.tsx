import React from "react";
import { BASE_URL } from "../../utils/keys";
import PriceChart from "../base/PriceChart";
import { RxCross1 } from "react-icons/rx";
import { currencyFormat, formatPercentage, numberFormat } from "../../utils/helper";
import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";
import FormatDecimalValue from "../base/FormatDecimalValue";
import { ICoinDetails } from "../rebalance/types";

interface SingleCoinProps {
    isOpen: boolean;
    onClose: () => void;
    coin: ICoinDetails;
}
const SingleCoin: React.FC<SingleCoinProps> = ({ isOpen, onClose, coin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex gap-4 flex-col lg:flex-row bg-zinc-900 p-5 rounded shadow-lg w-[80%] relative">
                <button
                    onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering token selection on expand
                        onClose();
                    }}
                    className="absolute top-0 right-4 mt-4 p-1 bg-zinc-800 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
                >
                    <RxCross1 />
                </button>
                <div className="min-w-80 flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-4">
                        <img src={coin.image} className="w-10 h-10 rounded-full" />
                        <span className="text-xl font-semibold text-zinc-100">{coin.name}</span>
                        <span className="text-sm text-zinc-300">{coin.symbol.toLocaleUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="relative text-3xl font-medium inline-flex items-center gap-1">
                            ${FormatDecimalValue(coin.current_price)}
                        </span>
                        <span
                            className={`text-xl flex items-center gap-1 ${
                                coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0 ? (
                                <TiArrowSortedUp />
                            ) : (
                                <TiArrowSortedDown />
                            )}
                            {formatPercentage(coin.price_change_percentage_24h)}%
                        </span>
                    </div>
                    <table className="w-full">
                        <tbody className="grid grid-cols-1 divide-y divide-zinc-700 dark:divide-moon-700">
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                    Market Cap
                                </th>
                                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                    <span>{currencyFormat(coin.market_cap)}</span>
                                </td>
                            </tr>

                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 font-medium text-sm leading-5">
                                    Fully Diluted Valuation
                                </th>
                                <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                    <span>{currencyFormat(coin.fully_diluted_valuation)}</span>
                                </td>
                            </tr>
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 font-medium text-sm leading-5">
                                    24H Trading Vol
                                </th>
                                <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                    <span>{currencyFormat(coin.total_volume)}</span>
                                </td>
                            </tr>
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                    Circulating Supply
                                </th>
                                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                    {numberFormat(coin.circulating_supply)}
                                </td>
                            </tr>
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 font-medium text-sm leading-5">Total Supply</th>
                                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                    {numberFormat(coin.total_supply)}
                                </td>
                            </tr>
                            <tr className="flex justify-between py-3">
                                <th className="text-left text-zinc-200 font-medium text-sm leading-5">Max Supply</th>
                                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                    {numberFormat(coin.max_supply)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex-1 overflow-hidden">
                    <PriceChart id={coin.id} />
                </div>
            </div>
        </div>
    );
};

export default SingleCoin;
