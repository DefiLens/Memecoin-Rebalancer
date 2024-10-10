export const currencyFormat = (num: number): string => {
    return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const numberFormat = (num: number): string => {
    return `${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPercentage = (percentage: number | null) =>
    percentage ? percentage.toFixed(2) : 'N/A';

export const formatMarketCap = (marketCap: number) => {
    if (marketCap > 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap > 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${(marketCap / 1e3).toFixed(2)}K`;
};