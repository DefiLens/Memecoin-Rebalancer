import React, { useRef, useState } from "react";
import { MemeCoinGridProps } from "./types";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import WishListTokens from "./WishListTokens";
import { IoCartOutline, IoCashOutline, IoBookmarkOutline } from "react-icons/io5";
import { AiOutlineRise, AiOutlineLineChart, AiOutlineBarChart, AiOutlineStock } from "react-icons/ai"; // Importing icons
import { useGlobalStore } from "../../context/global.store";
import { MdOutlineFilterList } from "react-icons/md";
import { MdOutlineFilterListOff } from "react-icons/md";
import useClickOutside from "../../utils/hooks/useClickOutside";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");
    const { activeFilter, setActiveFilter } = useGlobalStore(); // Use Zustand setter for active filter
    const [showFilters, setShowFilters] = useState(true); // Control filter visibility

    // Filter options
    const filterOptions = [
        { label: "24H Price Change(%)", value: "price_change_percentage_24h", icon: <AiOutlineRise /> },
        { label: "24H Market Change(%)", value: "market_cap_change_percentage_24h", icon: <AiOutlineLineChart /> },
        { label: "Market Cap", value: "market_cap", icon: <AiOutlineBarChart /> },
        { label: "24H Trading Vol", value: "total_volume", icon: <AiOutlineStock /> },
    ];

    const handleFilterChange = (filterValue: string) => {
        setActiveFilter(filterValue); // Set the filter in the global store
    };

    const filterRef = useRef(null);
    useClickOutside([filterRef], () => {
        // setShowFilters(false);
    });

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Tabs Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center border-zinc-500">
                    <button
                        onClick={() => setActiveTab("buy")}
                        className={`flex items-center gap-2 font-semibold text-xs sm:text-base hover:bg-zinc-800 px-3 sm:px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "buy" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoCartOutline className="text-sm sm:text-xl" />
                        Buy
                    </button>
                    <button
                        onClick={() => setActiveTab("sell")}
                        className={`flex items-center gap-2 font-semibold text-xs sm:text-base hover:bg-zinc-800 px-3 sm:px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "sell" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoCashOutline className="text-sm sm:text-xl" />
                        Sell
                    </button>
                    <button
                        onClick={() => setActiveTab("bookmark")}
                        className={`flex items-center gap-2 font-semibold text-xs sm:text-base hover:bg-zinc-800 px-3 sm:px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "bookmark" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoBookmarkOutline className="text-sm sm:text-xl" />
                        Bookmarks
                    </button>
                </div>

                {/* Toggle Filters Button */}
                {/* <div className="hidden sm:flex items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg hover:bg-opacity-70"
                    >
                        {showFilters ? (
                            <span className="flex items-center gap-2">
                                <MdOutlineFilterListOff />
                                Hide Filters
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <MdOutlineFilterList />
                                Show Filters
                            </span>
                        )}
                    </button>
                </div> */}
                {/* <div className="inline sm:hidden relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
                        className="bg-zinc-800 border border-zinc-700 text-zinc-300 p-1.5 rounded-md hover:bg-opacity-70"
                    >
                        <MdOutlineFilterList />
                    </button>
                    {showFilters && (
                        <div
                            ref={filterRef}
                            className="absolute top-10 -right-0 bg-zinc-900 p-2 rounded-lg z-20 flex items-center gap-2 whitespace-nowrap flex-wrap border border-zinc-700"
                        >
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => handleFilterChange(filter.value)}
                                    className={`flex items-center gap-2 font-semibold px-3 py-2 text-xs transition-all duration-300 rounded-full ${
                                        activeFilter === filter.value
                                            ? "bg-cyan-600 text-zinc-100"
                                            : "bg-zinc-800 text-zinc-200"
                                    }`}
                                >
                                    <span className="text-lg">{filter.icon}</span> {filter.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div> */}
            </div>

            {/* Conditionally Render Filters Section */}
            {showFilters && (
                <div ref={filterRef} className="hidden sm:flex items-center gap-4 mt-4 whitespace-nowrap flex-wrap">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleFilterChange(filter.value)}
                            className={`flex items-center gap-2 font-semibold px-3 py-2 text-xs transition-all duration-300 rounded-full ${
                                activeFilter === filter.value
                                    ? "bg-cyan-600 text-zinc-100"
                                    : "bg-zinc-800 text-zinc-200"
                            }`}
                        >
                            <span className="text-lg">{filter.icon}</span> {filter.label}
                        </button>
                    ))}
                </div>
            )}
            {/* Content Based on Tab */}
            {activeTab === "buy" && <BuyTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "sell" && <SellTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "bookmark" && <WishListTokens />}
        </div>
    );
};

export default MemeCoinGrid;
