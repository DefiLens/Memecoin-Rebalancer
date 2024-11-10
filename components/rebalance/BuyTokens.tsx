import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { useRebalanceStore } from "../../context/rebalance.store";
import { useGlobalStore } from "../../context/global.store";
import { ICoinDetails } from "./types";
import { HiOutlineViewGrid } from "react-icons/hi";
import { FaList } from "react-icons/fa6";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface TokenListProps {
    tokens: ICoinDetails[];
    // solAmount: string;
    // sortConfig: { key: SortKey; order: SortOrder } | null;
    // requestSort: (key: SortKey) => void;
    // selectedCategory: string;
    // isPumpToken: any;
    // currentPage: number;
}

type SortKey =
    | "current_price"
    | "price_change_percentage_1h_in_currency"
    | "price_change_percentage_24h"
    | "price_change_percentage_7d_in_currency"
    | "market_cap"
    | "total_volume";
type SortOrder = "asc" | "desc";

import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { DataState } from "../../context/dataProvider";
import CopyButton from "../shared/CopyButton";

interface OneTokenProps {
    token: ICoinDetails;
    isPumpToken: any;
    index: number;
    solAmount: any;
    selectedCategory: string;
}
const OneToken: React.FC<OneTokenProps> = ({ token, isPumpToken, index, solAmount, selectedCategory }: any) => {
    const [isModalOpen, setIsModalOpen] = useState<string | null>(null); // State to manage modal visibility

    const handleCoinClick = (id: string) => {
        setIsModalOpen(id); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(null); // Close the modal
    };

    return (
        <tr
            onClick={(event) => {
                event.stopPropagation(); // Prevent token selection when clicking "View more"
                handleCoinClick(token.id);
            }}
            className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-gray-300"
            data-index="1"
        >
            <td className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r sm:sticky left-0 z-10">
                <div className="flex items-center">
                    <div className="flex items-center pl-2">
                        <div className="flex items-center text-xs font-medium text-gray-400">
                            <div className="w-5 h-12">
                                <div className="flex items-center w-full h-full">
                                    {/* <button
                    onClick={handleToggleWishlist}
                    className="flex items-center"
                  >
                    {isWishlisted ? (
                      <TiStarFullOutline className="text-sm" />
                    ) : (
                      <TiStarOutline className="text-sm" />
                    )}
                  </button> */}
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
                            <span className="text-xs font-medium">{token.symbol.toUpperCase()}/SOL</span>
                            {selectedCategory !== "pump-fun" && (
                                <img className="h-3.5 w-3.5" src="/solana.webp" alt="Solana" />
                            )}
                            {/* {isPumpToken(token) && <img className="h-3.5 w-3.5" src="/pumpfun.webp" alt="Pump Fun" />} */}
                            {token?.detail_platforms?.solana?.contract_address && (
                                <CopyButton copy={token.detail_platforms.solana.contract_address} className="text-xs" />
                            )}
                        </div>
                        <div className="text-xs font-light text-gray-400">{token.name}</div>
                    </div>
                </div>
            </td>
            <td className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right">
                <span>${token.current_price?.toFixed(6) ?? "N/A"}</span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right tabular-nums"
                colSpan={1}
            >
                <span className="text-sm">
                    <span> ${token.market_cap?.toLocaleString() ?? "N/A"}</span>
                </span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right tabular-nums"
                colSpan={1}
            >
                <span> ${token.total_volume?.toLocaleString() ?? "N/A"}</span>
            </td>
            <td
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
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
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
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
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
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
                className="bg-black px-4 py-1 font-normal transition-all ease-in-out group-hover:bg-gray-900 md:py-2 whitespace-nowrap border-b border-gray-800/80 first:border-l last:border-r text-right min-w-24 tabular-nums"
                colSpan={1}
            >
                {/* <span>
          <BuyButton tokenMint={token.detail_platforms.solana.contract_address} solAmount={solAmount} />
        </span> */}
            </td>
            {/* <SingleCoin
        isOpen={isModalOpen === token.id}
        onClose={handleCloseModal}
        coin={token}
      /> */}
        </tr>
    );
};

