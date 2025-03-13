/**
 * Logic for calculating gold distribution in 16-player raids (Behemoth)
 */

/**
 * Calculates gold distribution for 16-player raids
 * @param {number} totalPrice - Price per buyer
 * @param {number} driversCount - Number of drivers
 * @param {number} buyersCount - Number of buyers
 * @param {object} driverGold - Object tracking gold per driver
 * @param {object} raid - Raid configuration
 * @returns {Array} Distribution objects
 */
export const calculateSixteenManDistribution = (totalPrice, driversCount, buyersCount, driverGold, raid) => {
  if (raid.id !== 'behemoth' || raid.totalPlayers !== 16) {
    return [];
  }

  const distribution = [];

  // Special case: 1c15 - Driver gets all parties except n1 from Party 1
  if (driversCount === 1 && buyersCount === 15) {
    // Individual buyers from Party 1
    for (let i = 2; i <= 4; i++) {
      distribution.push({ 
        driver: 1, 
        buyer: `n${i} (party 1)`, 
        gold: totalPrice 
      });
      driverGold[1] += totalPrice;
    }
    
    // Party 2 complete - grouped in a single entry
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Party 3 complete - grouped in a single entry
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 3)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Party 4 complete - grouped in a single entry
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 4)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
  }
  
  // Special case: 2c14 - Specific distribution for 2 drivers
  else if (driversCount === 2 && buyersCount === 14) {
    // Driver 1 gets:
    // Party 2 complete - grouped in a single entry
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
    // n4 from Party 1
    distribution.push({ 
      driver: 2, 
      buyer: `n4 (party 1)`, 
      gold: totalPrice 
    });
    driverGold[2] += totalPrice;
    
    // Party 3 complete - grouped in a single entry
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
  }
  
  // Special case: 3c13 - Each driver gets an entire party
  else if (driversCount === 3 && buyersCount === 13) {
    // Driver 1 gets Party 2 - grouped in a single entry
    distribution.push({ 
      driver: 1, 
      buyer: "all buyers (party 2)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[1] += totalPrice * 4;
    
    // Driver 2 gets Party 3 - grouped in a single entry
    distribution.push({ 
      driver: 2, 
      buyer: "all buyers (party 3)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[2] += totalPrice * 4;
    
    // Driver 3 gets Party 4 - grouped in a single entry
    distribution.push({ 
      driver: 3, 
      buyer: "all buyers (party 4)", 
      gold: totalPrice,
      isGrouped: true,
      totalBuyers: 4
    });
    driverGold[3] += totalPrice * 4;
    
    // n4 from party 1 is split between the three drivers
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
  }
  
  // Special case: 4c12 - Each driver gets the same position across parties
  else if (driversCount === 4 && buyersCount === 12) {
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
  }
  
  // Special case: 5c11 - Ensure each driver gets exactly 2.2 shares
  else if (driversCount === 5 && buyersCount === 11) {
    const goldPerDriver = Math.floor(totalPrice * buyersCount / driversCount);
    const partialShare = Math.floor(totalPrice * 0.2);

    // Assignments for each driver
    const driverAssignments = [
      { full: ["n1 (party 3)", "n2 (party 2)"], shared: "n3 (party 3)" },
      { full: ["n3 (party 2)", "n4 (party 3)"], shared: "n3 (party 3)" },
      { full: ["n2 (party 3)", "n4 (party 2)"], shared: "n3 (party 3)" },
      { full: ["n1 (party 4)", "n2 (party 4)"], shared: "n3 (party 3)" },
      { full: ["n3 (party 4)", "n4 (party 4)"], shared: "n3 (party 3)" }
    ];

    driverAssignments.forEach((assignment, index) => {
      const driverNum = index + 1;
      
      // Assign full buyers
      assignment.full.forEach(buyer => {
        distribution.push({ 
          driver: driverNum, 
          buyer: buyer, 
          gold: totalPrice 
        });
        driverGold[driverNum] += totalPrice;
      });
      
      // Assign shared buyer
      distribution.push({ 
        driver: driverNum, 
        buyer: assignment.shared, 
        gold: partialShare 
      });
      driverGold[driverNum] += partialShare;
    });
  }
  
  // Special case: 6c10 - Specific distribution for Behemoth
  else if (driversCount === 6 && buyersCount === 10) {
    // Party 1: d1, d2, d3, d4
    // Party 2: d5, d6, n3, n4
    // Party 3: n1, n2, n3, n4
    // Party 4: n1, n2, n3, n4
    
    const twoThirdsShare = Math.floor(totalPrice * 2/3);
    const oneThirdShare = totalPrice - twoThirdsShare;
    
    // Driver 1: n1 (party 3) complete + 2/3 of n1 (party 4)
    distribution.push({ 
      driver: 1, 
      buyer: "n1 (party 3)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 1, 
      buyer: "n1 (party 4)", 
      gold: twoThirdsShare 
    });
    driverGold[1] += totalPrice + twoThirdsShare;
    
    // Driver 2: n2 (party 3) complete + 2/3 of n2 (party 4)
    distribution.push({ 
      driver: 2, 
      buyer: "n2 (party 3)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 2, 
      buyer: "n2 (party 4)", 
      gold: twoThirdsShare 
    });
    driverGold[2] += totalPrice + twoThirdsShare;
    
    // Driver 3: n3 (party 3) complete + 2/3 of n3 (party 4)
    distribution.push({ 
      driver: 3, 
      buyer: "n3 (party 3)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 3, 
      buyer: "n3 (party 4)", 
      gold: twoThirdsShare 
    });
    driverGold[3] += totalPrice + twoThirdsShare;
    
    // Driver 4: n4 (party 3) complete + 2/3 of n4 (party 4)
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 3)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 4, 
      buyer: "n4 (party 4)", 
      gold: twoThirdsShare 
    });
    driverGold[4] += totalPrice + twoThirdsShare;
    
    // Driver 5: n3 (party 2) complete + 1/3 of n1 (party 4) + 1/3 of n2 (party 4)
    distribution.push({ 
      driver: 5, 
      buyer: "n3 (party 2)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 5, 
      buyer: "n1 (party 4)", 
      gold: oneThirdShare 
    });
    distribution.push({ 
      driver: 5, 
      buyer: "n2 (party 4)", 
      gold: oneThirdShare 
    });
    driverGold[5] += totalPrice + oneThirdShare * 2;
    
    // Driver 6: n4 (party 2) complete + 1/3 of n3 (party 4) + 1/3 of n4 (party 4)
    distribution.push({ 
      driver: 6, 
      buyer: "n4 (party 2)", 
      gold: totalPrice 
    });
    distribution.push({ 
      driver: 6, 
      buyer: "n3 (party 4)", 
      gold: oneThirdShare 
    });
    distribution.push({ 
      driver: 6, 
      buyer: "n4 (party 4)", 
      gold: oneThirdShare 
    });
    driverGold[6] += totalPrice + oneThirdShare * 2;
  }
  
  // Special case: 7c9 - Specific distribution for Behemoth
  else if (driversCount === 7 && buyersCount === 9) {
    const fractionalShare = Math.floor(totalPrice / 7);
    const remainder = totalPrice - (fractionalShare * 7);
    
    // Complete and fractional assignments
    const assignments = [
      { driver: 1, full: "n1 (party 3)" },
      { driver: 2, full: "n2 (party 3)" },
      { driver: 3, full: "n3 (party 3)" },
      { driver: 4, full: "n4 (party 3)" },
      { driver: 5, full: "n1 (party 4)" },
      { driver: 6, full: "n2 (party 4)" },
      { driver: 7, full: "n3 (party 4)" }
    ];
    
    assignments.forEach(assignment => {
      // Complete assignment
      distribution.push({ 
        driver: assignment.driver, 
        buyer: assignment.full, 
        gold: totalPrice 
      });
      driverGold[assignment.driver] += totalPrice;
      
      // Fractional assignments
      distribution.push({ 
        driver: assignment.driver, 
        buyer: "n4 (party 2)", 
        gold: assignment.driver === 7 ? fractionalShare + remainder : fractionalShare 
      });
      driverGold[assignment.driver] += assignment.driver === 7 ? fractionalShare + remainder : fractionalShare;
      
      distribution.push({ 
        driver: assignment.driver, 
        buyer: "n4 (party 4)", 
        gold: fractionalShare 
      });
      driverGold[assignment.driver] += fractionalShare;
    });
  }
  
  // Special case: 8c8 - Each driver sells to the buyer with the same number
  else if (driversCount === 8 && buyersCount === 8) {
    // Drivers from Party 1 (d1-d4) sell to buyers with same number in Party 3
    for (let i = 1; i <= 4; i++) {
      distribution.push({ 
        driver: i, 
        buyer: `n${i} (party 3)`, 
        gold: totalPrice 
      });
      driverGold[i] += totalPrice;
    }
    
    // Drivers from Party 2 (d5-d8) sell to buyers with corresponding number in Party 4
    for (let i = 5; i <= 8; i++) {
      const buyerNumber = i - 4;
      distribution.push({ 
        driver: i, 
        buyer: `n${buyerNumber} (party 4)`, 
        gold: totalPrice 
      });
      driverGold[i] += totalPrice;
    }
  }
  
  // Special cases: 9c7 to 15c1 - Each driver gets an equal share of each buyer
  else if (driversCount >= 9 && driversCount <= 15) {
    const sharePerDriver = Math.floor(totalPrice / driversCount);
    const remainder = totalPrice - (sharePerDriver * driversCount);
    
    // Define buyers according to the case
    let buyersList = [];
    if (driversCount === 9 && buyersCount === 7) {
      buyersList = [
        { party: 3, number: 2 },
        { party: 3, number: 3 },
        { party: 3, number: 4 },
        { party: 4, number: 1 },
        { party: 4, number: 2 },
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 10 && buyersCount === 6) {
      buyersList = [
        { party: 3, number: 3 },
        { party: 3, number: 4 },
        { party: 4, number: 1 },
        { party: 4, number: 2 },
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 11 && buyersCount === 5) {
      buyersList = [
        { party: 3, number: 4 },
        { party: 4, number: 1 },
        { party: 4, number: 2 },
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 12 && buyersCount === 4) {
      buyersList = [
        { party: 4, number: 1 },
        { party: 4, number: 2 },
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 13 && buyersCount === 3) {
      buyersList = [
        { party: 4, number: 2 },
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 14 && buyersCount === 2) {
      buyersList = [
        { party: 4, number: 3 },
        { party: 4, number: 4 }
      ];
    } else if (driversCount === 15 && buyersCount === 1) {
      buyersList = [
        { party: 4, number: 4 }
      ];
    }
    
    // Check if we can group Party 4
    const party4Complete = buyersList.filter(b => b.party === 4).length === 4;
    const party3Buyers = buyersList.filter(b => b.party === 3);
    
    // For each driver
    for (let driverNum = 1; driverNum <= driversCount; driverNum++) {
      if (party4Complete && party3Buyers.length > 0) {
        // Add individual buyers from Party 3
        party3Buyers.forEach(buyer => {
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver
          });
          driverGold[driverNum] += sharePerDriver;
        });
        
        // Add Party 4 as a group
        distribution.push({
          driver: driverNum,
          buyer: "all buyers (party 4)",
          gold: sharePerDriver,
          isGrouped: true,
          totalBuyers: 4
        });
        
        const party4Gold = sharePerDriver * 4 + (driverNum === driversCount ? remainder : 0);
        driverGold[driverNum] += party4Gold;
      } else {
        // Add each buyer individually
        buyersList.forEach((buyer, index) => {
          const isLastBuyerForLastDriver = driverNum === driversCount && index === buyersList.length - 1;
          distribution.push({
            driver: driverNum,
            buyer: `n${buyer.number} (party ${buyer.party})`,
            gold: sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0)
          });
          driverGold[driverNum] += sharePerDriver + (isLastBuyerForLastDriver ? remainder : 0);
        });
      }
    }
  }
  
  // General case: Fill parties from Party 1 onwards with drivers
  else {
    const parties = [[], [], [], []];
    let currentDriver = 1;
    
    // Fill parties with drivers
    for (let partyIdx = 0; partyIdx < 4 && currentDriver <= driversCount; partyIdx++) {
      for (let posIdx = 0; posIdx < 4 && currentDriver <= driversCount; posIdx++) {
        parties[partyIdx][posIdx] = { type: 'driver', number: currentDriver };
        currentDriver++;
      }
    }
    
    // Fill remaining slots with buyers
    let currentBuyer = 1;
    for (let partyIdx = 0; partyIdx < 4; partyIdx++) {
      for (let posIdx = 0; posIdx < 4; posIdx++) {
        if (!parties[partyIdx][posIdx] && currentBuyer <= buyersCount) {
          parties[partyIdx][posIdx] = { type: 'buyer', number: currentBuyer };
          currentBuyer++;
        }
      }
    }
    
    // Calculate gold distribution
    const goldPerDriver = Math.floor(totalPrice * buyersCount / driversCount);
    const buyersPerDriver = buyersCount / driversCount;
    
    // Assign buyers to drivers
    if (driversCount <= 4) {
      // Simple case: Each driver gets an equal number of buyers
      let remainingBuyers = buyersCount;
      let buyersAssigned = 0;
      
      for (let driverNum = 1; driverNum <= driversCount; driverNum++) {
        const driverBuyerCount = Math.floor(buyersPerDriver);
        let driverTotal = 0;
        
        for (let i = 0; i < driverBuyerCount && buyersAssigned < buyersCount; i++) {
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
        if (driverNum === driversCount && driverTotal < goldPerDriver) {
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
      const driverGroups = Math.ceil(driversCount / buyersCount);
      const driversPerBuyer = driversCount / buyersCount;
      
      let buyerIdx = 0;
      for (let partyIdx = 0; partyIdx < 4; partyIdx++) {
        for (let posIdx = 0; posIdx < 4; posIdx++) {
          const slot = parties[partyIdx][posIdx];
          if (slot && slot.type === 'buyer') {
            const buyerDrivers = [];
            
            // Find drivers for this buyer
            for (let d = 1; d <= driversCount && buyerDrivers.length < driversPerBuyer; d++) {
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
  }
  
  return distribution;
}; 