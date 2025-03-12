/**
 * Función para generar rutas de assets compatibles con la base URL
 * tanto en desarrollo local como en GitHub Pages
 */
export const getAssetUrl = (path) => {
  // Usar import.meta.env.BASE_URL para obtener la ruta base configurada en vite.config.js
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Eliminar cualquier barra inicial en el path para evitar duplicación
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Eliminar cualquier barra final en baseUrl para evitar duplicación
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Combinar la base URL con la ruta del asset
  return `${cleanBase}/${cleanPath}`;
}; 

/**
 * Función para obtener la URL de una imagen optimizada
 * según el tamaño deseado (sm, md, lg)
 * 
 * @param {string} path - Ruta relativa de la imagen original
 * @param {string} size - Tamaño deseado (sm: 96px, md: 256px, lg: 512px)
 * @param {boolean} useOptimized - Si debe usar la versión optimizada (default: true)
 * @returns {string} - URL completa de la imagen optimizada
 */
export const getOptimizedImageUrl = (path, size = 'md', useOptimized = true) => {
  // Si no queremos usar versiones optimizadas, simplemente devolver la URL normal
  if (!useOptimized) {
    return getAssetUrl(path);
  }
  
  // Comprobar si el tamaño es válido
  if (!['sm', 'md', 'lg'].includes(size)) {
    console.warn(`Tamaño de imagen no válido: ${size}. Usando 'md' por defecto.`);
    size = 'md';
  }
  
  // Verificar si la ruta es válida
  if (!path) {
    console.error('Ruta de imagen no especificada');
    return '';
  }
  
  try {
    // Dividir la ruta para insertar 'optimized/[size]'
    // Ejemplo: 'images/raids/Valtan.webp' -> 'images/raids/optimized/md/Valtan.webp'
    const pathParts = path.split('/');
    
    // Verificar que la ruta tenga al menos 3 partes (images/categoría/archivo)
    if (pathParts.length < 3) {
      console.warn('Formato de ruta no compatible con optimización:', path);
      return getAssetUrl(path);
    }
    
    // Extraer el nombre del archivo sin extensión
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    
    // Crear la nueva ruta con la estructura optimizada
    const category = pathParts[pathParts.length - 2];
    const optimizedPath = `images/${category}/optimized/${size}/${fileNameWithoutExt}.webp`;
    
    return getAssetUrl(optimizedPath);
  } catch (error) {
    console.error('Error al generar URL optimizada:', error);
    return getAssetUrl(path);
  }
}; 