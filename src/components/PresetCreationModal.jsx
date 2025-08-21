import React, { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { raids } from '../data/raids';
import { StorageManager } from '../utils/storage';
import OptimizedImage from './OptimizedImage';
import { getOptimizedImageUrl } from '../utils/assetUtils';

// Memoized raid card component for better performance
const RaidCard = React.memo(({ raid, onSelect }) => (
  <div
    onClick={() => onSelect(raid)}
    className="p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
  >
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center mb-3">
        {raid.image ? (
          <OptimizedImage 
            src={raid.image} 
            alt={raid.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
            {raid.name.charAt(0)}
          </span>
        )}
      </div>
      <h4 className="font-medium text-sm text-center text-gray-900 dark:text-gray-100 mb-1">
        {raid.name}
      </h4>
      <div className="flex items-center justify-center space-x-2">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {raid.totalPlayers} players
        </p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          raid.difficulty === 'Hard' 
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
        }`}>
          {raid.difficulty}
        </span>
      </div>
    </div>
  </div>
));

RaidCard.displayName = 'RaidCard';

// Memoized driver input component with optimized change handler
const DriverInput = React.memo(({ index, value, onChange, placeholder }) => {
  const handleChange = useCallback((e) => {
    onChange(index, e.target.value);
  }, [index, onChange]);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 w-6 flex-shrink-0">
        D{index + 1}
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength="12"
        className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  );
});

DriverInput.displayName = 'DriverInput';

/**
 * Modal component for creating new bus configuration presets
 * Allows users to save driver configurations for quick reuse
 */
export default React.memo(function PresetCreationModal({ isOpen, onClose, onPresetCreated, preselectedRaid = null }) {
  const [selectedRaid, setSelectedRaid] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [presetName, setPresetName] = useState('');
  const [drivers, setDrivers] = useState(1);
  const [price, setPrice] = useState(5000);
  const [driverNames, setDriverNames] = useState(['']);
  const [step, setStep] = useState(1); // 1: Select Raid, 2: Configure
  const [isCreating, setIsCreating] = useState(false);
  const [difficultyMenuOpen, setDifficultyMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const modalRef = useRef(null);
  const difficultyMenuRef = useRef(null);
  
  // Get gold icon URL
  const goldIconUrl = useMemo(() => getOptimizedImageUrl('images/icons/gold.webp', 'sm', true), []);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // If there's a preselected raid, use it and skip to step 2
      if (preselectedRaid) {
        setSelectedRaid(preselectedRaid);
        setSelectedDifficulty(preselectedRaid.difficulty);
        setStep(2);
        
        // Generate default preset name
        const defaultName = `${preselectedRaid.name} ${preselectedRaid.difficulty} Team`;
        setPresetName(defaultName);
      } else {
        setSelectedRaid(null);
        setSelectedDifficulty('');
        setStep(1);
        setPresetName('');
      }
      
      setDrivers(1);
      setPrice(5000);
      setDriverNames(['']);
      setIsCreating(false);
      setDifficultyMenuOpen(false);
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preselectedRaid]);

  // Initialize driver names array when drivers count changes
  useEffect(() => {
    const newNames = [...driverNames];
    while (newNames.length < drivers) newNames.push('');
    setDriverNames(newNames.slice(0, drivers));
  }, [drivers]);

  // Handle clicks outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle clicks outside difficulty menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (difficultyMenuRef.current && !difficultyMenuRef.current.contains(event.target)) {
        setDifficultyMenuOpen(false);
      }
    }

    if (difficultyMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [difficultyMenuOpen]);

  // Handle raid selection
  const handleRaidSelect = useCallback((raid) => {
    startTransition(() => {
      setSelectedRaid(raid);
      setSelectedDifficulty(raid.difficulty);
      setStep(2);
      
      // Generate default preset name
      const defaultName = `${raid.name} ${raid.difficulty} Team`;
      setPresetName(defaultName);
    });
  }, [startTransition]);

  // Toggle difficulty menu
  const toggleDifficultyMenu = useCallback(() => {
    if (selectedRaid && selectedRaid.availableDifficulties.length > 1) {
      setDifficultyMenuOpen(!difficultyMenuOpen);
    }
  }, [selectedRaid, difficultyMenuOpen]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((difficulty) => {
    setDifficultyMenuOpen(false);
    
    startTransition(() => {
      setSelectedDifficulty(difficulty);
      
      // Update preset name
      if (selectedRaid) {
        const defaultName = `${selectedRaid.name} ${difficulty} Team`;
        setPresetName(defaultName);
      }
    });
  }, [selectedRaid, startTransition]);

  // Handle driver count change
  const handleDriverChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '') {
      setDrivers(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;
    
    const maxDrivers = selectedRaid ? selectedRaid.totalPlayers - 1 : 0;
    
    startTransition(() => {
      if (numValue < 1) {
        setDrivers(1);
      } else if (numValue >= selectedRaid.totalPlayers) {
        setDrivers(maxDrivers);
      } else {
        setDrivers(numValue);
      }
    });
  }, [selectedRaid, startTransition]);

  // Handle price change with optimized validation
  const handlePriceChange = useCallback((e) => {
    const value = e.target.value;
    
    // Allow empty string for clearing
    if (value === '') {
      setPrice(0);
      return;
    }
    
    // Quick validation before parsing
    if (!/^\d+$/.test(value)) return;
    
    const numValue = parseInt(value, 10);
    if (numValue >= 0 && numValue <= 999999999) { // Reasonable upper limit
      setPrice(numValue);
    }
  }, []);

  // Handle driver name change
  const handleDriverNameChange = useCallback((index, value) => {
    const newNames = [...driverNames];
    newNames[index] = value;
    setDriverNames(newNames);
  }, [driverNames]);

  // Create preset
  const handleCreatePreset = useCallback(async () => {
    if (!presetName.trim() || !selectedRaid || drivers <= 0 || price <= 0) {
      return;
    }

    setIsCreating(true);

    try {
      const preset = {
        name: presetName.trim(),
        raidId: selectedRaid.id,
        difficulty: selectedDifficulty,
        drivers: drivers,
        price: price,
        driverNames: driverNames.filter(name => name.trim() !== '')
      };

      const presetId = StorageManager.savePreset(preset);
      
      if (presetId) {
        onPresetCreated?.(preset);
        onClose();
      }
    } catch (error) {
      console.error('Error creating preset:', error);
    } finally {
      setIsCreating(false);
    }
  }, [presetName, selectedRaid, drivers, price, selectedDifficulty, driverNames, onPresetCreated, onClose]);

  // Memoized computed values for performance
  const buyers = useMemo(() => selectedRaid ? selectedRaid.totalPlayers - drivers : 0, [selectedRaid, drivers]);
  const maxDrivers = useMemo(() => selectedRaid ? selectedRaid.totalPlayers - 1 : 0, [selectedRaid]);
  
  // Memoized raid list for step 1 to prevent unnecessary re-renders
  const availableRaids = useMemo(() => raids, []);
  
  // Memoized driver inputs array for better list rendering performance
  const driverInputsArray = useMemo(() => 
    Array.from({ length: drivers }, (_, index) => ({ 
      key: `driver-${index}`, 
      index, 
      value: driverNames[index] || '',
      placeholder: `Driver ${index + 1} name`
    })),
    [drivers, driverNames]
  );
  
  // Memoized step 1 content
  const stepOneContent = useMemo(() => (
    <div>
      <h3 className="text-base font-medium mb-4 text-gray-900 dark:text-gray-100">
        Select a Raid
      </h3>
      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
        {availableRaids.map((raid) => (
          <RaidCard key={raid.id} raid={raid} onSelect={handleRaidSelect} />
        ))}
      </div>
    </div>
  ), [availableRaids, handleRaidSelect]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] backdrop-blur-md flex items-center justify-center p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700 relative"
      >
          <div className="flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Create New Preset
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {step === 1 ? stepOneContent : (
                // Step 2: Configuration
                <div className="space-y-4">
                  {/* Raid info header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden flex-shrink-0">
                        {selectedRaid.image && (
                          <OptimizedImage 
                            src={selectedRaid.image} 
                            alt={selectedRaid.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {selectedRaid.name}
                        </h3>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{selectedRaid.totalPlayers} players</span>
                      </div>
                    </div>
                    
                    {/* Difficulty dropdown */}
                    <div ref={difficultyMenuRef} className="relative">
                      <button 
                        className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                          selectedDifficulty === 'Hard' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        } ${selectedRaid.availableDifficulties.length > 1 ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : 'cursor-default'}`}
                        onClick={toggleDifficultyMenu}
                        disabled={selectedRaid.availableDifficulties.length <= 1}
                      >
                        <span>{selectedDifficulty}</span>
                        {selectedRaid.availableDifficulties.length > 1 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-200 ${difficultyMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Difficulty options menu */}
                      {difficultyMenuOpen && selectedRaid.availableDifficulties.length > 1 && (
                        <div className="absolute top-full right-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 min-w-[80px]">
                          {selectedRaid.availableDifficulties.map((difficulty) => (
                            <button
                              key={difficulty}
                              className={`w-full text-left px-3 py-1.5 text-xs ${
                                difficulty === selectedDifficulty
                                  ? difficulty === 'Hard'
                                    ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              } transition-colors flex items-center`}
                              onClick={() => handleDifficultyChange(difficulty)}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
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

                  {/* Configuration Form */}
                  <div className="space-y-4">
                    {/* Preset Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preset Name
                      </label>
                      <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Enter preset name"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    {/* Driver Configuration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Drivers
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden">
                          <button 
                            onClick={() => drivers > 1 && setDrivers(drivers - 1)}
                            disabled={drivers <= 1}
                            className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          
                          <input
                            type="text"
                            value={drivers}
                            onChange={handleDriverChange}
                            className="w-12 text-center py-2 border-x border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none text-gray-900 dark:text-gray-100 font-medium text-sm"
                          />
                          
                          <button 
                            onClick={() => drivers < maxDrivers && setDrivers(drivers + 1)}
                            disabled={drivers >= maxDrivers}
                            className="p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-300 font-medium text-sm">
                          {drivers}c{buyers}
                        </div>
                      </div>
                    </div>

                    {/* Price Configuration */}
                    <div>
                                                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                  <div className="w-3 h-3 mr-1.5 flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-0.5 flex items-center justify-center">
                                    <img src={goldIconUrl} alt="Gold" className="w-full h-full object-contain" />
                                  </div>
                                  Bus Gold
                                </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                          <img src={goldIconUrl} alt="Gold" className="w-3 h-3 object-contain opacity-70" />
                        </div>
                        <input
                          type="number"
                          value={price}
                          onChange={handlePriceChange}
                          placeholder="5000"
                          className="w-full pl-8 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">gold</span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Names */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Driver Names
                      </label>
                      <div className="space-y-2">
                        {driverInputsArray.map(({ key, index, value, placeholder }) => (
                          <DriverInput
                            key={key}
                            index={index}
                            value={value}
                            onChange={handleDriverNameChange}
                            placeholder={placeholder}
                          />
                        ))}
                      </div>
                    </div>
              </div>
            </div>
          )}
        </div>

            {/* Modal Footer */}
            {step === 2 && (
              <div className="flex items-center justify-end space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePreset}
                  disabled={!presetName.trim() || isCreating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center space-x-2 text-sm"
                >
                  {isCreating && (
                    <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  <span>{isCreating ? 'Creating...' : 'Create Preset'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
    </div>,
    document.body
  );
});
