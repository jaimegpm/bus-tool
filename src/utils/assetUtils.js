/**
 * Asset URL utilities for handling image paths and URLs
 */

/**
 * Generates asset URLs for both dev and prod environments
 * @param {string} path - Asset path
 * @returns {string} - Full asset URL
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
 * Generates optimized image URLs for different sizes
 * @param {string} path - Original image path
 * @param {string} size - Size variant (sm/md/lg)
 * @param {boolean} useOptimized - Use optimized versions
 * @returns {string} - URL for the image
 */
export const getOptimizedImageUrl = (path, size = 'md', useOptimized = true) => {
  // Return standard URL if optimization disabled
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
    // Split path into components
    const pathParts = path.split('/');
    
    // Validate path format
    if (pathParts.length < 3) {
      console.warn('Path format not compatible with optimization:', path);
      return getAssetUrl(path);
    }
    
    // Get filename without extension
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    
    // Build optimized path
    const category = pathParts[pathParts.length - 2];
    const optimizedPath = `images/${category}/optimized/${size}/${fileNameWithoutExt}.webp`;
    
    return getAssetUrl(optimizedPath);
  } catch (error) {
    // Return original on error
    console.error('Error generating optimized URL:', error);
    return getAssetUrl(path);
  }
}; 