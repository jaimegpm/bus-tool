import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StorageManager } from '../../utils/storage';

/**
 * Simple tabbed interface for preset selection, Google Chrome style
 * Shows above the Configure Bus section
 */
export default function ConfigTabs({ 
  raid, 
  onPresetSelected, 
  activePresetId = null,
  className = '' 
}) {
  const [presets, setPresets] = useState([]);
  const [activeTab, setActiveTab] = useState('manual');

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

  // Memoized tab data for performance
  const tabsData = useMemo(() => {
    const tabs = [
      {
        id: 'manual',
        name: 'Manual',
        type: 'manual'
      }
    ];

    // Add preset tabs
    presets.forEach(preset => {
      tabs.push({
        id: preset.id,
        name: preset.name,
        type: 'preset',
        preset: preset
      });
    });

    return tabs;
  }, [presets]);

  // Don't render if no presets available - the manual tab will be handled by parent
  if (!raid || presets.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-end space-x-1 mb-2 ${className}`}>
      {tabsData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabSelect(tab.id, tab.preset)}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-t border-l border-r border-gray-200 dark:border-gray-700 shadow-sm'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600'
          } ${
            activeTab === tab.id ? 'z-10' : 'z-0'
          }`}
          style={{
            marginBottom: activeTab === tab.id ? '-1px' : '0px'
          }}
        >
          <span className="truncate max-w-32">
            {tab.name}
          </span>
          
          {/* Active tab indicator line */}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
          )}
        </button>
      ))}
    </div>
  );
}
