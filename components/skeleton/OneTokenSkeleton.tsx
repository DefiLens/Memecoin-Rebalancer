import React from "react";
import { FaSort } from "react-icons/fa";

const OneTokenSkeleton = () => {
  const getSortIcon = (key: string) => {
    return <FaSort className="ml-1 inline text-zinc-400" />;
  };
  const OneItem = () => {
    return (
      <tr className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-zinc-300 h-16">
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 first:border-l last:border-r sm:sticky left-0 z-10 w-[22.4rem]">
          <div className="flex items-center">
            <div className="flex items-center gap-1 px-2">
              <div className="w-3 h-3 bg-zinc-700 rounded-full animate-pulse"></div>
              <span className="w-4 h-3 bg-zinc-700 rounded animate-pulse"></span>
            </div>
            <div className="relative w-8 h-8 mr-2">
              <div className="w-8 h-8 bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
            <div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <span className="w-24 h-3 bg-zinc-700 rounded animate-pulse"></span>
                  <span className="w-3 h-3 bg-zinc-700 rounded animate-pulse"></span>
                  <span className="w-3 h-3 bg-zinc-700 rounded animate-pulse"></span>
                </div>
                <span className="w-12 h-3 bg-zinc-700 rounded animate-pulse"></span>
              </div>
              <div className="text-xs font-light text-zinc-400">
                <span className="w-20 h-2 bg-zinc-700 rounded animate-pulse"></span>
              </div>
            </div>
          </div>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-16 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-20 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-20 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-12 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-12 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <span className="w-12 h-3 bg-zinc-700 rounded animate-pulse block ml-auto"></span>
        </td>
        <td className="bg-zinc-950 px-4 py-1 font-normal group-hover:bg-zinc-900 md:py-2 whitespace-nowrap border-b border-zinc-800/80 text-right">
          <div className="w-16 h-6 bg-zinc-700 rounded animate-pulse ml-auto"></div>
        </td>
      </tr>
    );
  };
  return (
    <div className="overflow-x-auto hide_scrollbar relative min-h-full w-full">
      <table className="w-full border-separate border-spacing-0">
        <thead className="bg-zinc-950">
          <tr className="group overflow-y-auto text-sm h-row-xl xl:h-row-lg text-zinc-200" data-index="0">
            <th
              scope="col"
              className="caption-2 whitespace-nowrap text-left text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 sm:sticky left-0 z-10 border-t-0 !rounded-none"
            >
              <div className="cursor-pointer select-none hover:underline">
                <div className="flex items-center gap-1">Token</div>
              </div>
            </th>
            <th
              scope="col"
              className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right"
            >
              <div className="cursor-pointer select-none hover:underline">Price {getSortIcon("current_price")}</div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">Market Cap {getSortIcon("market_cap")}</div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">
                Volume (24h) {getSortIcon("total_volume")}
              </div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">
                1h Change {getSortIcon("price_change_percentage_1h_in_currency")}
              </div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">
                24h Change {getSortIcon("price_change_percentage_24h")}
              </div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">
                7D Change {getSortIcon("price_change_percentage_7d_in_currency")}
              </div>
            </th>
            <th className="caption-2 z-10 whitespace-nowrap text-[0.6rem] text-xs font-normal uppercase tracking-wider border-b border-zinc-800/80 bg-zinc-950 transition-all ease-in-out hover:bg-zinc-900 px-4 py-2 first:rounded-tl first:border-l last:rounded-tr last:border-r md:py-3 border-t-0 !rounded-none text-right">
              <div className="cursor-pointer select-none hover:underline">Action</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <OneItem />
          <OneItem />
          <OneItem />
          <OneItem />
          <OneItem />
        </tbody>
      </table>
    </div>
  );
};

export default OneTokenSkeleton;
