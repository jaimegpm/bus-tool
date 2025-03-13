/**
 * Core logic for calculating gold distribution in raid buses
 */

import { calculateFourManDistribution } from './FourManRaidLogic';
import { calculateEightManDistribution } from './EightManRaidLogic';
import { calculateSixteenManDistribution } from './SixteenManRaidLogic';

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
  
  if (raid && raid.id === 'behemoth' && raid.totalPlayers === 16) {
    return calculateSixteenManDistribution(totalPrice, driversCount, buyersCount, driverGold, raid);
  }
  else if (raid.totalPlayers === 8) {
    distribution.push(...calculateEightManDistribution(totalPrice, driversCount, buyersCount, driverGold));
  }
  else if (raid.totalPlayers === 4) {
    distribution.push(...calculateFourManDistribution(totalPrice, driversCount, buyersCount, driverGold, goldPerDriver));
  }
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