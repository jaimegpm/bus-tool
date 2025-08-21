import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { StorageManager } from '../../utils/storage';
import DeletePresetModal from './DeletePresetModal';

/**
 * Simple tabbed interface for preset selection, Google Chrome style
 * Shows above the Configure Bus section
 */
export default memo(function ConfigTabs({ 
  raid, 
  onPresetSelected, 
  activePresetId = null,
  className = '' 
}) {
  const [presets, setPresets] = useState([]);
  const [activeTab, setActiveTab] = useState('manual');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, preset: null });

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

  // Handle delete button click
  const handleDeleteClick = useCallback((preset, event) => {
    event.stopPropagation(); // Prevent tab selection
    setDeleteModal({ isOpen: true, preset });
  }, []);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(() => {
    if (deleteModal.preset) {
      StorageManager.deletePreset(deleteModal.preset.id);
      
      // Refresh presets list
      const updatedPresets = StorageManager.getPresetsForRaid(raid.id, raid.difficulty);
      setPresets(updatedPresets);
      
      // Switch to manual if deleted preset was active
      if (activeTab === deleteModal.preset.id) {
        setActiveTab('manual');
        onPresetSelected(null);
      }
    }
    
    setDeleteModal({ isOpen: false, preset: null });
  }, [deleteModal.preset, raid, activeTab, onPresetSelected]);

  // Handle delete cancel
  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, preset: null });
  }, []);

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
        <div key={tab.id} className="relative group">
          <button
            onClick={() => handleTabSelect(tab.id, tab.preset)}
            className={`text-sm font-medium rounded-t-lg transition-all duration-200 relative flex items-center ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-t border-l border-r border-gray-200 dark:border-gray-700 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-600'
            } ${
              activeTab === tab.id ? 'z-10' : 'z-0'
            } ${
              tab.type === 'preset' ? 'pl-4 pr-8 py-2' : 'px-4 py-2'
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

          {/* Delete button for presets */}
          {tab.type === 'preset' && (
            <button
              onClick={(e) => handleDeleteClick(tab.preset, e)}
              className="absolute top-1/2 right-2 -translate-y-1/2 p-0 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 z-30 bg-transparent border-none rounded-none"
              title={`Delete "${tab.name}"`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}
      
      {/* Delete confirmation modal */}
      <DeletePresetModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        presetName={deleteModal.preset?.name || ''}
      />
    </div>
  );
});
