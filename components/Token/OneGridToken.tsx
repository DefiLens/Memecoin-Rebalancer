import React, { useState } from "react";
import { DataState } from "../../context/dataProvider";
import { toast } from "react-toastify";
import { TiArrowSortedDown, TiArrowSortedUp, TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { currencyFormat, formatPercentage } from "../../utils/helper";
import SingleCoin from "./SingleCoin";
import FormatDecimalValue from "../shared/FormatDecimalValue";
import { ICoinDetails } from "../rebalance/types";
import { useAccount } from "wagmi";
import { BASE_URL } from "../../utils/keys";
import { FaCheckCircle } from "react-icons/fa";
import { useRebalanceStore } from "../../context/rebalance.store";
import { FiChevronDown } from "react-icons/fi";

interface OneGridTokenProps {
    token: ICoinDetails;
    action: string;
}
const OneGridToken: React.FC<OneGridTokenProps> = ({ token, action }) => {
    const { buyTokens, toggleBuyToken, sellTokens, toggleSellToken } = useRebalanceStore();
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null); // State to manage modal visibility
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
    const toggleExpand = (coinId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedCoin(expandedCoin === coinId ? null : coinId);
    };

    const handleCoinClick = (id: string) => {
        setIsModalOpen(id); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(null); // Close the modal
    };

    const { address } = useAccount();
    const { wishlist, setWishlist } = DataState();
    const isWishlisted = wishlist?.includes(token.id);
    const isSelected =
        action === "buy" ? buyTokens.some((c) => c.id === token.id) : sellTokens.some((c) => c.id === token.id);

    const toggleWishlist = async (coinId: string) => {
        if (!address) {
            toast.error("Please connect your wallet to use the wishlist feature");
            return;
        }

        try {
            const isWishlisted = wishlist.includes(coinId);
            const method = isWishlisted ? "DELETE" : "POST";
            const endpoint = isWishlisted ? `/wishlist/removeWishlist/${coinId}` : "/wishlist/add";
            setWishlist((prevWishlist: string[]) =>
                isWishlisted ? prevWishlist.filter((id) => id !== coinId) : [...prevWishlist, coinId]
            );
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userAddress: address, coinId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update wishlist");
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error("Failed to update wishlist");
        }
    };

    const handleToggleWishlist = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!toggleWishlist) return;
        toggleWishlist(token.id);
    };

    const handleSelectToken = (event: React.MouseEvent) => {
        event.stopPropagation();
        action === "buy" ? toggleBuyToken(token) : toggleSellToken(token);
    };

    return (
        <div
            onClick={handleSelectToken}
            className={`relative cursor-pointer border-zinc-700 border p-2 rounded-lg flex flex-col h-fit ${
                isSelected && "bg-cyan-900 bg-opacity-15"
            }`}
        >
            <div className="absolute top-2 right-2 flex gap-2 text-center py-1 items-center">
                <button onClick={(e) => handleToggleWishlist(e)} className="w-5 h-5 text-xl">
                    {isWishlisted ? (
                        <TiStarFullOutline className="text-lg text-yellow-400" />
                    ) : (
                        <TiStarOutline className="text-lg hover:text-yellow-400" />
                    )}
                </button>

                {isSelected ? (
                    <FaCheckCircle className="text-green-500 w-4 h-full" />
                ) : (
                    <div className="border hover:border-cyan-500 rounded-full w-4 h-4"></div>
                )}
            </div>

            <div className="flex justify-between">
                <div className="flex flex-col mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={token.image} className="w-10 h-10 rounded-full" alt={token.name} />
                        <span className="text-xl font-semibold text-zinc-100 capitalize">{token.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="relative text-2xl font-medium inline-flex items-center gap-1">
                            ${FormatDecimalValue(token.current_price)}
                        </span>
                        <span
                            className={`text-lg flex items-center gap-1 ${
                                token.price_change_percentage_24h && token.price_change_percentage_24h >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {token.price_change_percentage_24h && token.price_change_percentage_24h >= 0 ? (
                                <TiArrowSortedUp />
                            ) : (
                                <TiArrowSortedDown />
                            )}
                            {formatPercentage(token.price_change_percentage_24h)}%
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={(event) => toggleExpand(token.id, event)}
                className={`transform duration-300 flex items-center justify-center mt-1 p-1 text-lg text-zinc-400 ${
                    expandedCoin === token.id ? "rotate-180" : "rotate-0"
                }`}
            >
                <FiChevronDown />
            </button>
            {token?.balance && token?.value && (
                <table className="w-full border-t border-zinc-700 mt-4">
                    <tbody className="grid grid-cols-1 divide-y divide-zinc-700 dark:divide-moon-700">
                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                Balance
                            </th>
                            <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                <span>{token.balance && FormatDecimalValue(Number(token.balance))}</span>
                            </td>
                        </tr>
                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                Value
                            </th>
                            <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                <span>${token.value && FormatDecimalValue(Number(token.value))}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {expandedCoin === token.id && (
                <table className="w-full border-t border-zinc-700">
                    <tbody className="grid grid-cols-1 divide-y divide-zinc-700 dark:divide-moon-700">
                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                                Market Cap
                            </th>
                            <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                                <span>{currencyFormat(token.market_cap)}</span>
                            </td>
                        </tr>

                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 font-medium text-sm leading-5">
                                Market Cap 24H Change
                            </th>
                            <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                <span
                                    className={`text-lg flex items-center gap-1 ${
                                        token.market_cap_change_percentage_24h &&
                                        token.market_cap_change_percentage_24h >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {token.market_cap_change_percentage_24h &&
                                    token.market_cap_change_percentage_24h >= 0 ? (
                                        <TiArrowSortedUp />
                                    ) : (
                                        <TiArrowSortedDown />
                                    )}
                                    {formatPercentage(token.market_cap_change_percentage_24h)}%
                                </span>
                            </td>
                        </tr>

                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 font-medium text-sm leading-5">24H Trading Vol</th>
                            <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                <span>{currencyFormat(token.total_volume)}</span>
                            </td>
                        </tr>

                        <tr className="flex justify-center py-3">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleCoinClick(token.id);
                                }}
                                className={`px-2 py-1 rounded text-xs bg-zinc-700 hover:bg-zinc-700 hover:bg-opacity-70`}
                            >
                                View more
                            </button>
                        </tr>
                    </tbody>
                </table>
            )}
            <SingleCoin isOpen={isModalOpen === token.id} onClose={handleCloseModal} coin={token} />
        </div>
    );
};

export default OneGridToken;
