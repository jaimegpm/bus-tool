// Importar la utilidad para rutas de assets
import { getAssetUrl, getOptimizedImageUrl } from '../utils/assetUtils';

// Función para obtener la URL de imagen de raid optimizada
const getRaidImageUrl = (imagePath) => {
  // Durante el desarrollo, usar las imágenes originales hasta que se ejecute el script de optimización
  // Una vez ejecutado el script de optimización, cambiar a true
  const useOptimized = true; 
  return getOptimizedImageUrl(imagePath, 'md', useOptimized);
};

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