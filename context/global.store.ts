import { create } from "zustand";
import { ICoinDetails } from "../components/rebalance/types";

// Define the Zustand store interface
export interface IGlobalStore {
    allCoins: ICoinDetails[]; // Array for tokens marked as "buy"
    setAllCoins: (coins: ICoinDetails[]) => void; // Function to set allCoins
    allCoinLoading: boolean; // State to show/hide cart
    setAllCoinLoading: (show: boolean) => void; // Function to toggle cart visibility

    sellCoins: ICoinDetails[]; // Array for tokens marked as "buy"
    setSellCoins: (coins: ICoinDetails[]) => void; // Function to set allCoins

    activeFilter: string;
    setActiveFilter: (filter: string) => void;
    showCart: boolean; // State to show/hide cart
    setShowCart: (show: boolean) => void; // Function to toggle cart visibility
    
}

// Create the Zustand store
export const useGlobalStore = create<IGlobalStore>((set) => ({
    allCoins: [],
    setAllCoins: (coins) => set({ allCoins: coins }), // Update state with new coins
    allCoinLoading: false, // Initially, the cart is hidden
    setAllCoinLoading: (show) => set({ allCoinLoading: show }), // Function to toggle cart visibility

    sellCoins: [],
    setSellCoins: (coins) => set({ allCoins: coins }), // Update state with new coins

    activeFilter: "price_change_percentage_24h", // Default filter
    setActiveFilter: (filter) => set({ activeFilter: filter }),
    showCart: false, // Initially, the cart is hidden
    setShowCart: (show) => set({ showCart: show }), // Function to toggle cart visibility
}));
