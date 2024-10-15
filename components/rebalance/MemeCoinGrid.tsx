import React, { useState } from "react";
import { MemeCoinGridProps } from "./types";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import WishListTokens from "./WishListTokens";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex gap-3">
                <button
                    className={`px-4 py-2 min-w-20 rounded-lg border ${
                        activeTab === "buy"
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}
                    onClick={() => setActiveTab("buy")}
                >
                    Buy
                </button>
                <button
                    className={`px-4 py-2 min-w-20 rounded-lg border ${
                        activeTab === "sell"
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}
                    onClick={() => setActiveTab("sell")}
                >
                    Sell
                </button>
                <button
                    className={`px-4 py-2 min-w-20 rounded-lg border ${
                        activeTab === "bookmark"
                            ? "bg-zinc-800 text-white border-zinc-700"
                            : "bg-zinc-900 text-zinc-200 border-zinc-800"
                    }`}
                    onClick={() => setActiveTab("bookmark")}
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
