import React from "react";
import { FaSort } from "react-icons/fa";

const OneGridTokenSkeleton = () => {
  const getSortIcon = (key: string) => {
    return <FaSort className="ml-1 inline text-zinc-400" />;
  };
  const OneItem = () => {
    return (
      <div className="relative cursor-pointer border-zinc-700 border p-2 rounded-lg flex flex-col h-fit animate-pulse">
        <div className="absolute top-2 right-2 flex gap-2 text-center py-1 items-center">
          <div className="w-5 h-5 bg-zinc-700 rounded-full"></div>
        </div>

        <div className="flex justify-between">
          <div className="flex flex-col mb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
              <div className="w-16 h-6 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-6 bg-zinc-700 rounded"></div>
              <div className="w-16 h-6 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-zinc-700">
          <div className="grid grid-cols-1 divide-y divide-zinc-700">
            <div className="flex justify-between py-3">
              <div className="w-24 h-5 bg-zinc-700 rounded"></div>
              <div className="w-20 h-5 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex justify-between py-3">
              <div className="w-36 h-5 bg-zinc-700 rounded"></div>
              <div className="w-20 h-5 bg-zinc-700 rounded"></div>
            </div>
            <div className="flex justify-between py-3">
              <div className="w-36 h-5 bg-zinc-700 rounded"></div>
              <div className="w-20 h-5 bg-zinc-700 rounded"></div>
            </div>
            <div className="mt-3 flex justify-center">
              <div className="w-24 h-8 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-zinc-950 w-full">
      <div className="overflow-x-auto hide_scrollbar">
        <div className="flex justify-end space-x-4 min-w-max py-3">
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            Price {getSortIcon("current_price")}
          </button>
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            1h Change {getSortIcon("price_change_percentage_1h_in_currency")}
          </button>
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            24h Change {getSortIcon("price_change_percentage_24h")}
          </button>
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            7D Change {getSortIcon("price_change_percentage_7d_in_currency")}
          </button>
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            Market Cap {getSortIcon("market_cap")}
          </button>
          <button className="text-xs text-zinc-400 hover:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap">
            Volume (24h) {getSortIcon("total_volume")}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <OneItem />
        <OneItem />
        <OneItem />
        <OneItem />
        <OneItem />
        <OneItem />
        <OneItem />
        <OneItem />
      </div>
    </div>
  );
};

export default OneGridTokenSkeleton;
