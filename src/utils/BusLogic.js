/**
 * Core logic for calculating gold distribution in raid buses
 */

import { calculateFourManDistribution } from './FourManRaidLogic';
import { calculateEightManDistribution } from './EightManRaidLogic';

/**
 * Calculates how gold should be split between drivers based on raid configuration
 * @param {number} totalPrice - Price per buyer
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {object} raid - Raid configuration
 * @returns {Array} Distribution objects
 */
export const calculateGoldDistribution = (totalPrice, driversCount, buyersCount, raid) => {
  if (driversCount <= 0 || buyersCount <= 0) return [];
  
  // Handle Behemoth raid specifically
  if (raid && raid.id === 'behemoth' && raid.totalPlayers === 16) {
    return calculateBehemothDistribution(totalPrice, driversCount, buyersCount, raid);
  }
  
  const totalIncome = totalPrice * buyersCount;
  const goldPerDriver = Math.floor(totalIncome / driversCount);
  
  const distribution = [];
  
  const driverGold = {};
  for (let i = 1; i <= driversCount; i++) {
    driverGold[i] = 0;
  }
  
  // 8-player raid scenarios
  if (raid.totalPlayers === 8) {
    // Usar la lógica específica para raids de 8 jugadores
    distribution.push(...calculateEightManDistribution(totalPrice, driversCount, buyersCount, driverGold));
  }
  // 4-player raid scenarios
  else if (raid.totalPlayers === 4) {
    // Usar la lógica específica para raids de 4 jugadores
    distribution.push(...calculateFourManDistribution(totalPrice, driversCount, buyersCount, driverGold, goldPerDriver));
  }
  // Generic distribution for other scenarios
  else {
    distribution.push(...handleGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, raid.totalPlayers));
  }
  
  return distribution;
};

/**
 * Handles gold distribution for non-standard raid configurations
 */
const handleGenericDistribution = (totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, totalPlayers) => {
  const distribution = [];
  
  const party1Buyers = [];
  const party2Buyers = [];
  
  let drivers1 = Math.min(driversCount, 4);
  let drivers2 = driversCount - drivers1;
  
  let buyers1 = 4 - drivers1;
  let buyers2 = 4 - drivers2;
  
  for (let i = 1; i <= buyers1; i++) {
    party1Buyers.push(i + drivers1);
  }
  
  for (let i = 1; i <= buyers2; i++) {
    party2Buyers.push(i + drivers2);
  }
  
  for (let i = 0; i < party2Buyers.length; i++) {
    let driverId;
    if (drivers2 > 0 && i < drivers2) {
      driverId = driversCount - drivers2 + i + 1;
    } else {
      const driverEntries = Object.entries(driverGold)
        .sort((a, b) => a[1] - b[1]);
      driverId = parseInt(driverEntries[0][0]);
    }
    
    const buyerId = party2Buyers[i];
    
    distribution.push({
      driver: driverId,
      buyer: `n${buyerId} (party 2)`,
      gold: totalPrice
    });
    
    driverGold[driverId] += totalPrice;
  }
  
  const buyerPayments = {};
  party1Buyers.forEach(id => {
    buyerPayments[id] = 0;
  });
  
  let currentBuyerIndex = 0;
  
  while (Object.values(driverGold).some(gold => gold < goldPerDriver) && 
         currentBuyerIndex < party1Buyers.length) {
    
    const buyerId = party1Buyers[currentBuyerIndex];
    const buyerRemainingPayment = totalPrice - buyerPayments[buyerId];
    
    if (buyerRemainingPayment <= 0) {
      currentBuyerIndex++;
      continue;
    }
    
    const driverEntries = Object.entries(driverGold)
      .sort((a, b) => a[1] - b[1]);
    
    const [driverId, gold] = driverEntries[0];
    const driverNeedsMore = goldPerDriver - gold;
    
    if (driverNeedsMore <= 0) {
      break;
    }
    
    const amountToAssign = Math.min(driverNeedsMore, buyerRemainingPayment);
    
    if (amountToAssign > 0) {
      distribution.push({
        driver: parseInt(driverId),
        buyer: `n${buyerId} (party 1)`,
        gold: amountToAssign
      });
      
      driverGold[driverId] += amountToAssign;
      buyerPayments[buyerId] += amountToAssign;
      
      if (buyerPayments[buyerId] >= totalPrice) {
        currentBuyerIndex++;
      }
    }
  }
  
  return distribution;
};

/**
 * Utility functions for formatting and styling
 */

