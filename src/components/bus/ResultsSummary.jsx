import React from 'react';
import { formatGold, getDriverColor, getBuyerPartyIndicator } from '../../utils/BusLogic';

/**
 * ResultsSummary Component
 * Displays a summary of bus configuration results
 * Shows total buyers, price per buyer, total income, and gold per driver
 */
export default function ResultsSummary({ 
  isCalculating, 
  animateResult, 
  buyers, 
  price, 
  drivers, 
  goldIconUrl, 
  goldDistribution
}) {
  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-all duration-500 relative overflow-hidden ${
      isCalculating ? 'opacity-50' : 'opacity-100'
    } ${animateResult ? 'animate-glow' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-500/5 animate-pulse-slow"></div>
      <div className="relative z-10">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Results
          {isCalculating && (
            <svg className="animate-spin ml-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </h3>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Total Buyers</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{buyers}</div>
              </div>
            </div>
            
            <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0">
                <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Price per Buyer</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(price)}</div>
              </div>
            </div>
            
            <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Total Income</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(price * buyers)}</div>
              </div>
            </div>
            
            <div className="bg-blue-600/5 dark:bg-blue-400/5 p-4 rounded-lg flex items-center space-x-3 hover:bg-blue-600/10 dark:hover:bg-blue-400/10 transition-colors border-l-4 border-blue-500 dark:border-blue-400 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                <img src={goldIconUrl} alt="Gold" className="h-6 w-6 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Gold per Driver</div>
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{formatGold(Math.floor(price * buyers / drivers))}</div>
              </div>
            </div>
          </div>
        </div>
        
        {goldDistribution.length > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800/30">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Gold Distribution</h4>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-md p-4 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="w-1/3 text-center py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">Driver</th>
                    <th className="w-1/3 text-center py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">Buyer</th>
                    <th className="w-1/3 text-center py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {goldDistribution.map((item, index) => {
                    const driverColor = getDriverColor(item.driver);
                    return (
                      <tr key={index} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors group border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${driverColor.bg} transition-all duration-300 ${driverColor.text} ${driverColor.border} ${driverColor.shadow} ${driverColor.hover}`}>
                              d{item.driver}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium ${driverColor.bg} ${driverColor.text} transition-all duration-300 ${driverColor.border} ${driverColor.shadow} ${driverColor.hover}`}>
                              {item.buyer}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex justify-center">
                            <span className={`flex items-center px-3 py-1.5 rounded-md ${driverColor.bg} ${driverColor.text} transition-all duration-300 ${driverColor.border} ${driverColor.shadow} ${driverColor.hover}`}>
                              <img src={goldIconUrl} alt="Gold" className="w-3.5 h-3.5 mr-1.5" />
                              <span className="font-medium">
                                {item.isGrouped ? (
                                  formatGold(item.gold)
                                ) : (
                                  formatGold(item.gold)
                                )}
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 