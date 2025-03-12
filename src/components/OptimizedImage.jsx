import { useState } from 'react';

/**
 * OptimizedImage Component
 * A simple component that handles image loading with basic error handling
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  width = 256, 
  height = 256, 
  className = "",
  hovered = false,
  onError = null
}) {
  const [error, setError] = useState(false);
  
  // Handle image loading errors
  const handleError = (e) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };
  
  // Display fallback content if image fails to load
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
          {alt ? alt.charAt(0) : '?'}
        </span>
      </div>
    );
  }
  
  // Render optimized image
  return (
    <img 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${hovered ? 'scale-110 brightness-110' : 'scale-100'}`}
      onError={handleError}
      style={{ 
        width: className.includes('w-') ? undefined : `${width}px`, 
        height: className.includes('h-') ? undefined : `${height}px` 
      }}
    />
  );
} 