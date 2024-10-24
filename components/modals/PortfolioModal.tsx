import React from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { ICoinDetails } from "../rebalance/types";
import { DataState } from "../../context/dataProvider";
import Loader from "../shared/Loader";

// Portfolio Component
interface PortfolioModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose }) => {
    const { isTokenBalanceLoading, tokenBalances, totalPortfolioValue } = DataState();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2">
            <div className="bg-zinc-800 p-3 sm:p-6 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Token Portfolio</h3>
                        <p className="text-xl text-gray-300 mt-2">Total Value: ${totalPortfolioValue.toFixed(2)}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-grow">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-zinc-900">
                            <tr className="text-gray-400 border-b border-gray-700">
                                <th className="py-4 px-6 text-lg font-bold">Token</th>
                                <th className="py-4 px-6 text-lg font-bold">Balance</th>
                                <th className="py-4 px-6 text-lg font-bold">Price</th>
                                <th className="py-4 px-6 text-lg font-bold">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tokenBalances.map(
                                (token: ICoinDetails) =>
                                    parseFloat(token.balance || "0") > 0 && (
                                        <tr key={token.id} className="border-b border-gray-700 text-white">
                                            <td className="py-4 px-6 flex items-center">
                                                <div className="h-6 w-6">
                                                    <Image
                                                        src={token.image}
                                                        alt={token.name}
                                                        width={50}
                                                        height={50}
                                                        className="mr-6 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-lg ml-4 font-semibold whitespace-nowrap">
                                                    {token.name}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                {parseFloat(token.balance || "0").toFixed(6)}
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                ${token.current_price.toFixed(6)}
                                            </td>
                                            <td className="py-4 px-6 text-lg font-semibold">
                                                ${parseFloat(token.value || "0").toFixed(2)}
                                            </td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </table>
                    {isTokenBalanceLoading && (
                        <div className="flex items-center justify-center text-center py-4 text-white mt-5">
                            <Loader />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PortfolioModal;
