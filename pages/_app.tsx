// pages/_app.tsx

import "../styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../config/wagmi";
import { Buffer } from "buffer";
import { useState, useEffect } from "react";
import PinEntry from "../components/PinEntry";
import DataStore from "../context/dataStore";

if (typeof window !== "undefined") {
    window.Buffer = Buffer;
}

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    const [isPinVerified, setIsPinVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const pinVerified = localStorage.getItem("pinVerified");
        if (pinVerified === "true") {
            setIsPinVerified(true);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a more sophisticated loading screen
    }

    if (!isPinVerified) {
        return <PinEntry onPinVerified={() => setIsPinVerified(true)} />;
    }

    return (
        <WagmiConfig config={config}>
            <QueryClientProvider client={queryClient}>
                <DataStore>
                    <Component {...pageProps} />
                </DataStore>
            </QueryClientProvider>
        </WagmiConfig>
    );
}

export default MyApp;
