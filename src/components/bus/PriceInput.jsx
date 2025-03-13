import React from 'react';
import { formatGold } from '../../utils/BusLogic';

/**
 * PriceInput Component
 * Allows users to input or select a bus price
 * Includes quick selection buttons for common price points
 */
export default function PriceInput({ 
  price, 
  handlePriceChange, 
  setPrice, 
  goldIconUrl 
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg transition-all duration-300 hover:shadow-soft">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <div className="w-4 h-4 mr-1 flex-shrink-0">
          <img src={goldIconUrl} alt="Gold" className="w-full h-full object-contain" />
        </div>
        Total Bus Price (Gold)
      </label>
      <div className="relative">
        <input
          type="text"
          value={price}
          onChange={handlePriceChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 hover:shadow-inner-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400">gold</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[10000, 15000, 20000, 25000, 30000].map((amount) => (
          <button 
            key={amount}
            className={`text-sm py-1 rounded transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              price === amount 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-medium shadow-inner' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            onClick={() => setPrice(amount)}
          >
            {amount >= 1000 ? `${amount/1000}k` : formatGold(amount)}
          </button>
        ))}
      </div>
    </div>
  );
} 