/**
 * Asset URL Utility Functions
 * Handles proper URL generation for assets in both development and production environments
 */

/**
 * Generates asset URLs compatible with both local development and GitHub Pages
 * Uses the appropriate base URL based on the environment configuration
 * 
 * @param {string} path - Relative path to the asset
 * @returns {string} - Complete URL with correct base path
 */
export const getAssetUrl = (path) => {
  // Get base URL from Vite configuration
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Remove any leading slash to prevent duplication
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Remove any trailing slash from baseUrl to prevent duplication
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Combine base URL with asset path
  return `${cleanBase}/${cleanPath}`;
}; 

/**
 * Generates optimized image URLs for different device sizes
 * Maps a standard image path to the corresponding optimized version
 * 
 * @param {string} path - Original image path
 * @param {string} size - Desired size variant (sm: 96px, md: 256px, lg: 512px)
 * @param {boolean} useOptimized - Whether to use optimized versions or originals
 * @returns {string} - URL to the appropriate image version
 */
export const getOptimizedImageUrl = (path, size = 'md', useOptimized = true) => {
  // If optimization is disabled, return standard URL
  if (!useOptimized) {
    return getAssetUrl(path);
  }
  
  // Validate size parameter
  if (!['sm', 'md', 'lg'].includes(size)) {
    console.warn(`Invalid image size: ${size}. Defaulting to 'md'.`);
    size = 'md';
  }
  
  // Handle missing path error
  if (!path) {
    console.error('Image path not specified');
    return '';
  }
  
  try {
    // Extract path components to create optimized path
    // Example: 'images/raids/Valtan.webp' -> 'images/raids/optimized/md/Valtan.webp'
    const pathParts = path.split('/');
    
    // Ensure path has enough parts to be processed
    if (pathParts.length < 3) {
      console.warn('Path format not compatible with optimization:', path);
      return getAssetUrl(path);
    }
    
    // Extract filename and remove extension
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    
    // Create path to optimized version
    const category = pathParts[pathParts.length - 2];
    const optimizedPath = `images/${category}/optimized/${size}/${fileNameWithoutExt}.webp`;
    
    return getAssetUrl(optimizedPath);
  } catch (error) {
    // Fallback to original on error
    console.error('Error generating optimized URL:', error);
    return getAssetUrl(path);
  }
}; 