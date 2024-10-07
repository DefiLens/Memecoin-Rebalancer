import React from 'react';

interface SelectionInterfaceProps {
  selectedCount: number;
  onRebalance: () => void;
}

const SelectionInterface: React.FC<SelectionInterfaceProps> = ({ selectedCount, onRebalance }) => {
  return (
    <div className="bg-light-blue p-4 rounded-lg mb-6 flex justify-between items-center">
      <div>
        <span className="text-white font-bold">Selected: {selectedCount}</span>
      </div>
      {selectedCount > 0 && (
        <button
          onClick={onRebalance}
          className="bg-accent-green hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Rebalance
        </button>
      )}
    </div>
  );
};

export default SelectionInterface;