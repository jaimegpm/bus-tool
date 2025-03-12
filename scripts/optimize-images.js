/**
 * Script para optimizar automáticamente las imágenes del proyecto
 * 
 * Este script:
 * 1. Busca todas las imágenes en la carpeta public/images
 * 2. Crea versiones optimizadas en varios tamaños (sm, md, lg)
 * 3. Convierte las imágenes a formato WebP con compresión óptima
 * 
 * Uso: node scripts/optimize-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Obtener el directorio actual usando ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const imagesDirs = ['public/images/raids', 'public/images/icons'];
const sizes = {
  sm: 96,   // Para iconos pequeños y miniaturas
  md: 256,  // Para tarjetas de raids
  lg: 512   // Para pantallas grandes/retina
};
const quality = 80; // Calidad WebP (0-100)

// Crear directorios de salida si no existen
const ensureDirectoryExists = (dirPath) => {
  const optimizedDir = path.join(dirPath, 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Crear subdirectorios para cada tamaño
  Object.keys(sizes).forEach(size => {
    const sizeDir = path.join(optimizedDir, size);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });
};

// Procesar un directorio de imágenes
const processDirectory = async (dirPath) => {
  console.log(`Procesando directorio: ${dirPath}`);
  
  // Asegurar que existan los directorios de salida
  ensureDirectoryExists(dirPath);
  
  // Leer archivos en el directorio
  const files = fs.readdirSync(dirPath);
  
  // Filtrar solo archivos de imagen
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  console.log(`Encontradas ${imageFiles.length} imágenes para optimizar`);
  
  // Procesar cada imagen
  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const fileName = path.parse(file).name;
    
    console.log(`Optimizando: ${file}`);
    
    // Procesar para cada tamaño
    for (const [sizeName, size] of Object.entries(sizes)) {
      const outputPath = path.join(dirPath, 'optimized', sizeName, `${fileName}.webp`);
      
      try {
        await sharp(inputPath)
          .resize(size, size, { 
            fit: 'cover',
            withoutEnlargement: true
          })
          .webp({ quality })
          .toFile(outputPath);
        
        console.log(`  ✓ Creado ${sizeName}: ${outputPath}`);
      } catch (error) {
        console.error(`  ✗ Error al procesar ${file} a tamaño ${sizeName}:`, error);
      }
    }
  }
};

// Función principal
async function main() {
  console.log('Iniciando optimización de imágenes...');
  
  try {
    // Procesar cada directorio configurado
    for (const dir of imagesDirs) {
      await processDirectory(dir);
    }
    
    console.log('✅ Optimización completada con éxito');
    console.log('Para usar las imágenes optimizadas, actualice las importaciones para usar /images/[categoria]/optimized/[tamaño]/[nombre].webp');
  } catch (error) {
    console.error('❌ Error durante la optimización:', error);
    process.exit(1);
  }
}

// Ejecutar la función principal
main(); 