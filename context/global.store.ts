import { create } from "zustand";
import { ICoinDetails } from "../components/rebalance/types";

// Define the Zustand store interface
export interface IGlobalStore {
    allCoins: ICoinDetails[]; // Array for tokens marked as "buy"
    setAllCoins: (coins: ICoinDetails[]) => void; // Function to set allCoins
}

// Create the Zustand store
export const useGlobalStore = create<IGlobalStore>((set) => ({
    allCoins: [],
    setAllCoins: (coins) => set({ allCoins: coins }), // Update state with new coins
}));
