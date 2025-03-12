import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { raids } from '../data/raids';
import BusConfig from '../components/BusConfig';
import OptimizedImage from '../components/OptimizedImage';
import '../components/PixelCanvas.css';

/**
 * BusConfigPage Component
 * 
 * Displays the configuration page for a specific raid
 * Allows users to set up bus parameters and view gold distribution
 */
export default function BusConfigPage() {
  const { raidId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [raid, setRaid] = useState(null);
  const [busConfig, setBusConfig] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false);
  const difficultyMenuRef = useRef(null);
  
  // Load raid data and apply selected difficulty
  useEffect(() => {
    // Get difficulty from query parameters
    const searchParams = new URLSearchParams(location.search);
    const difficulty = searchParams.get('difficulty') || 'Normal';
    
    // Find the raid data by ID
    const selectedRaid = raids.find(r => r.id === raidId);
    if (!selectedRaid) {
      navigate('/');
      return;
    }
    
    // Validate difficulty selection
    if (!selectedRaid.availableDifficulties.includes(difficulty)) {
      // If invalid difficulty, redirect to first available one
      const validDifficulty = selectedRaid.availableDifficulties[0];
      navigate(`/raid/${raidId}?difficulty=${validDifficulty}`, { replace: true });
      return;
    }
    
    // Create raid object with selected difficulty and set state
    setRaid({
      ...selectedRaid,
      difficulty
    });
    setIsLoaded(true);
  }, [raidId, navigate, location.search]);
  
  // Handle clicks outside the difficulty dropdown menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (difficultyMenuRef.current && !difficultyMenuRef.current.contains(event.target)) {
        setDifficultyMenuOpen(false);
      }
    }
    
    if (difficultyMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [difficultyMenuOpen]);
  
  // Update the bus configuration state when changes occur
  const handleConfigChange = useCallback((config) => {
    setBusConfig(config);
  }, []);
  
  // Handle raid image loading errors
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Toggle the difficulty selection dropdown
  const toggleDifficultyMenu = () => {
    if (raid && raid.availableDifficulties.length > 1) {
      setDifficultyMenuOpen(!difficultyMenuOpen);
    }
  };
  
  // Handle difficulty change selection
  const handleDifficultyChange = (difficulty) => {
    if (difficulty !== raid.difficulty) {
      navigate(`/raid/${raidId}?difficulty=${difficulty}`, { replace: true });
    }
    setDifficultyMenuOpen(false);
  };
  
  if (!raid) return null;
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Back to raids button */}
      <div className={`flex items-center mb-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          onClick={() => navigate('/')}
          className="pixel-card difficulty-button relative p-3 rounded-lg border-2 border-blue-300 dark:border-blue-700 transition-all duration-150 flex items-center cursor-pointer active:scale-95 will-change-transform overflow-hidden gpu-accelerated bg-blue-50 dark:bg-blue-900/10"
        >
          <pixel-canvas 
            data-colors="#3B82F6,#2563EB,#1D4ED8"
            data-gap="4"
            data-speed="100"
          ></pixel-canvas>
          
          <div className="difficulty-button-content relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-blue-800 dark:text-blue-300">
              Back to Raids
            </span>
          </div>
        </div>
      </div>
      
      {/* Raid information header */}
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 transition-all duration-500 ${isLoaded ? 'animate-scale-in' : 'opacity-0 scale-95'}`}>
        <div className="flex items-start space-x-6 mb-4">
          {/* Raid image */}
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center shadow-md animate-float shrink-0">
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
              <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                {raid.name.charAt(0)}
              </span>
            )}
          </div>
          
          {/* Raid details and difficulty selector */}
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 leading-tight mb-2">
              {raid.name}
            </h1>
            
            <div className="flex items-center">
              <span className="text-gray-600 dark:text-gray-400">{raid.totalPlayers} players</span>
              
              {/* Difficulty dropdown menu */}
              <div ref={difficultyMenuRef} className="relative ml-3">
                <button 
                  className={`px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 ${
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
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${difficultyMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                {/* Difficulty selection dropdown */}
                {difficultyMenuOpen && raid.availableDifficulties.length > 1 && (
                  <div className="absolute top-full left-0 mt-1 z-10 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[120px] animate-fade-in will-change-transform" style={{ transform: 'translateZ(0)' }}>
                    {raid.availableDifficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          difficulty === raid.difficulty
                            ? difficulty === 'Hard'
                              ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        } transition-colors flex items-center`}
                        onClick={() => handleDifficultyChange(difficulty)}
                      >
                        <span className={`w-2 h-2 rounded-full mr-2 ${
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
      </div>
      
      {/* Bus configuration section */}
      <section className={`transition-all duration-500 delay-100 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
        <h2 className="text-2xl font-semibold mb-4">Configure Bus</h2>
        <BusConfig raid={raid} onConfigChange={handleConfigChange} />
      </section>
      
      {/* Bus configuration summary */}
      {busConfig && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bus details overview */}
            <div>
              <h3 className="text-lg font-medium mb-2">Bus Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Raid:</span>
                  <span className="font-medium">{raid.name}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                  <span className={`font-medium ${
                    raid.difficulty === 'Hard' 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {raid.difficulty}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Format:</span>
                  <span className="font-medium">{busConfig.drivers}c{busConfig.buyers}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                  <span className="font-medium">{busConfig.totalPrice} gold</span>
                </li>
              </ul>
            </div>
            
            {/* Listing instructions for buyers */}
            <div>
              <h3 className="text-lg font-medium mb-2">Listing Instructions</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                    List the following item in the market for each buyer:
                  </p>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">{busConfig.pricePerBuyer} gold</span>
                  </div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                    Each driver will receive approximately {Math.floor(busConfig.pricePerBuyer * busConfig.buyers / busConfig.drivers)} gold
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 