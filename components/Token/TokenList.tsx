import React from "react";
import { ICoinDetails } from "../rebalance/types";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SortKey, SortOrder } from "../rebalance/Sell";
import OneListToken from "./OneListToken";

interface TokenListProps {
    tokens: ICoinDetails[];
    sortConfig: { key: SortKey; order: SortOrder } | null;
    requestSort: (key: SortKey) => void;
    action: string;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, sortConfig, requestSort, action }) => {
    const getSortIcon = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="ml-1 inline text-zinc-400" />;
        }
        return sortConfig.order === "asc" ? (
            <FaSortUp className="ml-1 inline text-primary" />
        ) : (
            <FaSortDown className="ml-1 inline text-primary" />
        );
    };

    return (
        <div className="h-full overflow-y-auto hide-sidebar">
            <div className="relative">
                <table className="absolute left-0 top-0 w-full border-separate border-spacing-0">
                    <thead className="bg-zinc-800">
                        <tr className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-zinc-200" data-index="0">
                            <th
                                scope="col"
                                className="caption-2 whitespace-nowrap text-left text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 sm:sticky left-0 z-10 border-t-0 !rounded-none"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    <div className="flex items-center gap-1">Token</div>
                                </div>
                            </th>
                            <th
                                scope="col"
                                onClick={() => requestSort("current_price")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    Price {getSortIcon("current_price")}
                                </div>
                            </th>
                            {tokens[0]?.balance && (
                                <th
                                    scope="col"
                                    onClick={() => requestSort("balance")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                        Balance {getSortIcon("balance")}
                                    </div>
                                </th>
                            )}
                            {tokens[0]?.value && (
                                <th
                                    scope="col"
                                    onClick={() => requestSort("value")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                        Value {getSortIcon("value")}
                                    </div>
                                </th>
                            )}

                            <th
                                scope="col"
                                onClick={() => requestSort("market_cap")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    Market Cap {getSortIcon("market_cap")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                onClick={() => requestSort("total_volume")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    Volume (24h) {getSortIcon("total_volume")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                onClick={() => requestSort("price_change_percentage_1h_in_currency")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    1h Change {getSortIcon("price_change_percentage_1h_in_currency")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                onClick={() => requestSort("price_change_percentage_24h")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    24h Change {getSortIcon("price_change_percentage_24h")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                onClick={() => requestSort("price_change_percentage_7d_in_currency")}
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    7D Change {getSortIcon("price_change_percentage_7d_in_currency")}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                            >
                                <div className="cursor-pointer select-none text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out">
                                    Action
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map((token, index: number) => (
                            <OneListToken key={index} token={token} index={index + 1} action={action}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TokenList;
