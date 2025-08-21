import React from 'react';

/**
 * Component for inputting driver and buyer names
 * Dynamically shows input fields based on number of drivers and buyers
 */
export default function NameInputs({ 
  drivers, 
  buyers, 
  driverNames, 
  buyerNames, 
  onDriverNameChange, 
  onBuyerNameChange 
}) {
  const handleDriverChange = (index, value) => {
    const newNames = [...driverNames];
    newNames[index] = value;
    onDriverNameChange(newNames);
  };

  const handleBuyerChange = (index, value) => {
    const newNames = [...buyerNames];
    newNames[index] = value;
    onBuyerNameChange(newNames);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md animate-slide-up relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/10 to-emerald-50/10 dark:from-green-900/5 dark:to-emerald-900/5"></div>
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Player Names
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Driver Names */}
          <div className="space-y-3">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Drivers ({drivers})
            </h4>
            <div className="space-y-2">
              {Array.from({ length: drivers }).map((_, index) => (
                <div key={`driver-${index}`} className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 w-8">
                    D{index + 1}:
                  </span>
                  <input
                    type="text"
                    value={driverNames[index] || ''}
                    onChange={(e) => handleDriverChange(index, e.target.value)}
                    placeholder={`Driver ${index + 1}`}
                    maxLength="12"
                    className="flex-1 px-3 py-2 text-sm border border-blue-200 dark:border-blue-700 rounded-md 
                             bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Names */}
          <div className="space-y-3">
            <h4 className="font-medium text-purple-700 dark:text-purple-300 flex items-center text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Buyers ({buyers})
            </h4>
            <div className="space-y-2">
              {Array.from({ length: buyers }).map((_, index) => (
                <div key={`buyer-${index}`} className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 w-8">
                    B{index + 1}:
                  </span>
                  <input
                    type="text"
                    value={buyerNames[index] || ''}
                    onChange={(e) => handleBuyerChange(index, e.target.value)}
                    placeholder={`Buyer ${index + 1}`}
                    maxLength="12"
                    className="flex-1 px-3 py-2 text-sm border border-purple-200 dark:border-purple-700 rounded-md 
                             bg-purple-50 dark:bg-purple-900/20 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Names should be short (max 12 chars) to fit in chat messages. Empty names will use default labels.
          </p>
        </div>
      </div>
    </div>
  );
}
