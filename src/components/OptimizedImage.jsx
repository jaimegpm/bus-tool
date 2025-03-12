import { useState, useEffect } from 'react';

/**
 * Componente OptimizedImage que mejora el rendimiento de imágenes
 * - Agrega lazy loading automáticamente
 * - Establece dimensiones explícitas
 * - Gestiona errores de carga
 * - Proporciona fallback en caso de error
 * - Opcionalmente, puede aplicar efectos visuales (hover, etc.)
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
  const [loaded, setLoaded] = useState(false);
  
  // Resetear el estado de error si cambia la URL de la imagen
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);
  
  const handleError = (e) => {
    setError(true);
    if (onError) {
      onError(e);
    }
  };
  
  const handleLoad = () => {
    setLoaded(true);
  };
  
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
  
  return (
    <>
      {!loaded && (
        <div 
          className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`}
          style={{ width: `${width}px`, height: `${height}px` }}
        ></div>
      )}
      <img 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0 absolute'} ${hovered ? 'scale-110 brightness-110' : 'scale-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        style={{ 
          width: className.includes('w-') ? undefined : `${width}px`, 
          height: className.includes('h-') ? undefined : `${height}px` 
        }}
      />
    </>
  );
} 