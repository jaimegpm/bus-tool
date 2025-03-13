import React from 'react';
import { formatGold, getDriverColor, getBuyerPartyIndicator } from '../../utils/BusLogic';

/**
 * Displays a summary panel showing:
 * - Total buyers and price per buyer
 * - Total income and gold per driver
 * - Detailed gold distribution table
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
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg transition-all duration-500 relative overflow-hidden border border-blue-200 dark:border-blue-800/50 ${
      isCalculating ? 'opacity-50' : 'opacity-100'
    } ${animateResult ? 'animate-glow' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-500/5 animate-pulse-slow"></div>
      <div className="relative z-10">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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

        {/* Main stats grid showing key metrics */}
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-5 mb-5 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-blue-200 dark:border-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium tracking-wider">Total Buyers</div>
                <div className="text-3xl font-bold text-blue-800 dark:text-blue-300">{buyers}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all duration-300 border border-yellow-200 dark:border-yellow-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-yellow-200 dark:border-yellow-700">
                <img src={goldIconUrl} alt="Gold" className="h-7 w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-yellow-600 dark:text-yellow-400 uppercase font-medium tracking-wider">Price per Buyer</div>
                <div className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">{formatGold(price)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all duration-300 border border-green-200 dark:border-green-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-green-200 dark:border-green-700">
                <img src={goldIconUrl} alt="Gold" className="h-7 w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-green-600 dark:text-green-400 uppercase font-medium tracking-wider">Total Income</div>
                <div className="text-3xl font-bold text-green-800 dark:text-green-300">{formatGold(price * buyers)}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 p-4 rounded-lg flex items-center space-x-4 hover:shadow-md transition-all duration-300 border border-purple-200 dark:border-purple-800/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 shadow-inner border border-purple-200 dark:border-purple-700">
                <img src={goldIconUrl} alt="Gold" className="h-7 w-7 object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-purple-600 dark:text-purple-400 uppercase font-medium tracking-wider">Gold per Driver</div>
                <div className="text-3xl font-bold text-purple-800 dark:text-purple-300">{formatGold(Math.floor(price * buyers / drivers))}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gold distribution table */}
        {goldDistribution.length > 0 && (
          <div className="mt-5 pt-5 border-t border-blue-200 dark:border-blue-800/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Gold Distribution
            </h4>
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 shadow-md">
              <div className="overflow-x-auto">
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
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${driverColor.bg} transition-all duration-300 ${driverColor.text} ${driverColor.border} ${driverColor.shadow} ${driverColor.hover} text-sm font-bold`}>
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
                                <img src={goldIconUrl} alt="Gold" className="w-4 h-4 mr-1.5" />
                                <span className="font-medium">
                                  {formatGold(item.gold)}
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
          </div>
        )}
      </div>
    </div>
  );
} 