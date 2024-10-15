import React, { useState } from "react";
import { MemeCoinGridProps } from "./types";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import WishListTokens from "./WishListTokens";
import { IoCartOutline, IoCashOutline, IoBookmarkOutline } from "react-icons/io5";
import { AiOutlineRise, AiOutlineLineChart, AiOutlineBarChart, AiOutlineStock } from "react-icons/ai"; // Importing icons
import { useGlobalStore } from "../../context/global.store";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");
    const { activeFilter, setActiveFilter } = useGlobalStore(); // Use Zustand setter for active filter
    const [showFilters, setShowFilters] = useState(false); // Control filter visibility


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
    return (
        <div className="w-full flex flex-col gap-4">
            {/* Tabs Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center border-zinc-500">
                    <button
                        onClick={() => setActiveTab("buy")}
                        className={`flex items-center gap-2 font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "buy" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoCartOutline className="text-xl" /> Buy Memes
                    </button>
                    <button
                        onClick={() => setActiveTab("sell")}
                        className={`flex items-center gap-2 font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "sell" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoCashOutline className="text-xl" /> Sell Memes
                    </button>
                    <button
                        onClick={() => setActiveTab("bookmark")}
                        className={`flex items-center gap-2 font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                            activeTab === "bookmark" ? "border-zinc-500" : "border-transparent"
                        }`}
                    >
                        <IoBookmarkOutline className="text-xl hover:text-cyan-500" /> Bookmarks
                    </button>
                </div>

                {/* Toggle Filters Button */}
                <div className="flex items-center">
                    <button
                        onClick={() => setShowFilters(!showFilters)} // Toggle filter visibility
                        className="bg-gray-700 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>
            </div>

            {/* Conditionally Render Filters Section */}
            {showFilters && (
                <div className="flex items-center gap-4 mt-4">
                    {filterOptions.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleFilterChange(filter.value)}
                            className={`flex items-center gap-2 font-semibold text-base px-4 py-2 transition-all duration-300 border rounded-md ${
                                activeFilter === filter.value ? "bg-cyan-500 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                        >
                            {filter.icon} {filter.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Display active filter (if filters are visible) */}
            {showFilters && (
                <div className="text-right text-gray-400 text-sm mt-2">
                    Active Filter: {filterOptions.find((filter) => filter.value === activeFilter)?.label}
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