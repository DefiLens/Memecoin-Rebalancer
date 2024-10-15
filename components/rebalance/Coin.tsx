import React, { useCallback, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaCheckCircle } from "react-icons/fa";
import FormatDecimalValue from "../base/FormatDecimalValue";
import { currencyFormat, formatPercentage } from "../../utils/helper";
import SingleCoin from "../coin/SingleCoin";
import { CoinProps } from "./types";
import { useAccount, useBalance } from "wagmi";
import { Address } from "viem";
import { useRebalanceStore } from "../../context/rebalance.store";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/keys";

const Coin: React.FC<CoinProps> = ({ coin, selectedCoins, handleCoinSelect, type }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [expandedCoin, setExpandedCoin] = useState<string | null>(null);
    const { addSellTokenBalance } = useRebalanceStore();
    const [wishlist, setWishlist] = useState<string[]>([]);

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
    const tokenAddress = coin.contract_address as Address; // Explicitly cast to Address type

    const { data: balance, isLoading } = useBalance({
        address,
        token: tokenAddress, // Casted token address
    });

    useEffect(() => {
        if (balance) {
            addSellTokenBalance(coin.id, String(balance.formatted));
        }
    }, [balance]);

    const fetchWishlist = useCallback(async () => {
        if (!address) {
            console.log("No user address available");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/wishlist/${address}`);
            if (!response.ok) {
                throw new Error("Failed to fetch wishlist");
            }
            const wishlistData = await response.json();
            setWishlist(wishlistData.map((item: { coinId: string }) => item.coinId));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    }, [address]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);


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

            setWishlist((prevWishlist) =>
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

    if (isLoading) return null;
    if (type === "sell" && Number(balance?.formatted) === 0) return;
    return (
        <div
            onClick={handleSelectToken}
            className={`relative cursor-pointer border-zinc-700 border p-2 rounded-lg flex flex-col h-fit ${
                isSelected && "bg-cyan-900 bg-opacity-15"
            }`}
        >
            {/* Show green tick if token is selected */}
            {/* {isSelected ? (
                <FaCheckCircle className="absolute top-2 right-2 text-green-500 w-5 h-5" />
            ) : (
                <div className="absolute top-2 right-2 border border-zinc-700 rounded-full w-5 h-5"></div>
            )} */}
            <div className="absolute top-2 right-2 flex gap-2 text-center py-1">
                <button onClick={handleToggleWishlist} className="w-5 h-5">
                    {isWishlisted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" id="bookmark">
                            <path
                                fill="#FF0101"
                                d="M11.0699,0.0001 C13.7799,0.0001 15.9699,1.0701 15.9999,3.7901 L15.9999,3.7901 L15.9999,18.9701 C15.9999,19.1401 15.9599,19.3101 15.8799,19.4601 C15.7499,19.7001 15.5299,19.8801 15.2599,19.9601 C14.9999,20.0401 14.7099,20.0001 14.4699,19.8601 L14.4699,19.8601 L7.9899,16.6201 L1.4999,19.8601 C1.3509,19.9391 1.1799,19.9901 1.0099,19.9901 C0.4499,19.9901 -0.0001,19.5301 -0.0001,18.9701 L-0.0001,18.9701 L-0.0001,3.7901 C-0.0001,1.0701 2.1999,0.0001 4.8999,0.0001 L4.8999,0.0001 Z M11.7499,6.0401 L4.2199,6.0401 C3.7899,6.0401 3.4399,6.3901 3.4399,6.8301 C3.4399,7.2691 3.7899,7.6201 4.2199,7.6201 L4.2199,7.6201 L11.7499,7.6201 C12.1799,7.6201 12.5299,7.2691 12.5299,6.8301 C12.5299,6.3901 12.1799,6.0401 11.7499,6.0401 L11.7499,6.0401 Z"
                                transform="translate(4 2)"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            id="bookmark"
                        >
                            <path
                                fill="#FFFFFF"
                                d="M11.0699,0.0001 C13.7799,0.0001 15.9699,1.0701 15.9999,3.7901 L15.9999,3.7901 L15.9999,18.9701 C15.9999,19.1401 15.9599,19.3101 15.8799,19.4601 C15.7499,19.7001 15.5299,19.8801 15.2599,19.9601 C14.9999,20.0401 14.7099,20.0001 14.4699,19.8601 L14.4699,19.8601 L7.9899,16.6201 L1.4999,19.8601 C1.3509,19.9391 1.1799,19.9901 1.0099,19.9901 C0.4499,19.9901 -0.0001,19.5301 -0.0001,18.9701 L-0.0001,18.9701 L-0.0001,3.7901 C-0.0001,1.0701 2.1999,0.0001 4.8999,0.0001 L4.8999,0.0001 Z M11.7499,6.0401 L4.2199,6.0401 C3.7899,6.0401 3.4399,6.3901 3.4399,6.8301 C3.4399,7.2691 3.7899,7.6201 4.2199,7.6201 L4.2199,7.6201 L11.7499,7.6201 C12.1799,7.6201 12.5299,7.2691 12.5299,6.8301 C12.5299,6.3901 12.1799,6.0401 11.7499,6.0401 L11.7499,6.0401 Z"
                                transform="translate(4 2)"
                            ></path>
                        </svg>
                    )}
                </button>

                {/* Show green tick if token is selected */}
                {isSelected ? (
                    <FaCheckCircle className="mt-[2px] text-green-500 w-5 h-full" />
                ) : (
                    <div className="mt-[2px] border border-white hover:bg-zinc-700 rounded-full w-5 h-5"></div>
                )}
            </div>

            <div className="flex justify-between">
                <div className="flex flex-col mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={coin.image} className="w-10 h-10 rounded-full" alt={coin.name} />
                        <span className="text-xl font-semibold text-zinc-100">{coin.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="relative text-2xl font-medium inline-flex items-center gap-1">
                            ${FormatDecimalValue(coin.current_price)}
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
                            {isLoading ? (
                                <></>
                            ) : (
                                <>
                                    {FormatDecimalValue(Number(balance?.formatted))} {coin.symbol}
                                </>
                            )}
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
                                24 Hour Trading Vol
                            </th>
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
