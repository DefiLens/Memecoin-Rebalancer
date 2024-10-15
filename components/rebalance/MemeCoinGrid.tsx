import React, { useState } from "react";
import { MemeCoinGridProps } from "./types";
import BuyTokens from "./BuyTokens";
import SellTokens from "./SellTokens";
import WishListTokens from "./WishListTokens";
import { IoCartOutline, IoCashOutline, IoBookmarkOutline } from "react-icons/io5";

const MemeCoinGrid: React.FC<MemeCoinGridProps> = ({ resetSwapAmount }) => {
    const [activeTab, setActiveTab] = useState("buy");

    return (
        <div className="w-full flex flex-col gap-4">
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
            {activeTab === "buy" && <BuyTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "sell" && <SellTokens resetSwapAmount={resetSwapAmount} />}
            {activeTab === "bookmark" && <WishListTokens />}
        </div>
    );
};

export default MemeCoinGrid;
