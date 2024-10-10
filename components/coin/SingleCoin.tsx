import React from 'react';
import { BASE_URL } from '../../utils/keys';
import PriceChart from '../base/PriceChart';
import { formatPercentage } from '../MemeCoinGrid';
import { RxCross1 } from 'react-icons/rx';
import { currencyFormat, numberFormat } from '../../utils/helper';
import { TiArrowSortedUp } from 'react-icons/ti';
import { TiArrowSortedDown } from 'react-icons/ti';
const SingleCoin = ({
  isOpen,
  onClose,
  coin,
}: {
  isOpen: boolean;
  onClose: () => void;
  coin: any;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex gap-4 flex-col lg:flex-row bg-zinc-900 p-5 rounded shadow-lg w-[80%] relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-4 mt-4 p-1 bg-zinc-800 hover:bg-zinc-800 border border-transparent hover:border hover:border-zinc-700 text-white rounded transition-all duration-300 z-[51]"
        >
          <RxCross1 />
        </button>
        <div className="min-w-80 flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-4">
            <img src={coin.image} className="w-10 h-10 rounded-full" />
            <span className="text-xl font-semibold text-zinc-100">{coin.name}</span>
            <span className="text-sm text-zinc-300">{coin.symbol.toLocaleUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="relative text-3xl font-medium inline-flex items-center gap-1">
              ${coin.current_price}
            </span>
            <span
              className={`text-xl flex items-center gap-1 ${
                coin.price_change_percentage_24h && coin.price_change_percentage_24h >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
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
          <table className="w-full">
            <tbody
              x-data="{ mcap_expanded: false, fdv_expanded: false }"
              data-view-component="true"
              className="grid grid-cols-1 divide-y divide-zinc-700 dark:divide-moon-700"
            >
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
                  Fully Diluted Valuation
                </th>
                <td className="pl-2 text-right text-zinc-300 font-semibold text-sm leading-5">
                  <span>{currencyFormat(coin.fully_diluted_valuation)}</span>
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
              <tr className="flex justify-between py-3">
                <th className="text-left text-zinc-200 dark:text-moon-200 font-medium text-sm leading-5">
                  Circulating Supply
                </th>
                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                  {numberFormat(coin.circulating_supply)}
                </td>
              </tr>
              <tr className="flex justify-between py-3">
                <th className="text-left text-zinc-200 font-medium text-sm leading-5">
                  Total Supply
                </th>
                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                  {numberFormat(coin.total_supply)}
                </td>
              </tr>
              <tr className="flex justify-between py-3">
                <th className="text-left text-zinc-200 font-medium text-sm leading-5">
                  Max Supply
                </th>
                <td className="pl-2 text-right text-zinc-300 dark:text-moon-50 font-semibold text-sm leading-5">
                  {numberFormat(coin.max_supply)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex-1 overflow-hidden">
          <PriceChart id={coin.id} />
        </div>
      </div>
    </div>
  );
};

export default SingleCoin;

const coinn = {
  id: 'based-brett',
  symbol: 'brett',
  name: 'Brett',
  image: 'https://coin-images.coingecko.com/coins/images/35529/large/1000050750.png?1709031995',
  current_price: 0.085559,
  market_cap: 846873399,
  market_cap_rank: 89,
  fully_diluted_valuation: 846873399,
  total_volume: 79797791,
  high_24h: 0.090002,
  low_24h: 0.085534,
  price_change_24h: -0.002637681620222307,
  price_change_percentage_24h: -2.99069,
  market_cap_change_24h: -29752298.337415457,
  market_cap_change_percentage_24h: -3.39396,
  circulating_supply: 9910164234.00308,
  total_supply: 9910164234.00308,
  max_supply: 9999998988,
  ath: 0.193328,
  ath_change_percentage: -55.70629,
  ath_date: '2024-06-09T12:55:51.835Z',
  atl: 0.00084753,
  atl_change_percentage: 10003.75257,
  atl_date: '2024-02-29T08:40:24.951Z',
  roi: null,
  last_updated: '2024-10-09T15:00:55.470Z',
  price_change_percentage_24h_in_currency: -2.9906879620137667,
  price_change_percentage_7d_in_currency: -1.1910852155549905,
};
