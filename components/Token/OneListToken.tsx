import React, { useState } from "react";
import { ICoinDetails } from "../rebalance/types";
import { useAccount } from "wagmi";
import { DataState } from "../../context/dataProvider";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/keys";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import CopyButton from "../shared/CopyButton";
import FormatDecimalValue from "../shared/FormatDecimalValue";
import SingleCoin from "./SingleCoin";
import { useRebalanceStore } from "../../context/rebalance.store";
import { FaCheckCircle } from "react-icons/fa";

interface OneTokenProps {
    token: ICoinDetails;
    index: number;
    action: string;
}
const OneToken: React.FC<OneTokenProps> = ({ token, index, action }: any) => {
    const { buyTokens, toggleBuyToken, sellTokens, toggleSellToken } = useRebalanceStore();
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null); // State to manage modal visibility

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
        <tr
            onClick={(event) => {
                event.stopPropagation(); // Prevent token selection when clicking "View more"
                handleCoinClick(token.id);
            }}
            className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-zinc-300 border border-red-700"
            data-index={index}
        >
            <td className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r sm:sticky left-0 z-10">
                <div className="flex items-center">
                    <div className="flex items-center pl-2">
                        <div className="flex items-center text-xs font-medium text-zinc-400">
                            <div className="w-5 h-12">
                                <div className="flex items-center w-full h-full">
                                    <button onClick={handleToggleWishlist} className="flex items-center">
                                        {isWishlisted ? (
                                            <TiStarFullOutline className="text-sm text-yellow-400" />
                                        ) : (
                                            <TiStarOutline className="text-sm hover:text-yellow-400" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <span className="w-[32px] mt-[2px] px-2 pl-0.5 !pr-0">{index}</span>
                        </div>
                    </div>

                    <div className="relative w-8 h-8 mr-2">
                        <img
                            src={token?.image || "/placeholder-coin.png"}
                            alt={token.name}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "/placeholder-coin.png";
                            }}
                        />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-zinc-100 flex items-center gap-1">
                            <span className="text-xs font-medium">{token.symbol.toUpperCase()}</span>
                            <img className="h-3.5 w-3.5" src="/base.svg" alt="Pump Fun" />
                        </div>
                        <div className="text-xs font-light text-zinc-400">{token.name}</div>
                    </div>
                </div>
            </td>
            <td className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right">
                <span>${FormatDecimalValue(Number(token.current_price)) ?? "N/A"}</span>
            </td>
            {token.balance && (
                <td
                    className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right tabular-nums"
                    colSpan={1}
                >
                    <span className="text-sm">
                        <span> {FormatDecimalValue(Number(token.balance))}</span>
                    </span>
                </td>
            )}
            {token.value && (
                <td
                    className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right tabular-nums"
                    colSpan={1}
                >
                    <span className="text-sm">
                        <span> ${FormatDecimalValue(Number(token.value))}</span>
                    </span>
                </td>
            )}
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right tabular-nums"
                colSpan={1}
            >
                <span className="text-sm">
                    <span> ${token.market_cap?.toLocaleString() ?? "N/A"}</span>
                </span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right tabular-nums"
                colSpan={1}
            >
                <span> ${token.total_volume?.toLocaleString() ?? "N/A"}</span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
                colSpan={1}
            >
                <span className="text-buy">
                    <span
                        className={`px-2 py-1 inline-flex text-sm leading-5 rounded-full ${
                            (token.price_change_percentage_1h_in_currency ?? 0) > 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {token.price_change_percentage_1h_in_currency != null
                            ? `${token.price_change_percentage_1h_in_currency.toFixed(2)}%`
                            : "N/A"}
                    </span>
                </span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
                colSpan={1}
            >
                <span className="text-buy">
                    <span
                        className={`px-2 py-1 inline-flex text-sm leading-5 rounded-full ${
                            (token.price_change_percentage_24h ?? 0) > 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {token.price_change_percentage_24h != null
                            ? `${token.price_change_percentage_24h.toFixed(2)}%`
                            : "N/A"}
                    </span>
                </span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
                colSpan={1}
            >
                <span className="text-buy">
                    <span
                        className={`px-2 py-1 inline-flex text-sm leading-5 rounded-full ${
                            (token.price_change_percentage_7d_in_currency ?? 0) > 0 ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {token.price_change_percentage_7d_in_currency != null
                            ? `${token.price_change_percentage_7d_in_currency.toFixed(2)}%`
                            : "N/A"}
                    </span>
                </span>
            </td>
            <td
                onClick={(e) => handleSelectToken(e)}
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
                colSpan={1}
            >
                <button className="text-white text-xs font-bold py-2 w-fit rounded-xl flex items-center justify-center ease-in-out bg-zinc-900 hover:bg-zinc-800 group-hover:bg-zinc-800 group-hover:hover:bg-zinc-700 mx-auto px-4 transition-all duration-200 gap-2">
                    {isSelected ? "Added" : "Cart"}
                    {isSelected ? (
                        <FaCheckCircle className="text-green-500 w-3 h-full" />
                    ) : (
                        <div className="border hover:border-cyan-500 rounded-full w-3 h-3"></div>
                    )}
                </button>
            </td>
            <SingleCoin isOpen={isModalOpen === token.id} onClose={handleCloseModal} coin={token} />
        </tr>
    );
};
export default OneToken;