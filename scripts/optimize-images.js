/**
 * Image Optimization Script
 * 
 * Automatically optimizes images to improve web performance:
 * 1. Scans image directories for jpg, jpeg, png, and webp files
 * 2. Creates optimized versions in multiple sizes (sm, md, lg)
 * 3. Converts all images to WebP format with optimal compression
 * 
 * Usage: node scripts/optimize-images.js
 * 
 * After running, update useOptimized=true in src/data/raids.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration settings
const imagesDirs = ['public/images/raids', 'public/images/icons'];
const sizes = {
  sm: 96,   // Small size for icons and thumbnails
  md: 256,  // Medium size for cards
  lg: 512   // Large size for high-res displays
};
const quality = 80; // WebP compression quality (0-100)

/**
 * Creates output directories for optimized images
 * 
 * @param {string} dirPath - Base directory path
 */
const ensureDirectoryExists = (dirPath) => {
  // Create main optimized directory
  const optimizedDir = path.join(dirPath, 'optimized');
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Create subdirectories for each size
  Object.keys(sizes).forEach(size => {
    const sizeDir = path.join(optimizedDir, size);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });
};

/**
 * Processes a directory of images, creating optimized versions
 * 
 * @param {string} dirPath - Directory containing images to optimize
 */
const processDirectory = async (dirPath) => {
  console.log(`Processing directory: ${dirPath}`);
  
  // Create output directories
  ensureDirectoryExists(dirPath);
  
  // Get list of files in directory
  const files = fs.readdirSync(dirPath);
  
  // Filter for image files
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  // Process each image in the directory
  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const fileName = path.parse(file).name;
    
    console.log(`Optimizing: ${file}`);
    
    // Create versions for each configured size
    for (const [sizeName, size] of Object.entries(sizes)) {
      const outputPath = path.join(dirPath, 'optimized', sizeName, `${fileName}.webp`);
      
      try {
        // Optimize image: resize, convert to WebP
        await sharp(inputPath)
          .resize(size, size, { 
            fit: 'cover',
            withoutEnlargement: true
          })
          .webp({ quality })
          .toFile(outputPath);
        
        console.log(`  ✓ Created ${sizeName}: ${outputPath}`);
      } catch (error) {
        console.error(`  ✗ Error processing ${file} to ${sizeName}:`, error);
      }
    }
  }
};

/**
 * Main function that processes all configured directories
 */
async function main() {
  console.log('Starting image optimization...');
  
  try {
    // Process each directory in the configuration
    for (const dir of imagesDirs) {
      await processDirectory(dir);
    }
    
    console.log('✅ Optimization completed successfully');
    console.log('To use optimized images, update imports to use /images/[category]/optimized/[size]/[name].webp');
    console.log('And set useOptimized=true in src/data/raids.js');
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

// Execute the main function
main(); 