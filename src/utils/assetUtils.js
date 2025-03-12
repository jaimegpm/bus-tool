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