/**
 * Specific logic for gold distribution in 4-player raids
 */

/**
 * Calculates gold distribution for 4-player raids
 * @param {number} totalPrice - Price per buyer
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {object} driverGold - Object tracking gold per driver
 * @param {number} goldPerDriver - Gold per driver (optional, for generic case)
 * @returns {Array} Distribution objects
 */
export const calculateFourManDistribution = (totalPrice, driversCount, buyersCount, driverGold, goldPerDriver) => {
  const distribution = [];
  
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
    // For generic case, we need to import handleGenericDistribution
    // But since this could create circular dependency, we'll implement
    // a simplified version specific for 4 players
    distribution.push(...handleFourManGenericDistribution(totalPrice, driversCount, buyersCount, goldPerDriver || Math.floor(totalPrice * buyersCount / driversCount), driverGold));
  }
  
  return distribution;
};

/**
 * Handles gold distribution for non-standard 4-player raid configurations
 * @param {number} totalPrice - Price per buyer
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {number} goldPerDriver - Gold per driver
 * @param {object} driverGold - Object tracking gold per driver
 * @returns {Array} Distribution objects
 */
const handleFourManGenericDistribution = (totalPrice, driversCount, buyersCount, goldPerDriver, driverGold) => {
  const distribution = [];
  
  // Simplified for 4-player raids
  const buyers = [];
  for (let i = 1; i <= buyersCount; i++) {
    buyers.push(i + driversCount);
  }
  
  // Assign buyers to drivers
  for (let i = 0; i < buyers.length; i++) {
    // Find driver who needs most gold
    const driverEntries = Object.entries(driverGold)
      .sort((a, b) => a[1] - b[1]);
    const driverId = parseInt(driverEntries[0][0]);
    
    const buyerId = buyers[i];
    
    distribution.push({
      driver: driverId,
      buyer: `n${buyerId}`,
      gold: totalPrice
    });
    
    driverGold[driverId] += totalPrice;
  }
  
  return distribution;
}; 