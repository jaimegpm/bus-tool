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
 * - goldReward: Object containing gold rewards for each difficulty
 * - specialReward: Object containing paths to special reward images for each difficulty
 */
export const raids = [
  {
    id: 'echidna',
    name: 'Echidna',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Echidna.webp'),
    goldReward: {
      Normal: 16000,
      Hard: 19500
    },
    specialReward: {
      Normal: 'images/rewards/Echidna-normal-reward.webp',
      Hard: 'images/rewards/Echidna-hard-reward.webp'
    }
  },
  {
    id: 'kakul',
    name: 'Kakul-Saydon',
    totalPlayers: 4,
    difficulty: 'Normal',
    availableDifficulties: ['Normal'],
    image: getRaidImageUrl('images/raids/Kakul.webp'),
    goldReward: {
      Normal: 2000
    },
    specialReward: {
      Normal: 'images/rewards/Kakul-reward.webp'
    }
  },
  {
    id: 'brelshaza-act2',
    name: 'Brelshaza Act 2',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Brelshaza.webp'),
    goldReward: {
      Normal: 27500,
      Hard: 34000
    },
    specialReward: {
      Normal: 'images/rewards/Brelshaza-reward.webp',
      Hard: 'images/rewards/Brelshaza-reward.webp'
    }
  },
  {
    id: 'akkan',
    name: 'Akkan',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Akkan.webp'),
    goldReward: {
      Normal: 5400,
      Hard: 7500
    },
    specialReward: {
      Normal: 'images/rewards/Akkan-reward.webp',
      Hard: 'images/rewards/Akkan-reward.webp'
    }
  },
  {
    id: 'kayangel',
    name: 'Kayangel',
    totalPlayers: 4,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Kayangel.webp'),
    goldReward: {
      Normal: 3600,
      Hard: 3800
    },
    specialReward: {
      Normal: 'images/rewards/Kayangel-reward.webp',
      Hard: 'images/rewards/Kayangel-reward.webp'
    }
  },
  {
    id: 'thaemine',
    name: 'Thaemine',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Thaemine.webp'),
    goldReward: {
      Normal: 11000,
      Hard: 18800
    },
    specialReward: {
      Normal: 'images/rewards/Thaemine-reward.webp',
      Hard: 'images/rewards/Thaemine-reward.webp'
    }
  },
  {
    id: 'valtan',
    name: 'Valtan',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Valtan.webp'),
    goldReward: {
      Normal: 750,
      Hard: 1100
    },
    specialReward: {
      Normal: 'images/rewards/Valtan-reward.webp',
      Hard: 'images/rewards/Valtan-reward.webp'
    }
  },
  {
    id: 'vykas',
    name: 'Vykas',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Vykas.webp'),
    goldReward: {
      Normal: 1000,
      Hard: 1500
    },
    specialReward: {
      Normal: 'images/rewards/Vykas-reward.webp',
      Hard: 'images/rewards/Vykas-reward.webp'
    }
  },
  {
    id: 'behemoth',
    name: 'Behemoth',
    totalPlayers: 16,
    difficulty: 'Normal',
    availableDifficulties: ['Normal'],
    image: getRaidImageUrl('images/raids/Behemoth.webp'),
    goldReward: {
      Normal: 18000
    },
    specialReward: {
      Normal: 'images/rewards/Behemoth-reward.webp'
    }
  },
  {
    id: 'voldis',
    name: 'Voldis',
    totalPlayers: 4,
    difficulty: 'Normal',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Voldis.webp'),
    goldReward: {
      Normal: 6500,
      Hard: 13000
    },
    specialReward: {
      Normal: 'images/rewards/Voldis-reward.webp',
      Hard: 'images/rewards/Voldis-reward.webp'
    }
  },
  {
    id: 'aegir',
    name: 'Aegir',
    totalPlayers: 8,
    difficulty: 'Normal',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Aegir.webp'),
    goldReward: {
      Normal: 23000,
      Hard: 27500
    },
    specialReward: {
      Normal: 'images/rewards/Aegir-reward.webp',
      Hard: 'images/rewards/Aegir-reward.webp'
    }
  },
  {
    id: 'brelshaza',
    name: 'Brelshaza',
    totalPlayers: 8,
    difficulty: 'Hard',
    availableDifficulties: ['Normal', 'Hard'],
    image: getRaidImageUrl('images/raids/Brelshaza1.webp'),
    goldReward: {
      Normal: 4600,
      Hard: 5600
    },
    specialReward: {
      Normal: 'images/rewards/Brelshaza1-reward.webp',
      Hard: 'images/rewards/Brelshaza1-reward.webp'
    }
  },
]; 