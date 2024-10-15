import { create } from "zustand";
import { ICoinDetails } from "../components/rebalance/types";

// Define the Zustand store interface
export interface IRebalanceStore {
    buyTokens: ICoinDetails[]; // Array for tokens marked as "buy"
    sellTokens: ICoinDetails[]; // Array for tokens marked as "sell"
    toggleBuyToken: (token: ICoinDetails) => void; // Function to toggle buy token selection
    toggleSellToken: (token: ICoinDetails) => void; // Function to toggle sell token selection
    removeBuyToken: (token: ICoinDetails) => void; // Function to remove buy token
    removeSellToken: (token: ICoinDetails) => void; // Function to remove sell token

    updateSellTokenAmount: (tokenId: string, amount: string) => void;
    addSellTokenBalance: (tokenId: string, balance: string) => void;
    clearSelectedTokens: () => void;
}

// Create the Zustand store
export const useRebalanceStore = create<IRebalanceStore>((set) => ({
    buyTokens: [],
    sellTokens: [],

    // Function to toggle buy token selection
    toggleBuyToken: (token) =>
        set((state) => {
            const isTokenInBuy = state.buyTokens.some((t) => t.id === token.id);

            if (isTokenInBuy) {
                // If the token is already in the buy list, remove it
                return {
                    buyTokens: state.buyTokens.filter((t) => t.id !== token.id),
                };
            } else {
                // If the token is not in the buy list, add it
                return {
                    buyTokens: [...state.buyTokens, token],
                    sellTokens: state.sellTokens.filter((t) => t.id !== token.id), // Remove from sellTokens if present
                };
            }
        }),

    // Function to toggle sell token selection
    toggleSellToken: (token) =>
        set((state) => {
            const isTokenInSell = state.sellTokens.some((t) => t.id === token.id);

            if (isTokenInSell) {
                // If the token is already in the sell list, remove it
                return {
                    sellTokens: state.sellTokens.filter((t) => t.id !== token.id),
                };
            } else {
                // If the token is not in the sell list, add it
                return {
                    sellTokens: [...state.sellTokens, token],
                    buyTokens: state.buyTokens.filter((t) => t.id !== token.id), // Remove from buyTokens if present
                };
            }
        }),

    // Function to remove a token from the buyTokens array
    removeBuyToken: (token) =>
        set((state) => ({
            buyTokens: state.buyTokens.filter((t) => t.id !== token.id),
        })),

    // Function to remove a token from the sellTokens array
    removeSellToken: (token) =>
        set((state) => ({
            sellTokens: state.sellTokens.filter((t) => t.id !== token.id),
        })),

    updateSellTokenAmount: (tokenId, amount) =>
        set((state) => ({
            sellTokens: state.sellTokens.map((token) =>
                token.id === tokenId ? { ...token, amount } : token
            ),
        })),

    addSellTokenBalance: (tokenId: string, balance: string) =>
        set((state) => {
            // Find the token in the sellTokens array
            const updatedSellTokens = state.sellTokens.map((token) => {
                if (token.id === tokenId) {
                    // Update the balance for the matching token
                    return { ...token, balance: balance };
                }
                return token;
            });

            return {
                sellTokens: updatedSellTokens,
            };
        }),
    clearSelectedTokens: () => set({ buyTokens: [], sellTokens: [] }),
}));
