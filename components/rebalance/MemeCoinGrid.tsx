import React, { useState } from "react";
import { MemeCoinGridProps } from "./types";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import WishListTokens from "./WishListTokens";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center border-zinc-500">
                <button
                    onClick={() => setActiveTab("buy")}
                    className={`font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                        activeTab === "buy" ? "border-zinc-500" : "border-transparent"
                    }`}
                >
                    Bots
                </button>
                <button
                    onClick={() => setActiveTab("sell")}
                    className={`font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                        activeTab === "sell" ? "border-zinc-500" : "border-transparent"
                    }`}
                >
                    History
                </button>
                <button
                    onClick={() => setActiveTab("bookmark")}
                    className={`font-semibold text-base hover:bg-zinc-800 px-6 py-1 transition-all duration-300 border-b-4 ${
                        activeTab === "bookmark" ? "border-zinc-500" : "border-transparent"
                    }`}
                >
                    Bookmark
                </button>
            </div>
            {activeTab === "buy" && <BuyTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "sell" && <SellTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "bookmark" && <WishListTokens />}
        </div>
    );
};

export default MemeCoinGrid;
