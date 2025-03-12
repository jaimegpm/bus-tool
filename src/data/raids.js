// Import asset utility functions
import { getAssetUrl, getOptimizedImageUrl } from '../utils/assetUtils';

/**
 * Helper function to get optimized raid image URLs
 * Controls whether to use optimized images or originals
 * 
 * @param {string} imagePath - Path to the original raid image
 * @returns {string} - URL to the appropriate image version
 */
const getRaidImageUrl = (imagePath) => {
  // Toggle to enable optimized images after running the optimization script
  // Set to true after running 'npm run optimize-images'
  const useOptimized = true;
  return getOptimizedImageUrl(imagePath, 'md', useOptimized);
};

/**
 * Raid configuration data
 * Contains information about all available raids:
 * - id: Unique identifier for the raid
 * - name: Display name
 * - totalPlayers: Number of players in the raid (4 or 8)
 * - difficulty: Default difficulty setting
 * - availableDifficulties: Array of possible difficulty options
 * - image: Path to the raid's thumbnail image
 */
export const raids = [
  {
    id: 'echidna',
    name: 'Echidna',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Echidna.webp'),
  },
  {
    id: 'kakul',
    name: 'Kakul-Saydon',
    totalPlayers: 4,
    difficulty: 'Normal',
    availableDifficulties: ['Normal'],
    image: getRaidImageUrl('images/raids/Kakul.webp'),
  },
  {
    id: 'brelshaza-act2',
    name: 'Brelshaza Act 2',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Brelshaza.webp'),
  },
  {
    id: 'akkan',
    name: 'Akkan',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Akkan.webp'),
  },
  {
    id: 'kayangel',
    name: 'Kayangel',
    totalPlayers: 4,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Kayangel.webp'),
  },
  {
    id: 'thaemine',
    name: 'Thaemine',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Thaemine.webp'),
  },
  {
    id: 'valtan',
    name: 'Valtan',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Valtan.webp'),
  },
  {
    id: 'vykas',
    name: 'Vykas',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Vykas.webp'),
  },
  {
    id: 'behemoth',
    name: 'Behemoth',
    totalPlayers: 8,
    difficulty: 'Normal',
    availableDifficulties: ['Normal'],
    image: getRaidImageUrl('images/raids/Behemoth.webp'),
  },
  {
    id: 'voldis',
    name: 'Voldis',
    totalPlayers: 4,
    difficulty: 'Normal',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Voldis.webp'),
  },
  {
    id: 'aegir',
    name: 'Aegir',
    totalPlayers: 8,
    difficulty: 'Normal',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Aegir.webp'),
  },
  {
    id: 'brelshaza',
    name: 'Brelshaza',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Brelshaza1.webp'),
  },
]; 