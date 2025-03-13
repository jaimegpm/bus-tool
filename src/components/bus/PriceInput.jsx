import React from 'react';
import { formatGold } from '../../utils/BusLogic';

/**
 * Input component for setting bus price
 * Includes price input field and quick selection buttons
 */
export default function PriceInput({ 
  price, 
  handlePriceChange, 
  setPrice, 
  goldIconUrl 
}) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20 p-5 rounded-lg transition-all duration-300 hover:shadow-md border border-gray-200 dark:border-gray-700/50">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <div className="w-5 h-5 mr-2 flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-0.5 flex items-center justify-center">
          <img src={goldIconUrl} alt="Gold" className="w-full h-full object-contain" />
        </div>
        <span className="font-semibold">Total Bus Price (Gold)</span>
      </label>
      
      {/* Main price input field */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <img src={goldIconUrl} alt="Gold" className="w-4 h-4 object-contain opacity-70" />
        </div>
        <input
          type="text"
          value={price}
          onChange={handlePriceChange}
          className="w-full pl-10 pr-16 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-300 hover:shadow-inner-lg text-lg font-medium"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 font-medium">gold</span>
        </div>
      </div>
      
      {/* Quick selection buttons */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Quick Selection
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[10000, 15000, 20000, 25000, 30000].map((amount) => (
            <button 
              key={amount}
              className={`relative overflow-hidden py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                price === amount 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setPrice(amount)}
            >
              <div className={`absolute inset-0 ${price === amount ? 'bg-blue-400/20' : 'bg-blue-500/0'} group-hover:bg-blue-500/10`}></div>
              <div className="relative z-10 flex items-center justify-center">
                <span className="text-sm font-medium">{amount >= 1000 ? `${amount/1000}k` : formatGold(amount)}</span>
                {price === amount && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 