export interface ICoinDetails {
    id: any;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    last_updated: string;
    price_change_percentage_24h_in_currency: number;
    price_change_percentage_7d_in_currency: number;
    // Additional fields to be merged from frontend
    decimal_place?: number;
    contract_address?: string;
    amount?: string;
    balance?: string;
}

export interface ISwapAmount {
    amountIn: string;
    amountOut: string;
}

export type ButtonState = "proceed" | "quoting" | "rebalance" | "rebalancing";
export type TransactionStatus = "pending" | "error" | "idle" | "success";
//Props
export interface PriceChartProps {
    id: string;
}

export interface CoinProps {
    coin: ICoinDetails;
    selectedCoins: ICoinDetails[];
    handleCoinSelect: (coin: ICoinDetails) => void;
    type: string;
    wishlist?: any //{ coinId: string }[]; // Adjust this type if your wishlist structure is different
    toggleWishlist?: (coinId: string) => Promise<void>;
}

export interface MemeCoinGridProps {
    // selectedCoins: ICoinDetails[];
    // handleCoinSelect: (coin: ICoinDetails) => Promise<void>;
    resetSwapAmount: () => void;
}

export interface ApprovalAddress {
    [service: string]: `0x${string}`;
}