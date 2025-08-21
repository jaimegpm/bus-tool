/**
 * LocalStorage manager for Bus Tool user preferences and data
 * Handles favorites, recent configurations, and user settings
 */

const STORAGE_KEYS = {
  FAVORITES: 'busToolFavorites',
  SHOW_FAVORITES_ONLY: 'busToolShowFavoritesOnly',
  PRESETS: 'busToolPresets'
};

export const StorageManager = {
  /**
   * Get list of favorite raid IDs
   * @returns {string[]} Array of raid IDs marked as favorites
   */
  getFavorites() {
    try {
      const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  },

  /**
   * Add raid to favorites
   * @param {string} raidId - Raid ID to add to favorites
   */
  addFavorite(raidId) {
    try {
      const favorites = this.getFavorites();
      if (!favorites.includes(raidId)) {
        favorites.push(raidId);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  /**
   * Remove raid from favorites
   * @param {string} raidId - Raid ID to remove from favorites
   */
  removeFavorite(raidId) {
    try {
      const favorites = this.getFavorites();
      const updatedFavorites = favorites.filter(id => id !== raidId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  /**
   * Toggle favorite status for a raid
   * @param {string} raidId - Raid ID to toggle
   * @returns {boolean} New favorite status
   */
  toggleFavorite(raidId) {
    const favorites = this.getFavorites();
    const isFavorite = favorites.includes(raidId);
    
    if (isFavorite) {
      this.removeFavorite(raidId);
      return false;
    } else {
      this.addFavorite(raidId);
      return true;
    }
  },

  /**
   * Check if raid is marked as favorite
   * @param {string} raidId - Raid ID to check
   * @returns {boolean} True if raid is favorite
   */
  isFavorite(raidId) {
    return this.getFavorites().includes(raidId);
  },

  /**
   * Get show favorites only preference
   * @returns {boolean} True if should show only favorites
   */
  getShowFavoritesOnly() {
    try {
      const showFavoritesOnly = localStorage.getItem(STORAGE_KEYS.SHOW_FAVORITES_ONLY);
      return showFavoritesOnly === 'true';
    } catch (error) {
      console.error('Error loading show favorites preference:', error);
      return false;
    }
  },

  /**
   * Set show favorites only preference
   * @param {boolean} showOnly - Whether to show only favorites
   */
  setShowFavoritesOnly(showOnly) {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOW_FAVORITES_ONLY, showOnly.toString());
    } catch (error) {
      console.error('Error saving show favorites preference:', error);
    }
  },

  // Preset Management Functions

  /**
   * Get all saved presets
   * @returns {Array} Array of preset objects
   */
  getPresets() {
    try {
      const presets = localStorage.getItem(STORAGE_KEYS.PRESETS);
      return presets ? JSON.parse(presets) : [];
    } catch (error) {
      console.error('Error loading presets:', error);
      return [];
    }
  },

  /**
   * Get presets for a specific raid
   * @param {string} raidId - Raid ID to filter presets
   * @param {string} difficulty - Raid difficulty to filter presets
   * @returns {Array} Array of presets for the specified raid
   */
  getPresetsForRaid(raidId, difficulty) {
    const allPresets = this.getPresets();
    return allPresets.filter(preset => 
      preset.raidId === raidId && preset.difficulty === difficulty
    );
  },

  /**
   * Save a new preset
   * @param {Object} preset - Preset object to save
   * @param {string} preset.name - Display name for the preset
   * @param {string} preset.raidId - Raid ID
   * @param {string} preset.difficulty - Raid difficulty
   * @param {number} preset.drivers - Number of drivers
   * @param {number} preset.price - Gold price per buyer
   * @param {string[]} preset.driverNames - Array of driver names
   * @returns {string} Generated preset ID
   */
  savePreset(preset) {
    try {
      const presets = this.getPresets();
      const newPreset = {
        ...preset,
        id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      
      presets.push(newPreset);
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
      return newPreset.id;
    } catch (error) {
      console.error('Error saving preset:', error);
      return null;
    }
  },

  /**
   * Delete a preset by ID
   * @param {string} presetId - ID of preset to delete
   */
  deletePreset(presetId) {
    try {
      const presets = this.getPresets();
      const updatedPresets = presets.filter(preset => preset.id !== presetId);
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(updatedPresets));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  },

  /**
   * Update an existing preset
   * @param {string} presetId - ID of preset to update
   * @param {Object} updates - Object with fields to update
   */
  updatePreset(presetId, updates) {
    try {
      const presets = this.getPresets();
      const presetIndex = presets.findIndex(preset => preset.id === presetId);
      
      if (presetIndex !== -1) {
        presets[presetIndex] = {
          ...presets[presetIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets));
      }
    } catch (error) {
      console.error('Error updating preset:', error);
    }
  },

  /**
   * Get a specific preset by ID
   * @param {string} presetId - ID of preset to retrieve
   * @returns {Object|null} Preset object or null if not found
   */
  getPreset(presetId) {
    const presets = this.getPresets();
    return presets.find(preset => preset.id === presetId) || null;
  }
};
