import React from 'react';
import { formatGold } from '../../utils/BusLogic';

/**
 * Displays bus configuration details and earnings breakdown
 * Shows raid info, player setup, and gold calculations
 */
export default function BusDetails({ raid, busConfig }) {
  // Calculate gold earnings
  const raidGoldReward = raid.goldReward[raid.difficulty] || 0;
  const busGoldPerDriver = Math.floor(busConfig.totalPrice * busConfig.buyers / busConfig.drivers);
  const totalGoldPerDriver = raidGoldReward + busGoldPerDriver;
  const sharesPerDriver = busConfig.buyers / busConfig.drivers;
  
  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Bus Summary
      </h2>
      
      {/* Main layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration details */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-lg p-5 shadow-md border border-blue-200 dark:border-blue-800/50 flex flex-col justify-center h-full">
          <h3 className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
            Configuration
          </h3>
          
          <ul className="space-y-3">
            <li className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-800/30">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Raid
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{raid.name}</span>
            </li>
            
            <li className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-800/30">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Difficulty
              </span>
              <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                raid.difficulty === 'Hard' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              }`}>
                {raid.difficulty}
              </span>
            </li>
            
            <li className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-800/30">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Format
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm">
                {busConfig.drivers}c{busConfig.buyers}
              </span>
            </li>
            
            <li className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-800/30">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                  <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                </svg>
                Total Players
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{raid.totalPlayers}</span>
            </li>
            
            <li className="flex justify-between items-center pb-2 border-b border-blue-200 dark:border-blue-800/30">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Price per Buyer
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{formatGold(busConfig.pricePerBuyer)}</span>
            </li>

            <li className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                </svg>
                Special Reward
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                <img 
                  src={raid.specialReward[raid.difficulty]} 
                  alt={`${raid.name} ${raid.difficulty} reward`} 
                  className="w-6 h-6 object-contain"
                />
              </span>
            </li>
          </ul>
        </div>
        
        {/* Gold earnings section */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Bus gold card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 p-4 rounded-lg flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-300 border border-blue-200 dark:border-blue-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium tracking-wider">Bus Gold</div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">{formatGold(busGoldPerDriver)}</div>
            <div className="text-xs text-blue-600/80 dark:text-blue-400/80">
              {Math.round(sharesPerDriver)} shares per driver ({formatGold(busConfig.pricePerBuyer)} each)
            </div>
          </div>
          
          {/* Raid gold card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 p-4 rounded-lg flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-300 border border-purple-200 dark:border-purple-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="text-xs text-purple-600 dark:text-purple-400 uppercase font-medium tracking-wider">Raid Gold</div>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">{formatGold(raidGoldReward)}</div>
            <div className="text-xs text-purple-600/80 dark:text-purple-400/80">
              Full reward per player
            </div>
          </div>
          
          {/* Total gold card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 p-4 rounded-lg flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-300 border border-green-200 dark:border-green-800/50 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="text-xs text-green-600 dark:text-green-400 uppercase font-medium tracking-wider">Total Gold</div>
            <div className="text-2xl font-bold text-green-800 dark:text-green-300">{formatGold(totalGoldPerDriver)}</div>
            <div className="text-xs text-green-600/80 dark:text-green-400/80">
              Per driver
            </div>
          </div>
          
          {/* Party setup section */}
          <div className="sm:col-span-3 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 p-5 rounded-lg border border-yellow-200 dark:border-yellow-800/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent animate-pulse-slow"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-medium mb-3 text-yellow-800 dark:text-yellow-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Party Setup Guide
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First party */}
                <div className="bg-white/60 dark:bg-gray-800/40 px-4 py-3 rounded-lg shadow-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Party 1</div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from({ length: Math.min(4, busConfig.drivers) }).map((_, i) => (
                      <span key={`driver-p1-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/50">
                        Driver {i + 1}
                      </span>
                    ))}
                    {Array.from({ length: Math.min(4 - Math.min(4, busConfig.drivers), busConfig.buyers) }).map((_, i) => (
                      <span key={`buyer-p1-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800/50">
                        Buyer {i + 1}
                      </span>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - Math.min(4, busConfig.drivers) - Math.min(4 - Math.min(4, busConfig.drivers), busConfig.buyers)) }).map((_, i) => (
                      <span key={`empty-p1-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-gray-50 dark:bg-gray-800/20 text-gray-400 dark:text-gray-600 text-xs font-medium border border-gray-200 dark:border-gray-700/30">
                        Empty
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Second party - for 8-player raids */}
                {raid.totalPlayers === 8 && (
                  <div className="bg-white/60 dark:bg-gray-800/40 px-4 py-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center mb-3">
                      <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Party 2</div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.from({ length: Math.max(0, busConfig.drivers - 4) }).map((_, i) => (
                        <span key={`driver-p2-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium border border-blue-200 dark:border-blue-800/50">
                          Driver {i + 5}
                        </span>
                      ))}
                      {Array.from({ length: Math.min(4 - Math.max(0, busConfig.drivers - 4), Math.max(0, busConfig.buyers - Math.min(4 - Math.min(4, busConfig.drivers), busConfig.buyers))) }).map((_, i) => (
                        <span key={`buyer-p2-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800/50">
                          Buyer {i + 1 + Math.min(4 - Math.min(4, busConfig.drivers), busConfig.buyers)}
                        </span>
                      ))}
                      {Array.from({ length: Math.max(0, 4 - Math.max(0, busConfig.drivers - 4) - Math.min(4 - Math.max(0, busConfig.drivers - 4), Math.max(0, busConfig.buyers - Math.min(4 - Math.min(4, busConfig.drivers), busConfig.buyers)))) }).map((_, i) => (
                        <span key={`empty-p2-${i}`} className="inline-flex items-center justify-center w-20 h-8 rounded-md bg-gray-50 dark:bg-gray-800/20 text-gray-400 dark:text-gray-600 text-xs font-medium border border-gray-200 dark:border-gray-700/30">
                          Empty
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 