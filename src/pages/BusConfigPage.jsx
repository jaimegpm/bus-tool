import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { raids } from '../data/raids';
import BusConfig from '../components/BusConfig';
import OptimizedImage from '../components/OptimizedImage';
import BusDetails from '../components/bus/BusDetails';
import BusHeader from '../components/bus/BusHeader';
import ConfigTabs from '../components/bus/ConfigTabs';
import '../components/PixelCanvas.css';

/**
 * Main page for configuring raid bus settings
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
  const [activePresetId, setActivePresetId] = useState(null);
  const [presetConfig, setPresetConfig] = useState(null);
  const difficultyMenuRef = useRef(null);
  
  // Initialize raid data and difficulty
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
  
  // Handle difficulty menu clicks outside
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
  
  // Update bus config state
  const handleConfigChange = useCallback((config) => {
    setBusConfig(config);
  }, []);
  
  // Handle image errors
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Toggle difficulty menu
  const toggleDifficultyMenu = () => {
    if (raid && raid.availableDifficulties.length > 1) {
      setDifficultyMenuOpen(!difficultyMenuOpen);
    }
  };
  
  // Handle difficulty selection
  const handleDifficultyChange = (difficulty) => {
    if (difficulty !== raid.difficulty) {
      navigate(`/raid/${raidId}?difficulty=${difficulty}`, { replace: true });
    }
    setDifficultyMenuOpen(false);
  };

  // Handle preset selection
  const handlePresetSelected = useCallback((preset) => {
    if (preset === null) {
      // Clear preset selection (manual mode)
      setActivePresetId(null);
      setPresetConfig(null);
      return;
    }
    
    setActivePresetId(preset.id);
    setPresetConfig(preset);
  }, []);

  // Handle preset config changes (when user modifies manual settings)
  const handlePresetConfigChange = useCallback((config) => {
    if (config === null) {
      setActivePresetId(null);
      setPresetConfig(null);
    }
  }, []);
  
  if (!raid) return null;
  
  return (
    <div className="space-y-6 sm:space-y-8 w-full mx-auto px-4 sm:px-0 max-w-3xl">
      {/* Back to raids button */}
      <div className={`flex items-center mb-4 sm:mb-6 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div 
          onClick={() => navigate('/')}
          className="pixel-card difficulty-button relative p-2 sm:p-3 rounded-lg border-2 border-blue-300 dark:border-blue-700 transition-all duration-150 flex items-center cursor-pointer active:scale-95 will-change-transform overflow-hidden gpu-accelerated bg-blue-50 dark:bg-blue-900/10"
        >
          <pixel-canvas 
            data-colors="#3B82F6,#2563EB,#1D4ED8"
            data-gap="4"
            data-speed="100"
          ></pixel-canvas>
          
          <div className="difficulty-button-content relative z-10 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-sm sm:text-base text-blue-800 dark:text-blue-300">
              Back to Raids
            </span>
          </div>
        </div>
      </div>
      
      {/* Raid header section */}
      <div className={`bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8 transition-all duration-500 ${isLoaded ? 'animate-scale-in' : 'opacity-0 scale-95'}`}>
        <BusHeader
          raid={raid}
          difficultyMenuRef={difficultyMenuRef}
          difficultyMenuOpen={difficultyMenuOpen}
          toggleDifficultyMenu={toggleDifficultyMenu}
          handleDifficultyChange={handleDifficultyChange}
          imageError={imageError}
          handleImageError={handleImageError}
        />
      </div>
      
      {/* Configuration section */}
      <section className={`transition-all duration-500 delay-100 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-4'}`}>
        {/* Configuration tabs */}
        <ConfigTabs 
          raid={raid}
          onPresetSelected={handlePresetSelected}
          activePresetId={activePresetId}
        />
        
        {/* Configure Bus with integrated styling */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-t-0 rounded-t-none">
          <div className="px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">Configure Bus</h2>
          </div>
          <div className="p-4 sm:p-6">
            <BusConfig 
              raid={raid} 
              onConfigChange={handleConfigChange}
              presetConfig={presetConfig}
              onPresetConfigChange={handlePresetConfigChange}
            />
          </div>
        </div>
      </section>
      
      {/* Configuration summary */}
      {busConfig && (
        <BusDetails raid={raid} busConfig={busConfig} />
      )}
    </div>
  );
} 