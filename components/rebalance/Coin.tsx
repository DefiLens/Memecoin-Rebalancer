import React, { useCallback, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import FormatDecimalValue from "../base/FormatDecimalValue";
import { currencyFormat, formatPercentage } from "../../utils/helper";
import SingleCoin from "../coin/SingleCoin";
import { CoinProps } from "./types";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/keys";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { DataState } from "../../context/dataProvider";

const Coin: React.FC<CoinProps> = ({ coin, selectedCoins, handleCoinSelect, type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
    const { wishlist, setWishlist } = DataState();
    const toggleExpand = (coinId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent triggering token selection on expand
        setExpandedCoin(expandedCoin === coinId ? null : coinId);
    };

    const handleCoinClick = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleSelectToken = (event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent token selection when clicking on specific buttons
        handleCoinSelect(coin); // Trigger token selection
    };

    const isSelected = selectedCoins.some((c) => c.id === coin.id);

    const { address } = useAccount();

    const isWishlisted = wishlist?.includes(coin.id);

    const toggleWishlist = async (coinId: string) => {
        if (!address) {
            toast.error("Please connect your wallet to use the wishlist feature");
            return;
        }

        try {
            const isWishlisted = wishlist.includes(coinId);
            const method = isWishlisted ? "DELETE" : "POST";
            const endpoint = isWishlisted ? `/wishlist/removeWishlist/${coinId}` : "/wishlist/add";

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

            setWishlist((prevWishlist: string[]) =>
                isWishlisted ? prevWishlist.filter((id) => id !== coinId) : [...prevWishlist, coinId]
            );
        } catch (error) {
            console.error("Error updating wishlist:", error);
            toast.error("Failed to update wishlist");
        }
    };

    const handleToggleWishlist = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!toggleWishlist) return;
        toggleWishlist(coin.id);
    };

    return (
        <div
            onClick={handleSelectToken}
            className={`relative cursor-pointer border-zinc-700 border p-2 rounded-lg flex flex-col h-fit ${
                isSelected && "bg-cyan-900 bg-opacity-15"
            }`}
        >
            <div className="absolute top-2 right-2 flex gap-2 text-center py-1 items-center">
                <button onClick={handleToggleWishlist} className="w-5 h-5 text-xl">
                    {isWishlisted ? (
                        <IoBookmark className="text-cyan-500" />
                    ) : (
                        <IoBookmarkOutline className="hover:text-cyan-500" />
                    )}
                </button>

                {/* Show green tick if token is selected */}
                {isSelected ? (
                    <FaCheckCircle className="text-green-500 w-5 h-full" />
                ) : (
                    <div className="border hover:border-cyan-500 rounded-full w-5 h-5"></div>
                )}
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={coin.image} className="w-10 h-10 rounded-full" alt={coin.name} />
                        <span className="text-xl font-semibold text-zinc-100 capitalize">{coin.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="relative text-2xl font-medium inline-flex items-center gap-1">
                            ${coin.current_price && FormatDecimalValue(coin.current_price)}
                        </span>
                        <span
                            className={`text-lg flex items-center gap-1 ${
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
                    {type === "sell" && (
                        <span className="text-sm font-semibold text-zinc-100">
                            Your Balance: {coin.balance && FormatDecimalValue(Number(coin.balance))} {coin.symbol}
                        </span>
                    )}
                </div>
            </div>

            {/* Button to expand coin details */}
            <button
                onClick={(event) => toggleExpand(coin.id, event)}
                className={`transform duration-300 flex items-center justify-center mt-1 p-1 text-lg text-zinc-400 ${
                    expandedCoin === coin.id ? "rotate-180" : "rotate-0"
                }`}
            >
                <FiChevronDown />
            </button>

            {/* Expanded coin details */}
            {expandedCoin === coin.id && (
                <table className="w-full border-t border-zinc-700">
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
                                Market Cap 24H Change
                            </th>
                            <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                <span
                                    className={`text-lg flex items-center gap-1 ${
                                        coin.market_cap_change_percentage_24h &&
                                        coin.market_cap_change_percentage_24h >= 0
                                            ? "text-green-500"
                                            : "text-red-500"
                                    }`}
                                >
                                    {coin.market_cap_change_percentage_24h &&
                                    coin.market_cap_change_percentage_24h >= 0 ? (
                                        <TiArrowSortedUp />
                                    ) : (
                                        <TiArrowSortedDown />
                                    )}
                                    {formatPercentage(coin.market_cap_change_percentage_24h)}%
                                </span>
                            </td>
                        </tr>

                        <tr className="flex justify-between py-3">
                            <th className="text-left text-zinc-200 font-medium text-sm leading-5">24H Trading Vol</th>
                            <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                                <span>{currencyFormat(coin.total_volume)}</span>
                            </td>
                        </tr>

                        {/* Button to open modal without selecting the token */}
                        <tr className="flex justify-center py-3">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation(); // Prevent token selection when clicking "View more"
                                    handleCoinClick();
                                }}
                                className={`px-2 py-1 rounded text-xs bg-zinc-700 hover:bg-zinc-700 hover:bg-opacity-70`}
                            >
                                View more
                            </button>
                        </tr>
                    </tbody>
                </table>
            )}

            <SingleCoin isOpen={isModalOpen} onClose={handleCloseModal} coin={coin} />
        </div>
    );
};

export default Coin;
