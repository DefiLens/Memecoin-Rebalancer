import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface CopyButtonProps {
  copy: string | undefined;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ copy, className }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard")
    setTimeout(() => {
      setCopied(false);
    }, 3000); // Hide tick icon after 3 seconds
  };

  return (
    <div
      onClick={() => copyToClipboard(copy ?? '')}
      className={`text-white rounded-md cursor-pointer ${className}`}
    >
      {copied ? (
        <FiCheck className="text-green-500" />
      ) : (
        <FiCopy className="" />
      )}
    </div>
  );
};

export default CopyButton;
