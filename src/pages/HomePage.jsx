import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { raids } from '../data/raids';
import OptimizedImage from '../components/OptimizedImage';
import '../components/PixelCanvas.css';

/**
 * Main page component that displays raid selection grid and handles raid/difficulty selection
 */
export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredRaid, setHoveredRaid] = useState(null);
  const [selectedRaid, setSelectedRaid] = useState(null);
  const difficultyModalRef = useRef(null);
  
  // Handle raid preselection from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const preselectedRaidId = searchParams.get('preselect');
    
    if (preselectedRaidId) {
      const raid = raids.find(r => r.id === preselectedRaidId);
      if (raid && raid.availableDifficulties.length > 1) {
        setSelectedRaid(raid);
        
        // Clear URL parameter without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [location.search]);
  
  // Handle clicks outside difficulty modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (difficultyModalRef.current && !difficultyModalRef.current.contains(event.target)) {
        closeModal();
      }
    }
    
    if (selectedRaid) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedRaid]);
  
  // Handle raid selection and navigation
  const handleRaidSelect = (raid) => {
    if (raid.availableDifficulties.length === 1) {
      navigate(`/raid/${raid.id}?difficulty=${raid.availableDifficulties[0]}`);
      return;
    }
    
    setSelectedRaid(raid);
  };
  
  // Handle difficulty selection from modal
  const handleDifficultySelect = (difficulty) => {
    navigate(`/raid/${selectedRaid.id}?difficulty=${difficulty}`);
    closeModal();
  };
  
  const closeModal = () => {
    setSelectedRaid(null);
  };
  
  return (
    <div className="max-w-5xl mx-auto text-center">
      {/* Page header section */}
      <section className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-fade-in">
          Lost Ark Bus Calculator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-slide-up">
          Select a raid, configure settings and get optimal gold distribution for your group.
        </p>
      </section>
      
      {/* Raid selection grid */}
      <section className="animate-scale-in">
        <h2 className="text-2xl font-semibold mb-6">Select a Raid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {raids.map((raid) => (
            <div
              key={raid.id}
              className={`p-5 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 relative overflow-hidden bg-white dark:bg-gray-800 will-change-transform ${
                hoveredRaid === raid.id 
                  ? 'shadow-[0_10px_20px_-10px_rgba(59,130,246,0.3),0_0_8px_rgba(59,130,246,0.2)] dark:shadow-[0_10px_20px_-10px_rgba(29,78,216,0.4),0_0_8px_rgba(29,78,216,0.3)]' 
                  : 'shadow-[0_4px_10px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3)]'
              }`}
              onClick={() => handleRaidSelect(raid)}
              onMouseEnter={() => setHoveredRaid(raid.id)}
              onMouseLeave={() => setHoveredRaid(null)}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-400/5 dark:via-indigo-500/5 dark:to-purple-500/5 opacity-0 transition-opacity duration-300 pointer-events-none ${
                hoveredRaid === raid.id ? 'opacity-100' : ''
              }`}></div>
              
              {/* Card border highlight */}
              <div className={`absolute inset-0 border border-gray-100/70 dark:border-gray-700/70 rounded-lg transition-colors duration-300 ${
                hoveredRaid === raid.id ? 'border-blue-300/50 dark:border-blue-500/30' : ''
              }`}></div>
              
              <div className="flex flex-col items-center relative z-10">
                {/* Raid image container */}
                <div className={`w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mb-4 ${
                  hoveredRaid === raid.id ? 'animate-float shadow-md' : 'shadow-sm'
                } transition-shadow duration-300`}>
                  {raid.image ? (
                    <OptimizedImage 
                      src={raid.image} 
                      alt={raid.name}
                      width={256}
                      height={256}
                      className="w-full h-full object-cover transition-all duration-500"
                      hovered={hoveredRaid === raid.id}
                      onError={(e) => {
                        e.target.parentNode.innerHTML = `<span class="text-3xl font-bold text-gray-500 dark:text-gray-400">${raid.name.charAt(0)}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                      {raid.name.charAt(0)}
                    </span>
                  )}
                </div>
                
                {/* Raid name */}
                <h3 className={`font-medium text-lg mb-1 transition-colors duration-300 ${
                  hoveredRaid === raid.id ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {raid.name}
                </h3>
                
                {/* Raid details */}
                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="mr-3">{raid.totalPlayers} players</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    raid.difficulty === 'Hard' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {raid.difficulty}
                  </span>
                </div>
                
                {/* Multiple difficulties indicator */}
                {raid.availableDifficulties.length > 1 && (
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                    </svg>
                    Multiple difficulties
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Difficulty selection modal */}
      {selectedRaid && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm will-change-transform">
          <div 
            ref={difficultyModalRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-scale-in will-change-transform"
            style={{ transform: 'translateZ(0)' }}
          >
            {/* Modal header with raid info */}
            <div className="flex items-center mb-6">
              {selectedRaid.image && (
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                  <OptimizedImage 
                    src={selectedRaid.image} 
                    alt={selectedRaid.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentNode.innerHTML = `<span class="text-2xl font-bold text-gray-500 dark:text-gray-400">${selectedRaid.name.charAt(0)}</span>`;
                    }}
                  />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  {selectedRaid.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {selectedRaid.totalPlayers} players
                </p>
              </div>
              
              {/* Close button */}
              <button 
                onClick={closeModal}
                className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h4 className="text-lg font-medium mb-4 text-center">Select Difficulty</h4>
            
            {/* Difficulty options grid */}
            <div className="grid grid-cols-2 gap-4">
              {selectedRaid.availableDifficulties.map((difficulty) => {
                const isHard = difficulty === 'Hard';
                const colors = isHard 
                  ? '#EF4444,#DC2626,#B91C1C' 
                  : '#10B981,#059669,#047857';
                const borderColor = isHard 
                  ? 'border-red-300 dark:border-red-700' 
                  : 'border-green-300 dark:border-green-700';
                const bgColor = isHard 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-green-100 dark:bg-green-900/30';
                const textColor = isHard 
                  ? 'text-red-800 dark:text-red-300' 
                  : 'text-green-800 dark:text-green-300';
                
                return (
                  <div
                    key={difficulty}
                    onClick={() => handleDifficultySelect(difficulty)}
                    className={`pixel-card difficulty-button relative p-4 rounded-lg border-2 transition-all duration-150 flex flex-col items-center cursor-pointer ${borderColor} active:scale-95 will-change-transform overflow-hidden gpu-accelerated ${isHard ? 'bg-red-50 dark:bg-red-900/10' : 'bg-green-50 dark:bg-green-900/10'}`}
                  >
                    {/* Pixel animation canvas */}
                    <pixel-canvas 
                      data-colors={colors}
                      data-gap="4"
                      data-speed="100"
                    ></pixel-canvas>
                    
                    <div className="difficulty-button-content relative z-10">
                      {/* Difficulty icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${bgColor}`}>
                        {isHard ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      {/* Difficulty name */}
                      <span className={`font-medium ${textColor}`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 