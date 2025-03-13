/**
 * Specific logic for gold distribution in 8-player raids
 */

/**
 * Calculates gold distribution for 8-player raids
 * @param {number} totalPrice - Price per buyer
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {object} driverGold - Object tracking gold per driver
 * @returns {Array} Distribution objects
 */
export const calculateEightManDistribution = (totalPrice, driversCount, buyersCount, driverGold) => {
  const distribution = [];
  
  // 1 driver, 7 buyers
  if (driversCount === 1 && buyersCount === 7) {
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers n2-n4 (party 1)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 3
    });
    
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers n1-n4 (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    
    driverGold[1] += totalPrice * 7;
  }
  // 2 drivers, 6 buyers
  else if (driversCount === 2 && buyersCount === 6) {
    distribution.push({ driver: 1, buyer: "n3 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n4 (party 1)", gold: totalPrice });
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice * 3;
    
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n3 (party 2)", gold: totalPrice });
    distribution.push({ driver: 2, buyer: "n4 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice * 3;
  }
  // 3 drivers, 5 buyers
  else if (driversCount === 3 && buyersCount === 5) {
    distribution.push({ driver: 1, buyer: "n1 (party 2)", gold: totalPrice });
    driverGold[1] += totalPrice;
    
    distribution.push({ driver: 2, buyer: "n2 (party 2)", gold: totalPrice });
    driverGold[2] += totalPrice;
    
    distribution.push({ driver: 3, buyer: "n3 (party 2)", gold: totalPrice });
    driverGold[3] += totalPrice;
    
    const remainingNeeded1 = Math.floor(totalPrice * buyersCount / driversCount) - driverGold[1];
    const remainingNeeded2 = Math.floor(totalPrice * buyersCount / driversCount) - driverGold[2];
    const remainingNeeded3 = Math.floor(totalPrice * buyersCount / driversCount) - driverGold[3];
    
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
  // 4 drivers, 4 buyers
  else if (driversCount === 4 && buyersCount === 4) {
    // Each driver sells to the buyer with the same number in Party 2
    for (let i = 1; i <= 4; i++) {
      distribution.push({ 
        driver: i, 
        buyer: `n${i} (party 2)`, 
        gold: totalPrice 
      });
      driverGold[i] += totalPrice;
    }
  }
  // 5 drivers, 3 buyers
  else if (driversCount === 5 && buyersCount === 3) {
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
  else if (driversCount === 6 && buyersCount === 2) {
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
  else if (driversCount === 7 && buyersCount === 1) {
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
  
  return distribution;
}; 