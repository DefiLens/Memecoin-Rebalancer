import { WalletCallReceipt } from "viem";
import { SiTicktick } from "react-icons/si";
import { BsClockHistory } from "react-icons/bs";
export default function TransactionStatus({
    callStatus,
}: {
    callStatus:
    | {
        status: "PENDING" | "CONFIRMED";
        receipts?: WalletCallReceipt<bigint, "success" | "reverted">[] | undefined;
    }
    | undefined;
}) {
    if (!callStatus) return null;

    if (callStatus.status === "PENDING")
        return (
            <div className="flex flex-col justify-between p-4">
                <div className="flex flex-col gap-4 justify-center items-center">
                    <BsClockHistory className="text-cyan-500 text-7xl" />

                    <h1 className="text-xl font-semibold mb- 2">Transaction {callStatus.status.toLowerCase()}</h1>
                </div>
            </div>
        );

    if (callStatus.receipts) {
        let receipt = callStatus.receipts[0];
        let { transactionHash } = receipt;

        return (
            <div className="flex flex-col justify-between p-4">
                <div className="flex flex-col gap-4 justify-center items-center">
                    <SiTicktick className="text-cyan-500 text-7xl" />
                    <h1 className="text-xl font-semibold mb-2">Transaction {callStatus.status.toLowerCase()}</h1>
                    <a
                        href={`https://basescan.org/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-200 text-sm mb-2 bg-zinc-800 px-3 py-2 rounded-lg hover:bg-opacity-80 transition-all duration-200"
                    >
                        View on explorer
                    </a>
                </div>
                {/* <a
                    href={`https://basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-light tracking-wide flex items-center gap-2 hover:text-cyan-400 transition-all duration-200"
                >
                    {transactionHash.substring(0, 15)}...
                    {transactionHash.substring(transactionHash.length - 15, transactionHash.length)}
                    <RiExternalLinkLine className="text-sm text-zinc-400" />
                </a> */}
            </div>
        );
    }
}
