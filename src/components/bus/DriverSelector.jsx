import React from 'react';
import { getBuyerPartyIndicator } from '../../utils/BusLogic';

/**
 * DriverSelector Component
 * Allows users to select the number of drivers for a bus run
 * Displays the bus configuration type (e.g., 2c6, 3c5)
 */
export default function DriverSelector({ 
  drivers, 
  setDrivers, 
  maxDrivers, 
  buyers, 
  handleDriverChange 
}) {
  // Aunque no usamos getBuyerPartyIndicator directamente en este componente,
  // lo importamos para mantener la consistencia con la lógica de negocio
  
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg transition-all duration-300 hover:shadow-soft">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Number of Drivers
      </label>
      <div className="flex items-center space-x-4">
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button 
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => drivers > 1 && setDrivers(drivers - 1)}
            disabled={drivers <= 1}
            aria-label="Decrease drivers"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <input
            type="text"
            value={drivers}
            onChange={handleDriverChange}
            className="w-16 text-center py-2 border-x border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 text-gray-900 dark:text-gray-100 font-medium"
            aria-label="Number of drivers"
          />
          <button 
            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => drivers < maxDrivers && setDrivers(drivers + 1)}
            disabled={drivers >= maxDrivers}
            aria-label="Increase drivers"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 rounded-lg text-sm text-blue-800 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/30 shadow-sm">
          {drivers}c{buyers} ({drivers} drivers, {buyers} buyers)
        </div>
      </div>
    </div>
  );
} 