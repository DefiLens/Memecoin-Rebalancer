import React from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import OneGridToken from "./OneGridToken";
import { ICoinDetails } from "../rebalance/types";
import { SortKey, SortOrder } from "../rebalance/Sell";

interface TokenGridProps {
    tokens: ICoinDetails[];
    sortConfig: { key: SortKey; order: SortOrder } | null;
    requestSort: (key: SortKey) => void;
    action: string;
}

const TokenGrid: React.FC<TokenGridProps> = ({ tokens, sortConfig, requestSort, action }) => {
    const getSortIcon = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <FaSort className="ml-1 inline text-gray-400" />;
        }
        return sortConfig.order === "asc" ? (
            <FaSortUp className="ml-1 inline text-primary" />
        ) : (
            <FaSortDown className="ml-1 inline text-primary" />
        );
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto hide_scrollbar">
                {/* Width container to ensure proper spacing */}
                <div className="flex justify-end space-x-4 min-w-max py-3">
                    <button
                        onClick={() => requestSort("current_price")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        Price {getSortIcon("current_price")}
                    </button>
                    {tokens[0]?.balance && (
                        <button
                            onClick={() => requestSort("balance")}
                            className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                        >
                            Balance {getSortIcon("balance")}
                        </button>
                    )}
                    {tokens[0]?.value && (
                        <button
                            onClick={() => requestSort("value")}
                            className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                        >
                            Value {getSortIcon("value")}
                        </button>
                    )}

                    <button
                        onClick={() => requestSort("price_change_percentage_1h_in_currency")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        1h Change {getSortIcon("price_change_percentage_1h_in_currency")}
                    </button>
                    <button
                        onClick={() => requestSort("price_change_percentage_24h")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        24h Change {getSortIcon("price_change_percentage_24h")}
                    </button>
                    <button
                        onClick={() => requestSort("price_change_percentage_7d_in_currency")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        7D Change {getSortIcon("price_change_percentage_7d_in_currency")}
                    </button>
                    <button
                        onClick={() => requestSort("market_cap")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        Market Cap {getSortIcon("market_cap")}
                    </button>
                    <button
                        onClick={() => requestSort("total_volume")}
                        className="text-xs text-gray-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                    >
                        Volume (24h) {getSortIcon("total_volume")}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tokens.map((token: any, index: number) => (
                    <OneGridToken key={token.id} token={token} action={action} />
                ))}
            </div>
        </div>
    );
};

export default TokenGrid;
