import React from 'react';
import OptimizedImage from '../../components/OptimizedImage';
import { formatGold } from '../../utils/BusLogic';

// Main header component for displaying raid info and controls
export default function BusHeader({ 
  raid, 
  difficultyMenuRef, 
  difficultyMenuOpen, 
  toggleDifficultyMenu, 
  handleDifficultyChange,
  imageError,
  handleImageError 
}) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-6 mb-3 sm:mb-4">
      {/* Raid thumbnail image */}
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center shadow-md animate-float shrink-0">
        {raid.image && !imageError ? (
          <OptimizedImage 
            src={raid.image} 
            alt={raid.name}
            width={96}
            height={96}
            className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
            onError={handleImageError}
          />
        ) : (
          <span className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-400">
            {raid.name.charAt(0)}
          </span>
        )}
      </div>
      
      {/* Main raid info section */}
      <div className="flex flex-col justify-center items-start">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <h1 className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 leading-tight">
            {raid.name}
          </h1>
          
          {/* Gold reward indicator */}
          <div className="flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-yellow-400/10 to-amber-400/10 border border-yellow-400/20 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-yellow-600 dark:text-yellow-400">
              {formatGold(raid.goldReward[raid.difficulty])}
            </span>
          </div>

          {/* Special reward indicator */}
          <div className="flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 border border-purple-400/20 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 sm:mr-1 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
            </svg>
            <img 
              src={raid.specialReward[raid.difficulty]} 
              alt={`${raid.name} ${raid.difficulty} reward`} 
              className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
            />
          </div>
        </div>
        
        {/* Player count and difficulty selector */}
        <div className="flex items-center">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{raid.totalPlayers} players</span>
          
          {/* Difficulty dropdown */}
          <div ref={difficultyMenuRef} className="relative ml-2 sm:ml-3">
            <button 
              className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 ${
                raid.difficulty === 'Hard' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              } ${raid.availableDifficulties.length > 1 ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : 'cursor-default'}`}
              onClick={toggleDifficultyMenu}
              disabled={raid.availableDifficulties.length <= 1}
              aria-haspopup="true"
              aria-expanded={difficultyMenuOpen}
            >
              <span>{raid.difficulty}</span>
              {raid.availableDifficulties.length > 1 && (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-2.5 w-2.5 sm:h-3 sm:w-3 transition-transform duration-200 ${difficultyMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* Difficulty options menu */}
            {difficultyMenuOpen && raid.availableDifficulties.length > 1 && (
              <div className="absolute top-full left-0 mt-1 z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[100px] sm:min-w-[120px] animate-fade-in will-change-transform" style={{ transform: 'translateZ(0)' }}>
                {raid.availableDifficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm ${
                      difficulty === raid.difficulty
                        ? difficulty === 'Hard'
                          ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } transition-colors flex items-center`}
                    onClick={() => handleDifficultyChange(difficulty)}
                  >
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1.5 sm:mr-2 ${
                      difficulty === 'Hard'
                        ? 'bg-red-500 dark:bg-red-400'
                        : 'bg-green-500 dark:bg-green-400'
                    }`}></span>
                    {difficulty}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 