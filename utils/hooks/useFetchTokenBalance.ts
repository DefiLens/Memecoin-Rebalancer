import { useEffect, useCallback } from "react";
import axios from "axios";
import { decreasePowerByDecimals } from "../helper";

export type TransactionStatus = "pending" | "completed" | "notStarted";

// Define the structure of the API response
interface TokenBalanceResponse {
    balance: string;
    decimals: number;
}

// Types for the hook parameters
interface FetchTokenBalanceParams {
    smartAccountAddress: string;
    tokenAddress: string;
    chainId: string | number;
    decreasePowerByDecimals: (balance: string, decimals: number) => string;
}

const useFetchTokenBalance = ({
    smartAccountAddress,
    tokenAddress,
    chainId,
}: FetchTokenBalanceParams) => {
    // Function to fetch the balance
    const fetchTokenBalance = useCallback(async () => {
        try {
            const response = await axios.get<TokenBalanceResponse>(
                `/token/getBalance?userAddress=${smartAccountAddress}&tokenAddress=${tokenAddress}&chainId=${chainId}`
            );

            const balance = decreasePowerByDecimals(response.data.balance, response.data.decimals);
            return balance;
        } catch (error) {
            console.error("Error fetching token balances:", error);
            throw new Error("Failed to fetch token balance");
        }
    }, [smartAccountAddress, tokenAddress, chainId]);

    useEffect(() => {
        // Call the API function only when the required arguments are present
        if (smartAccountAddress && tokenAddress && chainId) {
            fetchTokenBalance()
                .then((balance) => {
                    console.log("Fetched balance:", balance);
                    // You can handle the balance here
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [smartAccountAddress, tokenAddress, chainId, fetchTokenBalance]);

    return { fetchTokenBalance };
};

export default useFetchTokenBalance;
