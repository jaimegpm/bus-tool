/**
 * BusLogic.js
 * Contains all the logic for calculating gold distribution in different bus scenarios
 * Handles special cases like 1c7, 2c6, 5c3, 6c2, etc.
 */

/**
 * Main function to calculate gold distribution between drivers
 * Handles different raid scenarios (1c7, 2c6, 5c3, 6c2, etc.)
 * Returns an array of distribution objects containing driver, buyer and gold amount
 * 
 * @param {number} totalPrice - The price each buyer pays
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {object} raid - Raid configuration object
 * @returns {Array} - Array of distribution objects
 */
export const calculateGoldDistribution = (totalPrice, driversCount, buyersCount, raid) => {
  if (driversCount <= 0 || buyersCount <= 0) return [];
  
  // Total income and equal gold per driver
  const totalIncome = totalPrice * buyersCount;
  const goldPerDriver = Math.floor(totalIncome / driversCount);
  
  // Create the distribution plan
  const distribution = [];
  
  // Track how much gold each driver has received
  const driverGold = {};
  for (let i = 1; i <= driversCount; i++) {
    driverGold[i] = 0;
  }
  
  // Special handling for 1c7 scenario (8 player raid with 1 driver)
  if (driversCount === 1 && buyersCount === 7 && raid.totalPlayers === 8) {
    // Separar por parties para mejor visualización
    // Party 1: driver 1 + 3 buyers (n2, n3, n4)
    // Party 2: 4 buyers (n1, n2, n3, n4)
    
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
    
    driverGold[1] += totalPrice * 7; // Total sigue siendo 7 buyers
  }
  // Special handling for 2c6 scenario (8 player raid with 2 drivers)
  else if (driversCount === 2 && buyersCount === 6 && raid.totalPlayers === 8) {
    // Distribución específica para 2c6
    // Party 1: d1, d2, n3, n4
    // Party 2: n1, n2, n3, n4
    
    // Driver 1 recibe pagos de:
    // - n3 y n4 de party 1
    // - n1 de party 2
    distribution.push({ driver: 1, buyer: "n3 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice * 3;
    
    // Driver 2 recibe pagos de:
    // - n2, n3 y n4 de party 2
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice * 3;
  }
  // Special handling for 5c3 scenario (8 player raid with 5 drivers)
  else if (driversCount === 5 && buyersCount === 3 && raid.totalPlayers === 8) {
    // Distribución específica para 5c3
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, n2, n3, n4
    
    // Calculamos los montos parciales (40% y 20% del precio)
    const fullAmount = Math.floor(totalPrice * 0.4); // 40% del precio
    const halfAmount = Math.floor(totalPrice * 0.2); // 20% del precio
    
    // Distribución según tabla proporcionada
    // D1 recibe 40% de N2 y 20% de N3
    distribution.push({ driver: 1, buyer: "n2 (party 2)", gold: fullAmount });
    distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: halfAmount });
    driverGold[1] += fullAmount + halfAmount;
    
    // D2 recibe 40% de N2 y 20% de N4
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: fullAmount });
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: halfAmount });
    driverGold[2] += fullAmount + halfAmount;
    
    // D3 recibe 40% de N3 y 20% de N4
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: fullAmount });
    distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: halfAmount });
    driverGold[3] += fullAmount + halfAmount;
    
    // D4 recibe 20% de N2 y 40% de N4
    distribution.push({ driver: 4, buyer: "n2 (party 2)", gold: halfAmount });
    distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: fullAmount });
    driverGold[4] += halfAmount + fullAmount;
    
    // D5 recibe 20% de N3 y 40% de N4
    distribution.push({ driver: 5, buyer: "n3 (party 2)", gold: halfAmount });
    distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: fullAmount });
    driverGold[5] += halfAmount + fullAmount;
  }
  // Special handling for 6c2 scenario (8 player raid with 6 drivers)
  else if (driversCount === 6 && buyersCount === 2 && raid.totalPlayers === 8) {
    // Distribución específica para 6c2
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, d6, n3, n4
    
    // Distribución solicitada:
    // d1, d2, d3 venden a n3 (party 2)
    // d4, d5, d6 venden a n4 (party 2)
    
    // Calculamos el monto que cada buyer paga a cada driver (1/3 del precio total)
    const driverShare = Math.floor(totalPrice / 3);
    // Ajuste para asegurar que la suma sea exactamente el precio total
    const remainder = totalPrice - (driverShare * 3);
    
    // Los conductores d1, d2, d3 reciben del comprador n3 (party 2)
    distribution.push({ driver: 1, buyer: "n3 (party 2)", gold: driverShare });
    driverGold[1] += driverShare;
    
    distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: driverShare });
    driverGold[2] += driverShare;
    
    // El último conductor recibe el resto para asegurar que sume exactamente el precio total
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: driverShare + remainder });
    driverGold[3] += driverShare + remainder;
    
    // Los conductores d4, d5, d6 reciben del comprador n4 (party 2)
    distribution.push({ driver: 4, buyer: "n4 (party 2)", gold: driverShare });
    driverGold[4] += driverShare;
    
    distribution.push({ driver: 5, buyer: "n4 (party 2)", gold: driverShare });
    driverGold[5] += driverShare;
    
    // El último conductor recibe el resto para asegurar que sume exactamente el precio total
    distribution.push({ driver: 6, buyer: "n4 (party 2)", gold: driverShare + remainder });
    driverGold[6] += driverShare + remainder;
  }
  // Special handling for 7c1 scenario (8 player raid with 7 drivers)
  else if (driversCount === 7 && buyersCount === 1 && raid.totalPlayers === 8) {
    // Distribución específica para 7c1
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, d6, d7, n4
    
    // Calculamos el monto que cada driver recibe (1/7 del precio total)
    const driverShare = Math.floor(totalPrice / 7);
    // Ajuste para asegurar que la suma sea exactamente el precio total
    const remainder = totalPrice - (driverShare * 7);
    
    // Distribuimos el oro entre los 7 conductores
    for (let i = 1; i <= 7; i++) {
      // El último conductor recibe el resto para asegurar que sume exactamente el precio total
      const goldAmount = (i === 7) ? driverShare + remainder : driverShare;
      
      distribution.push({ 
        driver: i, 
        buyer: "n4 (party 2)", 
        gold: goldAmount 
      });
      
      driverGold[i] += goldAmount;
    }
  }
  // Special handling for 3c5 scenario (8 player raid with 3 drivers)
  else if (driversCount === 3 && buyersCount === 5 && raid.totalPlayers === 8) {
    // Distribución específica para 3c5
    // Party 1: d1, d2, d3, n4
    // Party 2: n1, n2, n3, n4
    
    // Primero, asignamos los buyers completos
    // Driver 1 recibe de n1 party2
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice;
    
    // Driver 2 recibe de n2 party2
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice;
    
    // Driver 3 recibe de n3 party2
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: totalPrice });
    driverGold[3] += totalPrice;
    
    // Ahora distribuimos los n4 de ambas parties
    // Calculamos cuánto falta a cada driver para llegar al gold per driver
    const remainingNeeded1 = goldPerDriver - driverGold[1];
    const remainingNeeded2 = goldPerDriver - driverGold[2];
    const remainingNeeded3 = goldPerDriver - driverGold[3];
    
    // Driver 1 recibe parte de n4 party1
    const d1FromN4P1 = remainingNeeded1;
    distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: d1FromN4P1 });
    driverGold[1] += d1FromN4P1;
    
    // Driver 2 recibe parte de n4 party2
    const d2FromN4P2 = remainingNeeded2;
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: d2FromN4P2 });
    driverGold[2] += d2FromN4P2;
    
    // Driver 3 recibe el resto de n4 party1 y n4 party2
    const d3FromN4P1 = totalPrice - d1FromN4P1;
    const d3FromN4P2 = totalPrice - d2FromN4P2;
    
    distribution.push({ driver: 3, buyer: "n4 (party 1)", gold: d3FromN4P1 });
    driverGold[3] += d3FromN4P1;
    
    distribution.push({ driver: 3, buyer: "n4 (party 2)", gold: d3FromN4P2 });
    driverGold[3] += d3FromN4P2;
  }
  // Special handling for 4-player raid scenarios
  else if (raid.totalPlayers === 4) {
    // 1c3 scenario (1 driver, 3 buyers)
    if (driversCount === 1 && buyersCount === 3) {
      // En 1c3, el único driver recibe de todos los compradores
      distribution.push({ driver: 1, buyer: "n2", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
      distribution.push({ driver: 1, buyer: "n4", gold: totalPrice });
      
      driverGold[1] += totalPrice * 3;
    }
    // 2c2 scenario (2 drivers, 2 buyers)
    else if (driversCount === 2 && buyersCount === 2) {
      // En 2c2, cada driver recibe de un comprador
      distribution.push({ driver: 1, buyer: "n3", gold: totalPrice });
      driverGold[1] += totalPrice;
      
      distribution.push({ driver: 2, buyer: "n4", gold: totalPrice });
      driverGold[2] += totalPrice;
    }
    // 3c1 scenario (3 drivers, 1 buyer)
    else if (driversCount === 3 && buyersCount === 1) {
      // En 3c1, los tres drivers reciben del único comprador
      // Calculamos la parte equitativa para cada driver
      const driverShare = Math.floor(totalPrice / 3);
      // Ajuste para asegurar que la suma sea exactamente el precio total
      const remainder = totalPrice - (driverShare * 3);
      
      // Distribuimos el oro entre los 3 conductores
      for (let i = 1; i <= 3; i++) {
        // El último conductor recibe el resto para asegurar que sume exactamente el precio total
        const goldAmount = (i === 3) ? driverShare + remainder : driverShare;
        
        distribution.push({ 
          driver: i, 
          buyer: "n4", 
          gold: goldAmount 
        });
        
        driverGold[i] += goldAmount;
      }
    }
    // Generic algorithm for other 4-player scenarios (fallback)
    else {
      distribution.push(...handleGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, 4));
    }
  }
  // Generic algorithm for other scenarios
  else {
    distribution.push(...handleGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, raid.totalPlayers));
  }
  
  return distribution;
};

