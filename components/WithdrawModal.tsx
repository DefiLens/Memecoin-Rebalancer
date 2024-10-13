import React, { useState, useEffect } from 'react';
import { useBalance } from 'wagmi';
import { useCallsStatus, useSendCalls } from "wagmi/experimental";
import { FiX } from 'react-icons/fi';
import { RiExternalLinkLine } from 'react-icons/ri';
import { USDC_ADDRESS } from '../utils/constant';
import { memeCoinData } from '../utils/constant';
import { decreasePowerByDecimals, incresePowerByDecimals } from '../utils/helper';
import { buildERC20TransferTransaction } from '../utils/erc20Utils';
import { parseUnits } from 'viem';
import { toast } from 'react-toastify';
import Loader from './shared/Loader'; // Assuming you have this component

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    userAddress: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, userAddress }) => {
    const [selectedToken, setSelectedToken] = useState(USDC_ADDRESS);
    const [amount, setAmount] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [tokenDecimal, setTokenDecimal] = useState(6); // Default for USDC
    const [isLoading, setIsLoading] = useState(false);

    const { sendCallsAsync, data: callsId, status: sendCallsStatus, error: sendCallsError } = useSendCalls();
    const { data: callsStatus } = useCallsStatus({
        id: callsId as string,
        query: {
            enabled: !!callsId,
            refetchInterval: (data) => (data.state.data?.status === "CONFIRMED" ? false : 1000),
        },
    });

    const { data: balance } = useBalance({
        address: userAddress as `0x${string}`,
        token: selectedToken as `0x${string}`,
    });

    useEffect(() => {
        if (selectedToken === USDC_ADDRESS) {
            setTokenDecimal(6);
        } else {
            const token = memeCoinData.find(coin => coin.detail_platforms.base.contract_address.toLowerCase() === selectedToken.toLowerCase());
            if (token) {
                setTokenDecimal(token.detail_platforms.base.decimal_place);
            }
        }
    }, [selectedToken]);

    useEffect(() => {
        if (callsStatus?.status === "CONFIRMED" && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const txHash = callsStatus.receipts[0].transactionHash;
            toast.success(
                <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-light tracking-wide flex items-center gap-2 hover:text-cyan-400 transition-all duration-200"
                >
                    Success: {txHash.substring(0, 5)}...
                    {txHash.substring(txHash.length - 5, txHash.length)}
                    <RiExternalLinkLine className="text-base" />
                </a>
            );
            setIsLoading(false);
            onClose();
        }
    }, [callsStatus]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value || (Number(value) >= 0 && Number(value) <= Number(decreasePowerByDecimals(balance?.value || '0', tokenDecimal)))) {
            setAmount(value);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || !recipientAddress) return;

        setIsLoading(true);
        try {
            const amountInWei = parseUnits(amount, tokenDecimal);
            const transaction = await buildERC20TransferTransaction(
                selectedToken,
                recipientAddress,
                amountInWei
            );

            const id = await sendCallsAsync({
                calls: [transaction],
                capabilities: {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_BASE_PAYMASTER,
                    },
                },
            });
            
            console.log('Transaction sent:', id);
            toast.info('Withdrawal initiated. Waiting for confirmation...');
        } catch (error) {
            console.error('Error sending transaction:', error);
            toast.error('Failed to initiate withdrawal');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-zinc-800 p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Withdraw Tokens</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full p-2 mb-4 bg-zinc-700 rounded"
                    disabled={isLoading}
                >
                    <option value={USDC_ADDRESS}>USDC</option>
                    {memeCoinData.map((coin) => (
                        <option key={coin.id} value={coin.detail_platforms.base.contract_address}>
                            {coin.id}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Amount"
                    className="w-full p-2 mb-2 bg-zinc-700 rounded"
                    disabled={isLoading}
                />
                <p className="text-sm text-gray-400 mb-4">
                    Balance: {decreasePowerByDecimals(balance?.value || '0', tokenDecimal)} {balance?.symbol}
                </p>
                <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Recipient Address"
                    className="w-full p-2 mb-4 bg-zinc-700 rounded"
                    disabled={isLoading}
                />
                <button
                    onClick={handleWithdraw}
                    disabled={!amount || !recipientAddress || isLoading}
                    className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-500 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <Loader />
                            <span className="ml-2">Processing...</span>
                        </>
                    ) : (
                        'Withdraw'
                    )}
                </button>
            </div>
        </div>
    );
};

export default WithdrawModal;