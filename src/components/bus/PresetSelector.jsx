import React, { useState, useEffect } from 'react';
import { StorageManager } from '../../utils/storage';
import { formatGold } from '../../utils/BusLogic';

/**
 * Component for selecting and loading saved presets in raid configuration
 * Displays available presets for the current raid and allows quick loading
 */
export default function PresetSelector({ 
  raid, 
  onPresetSelected, 
  className = '' 
}) {
  const [presets, setPresets] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load presets for current raid
  useEffect(() => {
    if (raid) {
      const raidPresets = StorageManager.getPresetsForRaid(raid.id, raid.difficulty);
      setPresets(raidPresets);
    }
  }, [raid]);

  // Handle preset selection
  const handlePresetSelect = (preset) => {
    onPresetSelected(preset);
    setIsExpanded(false);
  };

  // Handle preset deletion
  const handleDeletePreset = (presetId, event) => {
    event.stopPropagation();
    StorageManager.deletePreset(presetId);
    
    // Refresh presets list
    const updatedPresets = StorageManager.getPresetsForRaid(raid.id, raid.difficulty);
    setPresets(updatedPresets);
  };

  // Don't render if no presets available
  if (!raid || presets.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Saved Presets
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {presets.length} preset{presets.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Presets List */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
            {presets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all duration-200 border border-transparent hover:border-purple-200 dark:hover:border-purple-800/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                          {preset.drivers}c{raid.totalPlayers - preset.drivers}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {preset.name}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatGold(preset.price)} gold
                        </span>
                        {preset.driverNames.length > 0 && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {preset.driverNames.filter(name => name.trim()).length} driver names
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Load button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePresetSelect(preset);
                    }}
                    className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded transition-colors"
                    title="Load preset"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDeletePreset(preset.id, e)}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition-colors"
                    title="Delete preset"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer info */}
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Click a preset to load it instantly, or use the buttons to load/delete
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