export const formatGold = (value) => {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

export const getDriverColor = (driverNumber) => {
  const colors = {
    1: { 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      text: 'text-red-800 dark:text-red-300',
      border: 'border border-red-300 dark:border-red-700',
      shadow: 'shadow-md shadow-red-500/20 dark:shadow-red-500/30',
      hover: 'hover:shadow-lg hover:shadow-red-500/30 dark:hover:shadow-red-500/40'
    },
    2: { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border border-blue-300 dark:border-blue-700',
      shadow: 'shadow-md shadow-blue-500/20 dark:shadow-blue-500/30',
      hover: 'hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40'
    },
    3: { 
      bg: 'bg-green-100 dark:bg-green-900/30', 
      text: 'text-green-800 dark:text-green-300',
      border: 'border border-green-300 dark:border-green-700',
      shadow: 'shadow-md shadow-green-500/20 dark:shadow-green-500/30',
      hover: 'hover:shadow-lg hover:shadow-green-500/30 dark:hover:shadow-green-500/40'
    },
    4: { 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      text: 'text-purple-800 dark:text-purple-300',
      border: 'border border-purple-300 dark:border-purple-700',
      shadow: 'shadow-md shadow-purple-500/20 dark:shadow-purple-500/30',
      hover: 'hover:shadow-lg hover:shadow-purple-500/30 dark:hover:shadow-purple-500/40'
    },
    5: { 
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border border-yellow-300 dark:border-yellow-700',
      shadow: 'shadow-md shadow-yellow-500/20 dark:shadow-yellow-500/30',
      hover: 'hover:shadow-lg hover:shadow-yellow-500/30 dark:hover:shadow-yellow-500/40'
    },
    6: { 
      bg: 'bg-indigo-100 dark:bg-indigo-900/30', 
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border border-indigo-300 dark:border-indigo-700',
      shadow: 'shadow-md shadow-indigo-500/20 dark:shadow-indigo-500/30',
      hover: 'hover:shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-500/40'
    },
    7: { 
      bg: 'bg-pink-100 dark:bg-pink-900/30', 
      text: 'text-pink-800 dark:text-pink-300',
      border: 'border border-pink-300 dark:border-pink-700',
      shadow: 'shadow-md shadow-pink-500/20 dark:shadow-pink-500/30',
      hover: 'hover:shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-500/40'
    },
    8: { 
      bg: 'bg-orange-100 dark:bg-orange-900/30', 
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border border-orange-300 dark:border-orange-700',
      shadow: 'shadow-md shadow-orange-500/20 dark:shadow-orange-500/30',
      hover: 'hover:shadow-lg hover:shadow-orange-500/30 dark:hover:shadow-orange-500/40'
    },
    9: { 
      bg: 'bg-teal-100 dark:bg-teal-900/30', 
      text: 'text-teal-800 dark:text-teal-300',
      border: 'border border-teal-300 dark:border-teal-700',
      shadow: 'shadow-md shadow-teal-500/20 dark:shadow-teal-500/30',
      hover: 'hover:shadow-lg hover:shadow-teal-500/30 dark:hover:shadow-teal-500/40'
    },
    10: { 
      bg: 'bg-lime-100 dark:bg-lime-900/30', 
      text: 'text-lime-800 dark:text-lime-300',
      border: 'border border-lime-300 dark:border-lime-700',
      shadow: 'shadow-md shadow-lime-500/20 dark:shadow-lime-500/30',
      hover: 'hover:shadow-lg hover:shadow-lime-500/30 dark:hover:shadow-lime-500/40'
    },
    11: { 
      bg: 'bg-cyan-100 dark:bg-cyan-900/30', 
      text: 'text-cyan-800 dark:text-cyan-300',
      border: 'border border-cyan-300 dark:border-cyan-700',
      shadow: 'shadow-md shadow-cyan-500/20 dark:shadow-cyan-500/30',
      hover: 'hover:shadow-lg hover:shadow-cyan-500/30 dark:hover:shadow-cyan-500/40'
    },
    12: { 
      bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', 
      text: 'text-fuchsia-800 dark:text-fuchsia-300',
      border: 'border border-fuchsia-300 dark:border-fuchsia-700',
      shadow: 'shadow-md shadow-fuchsia-500/20 dark:shadow-fuchsia-500/30',
      hover: 'hover:shadow-lg hover:shadow-fuchsia-500/30 dark:hover:shadow-fuchsia-500/40'
    },
    13: { 
      bg: 'bg-rose-100 dark:bg-rose-900/30', 
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border border-rose-300 dark:border-rose-700',
      shadow: 'shadow-md shadow-rose-500/20 dark:shadow-rose-500/30',
      hover: 'hover:shadow-lg hover:shadow-rose-500/30 dark:hover:shadow-rose-500/40'
    },
    14: { 
      bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border border-emerald-300 dark:border-emerald-700',
      shadow: 'shadow-md shadow-emerald-500/20 dark:shadow-emerald-500/30',
      hover: 'hover:shadow-lg hover:shadow-emerald-500/30 dark:hover:shadow-emerald-500/40'
    },
    15: { 
      bg: 'bg-sky-100 dark:bg-sky-900/30', 
      text: 'text-sky-800 dark:text-sky-300',
      border: 'border border-sky-300 dark:border-sky-700',
      shadow: 'shadow-md shadow-sky-500/20 dark:shadow-sky-500/30',
      hover: 'hover:shadow-lg hover:shadow-sky-500/30 dark:hover:shadow-sky-500/40'
    }
  };
  
  return colors[driverNumber] || { 
    bg: 'bg-gray-100 dark:bg-gray-800', 
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border border-gray-300 dark:border-gray-700',
    shadow: 'shadow-md shadow-gray-500/20 dark:shadow-gray-500/30',
    hover: 'hover:shadow-lg hover:shadow-gray-500/30 dark:hover:shadow-gray-500/40'
  };
};

export const getBuyerPartyIndicator = (buyerText) => {
  if (buyerText.includes('party 1')) {
    return { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-300' };
  } else if (buyerText.includes('party 2')) {
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300' };
  } else {
    return { bg: 'bg-gray-100 dark:bg-gray-800/50', text: 'text-gray-700 dark:text-gray-400' };
  }
};

/**
 * Handles gold distribution for Behemoth raid (16 players)
 * @param {number} totalPrice - Price per buyer
 * @param {number} drivers - Number of drivers
 * @param {number} buyers - Number of buyers
 * @param {object} raid - Raid configuration
 * @returns {Array} Distribution objects
 */
export const calculateBehemothDistribution = (totalPrice, drivers, buyers, raid) => {
  if (raid.id !== 'behemoth' || raid.totalPlayers !== 16) {
    // Use standard distribution for non-Behemoth raids
    return calculateGoldDistribution(totalPrice, drivers, buyers, raid);
  }
  
  const distribution = [];
  const driverGold = {};
  
  // Initialize driver gold tracking
  for (let i = 1; i <= drivers; i++) {
    driverGold[i] = 0;
  }
  
  // Special case: 1c15 - Driver gets all parties except n1 from Party 1
  if (drivers === 1 && buyers === 15) {
    // Driver 1 gets:
    // - n2, n3, n4 from Party 1 (3 buyers)
    // - Party 2 complete (4 buyers)
    // - Party 3 complete (4 buyers)
    // - Party 4 complete (4 buyers)
    // Total: 15 buyers
    
    // Individual buyers from Party 1
    for (let i = 2; i <= 4; i++) {
      distribution.push({ 
        driver: 1, 
        buyer: `n${i} (party 1)`, 
        gold: totalPrice 
      });
      driverGold[1] += totalPrice;
    }
    
    // Party 2 complete - agrupado en una sola entrada
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Party 3 complete - agrupado en una sola entrada
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 3)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Party 4 complete - agrupado en una sola entrada
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 4)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    return distribution;
  }
  
  // Special case: 2c14 - Specific distribution for 2 drivers
  if (drivers === 2 && buyers === 14) {
    // Driver 1 gets:
    // - Party 2 complete (4 buyers)
    // - n3 from Party 1 (1 buyer)
    // - n1 and n2 from Party 4 (2 buyers)
    // Total: 7 buyers
    
    // Party 2 complete - agrupado en una sola entrada
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // n3 from Party 1
    distribution.push({ 
      driver: 1, 
      buyer: `n3 (party 1)`, 
      gold: totalPrice 
    });
    driverGold[1] += totalPrice;
    
    // n1 and n2 from Party 4
    for (let i = 1; i <= 2; i++) {
      distribution.push({ 
        driver: 1, 
        buyer: `n${i} (party 4)`, 
        gold: totalPrice 
      });
      driverGold[1] += totalPrice;
    }
    
    // Driver 2 gets:
    // - n4 from Party 1 (1 buyer)
    // - Party 3 complete (4 buyers)
    // - n3 and n4 from Party 4 (2 buyers)
    // Total: 7 buyers
    
    // n4 from Party 1
    distribution.push({ 
      driver: 2, 
      buyer: `n4 (party 1)`, 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    // Party 3 complete - agrupado en una sola entrada
    distribution.push({ 
      driver: 2, 
      buyer: "all buyers (party 3)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[2] += totalPrice * 4;
    
    // n3 and n4 from Party 4
    for (let i = 3; i <= 4; i++) {
      distribution.push({ 
        driver: 2, 
        buyer: `n${i} (party 4)`, 
        gold: totalPrice 
      });
      driverGold[2] += totalPrice;
    }
    
    return distribution;
  }
  
  // Special case: 3c13 - Each driver gets an entire party
  if (drivers === 3 && buyers === 13) {
    // Driver 1 gets Party 2 - agrupado en una sola entrada
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Driver 2 gets Party 3 - agrupado en una sola entrada
    distribution.push({ 
      driver: 2, 
      buyer: "all buyers (party 3)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[2] += totalPrice * 4;
    
    // Driver 3 gets Party 4 - agrupado en una sola entrada
    distribution.push({ 
      driver: 3, 
      buyer: "all buyers (party 4)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[3] += totalPrice * 4;
    
    // El n4 de party 1 se reparte entre los tres drivers
    const sharePerDriver = Math.floor(totalPrice / 3);
    const remainder = totalPrice - (sharePerDriver * 3);
    
    for (let i = 1; i <= 3; i++) {
      const goldAmount = (i === 3) ? sharePerDriver + remainder : sharePerDriver;
      
      distribution.push({ 
        driver: i, 
        buyer: `n4 (party 1)`, 
        gold: goldAmount 
      });
      driverGold[i] += goldAmount;
    }
    
    return distribution;
  }
  
  // Special case: 4c12 - Each driver gets the same position across parties
  if (drivers === 4 && buyers === 12) {
    for (let driverNum = 1; driverNum <= 4; driverNum++) {
      // Each driver gets the same position (n1, n2, etc.) across parties 2, 3, and 4
      for (let partyNum = 2; partyNum <= 4; partyNum++) {
        distribution.push({ 
          driver: driverNum, 
          buyer: `n${driverNum} (party ${partyNum})`, 
          gold: totalPrice 
        });
        driverGold[driverNum] += totalPrice;
      }
    }
    
    return distribution;
  }
  
  // Special case: 5c11 - Ensure each driver gets exactly 2.2 shares (11k at 5k per buyer)
  if (drivers === 5 && buyers === 11) {
    const goldPerDriver = Math.floor(totalPrice * buyers / drivers); // 11k per driver at 5k per buyer
    
    // Driver 1: Gets 2 full buyers and 1 shared buyer (0.2 share)
    distribution.push({ 
      driver: 1, 
      buyer: "n1 (party 3)", 
      gold: totalPrice 
    });
    driverGold[1] += totalPrice;
    
    distribution.push({ 
      driver: 1, 
      buyer: "n2 (party 2)", 
      gold: totalPrice 
    });
    driverGold[1] += totalPrice;
    
    const partialShare = Math.floor(totalPrice * 0.2); // 0.2 share = 1k at 5k per buyer
    distribution.push({ 
      driver: 1, 
      buyer: "n3 (party 3)", 
      gold: partialShare 
    });
    driverGold[1] += partialShare;
    
    // Driver 2: Gets 2 full buyers and 1 shared buyer (0.2 share)
    distribution.push({ 
      driver: 2, 
      buyer: "n3 (party 2)", 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    distribution.push({ 
      driver: 2, 
      buyer: "n4 (party 3)", 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    distribution.push({ 
      driver: 2, 
      buyer: "n3 (party 3)", 
      gold: partialShare 
    });
    driverGold[2] += partialShare;
    
    // Driver 3: Gets 2 full buyers and 1 shared buyer (0.2 share)
    distribution.push({ 
      driver: 3, 
      buyer: "n2 (party 3)", 
      gold: totalPrice 
    });
    driverGold[3] += totalPrice;
    
    distribution.push({ 
      driver: 3, 
      buyer: "n4 (party 2)", 
      gold: totalPrice 
    });
    driverGold[3] += totalPrice;
    
    distribution.push({ 
      driver: 3, 
      buyer: "n3 (party 3)", 
      gold: partialShare 
    });
    driverGold[3] += partialShare;
    
    // Driver 4: Gets 2 full buyers and 1 shared buyer (0.2 share)
    distribution.push({ 
      driver: 4, 
      buyer: "n1 (party 4)", 
      gold: totalPrice 
    });
    driverGold[4] += totalPrice;
    
    distribution.push({ 
      driver: 4, 
      buyer: "n2 (party 4)", 
      gold: totalPrice 
    });
    driverGold[4] += totalPrice;
    
    distribution.push({ 
      driver: 4, 
      buyer: "n3 (party 3)", 
      gold: partialShare 
    });
    driverGold[4] += partialShare;
    
    // Driver 5: Gets 2 full buyers and 1 shared buyer (0.2 share)
    distribution.push({ 
      driver: 5, 
      buyer: "n3 (party 4)", 
      gold: totalPrice 
    });
    driverGold[5] += totalPrice;
    
    distribution.push({ 
      driver: 5, 
      buyer: "n4 (party 4)", 
      gold: totalPrice 
    });
    driverGold[5] += totalPrice;
    
    distribution.push({ 
      driver: 5, 
      buyer: "n3 (party 3)", 
      gold: partialShare 
    });
    driverGold[5] += partialShare;
    
    return distribution;
  }
  
  // Special case: 6c10 - Specific distribution for Behemoth
  if (drivers === 6 && buyers === 10) {
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, d6, n3, n4
    // Party 3: n1, n2, n3, n4
    // Party 4: n1, n2, n3, n4
    
    const twoThirdsShare = Math.floor(totalPrice * 2/3);
    const oneThirdShare = totalPrice - twoThirdsShare;
    
    // Driver 1: n1 (party 3) completo + 2/3 de n1 (party 4)
    distribution.push({ 
      driver: 1, 
      buyer: "n1 (party 3)", 
      gold: totalPrice 
    });
    driverGold[1] += totalPrice;
    
    // Driver 2: n2 (party 3) completo + 2/3 de n2 (party 4)
    distribution.push({ 
      driver: 2, 
      buyer: "n2 (party 3)", 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    // Driver 3: n3 (party 3) completo + 2/3 de n3 (party 4)
    distribution.push({ 
      driver: 3, 
      buyer: "n3 (party 3)", 
      gold: totalPrice 
    });
    driverGold[3] += totalPrice;
    
    // Driver 4: n4 (party 3) completo + 2/3 de n4 (party 4)
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 3)", 
      gold: totalPrice 
    });
    driverGold[4] += totalPrice;
    
    // Driver 5: n3 (party 2) completo + 1/3 de n1 (party 4) + 1/3 de n2 (party 4)
    distribution.push({ 
      driver: 5, 
      buyer: "n3 (party 2)", 
      gold: totalPrice 
    });
    driverGold[5] += totalPrice;
    
    // Driver 6: n4 (party 2) completo + 1/3 de n3 (party 4) + 1/3 de n4 (party 4)
    distribution.push({ 
      driver: 6, 
      buyer: "n4 (party 2)", 
      gold: totalPrice 
    });
    driverGold[6] += totalPrice;
    
    return distribution;
  }
  
  // Special case: 7c9 - Specific distribution for Behemoth
  if (drivers === 7 && buyers === 9) {
    // Cada driver recibe un comprador completo y dos fracciones de n4 (party 2) y n4 (party 4)
    const fractionalShare = Math.floor(totalPrice / 7); // Aproximadamente 714.29 para un precio de 5k
    const remainder = totalPrice - (fractionalShare * 7);
    
    // Asignación para Driver 1
    distribution.push({ 
      driver: 1, 
      buyer: "n1 (party 3)", 
      gold: totalPrice 
    });
    driverGold[1] += totalPrice;
    
    distribution.push({ 
      driver: 1, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[1] += fractionalShare;
    
    distribution.push({ 
      driver: 1, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[1] += fractionalShare;
    
    // Asignación para Driver 2
    distribution.push({ 
      driver: 2, 
      buyer: "n2 (party 3)", 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    distribution.push({ 
      driver: 2, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[2] += fractionalShare;
    
    distribution.push({ 
      driver: 2, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[2] += fractionalShare;
    
    // Asignación para Driver 3
    distribution.push({ 
      driver: 3, 
      buyer: "n3 (party 3)", 
      gold: totalPrice 
    });
    driverGold[3] += totalPrice;
    
    distribution.push({ 
      driver: 3, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[3] += fractionalShare;
    
    distribution.push({ 
      driver: 3, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[3] += fractionalShare;
    
    // Asignación para Driver 4
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 3)", 
      gold: totalPrice 
    });
    driverGold[4] += totalPrice;
    
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[4] += fractionalShare;
    
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[4] += fractionalShare;
    
    // Asignación para Driver 5
    distribution.push({ 
      driver: 5, 
      buyer: "n1 (party 4)", 
      gold: totalPrice 
    });
    driverGold[5] += totalPrice;
    
    distribution.push({ 
      driver: 5, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[5] += fractionalShare;
    
    distribution.push({ 
      driver: 5, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[5] += fractionalShare;
    
    // Asignación para Driver 6
    distribution.push({ 
      driver: 6, 
      buyer: "n2 (party 4)", 
      gold: totalPrice 
    });
    driverGold[6] += totalPrice;
    
    distribution.push({ 
      driver: 6, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare 
    });
    driverGold[6] += fractionalShare;
    
    distribution.push({ 
      driver: 6, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[6] += fractionalShare;
    
    // Asignación para Driver 7
    distribution.push({ 
      driver: 7, 
      buyer: "n3 (party 4)", 
      gold: totalPrice 
    });
    driverGold[7] += totalPrice;
    
    distribution.push({ 
      driver: 7, 
      buyer: "n4 (party 2)", 
      gold: fractionalShare + remainder // Añadimos el resto a la última fracción
    });
    driverGold[7] += fractionalShare + remainder;
    
    distribution.push({ 
      driver: 7, 
      buyer: "n4 (party 4)", 
      gold: fractionalShare 
    });
    driverGold[7] += fractionalShare;
    
    return distribution;
  }
  
  // Special case: 8c8 - Each driver sells to the buyer with the same number in their corresponding party
  if (drivers === 8 && buyers === 8) {
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, d6, d7, d8
    // Party 3: n1, n2, n3, n4
    // Party 4: n1, n2, n3, n4
    
    // Drivers de la Party 1 (d1-d4) venden a los compradores con su mismo número en Party 3
    for (let i = 1; i <= 4; i++) {
      distribution.push({ 
        driver: i, 
        buyer: `n${i} (party 3)`, 
        gold: totalPrice 
      });
      driverGold[i] += totalPrice;
    }
    
    // Drivers de la Party 2 (d5-d8) venden a los compradores con su número correspondiente en Party 4
    for (let i = 5; i <= 8; i++) {
      const buyerNumber = i - 4; // d5 -> n1, d6 -> n2, etc.
      distribution.push({ 
        driver: i, 
        buyer: `n${buyerNumber} (party 4)`, 
        gold: totalPrice 
      });
      driverGold[i] += totalPrice;
    }
    
    return distribution;
  }
  
  // Special case: 9c7 - Each driver gets an equal share of each buyer
  if (drivers === 9 && buyers === 7) {
    // Los 7 compradores son:
    // - n2, n3, n4 de Party 3
    // - n1, n2, n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 3, number: 2 }, // Buyer A
      { party: 3, number: 3 }, // Buyer B
      { party: 3, number: 4 }, // Buyer C
      { party: 4, number: 1 }, // Buyer D
      { party: 4, number: 2 }, // Buyer E
      { party: 4, number: 3 }, // Buyer F
      { party: 4, number: 4 }  // Buyer G
    ];
    
    // Si todos los compradores de la party 4 están en la lista, podemos agruparlos
    const party4Complete = buyersList.filter(b => b.party === 4).length === 4;
    const party3Buyers = buyersList.filter(b => b.party === 3);
    const party4Buyers = buyersList.filter(b => b.party === 4);
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Si la party 4 está completa y queremos agruparla
      if (party4Complete) {
        // Primero añadimos los compradores individuales de la party 3
        party3Buyers.forEach(buyer => {
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver
          });
          driverGold[driverNum] += sharePerDriver;
        });
        
        // Luego añadimos la party 4 completa como un grupo
        distribution.push({
          driver: driverNum,
          buyer: "all buyers (party 4)",
          gold: sharePerDriver,
          isGrouped: true,
          totalBuyers: 4
        });
        
        // El oro total para la party 4 es sharePerDriver * 4
        // Añadimos el remainder al último driver para el último comprador
        const party4Gold = sharePerDriver * 4 + (driverNum === drivers ? remainder : 0);
        driverGold[driverNum] += party4Gold;
      } else {
        // Si no agrupamos, añadimos cada comprador individualmente
        buyersList.forEach((buyer, index) => {
          const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
          });
          driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
        });
      }
    }
    
    return distribution;
  }
  
  // Special case: 10c6 - Each driver gets an equal share of each buyer
  if (drivers === 10 && buyers === 6) {
    // Los 6 compradores son:
    // - n3, n4 de Party 3
    // - n1, n2, n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 3, number: 3 }, // Buyer 1
      { party: 3, number: 4 }, // Buyer 2
      { party: 4, number: 1 }, // Buyer 3
      { party: 4, number: 2 }, // Buyer 4
      { party: 4, number: 3 }, // Buyer 5
      { party: 4, number: 4 }  // Buyer 6
    ];
    
    // Si todos los compradores de la party 4 están en la lista, podemos agruparlos
    const party4Complete = buyersList.filter(b => b.party === 4).length === 4;
    const party3Buyers = buyersList.filter(b => b.party === 3);
    const party4Buyers = buyersList.filter(b => b.party === 4);
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Si la party 4 está completa y queremos agruparla
      if (party4Complete) {
        // Primero añadimos los compradores individuales de la party 3
        party3Buyers.forEach(buyer => {
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver
          });
          driverGold[driverNum] += sharePerDriver;
        });
        
        // Luego añadimos la party 4 completa como un grupo
        distribution.push({
          driver: driverNum,
          buyer: "all buyers (party 4)",
          gold: sharePerDriver,
          isGrouped: true,
          totalBuyers: 4
        });
        
        // El oro total para la party 4 es sharePerDriver * 4
        // Añadimos el remainder al último driver para el último comprador
        const party4Gold = sharePerDriver * 4 + (driverNum === drivers ? remainder : 0);
        driverGold[driverNum] += party4Gold;
      } else {
        // Si no agrupamos, añadimos cada comprador individualmente
        buyersList.forEach((buyer, index) => {
          const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
          });
          driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
        });
      }
    }
    
    return distribution;
  }
  
  // Special case: 11c5 - Each driver gets an equal share of each buyer
  if (drivers === 11 && buyers === 5) {
    // Los 5 compradores son:
    // - n4 de Party 3
    // - n1, n2, n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 3, number: 4 }, // Buyer A
      { party: 4, number: 1 }, // Buyer B
      { party: 4, number: 2 }, // Buyer C
      { party: 4, number: 3 }, // Buyer D
      { party: 4, number: 4 }  // Buyer E
    ];
    
    // Si todos los compradores de la party 4 están en la lista, podemos agruparlos
    const party4Complete = buyersList.filter(b => b.party === 4).length === 4;
    const party3Buyers = buyersList.filter(b => b.party === 3);
    const party4Buyers = buyersList.filter(b => b.party === 4);
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Si la party 4 está completa y queremos agruparla
      if (party4Complete) {
        // Primero añadimos los compradores individuales de la party 3
        party3Buyers.forEach(buyer => {
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver
          });
          driverGold[driverNum] += sharePerDriver;
        });
        
        // Luego añadimos la party 4 completa como un grupo
        distribution.push({
          driver: driverNum,
          buyer: "all buyers (party 4)",
          gold: sharePerDriver,
          isGrouped: true,
          totalBuyers: 4
        });
        
        // El oro total para la party 4 es sharePerDriver * 4
        // Añadimos el remainder al último driver para el último comprador
        const party4Gold = sharePerDriver * 4 + (driverNum === drivers ? remainder : 0);
        driverGold[driverNum] += party4Gold;
      } else {
        // Si no agrupamos, añadimos cada comprador individualmente
        buyersList.forEach((buyer, index) => {
          const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
          });
          driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
        });
      }
    }
    
    return distribution;
  }
  
  // Special case: 12c4 - Each driver gets an equal share of each buyer
  if (drivers === 12 && buyers === 4) {
    // Los 4 compradores son todos de Party 4:
    // - n1, n2, n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 4, number: 1 }, // Buyer 1
      { party: 4, number: 2 }, // Buyer 2
      { party: 4, number: 3 }, // Buyer 3
      { party: 4, number: 4 }  // Buyer 4
    ];
    
    // Si todos los compradores de la party 4 están en la lista, podemos agruparlos
    const party4Complete = buyersList.filter(b => b.party === 4).length === 4;
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Si la party 4 está completa y queremos agruparla
      if (party4Complete) {
        // Añadimos la party 4 completa como un grupo
        distribution.push({
          driver: driverNum,
          buyer: "all buyers (party 4)",
          gold: sharePerDriver,
          isGrouped: true,
          totalBuyers: 4
        });
        
        // El oro total para la party 4 es sharePerDriver * 4
        // Añadimos el remainder al último driver para el último comprador
        const party4Gold = sharePerDriver * 4 + (driverNum === drivers ? remainder : 0);
        driverGold[driverNum] += party4Gold;
      } else {
        // Si no agrupamos, añadimos cada comprador individualmente
        buyersList.forEach((buyer, index) => {
          const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
          });
          driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
        });
      }
    }
    
    return distribution;
  }
  
  // Special case: 13c3 - Each driver gets an equal share of each buyer
  if (drivers === 13 && buyers === 3) {
    // Los 3 compradores son:
    // - n2, n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 4, number: 2 }, // Buyer 1
      { party: 4, number: 3 }, // Buyer 2
      { party: 4, number: 4 }  // Buyer 3
    ];
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Añadimos cada comprador individualmente
      buyersList.forEach((buyer, index) => {
        const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
        distribution.push({
          driver: driverNum,
          buyer: `n${buyer.number} (party ${buyer.party})`,
          gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
        });
        driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
      });
    }
    
    return distribution;
  }
  
  // Special case: 14c2 - Each driver gets an equal share of each buyer
  if (drivers === 14 && buyers === 2) {
    // Los 2 compradores son:
    // - n3, n4 de Party 4
    
    // Calculamos la parte que recibe cada driver por comprador
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Lista de compradores
    const buyersList = [
      { party: 4, number: 3 }, // Buyer 1
      { party: 4, number: 4 }  // Buyer 2
    ];
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Añadimos cada comprador individualmente
      buyersList.forEach((buyer, index) => {
        const isLastBuyerForLastDriver = driverNum === drivers && index === buyersList.length - 1;
        distribution.push({
          driver: driverNum,
          buyer: `n${buyer.number} (party ${buyer.party})`,
          gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
        });
        driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
      });
    }
    
    return distribution;
  }
  
  // Special case: 15c1 - Each driver gets an equal share of the only buyer
  if (drivers === 15 && buyers === 1) {
    // El único comprador es:
    // - n4 de Party 4
    
    // Calculamos la parte que recibe cada driver
    const sharePerDriver = Math.floor(totalPrice / drivers);
    const remainder = totalPrice - (sharePerDriver * drivers);
    
    // Para cada driver
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      // Añadimos el único comprador
      const isLastDriver = driverNum === drivers;
      distribution.push({
        driver: driverNum,
        buyer: `n4 (party 4)`,
        gold: sharePerDriver + (isLastDriver ? remainder : 0)
      });
      driverGold[driverNum] += sharePerDriver + (isLastDriver ? remainder : 0);
    }
    
    return distribution;
  }
  
  // General case: Fill parties from Party 1 onwards with drivers
  const parties = [[], [], [], []];
  let currentDriver = 1;
  
  // Fill parties with drivers
  for (let partyIdx = 0; partyIdx < 4 && currentDriver <= drivers; partyIdx++) {
    for (let posIdx = 0; posIdx < 4 && currentDriver <= drivers; posIdx++) {
      parties[partyIdx][posIdx] = { type: 'driver', number: currentDriver };
      currentDriver++;
    }
  }
  
  // Fill remaining slots with buyers
  let currentBuyer = 1;
  for (let partyIdx = 0; partyIdx < 4; partyIdx++) {
    for (let posIdx = 0; posIdx < 4; posIdx++) {
      if (!parties[partyIdx][posIdx] && currentBuyer <= buyers) {
        parties[partyIdx][posIdx] = { type: 'buyer', number: currentBuyer };
        currentBuyer++;
      }
    }
  }
  
  // Calculate gold distribution
  const goldPerDriver = Math.floor(totalPrice * buyers / drivers);
  const buyersPerDriver = buyers / drivers;
  
  // Assign buyers to drivers
  if (drivers <= 4) {
    // Simple case: Each driver gets an equal number of buyers
    let remainingBuyers = buyers;
    let buyersAssigned = 0;
    
    for (let driverNum = 1; driverNum <= drivers; driverNum++) {
      const driverBuyerCount = Math.floor(buyersPerDriver);
      let driverTotal = 0;
      
      for (let i = 0; i < driverBuyerCount && buyersAssigned < buyers; i++) {
        // Find the next buyer in the parties
        let found = false;
        for (let partyIdx = 0; partyIdx < 4 && !found; partyIdx++) {
          for (let posIdx = 0; posIdx < 4 && !found; posIdx++) {
            const slot = parties[partyIdx][posIdx];
            if (slot && slot.type === 'buyer' && !slot.assigned) {
              distribution.push({
                driver: driverNum,
                buyer: `n${slot.number} (party ${partyIdx + 1})`,
                gold: totalPrice
              });
              
              driverTotal += totalPrice;
              slot.assigned = true;
              buyersAssigned++;
              found = true;
            }
          }
        }
      }
      
      // Adjust for any remaining gold to ensure fair distribution
      if (driverNum === drivers && driverTotal < goldPerDriver) {
        const lastBuyerIdx = distribution.length - 1;
        if (lastBuyerIdx >= 0) {
          const adjustment = goldPerDriver - driverTotal;
          distribution[lastBuyerIdx].gold += adjustment;
        }
      }
      
      driverGold[driverNum] = driverTotal;
    }
  } else {
    // Complex case: Drivers outnumber buyers, distribute evenly
    const driverGroups = Math.ceil(drivers / buyers);
    const driversPerBuyer = drivers / buyers;
    
    let buyerIdx = 0;
    for (let partyIdx = 0; partyIdx < 4; partyIdx++) {
      for (let posIdx = 0; posIdx < 4; posIdx++) {
        const slot = parties[partyIdx][posIdx];
        if (slot && slot.type === 'buyer') {
          const buyerDrivers = [];
          
          // Find drivers for this buyer
          for (let d = 1; d <= drivers && buyerDrivers.length < driversPerBuyer; d++) {
            if (!driverGold[d] || driverGold[d] < goldPerDriver) {
              buyerDrivers.push(d);
            }
          }
          
          // Distribute gold among drivers
          const goldPerDriverForBuyer = Math.floor(totalPrice / buyerDrivers.length);
          const remainder = totalPrice - (goldPerDriverForBuyer * buyerDrivers.length);
          
          buyerDrivers.forEach((driverId, idx) => {
            const goldAmount = idx === buyerDrivers.length - 1 ? 
              goldPerDriverForBuyer + remainder : goldPerDriverForBuyer;
              
            distribution.push({
              driver: driverId,
              buyer: `n${slot.number} (party ${partyIdx + 1})`,
              gold: goldAmount
            });
            
            driverGold[driverId] += goldAmount;
          });
        }
      }
    }
  }
  
  return distribution;
};