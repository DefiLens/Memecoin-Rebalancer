import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const buttonStyles = {
    background: "transparent",
    border: "1px solid transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "#0052FF",
    padding: "8px 20px 8px 14px",
    borderRadius: 10,
    color: "white",
    cursor: "pointer",
};

export default function CoinbaseButton() {
    const { connect, connectors } = useConnect();
    const { isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    function connectToSmartWallet() {
        console.log("H:", connectors)
        const coinbaseWalletConnector = connectors.find(
            (connector) => connector.id === "coinbaseWalletSDK"
        );
        console.log(coinbaseWalletConnector)

        if (coinbaseWalletConnector) {
            connect({ connector: coinbaseWalletConnector });
        }
        console.log("H2")
    }

    if (isConnected)
        return (
            <button style={buttonStyles} onClick={() => disconnect()}>
                <span>Disconnect</span>
            </button>
        );

    return (
        <button style={buttonStyles} onClick={connectToSmartWallet}>
            <span>Connect Wallet</span>
        </button>
    );
}