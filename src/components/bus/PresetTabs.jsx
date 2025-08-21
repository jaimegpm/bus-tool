import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageManager } from '../../utils/storage';
import { formatGold } from '../../utils/BusLogic';

/**
 * Professional tabbed preset selector with instant application
 * Displays presets as tabs for immediate selection and application
 */
export default function PresetTabs({ 
  raid, 
  onPresetSelected, 
  activePresetId = null,
  className = '' 
}) {
  const [presets, setPresets] = useState([]);
  const [activeTab, setActiveTab] = useState('manual');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load presets for current raid
  useEffect(() => {
    if (raid) {
      const raidPresets = StorageManager.getPresetsForRaid(raid.id, raid.difficulty);
      setPresets(raidPresets);
      
      // Set active tab based on activePresetId
      if (activePresetId && raidPresets.find(p => p.id === activePresetId)) {
        setActiveTab(activePresetId);
      } else {
        setActiveTab('manual');
      }
    }
  }, [raid, activePresetId]);

  // Handle tab selection
  const handleTabSelect = useCallback((tabId, preset = null) => {
    setActiveTab(tabId);
    
    if (preset) {
      // Apply preset immediately
      onPresetSelected(preset);
    } else if (tabId === 'manual') {
      // Clear preset selection to go back to manual mode
      onPresetSelected(null);
    }
  }, [onPresetSelected]);

  // Handle preset deletion
  const handleDeletePreset = useCallback((presetId, event) => {
    event.stopPropagation();
    
    if (showDeleteConfirm === presetId) {
      // Confirm deletion
      StorageManager.deletePreset(presetId);
      
      // Refresh presets list
      const updatedPresets = StorageManager.getPresetsForRaid(raid.id, raid.difficulty);
      setPresets(updatedPresets);
      
      // Switch to manual if deleted preset was active
      if (activeTab === presetId) {
        setActiveTab('manual');
        onPresetSelected(null);
      }
      
      setShowDeleteConfirm(null);
    } else {
      // Show confirmation
      setShowDeleteConfirm(presetId);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(null), 3000);
    }
  }, [showDeleteConfirm, activeTab, raid, onPresetSelected]);

  // Cancel delete confirmation
  const cancelDelete = useCallback((event) => {
    event.stopPropagation();
    setShowDeleteConfirm(null);
  }, []);

  // Memoized tab data for performance
  const tabsData = useMemo(() => {
    const tabs = [
      {
        id: 'manual',
        name: 'Manual',
        type: 'manual',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        )
      }
    ];

    // Add preset tabs
    presets.forEach(preset => {
      tabs.push({
        id: preset.id,
        name: preset.name,
        type: 'preset',
        preset: preset,
        drivers: preset.drivers,
        buyers: raid.totalPlayers - preset.drivers,
        price: preset.price,
        hasNames: preset.driverNames.filter(name => name.trim()).length > 0
      });
    });

    return tabs;
  }, [presets, raid]);

  // Don't render if no presets available - just show manual mode
  if (!raid || presets.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Configuration
          </h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            • {presets.length} saved preset{presets.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {tabsData.map((tab) => (
          <div key={tab.id} className="relative flex-shrink-0">
            <button
              onClick={() => handleTabSelect(tab.id, tab.preset)}
              className={`relative flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 min-w-max ${
                activeTab === tab.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {/* Tab Icon */}
              <div className={`flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-500'
              }`}>
                {tab.type === 'manual' ? tab.icon : (
                  <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/50 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {tab.drivers}c{tab.buyers}
                    </span>
                  </div>
                )}
              </div>

              {/* Tab Content */}
              <div className="flex flex-col items-start">
                <span className="truncate max-w-24 sm:max-w-32">
                  {tab.name}
                </span>
                {tab.type === 'preset' && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatGold(tab.price)}</span>
                    {tab.hasNames && (
                      <>
                        <span>•</span>
                        <span className="w-2 h-2 bg-green-400 rounded-full" title="Has driver names"></span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Delete Button for Presets */}
              {tab.type === 'preset' && (
                <div className="absolute -top-1 -right-1">
                  {showDeleteConfirm === tab.id ? (
                    <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/50 rounded-full px-2 py-1">
                      <button
                        onClick={(e) => handleDeletePreset(tab.id, e)}
                        className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        title="Confirm delete"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelDelete}
                        className="w-4 h-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => handleDeletePreset(tab.id, e)}
                      className="w-5 h-5 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-200 flex items-center justify-center"
                      title="Delete preset"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </button>

            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"></div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Content Info */}
      {activeTab !== 'manual' && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-600">
          {(() => {
            const activePreset = presets.find(p => p.id === activeTab);
            if (!activePreset) return null;
            
            return (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-purple-600 dark:text-purple-400">
                      {activePreset.drivers} driver{activePreset.drivers !== 1 ? 's' : ''}
                    </span>
                    {' • '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {raid.totalPlayers - activePreset.drivers} buyer{raid.totalPlayers - activePreset.drivers !== 1 ? 's' : ''}
                    </span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {formatGold(activePreset.price)} gold per buyer
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  {activePreset.driverNames.filter(name => name.trim()).length > 0 && (
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Names configured</span>
                    </span>
                  )}
                  <span>Applied ✓</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