/**
 * Helper function to handle generic distribution for scenarios without special handling
 * 
 * @param {number} totalPrice - The price each buyer pays
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {number} goldPerDriver - Target gold amount per driver
 * @param {object} driverGold - Object tracking gold received by each driver
 * @param {number} totalPlayers - Total number of players in the raid
 * @returns {Array} - Array of distribution objects
 */
const handleGenericDistribution = (totalPrice, driversCount, buyersCount, goldPerDriver, driverGold, totalPlayers) => {
  const distribution = [];
  
  // Track buyers by party
  const party1Buyers = [];
  const party2Buyers = [];
  
  // Assign buyers to parties (cada party tiene 4 posiciones)
  // Primero identificamos cuántos drivers van en cada party
  let drivers1 = Math.min(driversCount, 4);
  let drivers2 = driversCount - drivers1;
  
  // Calculamos cuántos buyers hay en cada party
  let buyers1 = 4 - drivers1;
  let buyers2 = 4 - drivers2;
  
  // Asignamos los IDs de los compradores
  for (let i = 1; i <= buyers1; i++) {
    party1Buyers.push(i + drivers1);
  }
  
  for (let i = 1; i <= buyers2; i++) {
    party2Buyers.push(i + drivers2);
  }
  
  // First assign party 2 buyers to party 2 drivers if possible, otherwise distribute among all drivers
  for (let i = 0; i < party2Buyers.length; i++) {
    // Si hay drivers en party 2, asignar preferentemente a ellos
    let driverId;
    if (drivers2 > 0 && i < drivers2) {
      // Asignar a los drivers de party 2 (los últimos)
      driverId = driversCount - drivers2 + i + 1;
    } else {
      // Asignar a cualquier driver, priorizando los que tienen menos oro
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
  
  // Track remaining buyers' payments
  const buyerPayments = {};
  party1Buyers.forEach(id => {
    buyerPayments[id] = 0;
  });
  
  // Distribute party 1 buyers to balance gold
  let currentBuyerIndex = 0;
  
  // Keep distributing until all drivers have their gold or all buyers have paid
  while (Object.values(driverGold).some(gold => gold < goldPerDriver) && 
         currentBuyerIndex < party1Buyers.length) {
    
    const buyerId = party1Buyers[currentBuyerIndex];
    const buyerRemainingPayment = totalPrice - buyerPayments[buyerId];
    
    if (buyerRemainingPayment <= 0) {
      currentBuyerIndex++;
      continue;
    }
    
    // Find driver with least gold
    const driverEntries = Object.entries(driverGold)
      .sort((a, b) => a[1] - b[1]);
    
    const [driverId, gold] = driverEntries[0];
    const driverNeedsMore = goldPerDriver - gold;
    
    if (driverNeedsMore <= 0) {
      break; // All drivers have their gold
    }
    
    // Determine how much this driver should get from this buyer
    const amountToAssign = Math.min(driverNeedsMore, buyerRemainingPayment);
    
    if (amountToAssign > 0) {
      distribution.push({
        driver: parseInt(driverId),
        buyer: `n${buyerId} (party 1)`,
        gold: amountToAssign
      });
      
      driverGold[driverId] += amountToAssign;
      buyerPayments[buyerId] += amountToAssign;
      
      // If buyer has paid in full, move to next buyer
      if (buyerPayments[buyerId] >= totalPrice) {
        currentBuyerIndex++;
      }
    }
  }
  
  return distribution;
};

/**
 * Helper functions for formatting and styling
 */

/**
 * Format gold values with locale-specific formatting
 * 
 * @param {number} value - Gold amount to format
 * @returns {string} - Formatted gold amount
 */
export const formatGold = (value) => {
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

/**
 * Get color scheme for a driver based on driver number
 * 
 * @param {number} driverNumber - Driver number (1-7)
 * @returns {object} - Object with CSS classes for styling
 */
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

/**
 * Get color scheme for a buyer based on party
 * 
 * @param {string} buyerText - Buyer text that may include party information
 * @returns {object} - Object with CSS classes for styling
 */
export const getBuyerPartyIndicator = (buyerText) => {
  if (buyerText.includes('party 1')) {
    return { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-800 dark:text-cyan-300' };
  } else if (buyerText.includes('party 2')) {
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300' };
  } else {
    return { bg: 'bg-gray-100 dark:bg-gray-800/50', text: 'text-gray-700 dark:text-gray-400' };
  }
}; 