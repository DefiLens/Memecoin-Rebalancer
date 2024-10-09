import { WalletCallReceipt } from 'viem';
import { RiExternalLinkLine } from 'react-icons/ri';

export default function TransactionStatus({
  callStatus,
}: {
  callStatus:
    | {
        status: 'PENDING' | 'CONFIRMED';
        receipts?: WalletCallReceipt<bigint, 'success' | 'reverted'>[] | undefined;
      }
    | undefined;
}) {
  if (!callStatus) return null;

  if (callStatus.status === 'PENDING') return <div>Batch Status: {callStatus.status}</div>;

  if (callStatus.receipts) {
    let receipt = callStatus.receipts[0];
    let { transactionHash } = receipt;
    console.log(receipt);

    return (
      <a
        href={`https://basescan.org/tx/${transactionHash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-light tracking-wide flex items-center gap-2 hover:text-cyan-400 transition-all duration-200"
      >
        {transactionHash.substring(0, 15)}...
        {transactionHash.substring(transactionHash.length - 15, transactionHash.length)}
        <RiExternalLinkLine className="text-sm text-zinc-400" />
      </a>
    );
  }
}
