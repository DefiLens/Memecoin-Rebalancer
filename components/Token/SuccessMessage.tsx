import React from 'react';
import Link from 'next/link';

interface SuccessMessageProps {
  signature: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ signature }) => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center text-green-600 mb-2">
        <span>Transaction successful</span>
      </div>
      <Link 
        href={`https://solscan.io/tx/${signature}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        View on Solscan
      </Link>
    </div>
  );
};

export default SuccessMessage;