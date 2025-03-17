import React from 'react';
import { getBuyerPartyIndicator } from '../../utils/BusLogic';

/**
 * Handles driver selection and displays bus configuration
 */
export default function DriverSelector({ 
  drivers, 
  setDrivers, 
  maxDrivers, 
  buyers, 
  handleDriverChange 
}) {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20 p-3 sm:p-5 rounded-lg transition-all duration-300 hover:shadow-md border border-gray-200 dark:border-gray-700/50">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <span className="font-semibold">Number of Drivers</span>
      </label>
      
      {/* Driver count controls */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button 
            className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/20 dark:hover:to-blue-700/30 text-blue-600 dark:text-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-50 disabled:hover:to-blue-100 dark:disabled:hover:from-blue-900/10 dark:disabled:hover:to-blue-800/20"
            onClick={() => drivers > 1 && setDrivers(drivers - 1)}
            disabled={drivers <= 1}
            aria-label="Decrease drivers"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          
          <input
            type="text"
            value={drivers}
            onChange={handleDriverChange}
            className="w-12 sm:w-16 text-center py-2 sm:py-2.5 border-x border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base"
            aria-label="Number of drivers"
          />
          
          <button 
            className="p-2 sm:p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/20 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/20 dark:hover:to-blue-700/30 text-blue-600 dark:text-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-50 disabled:hover:to-blue-100 dark:disabled:hover:from-blue-900/10 dark:disabled:hover:to-blue-800/20"
            onClick={() => drivers < maxDrivers && setDrivers(drivers + 1)}
            disabled={drivers >= maxDrivers}
            aria-label="Increase drivers"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Configuration display */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center">
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-800/40 dark:to-indigo-700/40 text-blue-800 dark:text-blue-200 font-bold text-base sm:text-lg flex items-center justify-center border-r border-gray-200 dark:border-gray-700">
              {drivers}c{buyers}
            </div>
            
            <div className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5">
              <div className="flex items-center mr-2 sm:mr-3">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-blue-500 mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {drivers} <span className="text-gray-500 dark:text-gray-400 text-xs hidden sm:inline">driver{drivers !== 1 ? 's' : ''}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-indigo-500 mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {buyers} <span className="text-gray-500 dark:text-gray-400 text-xs hidden sm:inline">buyer{buyers !== 1 ? 's' : ''}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 