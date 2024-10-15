"use client";
import React, { createContext, useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import { ICoinDetails } from "../components/rebalance/types";
import { BASE_URL } from "../utils/keys";
import { memeCoinData } from "../utils/constant";
import { toast } from "react-toastify";
import { useGlobalStore } from "./global.store";

BigNumber.config({ DECIMAL_PLACES: 10 });

const DataProvider = ({ children }: any) => {
    const { setAllCoins } = useGlobalStore(); // Get the setter from Zustand

    const fetchCoins = useCallback(async () => {
        try {
            const response = await fetch(`${BASE_URL}/swap/token`);
            const backendData: ICoinDetails[] = await response.json();

            const mergedData = backendData.map((coin) => {
                const frontendCoin = memeCoinData.find((fcoin) => fcoin.id === coin.id);
                if (frontendCoin && frontendCoin.detail_platforms.base) {
                    return {
                        ...coin,
                        decimal_place: frontendCoin.detail_platforms.base.decimal_place,
                        contract_address: frontendCoin.detail_platforms.base.contract_address,
                    };
                }
                return coin;
            });

            setAllCoins(mergedData); // Use the Zustand setter to update allCoins
        } catch (error) {
            console.error("Error fetching coin data:", error);
            toast.error("Failed to fetch memecoin list");
        }
    }, [setAllCoins]);

    useEffect(() => {
        fetchCoins();
        const intervalId = setInterval(fetchCoins, 60000); // Fetch every 60 seconds
        return () => clearInterval(intervalId);
    }, [fetchCoins]);

    return <>{children}</>;
};

export default DataProvider;