const TokenList: React.FC<TokenListProps> = ({
    tokens,
    // solAmount,
    // sortConfig,
    // requestSort,
    // selectedCategory,
    // isPumpToken,
    // currentPage,
}) => {
    const getSortIcon = (key: SortKey) => {
        return <FaSort className="ml-1 inline text-gray-400" />;
        // if (!sortConfig || sortConfig.key !== key) {
        // }
        // return sortConfig.order === "asc" ? (
        //     <FaSortUp className="ml-1 inline text-primary" />
        // ) : (
        //     <FaSortDown className="ml-1 inline text-primary" />
        // );
    };

    return (
        <main className="flex-grow overflow-hidden relative">
            <div className={`h-full overflow-auto  `}>
                <div className="overflow-x-auto hide_scrollbar relative min-h-full w-[calc(100vw)]  ">
                    <table className="absolute left-0 top-0 w-full border-separate border-spacing-0">
                        <thead className="bg-black">
                            <tr
                                className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-gray-200"
                                data-index="0"
                            >
                                <th
                                    scope="col"
                                    className="caption-2 whitespace-nowrap text-left text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 sm:sticky left-0 z-10 border-t-0 !rounded-none"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        <div className="flex items-center gap-1">Token</div>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("current_price")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        Price {getSortIcon("current_price")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("market_cap")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        Market Cap {getSortIcon("market_cap")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("total_volume")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        Volume (24h) {getSortIcon("total_volume")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("price_change_percentage_1h_in_currency")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        1h Change {getSortIcon("price_change_percentage_1h_in_currency")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("price_change_percentage_24h")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        24h Change {getSortIcon("price_change_percentage_24h")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    // onClick={() => requestSort("price_change_percentage_7d_in_currency")}
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">
                                        7D Change {getSortIcon("price_change_percentage_7d_in_currency")}
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-gray-800/80 bg-gray-950 transition-all ease-in-out hover:bg-gray-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
                                >
                                    <div className="cursor-pointer select-none hover:underline">Action</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokens.map((token, index: number) => (
                                <OneToken
                                    key={index}
                                    token={token}
                                    isPumpToken={false}
                                    index={index + 1}
                                    solAmount={"0.0001"}
                                    selectedCategory={"a"}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

const BuyTokens: React.FC<{ resetSwapAmount: () => void }> = ({ resetSwapAmount }) => {
    const { buyTokens, toggleBuyToken } = useRebalanceStore();
    const { allCoins } = useGlobalStore(); // Get the setter from Zustand
    const [displayedCoins, setDisplayedCoins] = useState<ICoinDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let filteredCoins = allCoins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setDisplayedCoins(filteredCoins);
    }, [allCoins, searchTerm]);

    const [showInList, setShowInList] = useState(false);
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Search memecoins..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    className="w-full border border-zinc-700 p-2 bg-zinc-800 text-white rounded-lg outline-none z-10"
                />
                <div className="flex items-center rounded-lg border-zinc-800 border">
                    <button
                        onClick={() => setShowInList(true)}
                        className={`${showInList && "bg-zinc-700"} rounded-lg p-3`}
                    >
                        <FaList />
                    </button>
                    <button
                        onClick={() => setShowInList(false)}
                        className={`${!showInList && "bg-zinc-700"} rounded-lg p-3`}
                    >
                        <HiOutlineViewGrid />
                    </button>
                </div>
            </div>
            {!showInList ? (
                <div
                    className={`grid ${
                        showInList ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-5"
                    } gap-2 hide_scrollbar`}
                >
                    {displayedCoins.map((coin) => (
                        <Coin
                            key={coin.id}
                            coin={coin}
                            selectedCoins={buyTokens}
                            handleCoinSelect={toggleBuyToken}
                            type={"buy"}
                            showInList={showInList}
                        />
                    ))}
                </div>
            ) : (
                <TokenList tokens={displayedCoins} />
            )}
        </div>
    );
};

export default BuyTokens;
