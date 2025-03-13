/**
 * Core logic for calculating gold distribution in raid buses
 */

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
  
  const totalIncome = totalPrice * buyersCount;
  const goldPerDriver = Math.floor(totalIncome / driversCount);
  
  const distribution = [];
  
  const driverGold = {};
  for (let i = 1; i <= driversCount; i++) {
    driverGold[i] = 0;
  }
  
  // 1 driver, 7 buyers
  if (driversCount === 1 && buyersCount === 7 && raid.totalPlayers === 8) {
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers n2-n4 (party 1)", 
      gold: totalPrice,
      isGrouped: true
    });
    
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers n1-n4 (party 2)", 
      gold: totalPrice,
      isGrouped: true
    });
    
    driverGold[1] += totalPrice * 7;
  }
  // 2 drivers, 6 buyers
  else if (driversCount === 2 && buyersCount === 6 && raid.totalPlayers === 8) {
    distribution.push({ driver: 1, buyer: "n3 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice * 3;
    
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice * 3;
  }
  // 5 drivers, 3 buyers
  else if (driversCount === 5 && buyersCount === 3 && raid.totalPlayers === 8) {
    const fullAmount = Math.floor(totalPrice * 0.4);
    const halfAmount = Math.floor(totalPrice * 0.2);
    
    distribution.push({ driver: 1, buyer: "n2 (party 2)", gold: fullAmount });
    distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: halfAmount });
    driverGold[1] += fullAmount + halfAmount;
    
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: fullAmount });
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: halfAmount });
    driverGold[2] += fullAmount + halfAmount;
    
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: fullAmount });
    distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: halfAmount });
    driverGold[3] += fullAmount + halfAmount;
    
    distribution.push({ driver: 4, buyer: "n2 (party 2)", gold: halfAmount });
    distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: fullAmount });
    driverGold[4] += halfAmount + fullAmount;
    
    distribution.push({ driver: 5, buyer: "n3 (party 2)", gold: halfAmount });
    distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: fullAmount });
    driverGold[5] += halfAmount + fullAmount;
  }
  // 6 drivers, 2 buyers
  else if (driversCount === 6 && buyersCount === 2 && raid.totalPlayers === 8) {
    const driverShare = Math.floor(totalPrice / 3);
    const remainder = totalPrice - (driverShare * 3);
    
    distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: driverShare });
    driverGold[1] += driverShare;
    
    distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: driverShare });
    driverGold[2] += driverShare;
    
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: driverShare + remainder });
    driverGold[3] += driverShare + remainder;
    
    distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: driverShare });
    driverGold[4] += driverShare;
    
    distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: driverShare });
    driverGold[5] += driverShare;
    
    distribution.push({ driver: 6, buyer: "n4 (party 2)", gold: driverShare + remainder });
    driverGold[6] += driverShare + remainder;
  }
  // 7 drivers, 1 buyer
  else if (driversCount === 7 && buyersCount === 1 && raid.totalPlayers === 8) {
    const driverShare = Math.floor(totalPrice / 7);
    const remainder = totalPrice - (driverShare * 7);
    
    for (let i = 1; i <= 7; i++) {
      const goldAmount = (i === 7) ? driverShare + remainder : driverShare;
      
      distribution.push({ 
        driver: i, 
        buyer: "n4 (party 2)", 
        gold: goldAmount 
      });
      
      driverGold[i] += goldAmount;
    }
  }
  // 3 drivers, 5 buyers
  else if (driversCount === 3 && buyersCount === 5 && raid.totalPlayers === 8) {
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice;
    
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice;
    
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: totalPrice });
    driverGold[3] += totalPrice;
    
    const remainingNeeded1 = goldPerDriver - driverGold[1];
    const remainingNeeded2 = goldPerDriver - driverGold[2];
    const remainingNeeded3 = goldPerDriver - driverGold[3];
    
    const d1FromN4P1 = remainingNeeded1;
    distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: d1FromN4P1 });
    driverGold[1] += d1FromN4P1;
    
    const d2FromN4P2 = remainingNeeded2;
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: d2FromN4P2 });
    driverGold[2] += d2FromN4P2;
    
    const d3FromN4P1 = totalPrice - d1FromN4P1;
    const d3FromN4P2 = totalPrice - d2FromN4P2;
    
    distribution.push({ driver: 3, buyer: "n4 (party 1)", gold: d3FromN4P1 });
    driverGold[3] += d3FromN4P1;
    
    distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: d3FromN4P2 });
    driverGold[3] += d3FromN4P2;
  }
  // 4-player raid scenarios
  else if (raid.totalPlayers === 4) {
    // 1 driver, 3 buyers
    if (driversCount === 1 && buyersCount === 3) {
      distribution.push({ driver: 1, buyer: "n2", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n4", gold: totalPrice });
      
      driverGold[1] += totalPrice * 3;
    }
    // 2 drivers, 2 buyers
    else if (driversCount === 2 && buyersCount === 2) {
      distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
      driverGold[1] += totalPrice;
      
      distribution.push({ driver: 2, buyer: "n4", gold: totalPrice });
      driverGold[2] += totalPrice;
    }
    // 3 drivers, 1 buyer
    else if (driversCount === 3 && buyersCount === 1) {
      const driverShare = Math.floor(totalPrice / 3);
      const remainder = totalPrice - (driverShare * 3);
      
      for (let i = 1; i <= 3; i++) {
        const goldAmount = (i === 3) ? driverShare + remainder : driverShare;
        
        distribution.push({ 
          driver: i, 
          buyer: "n4", 
          gold: goldAmount 
        });
        
        driverGold[i] += goldAmount;
      }
    }
    // Generic 4-player distribution
    else {
      distribution.push(...handleGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, 4));
    }
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